const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model");
async function authMiddleware(req, res, next) {
    try {
        // Get token from cookie or Authorization header
        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access, token is missing",
            });
        }
        const isBlackListed = await tokenBlackListModel.findOne({token})

    if(isBlackListed){
        return res.status(401).json({
            message : "Unauthorize"
        })
    }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_KEY
        );

        // Find user
        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access, user not found",
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (err) {
        console.error("Auth middleware error:", err);

        return res.status(401).json({
            success: false,
            message: "Unauthorized access, token is invalid or expired",
        });
    }
}

async function authSystemUserMiddleware(req, res, next) {
    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access, token is missing"
        });
    }
    const isBlackListed = await tokenBlackListModel.findOne({token})

    if(isBlackListed){
        return res.status(401).json({
            message : "Unauthorize"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await userModel
            .findById(decoded.userId)
            .select("+systemUser");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access, user not found"
            });
        }

        if (!user.systemUser) {
            return res.status(403).json({
                success: false,
                message: "Forbidden access, not a system user"
            });
        }

        req.user = user;
        return next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access, token is invalid"
        });
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
};