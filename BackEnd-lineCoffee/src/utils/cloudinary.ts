// import { v2 as cloudinary } from "cloudinary";
// import { Request, Response, NextFunction } from "express";
// import fs from "fs";
// import dotenv from "dotenv";
// import fileUpload from "express-fileupload";

// dotenv.config();

// // ضبط إعدادات Cloudinary
// cloudinary.config({
//     cloud_name: "dulbtdvey",
//     api_key: "819556531398351",
//     api_secret: "U4B8LJ9IcuZ9Mkq6-m6Tti-LTYU",
// });

// // دالة لرفع الصور إلى Cloudinary
// export const uploadToCloudinary = async (filePath: string): Promise<string> => {
//     try {
//         const result = await cloudinary.uploader.upload(filePath, {
//             folder: "products",
//         });

//         // حذف الملف بعد الرفع
//         fs.unlinkSync(filePath);

//         return result.secure_url;
//     } catch (error) {
//         console.error("Cloudinary upload error:", error);
//         throw new Error("Image upload failed!");
//     }
// };

// // Middleware لمعالجة رفع الصور مع `express-fileupload`
// export const cloudinaryUploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     console.log("Request Content-Type:", req.headers["content-type"]); 
//     console.log("Full req.body before parsing:", req.body); 
//     console.log("Uploaded files:", req.files); 

//     try {
//         if (!req.files || !req.files.image) {
//             console.log("No image found in request");
//             return next();
//         }

//         const image = req.files.image as fileUpload.UploadedFile;
//         console.log("Uploading image:", image.name); 
        
//         const imageUrl = await uploadToCloudinary(image.tempFilePath);
//         console.log("Uploaded image URL:", imageUrl); 

//         req.body.imageUrl = imageUrl; // ✨ أضيفي رابط الصورة للطلب
//         next();
//     } catch (error) {
//         console.error("Middleware error:", error);
//         next(error);
//     }
// };

