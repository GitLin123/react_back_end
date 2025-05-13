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
    SELECT id, username, email, 
    password, full_name ,phone_number,address,avatar
    FROM users
    WHERE id = ?
  `,

  //由username查找用户信息
  GET_USER_BY_NAME: `
  SELECT id, username, email, 
  full_name ,phone_number,address,avatar
  FROM users 
  WHERE username = ?
  `,

  //删除指定ID的用户
  DELETE_USER_BY_ID: `
  DELETE
  FROM users 
  WHERE id = ?
  `,

  //修改个人信息
  UPDATE_USER_INFO_BY_ID:`
  UPDATE users 
  SET full_name = ?, email = ?,
  phone_number = ?, address = ?,
  avatar = ?
  WHERE id = ?
  `,

  //修改密码
  UPDATE_PASSWORD: `
    UPDATE users
    SET password = ?
    WHERE id = ?
  `,

  //更新登陆时间
  UPDATE_LAST_LOGIN: `
    UPDATE users 
    SET last_login = CURRENT_TIMESTAMP 
    WHERE id = ?
  `,

  //由ID获取用户的图库链接
    GET_IMAGES_URL_BY_ID: `
    SELECT images 
    FROM users
    WHERE id = ?
  `,

  //由ID添加用户的图库
  ADD_IMAGE_BY_ID: `
    UPDATE users
    SET images =
          CASE
            WHEN images IS NULL THEN JSON_ARRAY(?)
            ELSE JSON_ARRAY_APPEND(images, '$', ?)
            END
    WHERE id = ?
  `,

   //删除特定的图片按照索引
  DELETE_IMAGE_BY_INDEX: `
    UPDATE users
    SET images = JSON_REMOVE(images, ?)
    WHERE id = ?
    `,
};