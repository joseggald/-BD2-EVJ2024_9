import mongoose, { Schema } from "mongoose";

export const bookSchema = new mongoose.Schema({
     title: { type: String, required: true },
     author_uid: { type: Schema.Types.ObjectId, required: true },
     description: { type: String, required: true },
     genre : { type: String, required: true },
     released_date: { type: Date, required: true },
     available : { type: Boolean, required: true },
     stock : { type: Number, required: true },
     rating: { type: Number, required: true , default: 0}, 
     price : { type: Number, required: true },
     image_url : { type: String, required: true } 
 });