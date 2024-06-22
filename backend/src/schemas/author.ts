import mongoose, { Schema } from 'mongoose';

export const authorSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    biography: { type: String, required: true },
    age: { type: Number, required: true }
});
