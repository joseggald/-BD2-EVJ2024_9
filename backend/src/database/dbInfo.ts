import toml from 'toml';
import fs from 'fs';

// Interface para la informacion de la instancia
export interface IInstanceInfo {
    USER: string,
    PASSWORD: string,
    DATABASE: string,
    HOST: string,
}

// Retorna la informacion de la instancia
export const getInstanceInfo = (instance: string): IInstanceInfo => {
    const instances_toml = toml.parse(fs.readFileSync('credentials.toml', 'utf8'));
    const instances_string = JSON.stringify(instances_toml);
    const instances = JSON.parse(instances_string);
    return {...instances['instanciaMongo']};
}
