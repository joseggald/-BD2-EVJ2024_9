import mongoose, { Schema } from "mongoose";

export const reviewSchema = new mongoose.Schema({
     user_uid: { type: Schema.Types.ObjectId, required: true },
     content: { type: String, required: true },
     rating: { type: Number, required: true },
     created_on: { type: Date, default: Date.now },
     book_uid: { type: Schema.Types.ObjectId, required: true }
 });