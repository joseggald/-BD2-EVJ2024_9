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
                res.json({ user });
            } else {    
                res.status(401).json({ error: 'User error' });
            }
        } catch (error) {
            res.status(500).json({ error: 'User error' });
        }
    });

    router.get('/getAllBooks', async (req, res) => {
        try {
            const books = await mongoConnection.getBooks();
            if (books) {
                res.json({books: books});
            } else {
                res.status(401).json({ error: 'Login Error' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Login Error' });
        }
    });

    return router;
}

export default getRoutes;
