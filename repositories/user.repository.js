// user.repository.js
import { getConnection } from '../db/connection.js';
import pool from '../db/connection.js';
import { USER_QUERIES } from '../db/queries/user.queries.js';

export class UserRepository {
    // 创建用户
    static async createUser(username, email, password) {
        const connection = await getConnection();
        try {
            const [result] = await connection.query(
                USER_QUERIES.CREATE_USER,
                [username, email, password]
            );
            return { id: result.insertId, username, email };
        } finally {
            connection.release();
        }
    }

    // 获取所有用户
    static async getAllUsers() {
        const connection = await getConnection();
        try {
            const [rows] = await connection.query(USER_QUERIES.GET_ALL_USERS);
            return rows;
        } finally {
            connection.release();
        }
    }

    // 根据ID查询用户
    static async getUserById(id) {
        const connection = await getConnection();
        try {
            const [rows] = await pool.query(
                `${USER_QUERIES.GET_USER_BY_ID} LIMIT 1`, // 确保只返回一条记录
                [id]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    // 根据username查询用户
    static async getUserByName(username) {
        const connection = await getConnection();
        try {
            const [rows] = await connection.query(
                `${USER_QUERIES.GET_USER_BY_NAME} LIMIT 1`,
                [username]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }


    //删除指定ID的用户
    static async deleteUser(id) {
        const connection = await getConnection();
        try {
            const [result] = await connection.query(USER_QUERIES.DELETE_USER_BY_ID, [id]);

            // 检查是否成功删除（影响行数 > 0）
            if (result.affectedRows === 0) {
                throw new Error('删除用户失败');
            }
        } finally {
            connection.release();
        }
    }

    //获取用户登录
    static async getUserForLogin(username) {
        const connection = await getConnection();
        try {
            const [users] = await connection.query(USER_QUERIES.GET_USER_BY_NAME,
                [username]
            );
            const [detail] = await connection.query(
                USER_QUERIES.GET_USER_BY_ID,
                [users[0].id]
            )

            return detail[0]; // 返回第一个匹配用户或null
        } catch (error) {
            console.error('数据库查询失败:', error);
            throw new Error('用户查询失败');
        } finally {
            connection.release();
        }
    }

    /**
     * 更新用户最后登录时间
     * @param {number} userId - 用户ID
     */
    static async updateLastLogin(userId) {
        const connection = await getConnection();
        try {
            const [result] = await connection.query(
                USER_QUERIES.UPDATE_LAST_LOGIN,
                [userId]
            );

            // 验证是否成功更新
            if (result.affectedRows === 0) {
                throw new Error('更新登录时间失败');
            }
        } finally {
            connection.release();
        }
    }

}