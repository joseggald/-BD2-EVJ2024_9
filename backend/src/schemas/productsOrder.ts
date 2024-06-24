import mongoose, { Schema } from 'mongoose';

export const productsOrderSchema = new mongoose.Schema({
    order_uid: { type: Schema.Types.ObjectId, required: true },
    book_uid: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true},
    total : { type: Number, required: true },
});
