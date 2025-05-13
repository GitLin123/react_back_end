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
            const [rows] = await connection.query(USER_QUERIES.GET_USER_BY_ID,[id]);
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

    //根据ID修改指定用户信息
    static async changeUserInfo(full_name, email, phone, address, avatar, id) {
        const connection = await getConnection();
        try {
            const [rows] = await connection.query(
                USER_QUERIES.UPDATE_USER_INFO_BY_ID,
                [full_name, email, phone, address, avatar, id]
            );
            return rows[0] || null;
        } catch (error) {
            // 出错时回滚事务
            if (connection) await connection.rollback();
            console.error('更新用户信息失败:', error);
            throw new Error(`更新用户信息失败: ${error.message}`);
        } finally {
            if (connection) connection.release();
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
                [users[0]?.id]
            )

            return detail[0]; // 返回第一个匹配用户或null
        } catch (error) {
            console.error('数据库查询失败:', error);
            throw new Error('用户不存在');
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
    //根据用户ID获取用户图库

    static async getImagesByID(userID) {
        const connection = await getConnection();
        try {
            const [result] = await connection.query(
                USER_QUERIES.GET_IMAGES_URL_BY_ID,
                [userID]
            )
            return result[0] || null;

        }catch {
            throw new Error('获取用户图库失败!');
        } finally {
            connection.release();
        }
    }

    //Add一个图片到图库
    static async addImage(userID,imgData) {
        const connection = await getConnection();
        try {
            const [result] = await connection.query(
                USER_QUERIES.ADD_IMAGE_BY_ID,
                [imgData,imgData,userID]
            )
            // 验证是否成功更新
            if (result.affectedRows === 0) {
                throw new Error('添加图片失败');
            }else {
                return true;
            }

        }catch {
            throw new Error('保存用户图片失败!');
        } finally {
            connection.release();
        }
    }

}