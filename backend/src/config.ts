import {config} from 'dotenv';
import path from 'path';
config({path: path.join(__dirname, '../.env')});

interface Env{  // interface for environment variables
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
    SESSION_SECRET: string;
    SSL_KEY_PATH: string;
    SSL_CERT_PATH: string;
}

function getEnv(): Env{ // checks if environment variables are set
    if(process.env.DB_NAME !== null ||
        process.env.DB_USER !== null ||
        process.env.DB_PASSWORD !== null ||
        process.env.DB_HOST !== null ||
        process.env.DB_PORT !== null ||
        process.env.SESSION_SECRET !== null ||
        process.env.SSL_KEY_PATH !== null ||
        process.env.SSL_CERT_PATH !== null){
            throw new Error('Environment variables not set');
        }

    return {    // returns an object with the environment variables
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: parseInt(process.env.DB_PORT),
        SESSION_SECRET: process.env.SESSION_SECRET,
        SSL_KEY_PATH: process.env.SSL_KEY_PATH,
        SSL_CERT_PATH: process.env.SSL_CERT_PATH
    }
        
}

export const env = getEnv();