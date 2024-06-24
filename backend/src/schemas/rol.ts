import mongoose, { Schema } from "mongoose";

export const rolSchema = new mongoose.Schema({
     name: { type: String, required: true }
 });