import { Request, Response, NextFunction } from "express";
import { Schema } from "joi"; // استيراد نوع `Schema` من Joi

export const validate = (userSchema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = userSchema.validate(
            { ...req.body, ...req.params, ...req.query },
            { abortEarly: false }
        );

        if (!error) {
            return next();
        }

        // تجميع الأخطاء في مصفوفة
        const errMsg = error.details.map((err) => err.message);
        console.log("Validation error:", error.details);

        res.status(400).json({ message: errMsg });
    };
};
