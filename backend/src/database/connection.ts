import mongoose, { Connection, Schema } from "mongoose";
import { IInstanceInfo } from "./dbInfo";

export default class MongoConnection {
    // Conexion a la base de datos
    conn: Connection;

    // Incializa modelos de la base de datos
    studentsModel

    constructor(instance: IInstanceInfo) {
        // URI de la base de datos con la instacia perteneciente y crea la conexion
        const URI = `mongodb+srv://${instance.USER}:${instance.PASSWORD}@${instance.HOST}/?retryWrites=true&w=majority&appName=ProjectsEnviroment`;
        this.conn = mongoose.createConnection(URI, { dbName: instance.DATABASE });
        console.log(`Connected to ${instance.DATABASE}`);
        
        // MONGODB SCHEMAS
        this.studentsModel = this.conn.model('students', new mongoose.Schema());
    }

    // Funciones de la base de datos
    async getStudents() {
        return await this.studentsModel.find();
    }
    
}
