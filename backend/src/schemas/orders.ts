import mongoose, { Schema } from 'mongoose';

export const ordersSchema = new mongoose.Schema({
    order_number: { type: Number, required: true },
    description: { type: String, required: true, default: 'Sin descripción'},
    status: { type: String, required: true, default:'DRAFT' },
    created_on: { type: Date, default: Date.now },
    update_on: { type: Date, default: Date.now },
    total : { type: Number, required: true, default: 0},
    user_uid: { type: Schema.Types.ObjectId, required: true },
    books: { type: Array, required: true, default: []}
});
