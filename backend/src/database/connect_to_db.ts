import { Sequelize } from 'sequelize';
import { env } from '../config';


const sequelize = new  Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres',
    timezone: 'Europe/Athens',
})

sequelize.authenticate()
    .then(() => { console.log('Database connected'); })
    .catch(err => { console.log('Error connecting to database' + err); });

export default sequelize;