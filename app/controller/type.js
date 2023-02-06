const { Controller } = require('egg');

class TypeController extends Controller {
    async add() {
        const { ctx, app } = this;
        const { name, type } = ctx.request.body;
        if (!name || !type) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
            return;
        }

        try {
            let user_id
            const token = ctx.request.header.authorization;
            // 拿到 token 获取用户信息
            const decode = app.jwt.verify(token, app.config.jwt.secret);
            if (!decode) return;
            user_id = decode.id;
            const result = await ctx.service.type.add({
                name,
                type,
                user_id
            });
            ctx.body = {
                code: 200,
                msg: '操作成功',
                data: null
            }
        } catch(e) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    async list() {
        const { ctx, app } = this;
        try {
            let user_id
            // 通过 token 解析，拿到 user_id
            const token = ctx.request.header.authorization;
            const decode = app.jwt.verify(token, app.config.jwt.secret);
            if (!decode) return
            user_id = decode.id;
            const list = await ctx.service.type.list(user_id);
            // 返回数据
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: {
                    list: list || [] // 格式化后，并且经过分页处理的数据
                }
            }
        } catch(e) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    async update() {
        const { ctx, app } = this;
        const { name, type } = ctx.request.body;
        if (!name || !type) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
            return;
        }

        try {
            let user_id
            const token = ctx.request.header.authorization;
            // 拿到 token 获取用户信息
            const decode = app.jwt.verify(token, app.config.jwt.secret);
            if (!decode) return;
            user_id = decode.id;
            const result = await ctx.service.type.update({
                id,
                name,
                type,
                user_id
            });
            ctx.body = {
                code: 200,
                msg: '操作成功',
                data: null
            }
        } catch(e) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
        
    }

    async delete() {
        const { ctx, app } = this;
        const { id } = ctx.request.body;
        if (!id) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
        }
        try {
            let user_id
            const token = ctx.request.header.authorization;
            const decode = await app.jwt.verify(token, app.config.jwt.secret);
            if (!decode) return
            user_id = decode.id
            const result = await ctx.service.type.delete(id, user_id);
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: null
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }
}

module.exports = TypeController;