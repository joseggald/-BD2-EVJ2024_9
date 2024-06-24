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
                res.json({ message: 'Login Success', userData: userAuth.userdata, rol: userAuth.rol});
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

    router.post('/addBook', async (req, res) => {
        try {
            const { title, author_uid, description, genre, released_date, stock, price, image_url } = req.body;
            const newBook = await mongoConnection.addBook(title, author_uid, description, genre, released_date, stock, price, image_url);
            if (newBook) {
                res.json({ message: 'Book added successfully', book: newBook });
            } else {
                res.status(409).json({ error: 'Book with the same title and author already exists' }); 
            }
        } catch (error: unknown) {
            console.error('Error adding book:', error); 
            res.status(500).json({ error: 'Error adding book' });
        }
    });
    
    router.put('/updateBook/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body; 
            const updatedBook = await mongoConnection.updateBook(id, updates);
            if (updatedBook) {
                res.json({ message: 'Book updated successfully', book: updatedBook });
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        } catch (error: unknown) {
            console.error('Error updating book:', error); 
            res.status(500).json({ error: 'Error updating book' });
        }
    });
    
    router.delete('/deleteBook/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const deletedBook = await mongoConnection.deleteBook(id);
            if (deletedBook) {
                res.json({ message: 'Book deleted successfully', book: deletedBook });
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        } catch (error: unknown) {
            console.error('Error deleting book:', error);
            res.status(500).json({ error: 'Error deleting book' });
        }
    });
    
    router.post('/register', async (req, res) => {
        try {
            const { first_name, last_name, email, phone, address, password, rol } = req.body;
            const newUser = await mongoConnection.register(first_name, last_name, email, phone, address, password, rol);
            if (newUser) {
                res.json({ message: 'User registered successfully', user: newUser });
            } else {
                res.status(409).json({ error: 'Email already registered' }); 
            }
        } catch (error: unknown) {
            console.error('Error registering user:', error); 
            res.status(500).json({ error: 'Error registering user' });
        }
    });

    router.put('/updateProfile/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedUser = await mongoConnection.updateProfile(id, updates);
            if (updatedUser) {
                res.json({ message: 'Profile updated successfully', user: updatedUser });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error: unknown) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Error updating profile' });
        }
    });
    
    router.get('/getRoles', async (req, res) => {
        try {
            const roles = await mongoConnection.getRoles();
            res.send(roles);
        } catch (error: unknown) {
            console.error('Error getting roles:', error); 
            res.status(500).json({ error: 'Error getting roles' });
        }
    });
    
    router.get('/getAllAuthors', async(req, res) => {
        try {
            const authors = await mongoConnection.getAllAuthors()
            res.json(authors)
        }catch {
            res.status(500).json({ error: 'Failed to fetch authors' });
        }
    });

    router.get('/getBooksAuthor', async(req, res) => {
        try {
            const authorId = req.body.authorId;

            if (!authorId) {
                return res.status(400).json({ error: 'AuthorId is required' });
            }

            const booksAuthor = await mongoConnection.getBooksAuthor(authorId)
            res.send(booksAuthor)
        }catch {
            res.status(500).json({ error: 'Failed to fetch books by author' });
        }
    });

    router.post('/addAuthor', async(req, res) => {
        try {
            const { first_name, last_name, biography, age } = req.body;
            console.log(first_name, last_name, biography, age)

            if (!first_name || !last_name || !biography || typeof age !== 'number') {
                return res.status(400).json({ error: 'Invalid data provided' });
            }

            const result = await mongoConnection.addAuthor(first_name, last_name, biography, age)
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to add author' });
        }
    });

    router.delete('/deleteAuthor', async(req, res) => {
        try {
            const authorId = req.body.authorId;

            if (!authorId) {
                return res.status(400).json({ error: 'AuthorId is required' });
            }

            const result = await mongoConnection.deleteAutor(authorId)
            res.json({ message: result})
        }catch {
            res.status(500).json({ error: 'Failed to delete author' });
        }
    });

    router.post('/addShoppingCart', async(req, res) => {
        try {
            const { user_uid } = req.body;
            const result = await mongoConnection.createOrder(user_uid);
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to create order' });
        }
    });

    router.post('/addProductToCart', async(req, res) => {
        try {
            const { order_uid, book_uid, quantity } = req.body;
            const result = await mongoConnection.addProductOrder(order_uid, book_uid, quantity);
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to add product'});
        }
    });

    router.delete('/deleteProductFromCart', async(req, res) => {
        try {
            const { product_uid } = req.body;
            const result = await mongoConnection.deleteProductOrder(product_uid);
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to delete product'});
        }
    });

    router.put('/updateProductFromCart', async(req, res) => {
        try {
            const { product_uid, quantity } = req.body;
            const result = await mongoConnection.updateProductOrder(product_uid, quantity);
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to update product'});
        }
    });

    router.get('/getOrderResume', async(req, res) => {
        try {
            const { order_uid } = req.body;
            const result = await mongoConnection.getOrderResume(order_uid);
            res.json({ order: result.order, products: result.products})
        }catch {
            res.status(500).json({ error: 'Failed to get order resume'});
        }
    });

    router.get('/getOrdersByUser', async(req, res) => {
        try {
            const { user_uid } = req.body;
            const result = await mongoConnection.getOrdersByUser(user_uid);
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to get orders by user'});
        }
    });

    router.get('/getAllOrders', async(req, res) => {
        try {
            const result = await mongoConnection.getOrders();
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to get order by id'});
        }
    });

    router.delete('/deleteOrder', async(req, res) => {
        try {
            const { order_uid } = req.body;
            const result = await mongoConnection.deleteOrder(order_uid);
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to delete order'});
        }
    });

    router.put('/updateStatusOrder', async(req, res) => {
        try {
            const { order_uid } = req.body;
            const result = await mongoConnection.updateStatusOrder(order_uid);
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to update status order'});
        }
    });

    router.get('/getAuthor', async(req, res) => {
        try {
            const { author_uid } = req.body;
            const result = await mongoConnection.getAuthorById(author_uid);
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to get author'});
        }
    });

    router.get('/getAuthorName', async(req, res) => {
        try {
            const { name } = req.body;
            const result = await mongoConnection.getAuthorName(name);
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to get names authors'});
        }
    });

    router.get('/getReportTopBooks', async(req, res) => {
        try {
            const result = await mongoConnection.getReportTopBooks();
            res.json(result)
        }catch {
            res.status(500).json({ error: 'Failed to get report top books'});
        }
    });
    return router;
}

export default getRoutes;
