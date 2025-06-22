import { Request, Response, NextFunction } from "express";
import { User } from "../../modules/Users/users.models";
import bcrypt from "bcryptjs";
import { catchError } from "../errors/catchError";

export const checkEmail = catchError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }

    const emailFound = await User.findOne({ email });

    if (emailFound) {
        res.status(400).json({ message: "Email already exists" });
        return;
    }

    req.body.password = bcrypt.hashSync(password, 8);
    next();
});
