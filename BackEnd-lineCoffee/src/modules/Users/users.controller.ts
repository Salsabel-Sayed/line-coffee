import { NextFunction, Request, Response } from "express";
import { catchError } from "../../middlewares/errors/catchError";
import { User, IUser } from "./users.models";
import { AppError } from "../../middlewares/errors/appError";
import  bcrypt  from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticatedRequest } from "../../types/custom";
import { IWallet, Wallet } from "../Wallet/wallet.model";
import mongoose, { Types } from "mongoose";
import { Coins } from "../Coins/coins.model";


dotenv.config();

// user token 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//   .eyJ1c2VySWQiOiI2ODAwZTI0ZGEzMWRmMWY0MGYzMTBkYWEiLCJlbWFpbCI6InVzZXJsYXN0QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwibG9nZ2luZyI6ZmFsc2UsImlhdCI6MTc0NDg4OTA4OH0
//   .wwnArRF2xEBIAwdJ5QZaHQSjH0ZW2HOS2qsGrnot24c;




//? register user
export const registerUser = catchError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // تأكد إن req.body متوافق مع واجهة المستخدم IUser
      const addUser: IUser = await User.create(req.body);
      const newWallet: IWallet = await Wallet.create({
        userId: addUser._id,
        balance: 0,
        transactions: [],
      });
      const newCoins = await Coins.create({
        userId: addUser._id,
        coins: 0,
      });
      console.log("Wallet created:", newWallet);
      addUser.wallet = newWallet._id as Types.ObjectId;;
      addUser.coins = newCoins._id as Types.ObjectId;
      await addUser.save();


      res.status(201).json({ message: "User added successfully", addUser });
    } catch (error) {
        next(error); 
    }
});

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? log in user
export const loginUser = catchError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  console.log(email , password);


  const userExist = await User.findOne({ email });
  if (!userExist) return next(new AppError("User not found", 404));

  const isPasswordValid = await bcrypt.compare(password, userExist.password);
  if (!isPasswordValid) return next(new AppError("Invalid password!", 404));

  if (userExist.email !== email) return next(new AppError("Invalid email or password!", 404));

  const activeState = await User.updateOne({ _id: userExist._id }, { logging: true, firstLoginCouponUsed: true }  );
  console.log("activeState", activeState);

  const secretKey = process.env.PASSWORD_TOKEN || "thisisLineCoffeeProj";
  let authorization = jwt.sign(
    {
      userId: userExist._id,
      email: userExist.email,
      role: userExist.role,
      logging: userExist.logging,
    },
    secretKey,
    { expiresIn: "3d" }
  );
  if (userExist.coins && !(userExist.coins instanceof Types.ObjectId)) {
    userExist.coins = undefined; // أو null لو بتحبي
  }
  
  await userExist.save();
  res.json({ message: "Signed in successfully", authorization });
});
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? create User By Admin
export const createUserByAdmin = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const addUser: IUser = await User.create(req.body);
      console.log("addUser", addUser);

      const newWallet: IWallet = await Wallet.create({
        userId: addUser._id,
        balance: 0,
        transactions: [],
      });
      console.log("newWallet", newWallet);

      const newCoins = await Coins.create({
        userId: addUser._id,
        coins: 0,
      });
      console.log("newCoins", newCoins);

      addUser.wallet = newWallet._id as Types.ObjectId;
      addUser.coins = newCoins._id as Types.ObjectId;
      await addUser.save();

      res.status(201).json({ message: "User created by admin", user: addUser });
    } catch (error: any) {
      console.error(
        "Admin create user error:",
        error.message,
        error.errors || error
      );

      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(
          (err: any) => err.message
        );
         res.status(400).json({ message: "Validation Error", errors });
      }

      res.status(500).json({ message: error.message || "Server Error" });
    }
      
  }
);



