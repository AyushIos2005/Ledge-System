const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route")
const accountRouter = require("./routes/account.route")
const transcationRouter = require("./routes/transcation.route")
const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
// api call

app.get("/",(req,res)=>{
    res.send("Server is Working properly");
})
app.use("/api/auth",authRouter);
app.use("/api/accounts",accountRouter);
app.use("/api/transcation",transcationRouter);
module.exports = app;
