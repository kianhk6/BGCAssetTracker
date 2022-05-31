
import pg from 'pg';
const {Pool} = pg;


let localPoolConfig = { //local 
    user:'postgres',
     //this my personal password
    password: '2254',
    host: 'localhost',
    port: '5432',
    database:'bgc'
};


const poolConfig = process.env.DATABASE_URL ? { //heroku
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  } : localPoolConfig;

const pool = new Pool(poolConfig);

export default pool;