//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? log out user
export const logoutUser = catchError(async (req: AuthenticatedRequest, res: Response, next: NextFunction):Promise<void>=>{

    const userId = req.user?.userId
    console.log("userId",userId);
    
    if(!userId){
        return next(new AppError("You are not logged in", 401))
    }
    const user = await User.findByIdAndUpdate(userId, { logging: false }, { new: true });
    res.json({ message: "Logged out successfully",user });
})

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? update user
export const updateUser = catchError(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new AppError("Unauthorized access!", 401));
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
      return next(new AppError("User not found!", 404));
    }

    if (req.body.email || req.body.userPhone) {
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { userPhone: req.body.userPhone }],
        _id: { $ne: userId },
      });

      if (existingUser) {
        return next(
          new AppError(
            "Email or phone number already in use by another user!",
            400
          )
        );
      }
    }

    let passwordChanged = false;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      passwordChanged = true;
    }

    const updated = await User.updateOne({ _id: userId }, req.body);

    // ✨ لو الباسورد اتغير نولد توكن جديد
    let newToken: string | null = null;

    if (passwordChanged) {
      newToken = jwt.sign(
        {
          userId: findUser._id,
          email: req.body.email || findUser.email,
          role: findUser.role,
        },
        "thisisLineCoffeeProj",
        { expiresIn: "7d" }
      );
    }

    await findUser.save();

    res.json({
      message: "Done!",
      updated,
      ...(newToken && { authorization: newToken }), // لو فيه توكن جديد، نرجعه
    });
  }
);


//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? delete user

export const deleteUser = catchError(async (req:AuthenticatedRequest, res: Response, next: NextFunction):Promise<void> =>{
    const userId = req.user?.userId;
    if (!userId) {
        return next(new AppError("Unauthorized access!", 401));
    }
    console.log("userId", userId);
    const findUser = await User.findById(userId);
    if (!findUser) {
        return next(new AppError("User not found!", 404));
    }
    console.log('findUser', findUser);

    const deleteUserInfo = await User.findByIdAndDelete(userId);

    res.json({message:"delted user!", deleteUserInfo})

})

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get user profile
export const finduserInfo = catchError(async(req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void>=>{
    const userId = req.user?.userId;
    const userIdFromParams = req.params.id;
    console.log("userId",userId);
    console.log("userIdFromParams", userIdFromParams);
    

    if (userId !== userIdFromParams) {
      return next(new AppError("Unauthorized access!", 403));
    }
    if (!userId) {
        return next(new AppError("Unauthorized access!", 401));
    }
    if (!userIdFromParams) {
      return next(new AppError("params Unauthorized access!", 401));
    }
    console.log("userId", userId);
    const findUser = await User.findById(userId);
    if (!findUser) {
        return next(new AppError("User not found!", 404));
    }
    console.log('findUser', findUser);
    res.json({
      message: "Login successful",
      user: {
        
        _id: findUser._id,
        email: findUser.email,
        userName: findUser.userName,
        userPhone: findUser.userPhone,
        wallet: findUser.wallet,
        coins: findUser.coins,
        address: findUser.address,
        // أي حاجة تانية محتاجاها
      },
    });
      
})

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get all users profile(admin)
export const getAllUsers = catchError(async (req: AuthenticatedRequest, res: Response, next:NextFunction):Promise<void>=>{
    const userId = req.user?.userId;
    console.log("userId",userId);
    if (!userId) {
        return next(new AppError("Unauthorized access!", 401));
    }
    const users = await User.find()
      .populate({ path: "coins", select: "coins" })
      .populate({ path: "wallet", select: "balance" });

    console.log(
      "USERS WITH COINS:",
      users.map((u) => ({
        email: u.email,
        coins: u.coins,
        coinsType: typeof u.coins,
        wallet: u.wallet,
      }))
    );


    res.json({users});


})
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? update users profile(admin)
export const adminUpdateUser = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Incoming body:", req.body);

    const userId = req.params.id;

    const findUser = await User.findById(userId);
    if (!findUser) return next(new AppError("User not found!", 404));

    if (req.body.email || req.body.userPhone) {
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { userPhone: req.body.userPhone }],
        _id: { $ne: userId },
      });

      if (existingUser) {
        return next(new AppError("Email or phone number already in use!", 400));
      }
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await User.updateOne({ _id: userId }, req.body);
    let newToken: string | null = null;

    if (req.body.email || req.body.password) {
      newToken = jwt.sign(
        {
          userId: findUser._id,
          email: req.body.email || findUser.email,
          role: findUser.role,
        },
        "thisisLineCoffeeProj",
        { expiresIn: "7d" }
      );
    }

    res.json({
      message: "Updated by admin",
      updated,
      ...(newToken && { authorization: newToken }),
    });
  
  }
);
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? delete users profile(admin)
export const adminDeleteUser = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const findUser = await User.findById(userId);
    if (!findUser) return next(new AppError("User not found!", 404));

    const deleted = await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted by admin", deleted });
  }
);
