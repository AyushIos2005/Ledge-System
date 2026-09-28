const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const AccountController = require("../controllers/account.controller");

const router = express.Router();

/**
 * -POST/api/account/
 * -Create a new account 
 * -Protected Route
 */


router.post("/",authMiddleware.authMiddleware,AccountController.createAccountController);

/**
 * -GET/api/accounts/
 * -Get all accounts of the logged-in user 
 * -Protected Route 
 */
router.get("/",authMiddleware.authMiddleware,AccountController.getUserAccountsController);

/**
 * -GET/api/accounts/balance/:accountId
 * 
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,AccountController.getAccountBalance);
module.exports = router;