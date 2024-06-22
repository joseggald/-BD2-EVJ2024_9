import mongoose, { Schema } from "mongoose";

export const userSchema = new mongoose.Schema({
     first_name: { type: String, required: true },
     last_name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     phone: { type: Number, required: true },
     address: { type: String, required: true },
     created_on: { type: Date, default: Date.now },
     update_session: { type: Date, default: Date.now },
     password: { type: String, required: true },
     rol: { type: Schema.Types.ObjectId, required: true },
     shopping_cart: { type: Schema.Types.ObjectId, default: null }
 }, { versionKey: false });