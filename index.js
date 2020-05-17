// 依赖
const fs = require('fs');
const mime = require('mime');
const http = require("http");
const https = require('https');
const enforceHTTPS = require('koa-sslify');

// 自定义函数
function existsFileEX(filename) {
    ret = true;
    // fs.open(filename, function(err) { ret = false; });
    fs.existsSync(filename) ? ret = true : ret = false;
    return ret;
}

// Koa 运行
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

app.use(router.routes());
app.on("error", (err, next) => {
    console.log(err);
})

router.get('/', async (ctx, next) => {
    ctx.status= 200;
    ctx.set('Content-Type', mime.getType(StaticPage)+";charset=utf-8");
    ctx.body = 'Hello World!\n';
});

router.get('/form', async (ctx, next) => {
    StaticPage = '.\\static\\form.html';
    if (existsFileEX(StaticPage)) {
        ctx.status= 200;
        ctx.set('Content-Type', mime.getType(StaticPage)+";charset=utf-8");
        ctx.body = fs.createReadStream(StaticPage);
    } else { ctx.status= 404; }
});

if (existsFileEX('..\\SSL\\')) {
    const SSLKey = '..\\SSL\\localhost_key.pem';
    const SSLCrt = '..\\SSL\\localhost_crt.pem'
    const options = {
        key: fs.readFileSync(SSLKey),
        cert: fs.readFileSync(SSLCrt)
    }
    https.createServer(options, app.callback()).listen(443, (err) => {
        if (err) {
            console.log('HTTPS 服务启动出错', err);
        } else {
            console.log('HTTPS 服务建立成功 [' + 443 + ']');
        }
    });
} else {
    http.createServer(app.callback()).listen(80, (err) => {
        if (err) {
            console.log('HTTP 服务启动出错', err);
        } else {
            console.log('HTTP 服务建立成功 [' + 80 + ']');
        }
    });
}