// db/queries/user.queries.js
export const USER_QUERIES = {
    // 创建用户
    CREATE_USER: `
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?)
  `,
    // 获取所有用户信息
    GET_ALL_USERS: `
    SELECT id, username, email,
    full_name ,phone_number,address
    FROM users
  `,
    // 由id查找用户信息
    GET_USER_BY_ID: `
    SELECT id, username, email, password, full_name ,phone_number,address,avatar
    FROM users
    WHERE id = ?
  `,
  //由username查找用户信息
  GET_USER_BY_NAME: `
  SELECT id, username, email, full_name ,phone_number,address,avatar
  FROM users 
  WHERE username = ?
  `,
  //删除指定ID的用户
  DELETE_USER_BY_ID: `
  DELETE
  FROM users 
  WHERE id = ?
  `,
  //更新登陆时间
  UPDATE_LAST_LOGIN: `
    UPDATE users 
    SET last_login = CURRENT_TIMESTAMP 
    WHERE id = ?
  `

};