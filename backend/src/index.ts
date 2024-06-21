import express from 'express';
import bodyParser from 'body-parser'
import getRoutes from './routes/generalRoutes';

//Instacia de express y puerto
const app = express();
const port = 5000;

//Habilita cors
var cors = require('cors')

app.use(cors())

//Maneja los datos en formato json para la insercion de datos y la lectura de los mismos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Rutas e instacia el toml de common con las credenciales de la base de datos
app.use('/', getRoutes('instanciaMongo'));

//Inicia el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});