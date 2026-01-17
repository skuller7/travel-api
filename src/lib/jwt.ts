import jwt from "jsonwebtoken"
import config from "../config";
import { Types } from "mongoose";

export const  generateAccessToken =  (userid: Types.ObjectId): string => {
    return jwt.sign({userid}, config.JWT_ACCESS_SECRET, {
        expiresIn: config.ACCESS_TOKEN_EXPIRY,
        subject: 'accessApi'
    });
};

export const  generateRefreshToken =  (userid: Types.ObjectId): string => {
    return jwt.sign({userid}, config.JWT_REFRESH_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRY,
        subject: 'refreshApi'
    });
};