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
        
        // MONGODB SCHEMAS
        this.usersModel = this.conn.model('users', new mongoose.Schema());
        this.rolesModel = this.conn.model('roles', new mongoose.Schema());
        this.booksModel = this.conn.model('books', new mongoose.Schema());
        this.ordersModel = this.conn.model('orders', new mongoose.Schema());
        this.authorModel = this.conn.model('authors', new mongoose.Schema());
        this.reviewsModel = this.conn.model('reviews', new mongoose.Schema());
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

}
