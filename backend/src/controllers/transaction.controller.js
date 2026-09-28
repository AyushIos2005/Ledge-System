const mongoose = require("mongoose");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");

/**
 * -Create a new transcation
 * the 10 -step transfer flow :
 * 1.Validate request 
 * 2.Validate idempotency key 
 * 3.check account status 
 * 4.Derive sender balance from ledger 
 * 5.Create transcation (PeNDING)
 * 6.Create DEBIT ledger entry 
 * 7.Create Credit ledger entry 
 * 8.Mark transaction COMPLETED 
 * 9.Commit MongoDB session
 * 10.Send email notification
 */

async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            success: false,
            message: "fromAccount,toAccount,amount,idempotencyKey are required"
        });
    }

    if (
        !mongoose.isValidObjectId(fromAccount) ||
        !mongoose.isValidObjectId(toAccount) ||
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid fromAccount, toAccount or amount"
        });
    }

    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            success: false,
            message: "Invalid fromAccount or toAccount"
        });
    }

    /**
     * 2.Validate idempotency key 
     */
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    });

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                success: true,
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            });
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                success: true,
                message: "Transaction is still processing"
            });
        }
        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                success: false,
                message: "Transaction processing Failed"
            });
        }
        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                success: false,
                message: "Transaction was reversed,please retry"
            });
        }
    }

    /**
     * 3.check account status 
     */
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            success: false,
            message: "Both fromAccount and toAccount must be active to proceed for transaction"
        });
    }

    /**
     * 4.Derive sender balance from ledger 
     */
    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
        return res.status(400).json({
            success: false,
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
        });
    }

    /**
     * 5-9.Create transaction + ledger entries atomically
     */
    const session = await mongoose.startSession();
    let transaction;

    try {
        session.startTransaction();

        // NOTE: with { session }, create() needs an array of docs
        [transaction] = await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session });

        await ledgerModel.create([{
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });
        ()=>{}
        await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();

    } catch (error) {
        await session.abortTransaction();

        // Two requests with the same idempotencyKey raced each other
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Transaction with this idempotencyKey is already being processed"
            });
        }

        console.error("createTransaction error:", error);
        return res.status(500).json({
            success: false,
            message: "Transaction failed"
        });

    } finally {
        await session.endSession();
    }

    /**
     * 10.Send email (money already moved - never fail the request because of email)
     */
    try {
        await emailService.sendTransactionEmail(
            req.user.email,
            req.user.name,
            amount,
            toUserAccount._id
        );
    } catch (error) {
        console.error("Transaction email failed:", error);
    }

    return res.status(201).json({
        success: true,
        message: "Transaction is completed successfully",
        transaction
    });
}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            success: false,
            message: "toAccount,amount and idempotencyKey are required"
        });
    }

    if (
        !mongoose.isValidObjectId(toAccount) ||
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid toAccount or amount"
        });
    }

    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!toUserAccount) {
        return res.status(400).json({
            success: false,
            message: "Invalid toAccount"
        });
    }

    // Idempotency: return the previous result instead of creating another transaction
    const existingTransaction = await transactionModel.findOne({ idempotencyKey });

    if (existingTransaction) {
        return res.status(200).json({
            success: true,
            message: "Transaction already processed",
            transaction: existingTransaction
        });
    }

    // req.user.systemUser === true is already verified by authSystemUserMiddleware
    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    });

    if (!fromUserAccount) {
        return res.status(400).json({
            success: false,
            message: "System user account not found"
        });
    }

    const session = await mongoose.startSession();
    let transaction;

    try {
        session.startTransaction();

        [transaction] = await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session });

        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();

    } catch (error) {
        await session.abortTransaction();

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Transaction with this idempotencyKey is already being processed"
            });
        }

        console.error("createInitialFundsTransaction error:", error);
        return res.status(500).json({
            success: false,
            message: "Initial funds transaction failed"
        });

    } finally {
        await session.endSession();
    }

    return res.status(201).json({
        success: true,
        message: "Initial funds transaction completed successfully",
        transaction
    });
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
};
