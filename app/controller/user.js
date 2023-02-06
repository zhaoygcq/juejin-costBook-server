const { Controller } = require('egg');
// 默认头像
const defaultAvatar = 'https://img.51miz.com/Element/00/90/25/94/46175c51_E902594_b379a5d8.png'

class UserController extends Controller {
    async register() {
        const { ctx } = this;
        const { username, password } = ctx.request.body;
        if (!username || !password) {
            ctx.body = {
                code: 500,
                msg: '账号密码不能为空',
                data: null
            }
            return
        }

        // 验证数据库内是否已经有该账户名
        const userInfo = await ctx.service.user.getUserByName(username) // 获取用户信息
        if (userInfo) {
            ctx.body = {
                code: 500,
                msg: '账户名已被注册，请重新输入',
                data: null
            }
            return
        }

        const result = await ctx.service.user.register({
            username,
            password,
            signature: '世界和平。',
            avatar: defaultAvatar,
            ctime: +new Date()
        });

        if (result) {
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: null
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '注册失败',
                data: null
            }
        }


    }

    async login() {
        const { ctx, app } = this;
        const { username, password } = ctx.request.body;

        // 进入数据库查找
        const userInfo = await ctx.service.user.getUserByName(username);
        // 没找到说明没有该用户
        if (!userInfo || !userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账号不存在',
                data: null
            }
            return
        }
        // 找到用户，并且判断输入密码与数据库中用户密码。
        if (userInfo && password != userInfo.password) {
            ctx.body = {
                code: 500,
                msg: '账号密码错误',
                data: null
            }
            return
        }

        // 生成 token 加盐
        // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串，上文已经提到过。
        const token = app.jwt.sign({
            id: userInfo.id,
            username: userInfo.username,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // token 有效期为 24 小时
        }, app.config.jwt.secret);

        ctx.body = {
            code: 200,
            msg: '登陆成功',
            data: {
                token
            }
        }

    }

    async getUserInfo() {
        const { ctx, app } = this;
        const token = ctx.request.header.authorization;
        // 通过 app.jwt.verify 方法，解析出 token 内的用户信息
        const decode = app.jwt.verify(token, app.config.jwt.secret);
        // 通过 getUserByName 方法，以用户名 decode.username 为参数，从数据库获取到该用户名下的相关信息
        const userInfo = await ctx.service.user.getUserByName(decode.username);
        // userInfo 中应该有密码信息，所以我们指定下面四项返回给客户端
        ctx.body = {
            code: 200,
            msg: '请求成功',
            data: {
                id: userInfo.id,
                username: userInfo.username,
                signature: userInfo.signature || '',
                avatar: userInfo.avatar || defaultAvatar
            }
        }
    }

    async editUserInfo() {
        const { ctx, app } = this;
        const { signature = '', avatar = '' } = ctx.request.body;
        try {
            let user_id;
            const token = ctx.header.authorization;
            const decode = app.jwt.verify(token, app.config.jwt.secret);
            if(!decode) return;
            user_id = decode.id;
            const userInfo = await ctx.service.user.getUserByName(decode.username);
            const result = await ctx.service.user.editUserInfo({
                ...userInfo,
                signature,
                avatar
            });
            ctx.body = {
                code: 200,
                msg: '操作成功',
                data: {
                  id: user_id,
                  signature,
                  avatar,
                  username: userInfo.username
                }
              }
        } catch(e) {

        }
    }
}

module.exports = UserController;