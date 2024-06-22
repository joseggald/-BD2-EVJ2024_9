import mongoose, { Connection, Schema } from "mongoose";
import { IInstanceInfo } from "./dbInfo";
import { bookSchema } from "../schemas/books";
import { reviewSchema } from "../schemas/review";
import { authorSchema }from "../schemas/author";
import { userSchema } from "../schemas/user";
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
        // URI de la base de datos con la instancia perteneciente y crea la conexión
        const URI = `mongodb+srv://${instance.USER}:${instance.PASSWORD}@${instance.HOST}/?retryWrites=true&w=majority&appName=ProjectsEnviroment`;
        this.conn = mongoose.createConnection(URI, { dbName: instance.DATABASE });
        console.log(`Connected to ${instance.DATABASE}`);

        userSchema.set('toJSON', {
            transform: (doc, ret, options) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                return ret;
            }
        });

        // MONGODB SCHEMAS
        this.usersModel = this.conn.model('users', userSchema);
        this.rolesModel = this.conn.model('roles', new mongoose.Schema());
        this.booksModel = this.conn.model('books', bookSchema);
        this.ordersModel = this.conn.model('orders', new mongoose.Schema());
        this.authorModel = this.conn.model('authors', authorSchema);
        this.reviewsModel = this.conn.model('reviews', reviewSchema);
        this.productsOrderModel = this.conn.model('products_order', new mongoose.Schema());
    }

    // Funciones de la base de datos
    async login(email:string, password:string) {
        const user = await this.usersModel.findOne({ email, password });
        if (user) {
            await this.usersModel.updateOne({ _id: user._id }, { update_session : new Date()})
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

    async addBook(title: string, author_uid: string, description: string, genre: string, released_date: string, available: boolean, stock: number, price: number, image_url: string) {
        try {
            // Verifica la existencia de un libro para no generar duplicados
            const existingBook = await this.booksModel.findOne({ title, author_uid });
            if (existingBook) {
                return null; // Devolver null si el libro ya existe
            }
    
            const newBook = await this.booksModel.create({
                title,
                author_uid,
                description,
                genre,
                released_date, //string
                available,
                stock,
                rating: 0, // Inicialmente, el rating es 0
                price,
                image_url
            });
            return newBook.toJSON();
        } catch (error) {
            console.error('Error adding book:', error);
            throw new Error('Error adding book');
        }
    }
    
    
    async updateBook(id: string, updates: Partial<{ title: string, author_uid: string, description: string, genre: string, released_date: string, available: boolean, stock: number, price: number, image_url: string }>) {
        try {
            // Verificar que el libro existe
            const existingBook = await this.booksModel.findById(id);
            if (!existingBook) {
                return null; // Devolver null si el libro no existe
            }
    
            // Verificar si el nuevo título y autor ya existen en otro libro
            if (updates.title && updates.author_uid) {
                const duplicateBook = await this.booksModel.findOne({ title: updates.title, author_uid: updates.author_uid, _id: { $ne: id } });
                if (duplicateBook) {
                    throw new Error('El libro con el mismo título y autor ya existe.');
                }
            }
    
            // Mantener los valores existentes si los nuevos valores no son proporcionados
            const updatedData = {
                title: updates.title || existingBook.title,
                author_uid: updates.author_uid || existingBook.author_uid,
                description: updates.description || existingBook.description,
                genre: updates.genre || existingBook.genre,
                released_date: updates.released_date || existingBook.released_date, 
                available: updates.available !== undefined ? updates.available : existingBook.available,
                stock: updates.stock !== undefined ? updates.stock : existingBook.stock,
                price: updates.price !== undefined ? updates.price : existingBook.price,
                image_url: updates.image_url || existingBook.image_url
            };
    
            const updatedBook = await this.booksModel.findByIdAndUpdate(id, updatedData, { new: true });
            if (!updatedBook) {
                throw new Error('Error actualizando el libro.');
            }
            return updatedBook.toJSON();
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    }
    
    async deleteBook(id: string) {
        try {
            const deletedBook = await this.booksModel.findByIdAndDelete(id);
            return deletedBook ? deletedBook.toJSON() : null;
        } catch (error) {
            console.error('Error deleting book:', error);
            throw new Error('Error deleting book');
        }
    }

    async register(first_name: string, last_name: string, email: string, phone: number, address: string, password: string, rol: string) {
        try {
            // Verificar si el correo electrónico ya está registrado
            const existingUser = await this.usersModel.findOne({ email });
            if (existingUser) {
                return null; // Devolver null si el correo electrónico ya está registrado
            }

            const newUser = await this.usersModel.create({
                first_name,
                last_name,
                email,
                phone,
                address,
                password, // falta cifrar la contraseña jeje salu2
                rol,
                shopping_cart: null
            });
            return newUser.toJSON();
        } catch (error) {
            console.error('Error registering user:', error);
            throw new Error('Error registering user');
        }
    }

    async updateProfile(id: string, updates: Partial<{ first_name: string, last_name: string, email: string, phone: number, address: string, password: string, rol: string, shopping_cart: any }>) {
        try {
            // Verificar que el usuario existe
            const existingUser = await this.usersModel.findById(id);
            if (!existingUser) {
                return null; // Devolver null si el usuario no existe
            }
    
            // Verificar si el nuevo correo electrónico ya existe en otro usuario
            if (updates.email && updates.email !== existingUser.email) {
                const duplicateUser = await this.usersModel.findOne({ email: updates.email, _id: { $ne: id } });
                if (duplicateUser) {
                    throw new Error('El correo electrónico ya está registrado.');
                }
            }
    
            // Mantener los valores existentes si los nuevos valores no son proporcionados
            const updatedData = {
                first_name: updates.first_name || existingUser.first_name,
                last_name: updates.last_name || existingUser.last_name,
                email: updates.email || existingUser.email,
                phone: updates.phone !== undefined ? updates.phone : existingUser.phone,
                address: updates.address || existingUser.address,
                password: updates.password || existingUser.password,
                rol: updates.rol || existingUser.rol,
                shopping_cart: updates.shopping_cart !== undefined ? updates.shopping_cart : existingUser.shopping_cart
            };
    
            const updatedUser = await this.usersModel.findByIdAndUpdate(id, updatedData, { new: true });
            if (!updatedUser) {
                throw new Error('Error actualizando el perfil.');
            }
            return updatedUser.toJSON();
        } catch (error) {
            console.error('Error updating profile:', error);
            throw new Error('Error updating profile');
        }
    }
    
    async getRoles() {
        try {
            const roles = await this.rolesModel.find({});
            return roles.map(role => role.toJSON());
        } catch (error) {
            console.error('Error getting roles:', error);
            throw new Error('Error getting roles');
        }
    }
    
    
    async getAllAuthors() {
        return await this.authorModel.find();
    }

    async getBooksAuthor(authorId: string) {
        if (!ObjectId.isValid(authorId)) {
            throw new Error('Id inválido.')
        }
        const autorObjectId = new ObjectId(authorId)
        return await this.booksModel.find({author_uid:autorObjectId});
    }
    
    async addAuthor(first_name:string, last_name:string, biography:string, age:number) {
        const newAuthor = await this.authorModel.create({
            first_name,
            last_name,
            biography,
            age
        });
        return newAuthor;
    }

    async deleteAutor(authorId: string){
        if (!ObjectId.isValid(authorId)) {
            throw new Error('Id inválido.')
        }

        const autorObjectId = new ObjectId(authorId)
        await this.authorModel.deleteOne({_id:autorObjectId});
        await this.booksModel.deleteMany({author_uid:autorObjectId})
        return 'Author and associated books deleted successfully'
    }

}
