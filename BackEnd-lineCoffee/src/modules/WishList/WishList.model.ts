import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
    user: Schema.Types.ObjectId;
    products: Schema.Types.ObjectId[]; // Array of product IDs
}

const WishlistSchema = new Schema<IWishlist>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        products: [{ type: Schema.Types.ObjectId, ref: "Products" }],
    },
    { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);
