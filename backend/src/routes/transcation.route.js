const {Router} = require("express");
const authMiddleware  = require("../middlewares/auth.middleware");
const transactionController = require("../controllers/transaction.controller")
const transactionRoutes = Router();

/**
 * -POST/api/transactions/
 * -Create a new transaction
 */

transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction);

/**
 * -POST/api/transaction/system/inital-funds
 * -Create initial funds transaction from system.
 */
transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction);
module.exports = transactionRoutes;