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
    router.get('/', async (req, res) => {
        try {
            const students = await mongoConnection.getStudents();
            res.json(students);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch students' });
        }
    });

    return router;
}

export default getRoutes;
