import {config} from 'dotenv';
import path from 'path';
config({path: path.join(__dirname, '../env')});

interface Env{  // interface for environment variables
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
    JWT_SECRET: string;
}

function getEnv(): Env{ // checks if environment variables are set
    if(
        typeof process.env.DB_NAME === 'undefined'  ||
        typeof process.env.DB_USER === 'undefined' ||
        typeof process.env.DB_PASSWORD === 'undefined' ||
        typeof process.env.DB_HOST === 'undefined' ||
        typeof process.env.DB_PORT === 'undefined' ||
        typeof process.env.JWT_SECRET === 'undefined'){
            throw new Error('Environment variables not set');
    } else {
        return {    // returns an object with the environment variables
            DB_NAME: process.env.DB_NAME,
            DB_USER: process.env.DB_USER,
            DB_PASSWORD: process.env.DB_PASSWORD,
            DB_HOST: process.env.DB_HOST,
            DB_PORT: parseInt(process.env.DB_PORT),
            JWT_SECRET: process.env.JWT_SECRET,
        }
    }        
}

export const env = getEnv();