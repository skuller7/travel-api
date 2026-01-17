import logger = require("../../../lib/winston");
import config = require("../../../config");


import type { Request, Response } from "express";


import User, { IUser } from "../../../models/user";
import { generateAccessToken, generateRefreshToken } from "../../../lib/jwt";
import { Types } from "mongoose";


type UserData = Pick<IUser, 'email' | 'password' | 'role' | 'username'> & {
    firstName?: string;
    lastName?: string;
}

const register = async (req: Request, res: Response): Promise<void> => {
    
    console.log('=== DEBUG START ===');
    console.log('Full request body:', req.body);
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', Object.keys(req.body));
    console.log('Email value:', req.body.email);
    console.log('Password value:', req.body.password);
    console.log('=== DEBUG END ==='); 
    // This is for debugging 
    
    const { email, password, role, username, firstName, lastName } = req.body as UserData;
    
    
    if (!email || !password) {
        res.status(400).json({
            code: "VALIDATION_ERROR",
            message: "Email i lozinka su obavezni",
        });
        return;
    }

    // Generate username from email if not provided
    const finalUsername = username || email.split('@')[0];
    // const accessToken = generateAccessToken(new Types.ObjectId(finalUsername));
    // const refreshToken = generateRefreshToken(new Types.ObjectId(finalUsername));

    try {
        // Create new user
        const newUser = new User({
            email,
            password,
            role: role || 'user',
            username: finalUsername,
            firstName,
            lastName,
        });

        // Save user to database
        const savedUser = await newUser.save();

        logger.info("Korisnik je uspesno registrovan", {
            userId: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,
        });

        res.status(201).json({
            message: "Korisnik je uspesno registrovan",
            user: {
                id: savedUser._id,
                email: savedUser.email,
                username: savedUser.username,
                role: savedUser.role,
            },
        });
    } catch (error: any) {
        
        if (error.code === 11000) {
            const field = error.keyPattern?.email ? 'email' : 'username';
            res.status(409).json({
                code: "DUPLICATE_ERROR",
                message: `${field === 'email' ? 'Email' : 'Korisnicko ime'} vec postoji`,
            });
            logger.warn(`Pokusaj registracije sa postojećim ${field}`, { email, username: finalUsername });
            return;
        }

        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            const errorMessage = errors.length > 0 ? errors.join(", ") : "Greska u validaciji podataka";
            res.status(400).json({
                code: "VALIDATION_ERROR",
                message: errorMessage,
                errors,
            });
            logger.warn("Greska u validaciji prilikom registrovanja", { 
                errors, 
                requestBody: { email, role, username: finalUsername } 
            });
            return;
        }

        // Handle other errors
        res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Greska prilikom registrovanja korisnika",
        });
        logger.error("Greska prilikom registrovanja korisnika", error);
    }
}

export = register;
