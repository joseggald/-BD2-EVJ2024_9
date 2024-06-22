import mongoose, { Connection, Schema } from "mongoose";
import { IInstanceInfo } from "./dbInfo";
const { ObjectId } = require('mongodb');
export default class MongoConnection {
    // Conexion a la base de datos
    conn: Connection;

    // Incializa modelos de la base de datos
    usersModel
    rolesModel
    booksModel
    ordersModel
    authorModel
    reviewsModel
    productsOrderModel

    constructor(instance: IInstanceInfo) {
        // URI de la base de datos con la instacia perteneciente y crea la conexion
        const URI = `mongodb+srv://${instance.USER}:${instance.PASSWORD}@${instance.HOST}/?retryWrites=true&w=majority&appName=ProjectsEnviroment`;
        this.conn = mongoose.createConnection(URI, { dbName: instance.DATABASE });
        console.log(`Connected to ${instance.DATABASE}`);

        // Initial Schema
        const reviewSchema = new mongoose.Schema({
            user_uid: { type: Schema.Types.ObjectId, required: true },
            content: { type: String, required: true },
            rating: { type: Number, required: true },
            created_on: { type: Date, default: Date.now },
            book_uid: { type: Schema.Types.ObjectId, required: true }
        });
        const bookSchema = new mongoose.Schema({
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

        // MONGODB SCHEMAS
        this.usersModel = this.conn.model('users', new mongoose.Schema());
        this.rolesModel = this.conn.model('roles', new mongoose.Schema());
        this.booksModel = this.conn.model('books', bookSchema);
        this.ordersModel = this.conn.model('orders', new mongoose.Schema());
        this.authorModel = this.conn.model('authors', new mongoose.Schema());
        this.reviewsModel = this.conn.model('reviews', reviewSchema);
        this.productsOrderModel = this.conn.model('products_order', new mongoose.Schema());

    }

    // Funciones de la base de datos
    async login(email:string, password:string) {
        const user = await this.usersModel.findOne({ email, password });
        if (user) {
            return { success: true, userId: user._id };
        }
        return { success: false };
    }

    async getUser(id:string) {
        return await this.usersModel.find({ _id: id });
    }

    async getAllBooks() {
        return await this.booksModel.find();
    }

    async getBooksName(nameBook:string) {
        const regex = new RegExp(nameBook, 'i');
        return await this.booksModel.find({ title: regex });
    }

    async getAllGenres() {
        return await this.booksModel.aggregate([
            {
                $group: {
                    _id: "$genre",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    genre: "$_id"
                }
            }
        ]).exec();
    }

    async getGenreBooks(genreBook:string) {
        const regex = new RegExp(genreBook, 'i');
        return await this.booksModel.find({ genre: regex });
    }

    async getLowPrices() {
        return await this.booksModel.find().sort({ price: 1 })
    }

    async getHighPrices() {
        return await this.booksModel.find().sort({ price: -1 })
    }

    async getHighRatingBooks() {
        return await this.booksModel.find().sort({ rating: -1 })
    }

    async getLowRatingBooks() {
        return await this.booksModel.find().sort({ rating: 1 })
    }

    async getBookById(id:string) {
        return await this.booksModel.find({ _id: id });
    }

    async getAuthorById(id:string) {
        return await this.authorModel.find({ _id:id });
    }

    async getReviewsBook(id:string) {
        return await this.reviewsModel.find({ book_uid: id });
    }

    async addReview(idBook: string, idUser: string, content: string, rating: number) {
        try {
            const review = await this.reviewsModel.create({
                user_uid: idUser,
                content,
                rating,
                book_uid: idBook 
            });
    
            if (review) {
                const ratingBook = await this.reviewsModel.aggregate([
                    { $match: { book_uid: new ObjectId(idBook) } },
                    { $group: { _id: "$book_uid", avgRating: { $avg: "$rating" } } }
                ]).exec();
                if (ratingBook.length > 0) {
                    const avgRating = ratingBook[0].avgRating.toFixed(2);
                    const updatedBook = await this.booksModel.updateOne(
                        { _id: idBook },
                        { rating: avgRating }
                    ).exec();

                    return { success: true };
                } else {
                    console.error('No se encontraron reseñas para el libro especificado.');
                    return { success: false };
                }
            } else {
                console.error('No se pudo crear la reseña.');
                return { success: false };
            }
        } catch (error) {
            console.error('Error al agregar la reseña y actualizar el rating:', error);
            throw error;
        }
    }
    
}
