import { Router } from 'express';
//Imports de la conexion a la base de datos
import { getInstanceInfo } from '../database/dbInfo';
import MongoConnection from '../database/connection';

//Rutas de la aplicacion
const getRoutes = (_instance: string): Router => {
    const router = Router();

    //Instancia de la conexion a la base de datos
    const instance = getInstanceInfo(_instance);
    const mongoConnection = new MongoConnection(instance);

    //Llamada a las funciones con sus rutas
    router.get('/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const userAuth = await mongoConnection.login(email, password);
            if (userAuth.success) {
                res.json({ message: 'Login Success', userId: userAuth.userId });
            } else {
                res.status(401).json({ error: 'Login Error' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Login Error' });
        }
    });

    router.get('/getUserById', async (req, res) => {
        try {
            const { id } = req.body;
            const user = await mongoConnection.getUser(id); 
            if (user) {
                res.send(user);
            } else {    
                res.status(401).json({ error: 'User error' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User error' });
        }
    });

    router.get('/getAllBooks', async (req, res) => {
        try {
            const books = await mongoConnection.getAllBooks();
            if (books) {
                res.send(books);
            } else {
                res.status(401).json({ error: 'error get' });
            }
        } catch (error) {
            res.status(500).json({ error: 'error get' });
        }
    });

    router.get('/getAllGenres', async (req, res) => {
        try {
            const books = await mongoConnection.getAllGenres();
            if (books) {
                res.send(books);
            } else {
                res.status(401).json({ error: 'error get' });
            }
        } catch (error) {
            res.status(500).json({ error: 'error get' });
        }
    });

    router.get('/getBooksName', async (req, res) => {
        try {
            const { name } = req.body;
            const books = await mongoConnection.getBooksName(name); 
            if (books) {
                res.send(books);
            } else {    
                res.status(401).json({ error: 'book error' });
            }
        } catch (error) {
            res.status(500).json({ error: 'book error' });
        }
    });

    router.get('/getGenreBooks', async (req, res) => {
        try {
            const { genre } = req.body;
            const books = await mongoConnection.getGenreBooks(genre);
            if (books) {
                res.send(books);
            } else {
                res.status(401).json({ error: 'error get' });
            }
        } catch (error) {
            res.status(500).json({ error: 'error get' });
        }
    });

    router.get('/getLowPrices', async (req, res) => {
        try {
            const books = await mongoConnection.getLowPrices();
            if (books) {
                res.send(books);
            } else {
                res.status(401).json({ error: 'error get' });
            }
        } catch (error) {
            res.status(500).json({ error: 'error get' });
        }
    });

    router.get('/getHighPrices', async (req, res) => {
        try {
            const books = await mongoConnection.getHighPrices();
            if (books) {
                res.send(books);
            } else {
                res.status(401).json({ error: 'error get' });
            }
        } catch (error) {
            res.status(500).json({ error: 'error get' });
        }
    });

    router.get('/getHighRatingBooks', async (req, res) => {
        try {
            const books = await mongoConnection.getHighRatingBooks();
            if (books) {
                res.send(books);
            } else {
                res.status(401).json({ error: 'error get' });
            }
        } catch (error) {
            res.status(500).json({ error: 'error get' });
        }
    });

    router.get('/getLowRatingBooks', async (req, res) => {
        try {
            const books = await mongoConnection.getLowRatingBooks();
            if (books) {
                res.send(books);
            } else {
                res.status(401).json({ error: 'error get' });
            }
        } catch (error) {
            res.status(500).json({ error: 'error get' });
        }
    });

    router.get('/getBookById', async (req, res) => {
        try {   
            const { id } = req.body;
            const books = await mongoConnection.getBookById(id);
            
            if (books) {
                const authorId = String(books[0].toJSON().author_uid);
                const author = await mongoConnection.getAuthorById(authorId);
                const reviews = await mongoConnection.getReviewsBook(id);
                res.json({ book: books, author: author, reviews: reviews });
            } else {
                res.status(401).json({ error: 'error get' });
            }
        } catch (error) {
            res.status(500).json({ error: 'error get' });
        }
    });

    router.post('/addReview', async (req, res) => {
        try {
            const { idBook, idUser, content, rating } = req.body;
            const review = await mongoConnection.addReview(idBook, idUser, content, rating);
            if (review) {
                res.json({ message: 'Review added' });
            } else {
                res.status(401).json({ error: 'error add' });
            }
        } catch (error) {
            res.status(500).json({ error: 'error add' });
        }
    });

    return router;
}

export default getRoutes;
