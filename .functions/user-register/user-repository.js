
    const { models } = require('./db');

    async function getUserByPhone(phone) {
      const result = await models.user.find({
        filter: {
          phone: phone
        }
      });
      return result.data && result.data.length > 0 ? result.data[0] : null;
    }

    async function getUserByUsername(username) {
      const result = await models.user.find({
        filter: {
          username: username
        }
      });
      return result.data && result.data.length > 0 ? result.data[0] : null;
    }

    async function createUser(userData) {
      const result = await models.user.create({
        data: userData
      });
      return result.data;
    }

    async function saveVerificationCode(phone, code, expireTime) {
      const result = await models.verification_code.create({
        data: {
          phone: phone,
          code: code,
          expireTime: expireTime,
          used: false
        }
      });
      return result.data;
    }

    async function getValidVerificationCode(phone, code) {
      const currentTime = new Date().toISOString();
      const result = await models.verification_code.find({
        filter: {
          phone: phone,
          code: code,
          used: false,
          expireTime: { $gt: currentTime }
        }
      });
      return result.data && result.data.length > 0 ? result.data[0] : null;
    }

    async function markVerificationCodeUsed(codeId) {
      await models.verification_code.update({
        filter: {
          _id: codeId
        },
        data: {
          used: true
        }
      });
    }

    module.exports = {
      getUserByPhone,
      getUserByUsername,
      createUser,
      saveVerificationCode,
      getValidVerificationCode,
      markVerificationCodeUsed
    };
  