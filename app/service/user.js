const { Service } = require('egg');

class UserService extends Service {
  async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { username });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async register(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('user', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async editUserInfo(params) {
    const { app } = this;
    try {
      // 通过 app.mysql.update 方法，指定 user 表，
      let result = await app.mysql.update('user', {
        ...params // 要修改的参数体，直接通过 ... 扩展操作符展开
      }, {
        id: params.id // 筛选出 id 等于 params.id 的用户
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;