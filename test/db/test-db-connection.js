// 新建一个测试文件 test-db-connection.js
import pool from '../../db/connection.js';

async function testConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('✅ 数据库连接成功！');

        // 可选：执行简单查询验证（如 SELECT 1）
        const [rows] = await connection.query('SELECT 1');
        console.log('✅ 测试查询结果:', rows);
    } catch (err) {
        console.error('❌ 数据库连接失败:', err.message);
    } finally {
        if (connection) connection.release();
        // 关闭连接池（测试后退出）
        pool.end();
    }
}

testConnection();