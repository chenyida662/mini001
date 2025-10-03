
    'use strict';

    const cloudbase = require('@cloudbase/node-sdk');
    const app = cloudbase.init({
      env: cloudbase.SYMBOL_CURRENT_ENV
    });
    const models = app.models;

    exports.main = async (event, context) => {
      try {
        const { username, password } = event;

        if (!username || !password) {
          return {
            success: false,
            userInfo: null,
            message: '用户名和密码不能为空'
          };
        }

        const userResult = await models.user.find({
          filter: {
            username: username
          }
        });

        if (!userResult.data || userResult.data.length === 0) {
          return {
            success: false,
            userInfo: null,
            message: '用户名不存在'
          };
        }

        const user = userResult.data[0];

        if (user.password !== password) {
          return {
            success: false,
            userInfo: null,
            message: '密码错误'
          };
        }

        const { password: _, ...userInfo } = user;

        return {
          success: true,
          userInfo: userInfo,
          message: '登录成功'
        };

      } catch (error) {
        console.error('登录错误:', error);
        return {
          success: false,
          userInfo: null,
          message: '服务器内部错误，请稍后重试'
        };
      }
    };
  