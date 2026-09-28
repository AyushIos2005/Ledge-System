const mon = require("mongoose");

const transcationSchema = new mon.Schema({
    fromAccount : {
        type : mon.Schema.Types.ObjectId,
        ref : "account",
        required : [true,"Transaction must be associated with a from account"],
        index : true
    },
    toAccount : {
        type : mon.Schema.Types.ObjectId,
        ref : "account",
        required : [true,"Transaction must be associated with a to account"],
        index : true
    },
    status : {
        type : String,
        enum : {
            values : ["PENDING","COMPLETED","FAILED","REVERSED"],
            message : "Status can be either PENDING,COMPLETED,FAILED or REVERSED",
        },
        default : "PENDING"
    },
    amount :{
        type :Number,
        required : [true,"Amount is required for creating a transaction"],
        min : [1,"Transaction amount cannot be zero or negative"]
    },
    idempotencyKey : {
        type : String,
        required : [true,"Idempotency key is required for creating a transaction"],
        index : true,
        unique : true
    }
},{
    timestamps : true
})

const transactionModel = mon.model("transaction",transcationSchema)

module.exports = transactionModel;
