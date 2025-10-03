
    'use strict';
    const userRepository = require('./user-repository');

    exports.main = async (event, context) => {
      try {
        const { action, data } = event;

        switch (action) {
          case 'register':
            return await registerUser(data);
          
          case 'sendVerificationCode':
            return await sendVerificationCode(data);
          
          case 'verifyCode':
            return await verifyCode(data);
          
          default:
            return {
              success: false,
              message: '未知的操作类型'
            };
        }
      } catch (error) {
        console.error('注册服务错误:', error);
        return {
          success: false,
          message: '服务器内部错误，请稍后重试'
        };
      }
    };

    async function registerUser(userData) {
      const { phone, verificationCode, username, password, ...otherInfo } = userData;

      if (!phone || !verificationCode || !username || !password) {
        return {
          success: false,
          message: '手机号、验证码、用户名和密码不能为空'
        };
      }

      const existingUserByPhone = await userRepository.getUserByPhone(phone);
      if (existingUserByPhone) {
        return {
          success: false,
          message: '该手机号已被注册'
        };
      }

      const existingUserByUsername = await userRepository.getUserByUsername(username);
      if (existingUserByUsername) {
        return {
          success: false,
          message: '该用户名已被使用'
        };
      }

      const validCode = await userRepository.getValidVerificationCode(phone, verificationCode);
      if (!validCode) {
        return {
          success: false,
          message: '验证码无效或已过期'
        };
      }

      const newUser = await userRepository.createUser({
        phone,
        username,
        password,
        ...otherInfo,
        createdAt: new Date().toISOString(),
        status: 'active'
      });

      await userRepository.markVerificationCodeUsed(validCode._id);

      const { password: _, ...userInfo } = newUser;

      return {
        success: true,
        userInfo: userInfo,
        message: '注册成功'
      };
    }

    async function sendVerificationCode(data) {
      const { phone } = data;

      if (!phone) {
        return {
          success: false,
          message: '手机号不能为空'
        };
      }

      const existingUser = await userRepository.getUserByPhone(phone);
      if (existingUser) {
        return {
          success: false,
          message: '该手机号已被注册'
        };
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expireTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      await userRepository.saveVerificationCode(phone, code, expireTime);

      return {
        success: true,
        message: '验证码已发送',
        code: code
      };
    }

    async function verifyCode(data) {
      const { phone, code } = data;

      if (!phone || !code) {
        return {
          success: false,
          message: '手机号和验证码不能为空'
        };
      }

      const validCode = await userRepository.getValidVerificationCode(phone, code);
      if (!validCode) {
        return {
          success: false,
          message: '验证码无效或已过期'
        };
      }

      return {
        success: true,
        message: '验证码验证成功'
      };
    }
  