const http = require("http");
const https = require('https');
const fs = require('fs');
const enforceHTTPS = require('koa-sslify');

// 自定义函数
function existsFile(filename) {
    return new Promise(
        (complete, fail) => 
            fs.access(filename, fs.R_OK | fs.W_OK, (err) => 
                err ? fail(err) : complete()))
}

// Koa 运行
const Koa = require('koa');
const app = new Koa();

const options = {
    key: fs.readFileSync('..\\SSL\\localhost_key.pem'),
    cert: fs.readFileSync('..\\SSL\\localhost_crt.pem')
}

app.use(async ctx => {
    ctx.body = 'Hello World\n';
});

// http.createServer(app.callback()).listen(80, (err) => {
//     if (err) {
//         console.log('HTTP 服务启动出错', err);
//     } else {
//         console.log('HTTP 服务建立成功 [' + 80 + ']');
//     }
// });
https.createServer(options, app.callback()).listen(443, (err) => {
    if (err) {
        console.log('HTTPS 服务启动出错', err);
    } else {
        console.log('HTTPS 服务建立成功 [' + 443 + ']');
    }
});