const Service = require('egg').Service;

class TypeService extends Service {
  async add(params) {
    const { ctx, app } = this;
    try {
      // 往 bill 表中，插入一条账单数据
      const result = await app.mysql.insert('type', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 获取账单列表
  async list(id) {
    const { ctx, app } = this;
    const QUERY_STR = 'id, name, type, user_id';
    let sql = `select ${QUERY_STR} from type where user_id = 0 or user_id=${id}`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async detail(id, user_id) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.get('type', { id, user_id })
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(params) {
    const { ctx, app } = this;
    try {
      let result = await app.mysql.update('type', {
          ...params
      }, {
          id: params.id,
          user_id: params.user_id
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(id, user_id) {
    const { ctx, app } = this;
    try {
      let result = await app.mysql.delete('type', {
          id: id,
          user_id: user_id
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = TypeService;