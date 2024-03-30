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
    if(process.env.DB_NAME === 'undefined'  ||
        process.env.DB_USER === 'undefined' ||
        process.env.DB_PASSWORD === 'undefined' ||
        process.env.DB_HOST === 'undefined' ||
        process.env.DB_PORT === 'undefined' ||
        process.env.SESSION_SECRET === 'undefined' ||
        process.env.SSL_KEY_PATH === 'undefined' ||
        process.env.SSL_CERT_PATH === 'undefined'){
            throw new Error('Environment variables not set');
    } else {
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
}

export const env = getEnv();