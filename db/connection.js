// db/connection.js
import { createPool } from 'mysql2/promise';
import { DB_CONFIG } from '../config/database.js';

// 直接使用 DB_CONFIG
const pool = createPool(DB_CONFIG);

export const getConnection = () => pool.getConnection((err, connection) => {
    return connection;
})
export default pool;