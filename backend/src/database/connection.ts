import mongoose, { Connection, Schema  } from "mongoose";
import { IInstanceInfo } from "./dbInfo";
import { bookSchema } from "../schemas/books";
import { reviewSchema } from "../schemas/review";
import { authorSchema }from "../schemas/author";
import { userSchema } from "../schemas/user";
import { ordersSchema } from "../schemas/orders";
import { productsOrderSchema } from "../schemas/productsOrder";
import { rolSchema } from "../schemas/rol";
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
        this.rolesModel = this.conn.model('roles', rolSchema);
        this.booksModel = this.conn.model('books', bookSchema);
        this.ordersModel = this.conn.model('orders', ordersSchema);
        this.authorModel = this.conn.model('authors', authorSchema);
        this.reviewsModel = this.conn.model('reviews', reviewSchema);
        this.productsOrderModel = this.conn.model('products_orders', productsOrderSchema);
    }

    // Funciones de la base de datos
    async login(email:string, password:string) {
        const user = await this.usersModel.find({ email, password });
        const rol = await this.rolesModel.find({_id:user[0].rol});

        if (user) {
            await this.usersModel.updateOne({ _id: user[0]._id }, { update_session : new Date()})
            return { success: true, userdata: user, rol: rol[0].name};
        }
        return { success: false };
    }

    async getUser(id:string) {
        return await this.usersModel.find({ _id: id });
    }

    async getAllBooks() {
        return await this.booksModel.aggregate([
            {
                $lookup: {
                    from: 'authors', // Nombre de la colección de autores en la base de datos
                    localField: 'author_uid',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true // Esto asegura que los libros sin autores aún sean incluidos
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author_uid: 1,
                    description: 1,
                    genre: 1,
                    released_date: 1,
                    available: 1,
                    stock: 1,
                    rating: 1,
                    price: 1,
                    image_url: 1,
                    'author._id': 1,
                    'author.first_name': 1,
                    'author.last_name': 1,
                    'author.biography': 1,
                    'author.age': 1
                }
            },{
                $sort: { _id: 1 } // Orden ascendente por _id
              }
        ]);
    }

    async getBooksName(nameBook:string) {
        const regex = new RegExp(nameBook, 'i');
        return await this.booksModel.aggregate([
            {
                $match: { title: regex }
            },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author_uid',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author_uid: 1,
                    description: 1,
                    genre: 1,
                    released_date: 1,
                    available: 1,
                    stock: 1,
                    rating: 1,
                    price: 1,
                    image_url: 1,
                    'author._id': 1,
                    'author.first_name': 1,
                    'author.last_name': 1,
                    'author.biography': 1,
                    'author.age': 1
                }
            }
        ]);
    }

    async getAuthorName(name: string) {
        const names = name.split(' ').filter(n => n);
        const regexes = names.map(n => new RegExp(n, 'i'));
    
        let query = [];
    
        if (regexes.length === 1) {
            query.push({ first_name: regexes[0] });
            query.push({ last_name: regexes[0] });
        } else if (regexes.length >= 2) {
            for (let i = 0; i < regexes.length; i++) {
                for (let j = 0; j < regexes.length; j++) {
                    if (i !== j) {
                        query.push({ $and: [{ first_name: regexes[i] }, { last_name: regexes[j] }] });
                    }
                }
            }
        }
    
        return await this.authorModel.find({
            $or: query
        });
    }
    

    async getAuthor(authorId:string) {
        return await this.authorModel.find({ _id: authorId});
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
        return await this.booksModel.aggregate([
            {
                $match: { genre: regex }
            },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author_uid',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author_uid: 1,
                    description: 1,
                    genre: 1,
                    released_date: 1,
                    available: 1,
                    stock: 1,
                    rating: 1,
                    price: 1,
                    image_url: 1,
                    'author._id': 1,
                    'author.first_name': 1,
                    'author.last_name': 1,
                    'author.biography': 1,
                    'author.age': 1
                }
            }
        ]);
    }

    async getLowPrices() {
        return await this.booksModel.aggregate([
            {
                $sort: { price: 1 }
            },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author_uid',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author_uid: 1,
                    description: 1,
                    genre: 1,
                    released_date: 1,
                    available: 1,
                    stock: 1,
                    rating: 1,
                    price: 1,
                    image_url: 1,
                    'author._id': 1,
                    'author.first_name': 1,
                    'author.last_name': 1,
                    'author.biography': 1,
                    'author.age': 1
                }
            }
        ]);
    }

    async getHighPrices() {
        return await this.booksModel.aggregate([
            {
                $sort: { price: -1 }
            },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author_uid',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author_uid: 1,
                    description: 1,
                    genre: 1,
                    released_date: 1,
                    available: 1,
                    stock: 1,
                    rating: 1,
                    price: 1,
                    image_url: 1,
                    'author._id': 1,
                    'author.first_name': 1,
                    'author.last_name': 1,
                    'author.biography': 1,
                    'author.age': 1
                }
            }
        ]);
    }

    async getHighRatingBooks() {
        return await this.booksModel.aggregate([
            {
                $sort: { rating: -1 }
            },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author_uid',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author_uid: 1,
                    description: 1,
                    genre: 1,
                    released_date: 1,
                    available: 1,
                    stock: 1,
                    rating: 1,
                    price: 1,
                    image_url: 1,
                    'author._id': 1,
                    'author.first_name': 1,
                    'author.last_name': 1,
                    'author.biography': 1,
                    'author.age': 1
                }
            }
        ]);
    }

    async getLowRatingBooks() {
        return await this.booksModel.aggregate([
            {
                $sort: { rating: 1 }
            },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author_uid',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author_uid: 1,
                    description: 1,
                    genre: 1,
                    released_date: 1,
                    available: 1,
                    stock: 1,
                    rating: 1,
                    price: 1,
                    image_url: 1,
                    'author._id': 1,
                    'author.first_name': 1,
                    'author.last_name': 1,
                    'author.biography': 1,
                    'author.age': 1
                }
            }
        ]);
    }

    async getBookById(id:string) {
        return await this.booksModel.find({ _id: id});
    }

    async getAuthorById(id:string) {
        return await this.authorModel.find({ _id:id });
    }

    async getReviewsBook(id: string) {
        try {
          const reviews = await this.reviewsModel.aggregate([
            { $match: { book_uid: new ObjectId(id) } },
            {
              $lookup: {
                from: 'users',
                localField: 'user_uid',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $unwind: '$user' // Desenrollar el array 'user' resultante del $lookup
            },
            {
              $project: {
                _id: 1,
                content: 1,
                rating: 1,
                created_on: 1,
                user_name: { $concat: ['$user.first_name', ' ', '$user.last_name'] }, // Concatenar nombres y apellidos
                user_email: '$user.email',
              },
            },
          ]);
      
          return reviews;
        } catch (error) {
          console.error('Error al obtener reseñas del libro', error);
          throw new Error('No se pudieron obtener las reseñas del libro');
        }
      }

    async addReview(idBook: string, idUser: string, content: string, rating: number) {
        try {
            console.log('idUser:', idUser);
            const review = await this.reviewsModel.create({
                user_uid: idUser,
                content,
                rating,
                book_uid: idBook 
            });
            console.log('review:', review);
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

    async addBook(title: string, author_uid: string, description: string, genre: string, released_date: string, stock: number, price: number, image_url: string) {
        try {
            var available = false;
            // Verifica la existencia de un libro para no generar duplicados
            if (stock > 0 ) {
                available = true;
            }
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
    
    
    async updateBook(id: string, updates: Partial<{ title: string, author_uid: string, description: string, genre: string, released_date: string, stock: number, price: number, image_url: string }>) {
        try {
            var available = false;
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
            if (existingBook.stock > 0) {
                available = true;
            }
            if (updates.stock && updates.stock > 0) {
                available = true;
            }
            if (updates.stock && updates.stock <= 0) {
                available = false;
            }
            // Mantener los valores existentes si los nuevos valores no son proporcionados
            const updatedData = {
                title: updates.title || existingBook.title,
                author_uid: updates.author_uid || existingBook.author_uid,
                description: updates.description || existingBook.description,
                genre: updates.genre || existingBook.genre,
                released_date: updates.released_date || existingBook.released_date, 
                available: available,
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

    async createOrder(user_uid: string) {
        var order_number=await this.ordersModel.countDocuments({ user_uid: user_uid }).exec();
        if (order_number==0) order_number=1;
        else order_number++;

        const newOrder = await this.ordersModel.create({
            order_number,
            user_uid
        });

        await this.usersModel.updateOne({ _id: user_uid }, { shopping_cart: newOrder._id }).exec();
        
        return newOrder;
    }
    
    async addProductOrder(order_uid: string, book_uid: string, quantity: number) {
        try {
          // Buscar el libro por su _id
          const book = await this.booksModel.findById(book_uid);
          if (!book) {
            console.log('El libro no existe.');
            throw new Error('El libro no existe.');
          }
          if (book.stock <= quantity) {
            console.log('No hay suficiente stock.');
            throw new Error('No hay suficiente stock.');
          }
      
          // Verificar si el producto ya está en la orden
          const productsOrder = await this.productsOrderModel.find({ order_uid, book_uid });
          if (productsOrder.length > 0) {
            console.log('El libro ya está en la orden.');
            throw new Error('El libro ya está en la orden.');
          }
      
          const total = book.price * quantity;
      
          // Crear el nuevo producto de la orden
          const newProductOrder = await this.productsOrderModel.create({
            order_uid,
            book_uid,
            quantity,
            total
          });
      
          // Actualizar la orden para agregar el nuevo producto
          await this.ordersModel.updateOne({ _id: order_uid }, { $push: { books: newProductOrder._id } });
      
          // Obtener la orden actualizada con los libros poblados
          const order = await this.ordersModel.findById(order_uid).populate('books');
          if (!order) {
            console.log('La orden no existe.');
            throw new Error('La orden no existe.');
          }

          const orderDescription = await Promise.all(order.books.map(async (productOrder: any) => {
            const product = await this.productsOrderModel.find({ _id: productOrder });
            const productBook = await this.booksModel.find({_id:product[0].book_uid});
            if (!productBook) {
              console.log('El libro del producto en la orden no existe.');
              throw new Error('El libro del producto en la orden no existe.');
            }
            return `${product[0].quantity} x ${productBook[0].title}`;
            }));
            const orders1=await this.ordersModel.find({ _id: order_uid});
            var totalOrder=0;
            for (let i=0; i<orders1[0].books.length; i++) {
                const product=await this.productsOrderModel.find({ _id: orders1[0].books[i]});
                console.log('product:', product[0].total);
                totalOrder+=product[0].total;
            }
          
            await this.ordersModel.updateOne({ _id: order_uid }, { description: orderDescription.join(', '), total: totalOrder }).exec();
      
          return newProductOrder;
        } catch (error) {
          console.error('Error al agregar el producto a la orden:', error);
          throw new Error('Error al agregar el producto a la orden.');
        }
      }
      
      

    async deleteProductOrder(product_uid: string) {
        const product = await this.productsOrderModel.find({_id:product_uid});
        try {
            const book = await this.booksModel.findByIdAndUpdate({ _id: product[0].book_uid }, { $inc: { stock: product[0].quantity }}).exec();
            const orderUpdateResult = await this.ordersModel.updateOne(
                { _id: product[0].order_uid },
                { $pull: { books: new ObjectId(product_uid) } }
            ).exec();
            
            if (orderUpdateResult.modifiedCount === 0) {
                console.log(`No se encontró el pedido con ID ${product[0].order_uid} o el producto ${product_uid} no estaba en el array 'books'.`);
            } else {
                console.log(`Producto ${product_uid} eliminado del array 'books' del pedido ${product[0].order_uid}.`);
            }
    
            const productDeleteResult = await this.productsOrderModel.findOneAndDelete({ _id: product_uid }).exec();
            const orders=await this.ordersModel.find({ _id: product[0].order_uid});
            var totalOrder=0;
            for (let i=0; i<orders[0].books.length; i++) {
                const product=await this.productsOrderModel.find({ _id: orders[0].books[i]});
                totalOrder+=product[0].total;
            }
            const order = await this.ordersModel.findById(product[0].order_uid).populate('books');
            if (!order) {
              console.log('La orden no existe.');
              throw new Error('La orden no existe.');
            }
    
            const orderDescription = await Promise.all(order.books.map(async (productOrder: any) => {
              const product1 = await this.productsOrderModel.find({ _id: productOrder });
              const productBook = await this.booksModel.find({_id:product1[0].book_uid});
              if (!productBook) {
                console.log('El libro del producto en la orden no existe.');
                throw new Error('El libro del producto en la orden no existe.');
              }
              return `${product1[0].quantity} x ${productBook[0].title}`;
              }));

            await this.ordersModel.updateOne({ _id: product[0].order_uid }, {description:orderDescription.join(', '), total: totalOrder }).exec();
            if (!productDeleteResult) {
                console.log(`No se encontró el producto con ID ${product_uid} en la colección productsOrder.`);
            } else {
                console.log(`Producto ${product_uid} eliminado de la colección productsOrder.`);
            } 
            return orderUpdateResult;
        } catch (error) {
            console.error(`Error eliminando el producto ${product_uid} del pedido ${product[0].order_uid}:`, error);
            throw error;
        }
    }
    
    async updateProductOrder(product_uid: string, quantity: number) {
        const productOriginal = await this.productsOrderModel.find({_id:product_uid});
        const book = await this.booksModel.find({_id:productOriginal[0].book_uid});
        var stock=book[0].stock+productOriginal[0].quantity;
        if ((stock) < quantity) {
            console.log('No hay suficiente stock.');
            return Error('No hay suficiente stock.');
        }
        var newTotal=book[0].price*quantity;
        const product = await this.productsOrderModel.findByIdAndUpdate(product_uid, { quantity: quantity, total:newTotal }, { new: true }).exec();
        await this.booksModel.updateOne({ _id: productOriginal[0].book_uid }, { stock: stock-quantity }).exec();
        const products=await this.ordersModel.find({ _id: productOriginal[0].order_uid});
        // Obtener la orden actualizada con los libros poblados
        const order = await this.ordersModel.findById(productOriginal[0].order_uid).populate('books');
        if (!order) {
          console.log('La orden no existe.');
          throw new Error('La orden no existe.');
        }

        const orderDescription = await Promise.all(order.books.map(async (productOrder: any) => {
          const product1 = await this.productsOrderModel.find({ _id: productOrder });
          const productBook = await this.booksModel.find({_id:product1[0].book_uid});
          if (!productBook) {
            console.log('El libro del producto en la orden no existe.');
            throw new Error('El libro del producto en la orden no existe.');
          }
          return `${product1[0].quantity} x ${productBook[0].title}`;
          }));
        var totalOrder=0;
        for (let i=0; i<products[0].books.length; i++) {
            const product=await this.productsOrderModel.find({ _id: products[0].books[i]});
            totalOrder+=product[0].total;
        }
        await this.ordersModel.updateOne({ _id: productOriginal[0].order_uid }, {description: orderDescription.join(', '), total: totalOrder }).exec();
        return product;
    }    

    async getOrderResume(order_uid: string) {
        const order=await this.ordersModel.find({ _id: order_uid });
        const products = await this.productsOrderModel.aggregate([
            {
              $match: { order_uid: new ObjectId(order_uid) } // Filtro para encontrar las órdenes por order_uid
            },
            {
              $lookup: {
                from: 'books', // Colección books
                localField: 'book_uid',
                foreignField: '_id',
                as: 'book'
              }
            },
            {
              $unwind: '$book' // Desenrollar el array resultado de $lookup (ya que es un solo libro por orden)
            },
            {
              $lookup: {
                from: 'authors', // Colección authors
                localField: 'book.author_uid',
                foreignField: '_id',
                as: 'author'
              }
            },
            {
              $unwind: '$author' // Desenrollar el array resultado de $lookup (ya que es un solo autor por libro)
            },
            {
              $project: {
                _id: 1, // Opcional: Excluir el _id del resultado final si no es necesario
                order_uid: 1,
                quantity: 1,
                total: 1,
                book: {
                  title: 1,
                  description: 1,
                  genre: 1,
                  released_date: 1,
                  available: 1,
                  stock: 1,
                  rating: 1,
                  price: 1,
                  image_url: 1
                },
                author: {
                  first_name: 1,
                  last_name: 1,
                  biography: 1,
                  age: 1
                }
              }
            }
          ]);
        
        return { order, products };
    }

    async getOrdersByUser(user_uid: string) {
        return await this.ordersModel.find({ user_uid: user_uid, status: { $ne: 'DRAFT' }}).sort({ created_on: -1});
    }

    async getOrders() {
        try {
          const orders = await this.ordersModel.aggregate([
            {
              $match: { status: { $ne: 'DRAFT' } }
            },
            {
              $sort: { created_on: -1 }
            },
            {
              $lookup: {
                from: 'users', // Nombre de la colección de usuarios en tu base de datos
                localField: 'user_uid',
                foreignField: '_id',
                as: 'user'
              }
            },
            {
              $unwind: '$user'
            },
            {
              $project: {
                _id: 1,
                order_number: 1,
                description: 1,
                status: 1,
                total: 1,
                user: { $mergeObjects: ['$user', {}] }, // Asegura que los campos de usuario se agreguen correctamente
                books: 1,
                created_on: 1,
                update_on: 1
              }
            }
          ]);
          return orders;
        } catch (error) {
          console.error('Error fetching orders:', error);
          throw new Error('Unable to fetch orders');
        }
      }

    async deleteOrder(order_uid: string) {
        const order = await this.ordersModel.find({_id:order_uid});
        const products=await this.productsOrderModel.find({ order_uid: order_uid });
        for (let i=0; i<products.length; i++) {
            await this.productsOrderModel.deleteOne({ _id: products[i]._id });
            const book = await this.booksModel.find({_id:products[i].book_uid});
            await this.booksModel.updateOne({ _id: products[i].book_uid }, { stock: book[0].stock+products[i].quantity }).exec();
        }
        const orderDeleteResult = await this.ordersModel.deleteOne({ _id: order_uid }).exec();
        return orderDeleteResult;
    }

    async updateStatusOrder(order_uid: string) {
        const order=await this.ordersModel.find({ _id: order_uid });
        if(order[0].status=='DRAFT') {
            await this.ordersModel.updateOne({ _id: order_uid }, { status: 'PROCESS' }).exec();
            await this.usersModel.updateOne({ _id: order[0].user_uid }, { shopping_cart: null }).exec();
            return 'Order status updated successfully';
        }else if(order[0].status=='PROCESS') {
            await this.ordersModel.updateOne({ _id: order_uid }, { status: 'SENT' }).exec();
            return 'Order status updated successfully';
        }else if(order[0].status=='SENT') {
            await this.ordersModel.updateOne({ _id: order_uid }, { status: 'DELIVERED' }).exec();
            return 'Order status updated successfully';
        }
        
    }

    async getReportTopBooks(){
        try {
            const report = await this.ordersModel.aggregate([
                { $match: { status: 'DELIVERED' } },
                { $unwind: '$books' },
                {
                    $lookup: {
                        from: 'products_orders',
                        localField: 'books',
                        foreignField: '_id',
                        as: 'orderDetails'
                    }
                },
                { $unwind: '$orderDetails' },
                {
                    $lookup: {
                        from: 'books',
                        localField: 'orderDetails.book_uid',
                        foreignField: '_id',
                        as: 'bookDetails'
                    }
                },
                { $unwind: '$bookDetails' },
                {
                    $group: {
                        _id: '$bookDetails.title',
                        totalQuantitySold: { $sum: '$orderDetails.quantity' },
                        totalSales: { $sum: { $multiply: ['$orderDetails.quantity', '$bookDetails.price'] } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        title: '$_id',
                        totalQuantitySold: 1,
                        totalSales: 1
                    }
                },
                { $sort: { totalSales: -1 } }
            ]);

            return report;
        } catch (error) {
            console.error('Error generating sales report:', error);
        }
    
    }

}
