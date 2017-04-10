//引入文件
var http = require('http'),
    // mongodb = require('mongodb'),
    sys = require('sys'),
    // io = require('socket.io'),
    path = require('path');
fs = require('fs');

//config
var aIndex = ['index.html', 'default.html', 'index.htm', 'default.htm'],
    iInNum = 0,
    admin = {
        email: 'emial:win7killer@163.com',
        tel: ''
    };
//全局变量
var routerCfg = require('./router.config.js');
var dir = path.resolve(__dirname, './www');

var rotter = {

};

// var basePath = '/space/node/www/';
basePath = dir;
var delFn = {
    q: null,
    s: null,
    rewrite: function() {
        if (this.q.url === '/index.html') {
            this.q.url = '/index';
        }
    },
    doFn: function() {
        this.s.writeHead(200, {
            'Content-Type': 'text/html;charset="utf-8"'
        });
        var str = '';
        fs.readFile(basePath + routerCfg[delFn.q.url], 'utf-8', function(err, data) {
            if (err) {
                delFn.erFn();
            } else {
                str = data;
                delFn.s.write(str);
                delFn.s.end();
            }
        });

    },
    erFn: function() {
        delFn.s.writeHead(404, {
            'Content-Type': 'text/html;charset="utf-8"'
        });
        var str = '';
        fs.readFile(basePath + '/404.html', 'utf-8', function(err, data) {
            if (err) {
                str = '<h1>error</h1>';
            } else {
                str = data;
            }
            delFn.s.write(str);
            delFn.s.end();
        });
    },
    serverFn: function(req, res) {
        var sIndex = '';
        delFn.q = req;
        delFn.s = res;
        console.log(req.url);
        if (!/^\/+$/.test(req.url)) {
            for (var i = 0, l = aIndex.length; i < l; i++) {
                console.log('^\\/+' + aIndex[i] + '$');
                if (new RegExp('^\\/+' + aIndex[i] + '$').test(req.url)) {
                    sIndex = aIndex[i];
                    break;
                }
            }
        } else {
            sIndex = aIndex[iInNum];
        }
        delFn.rewrite();
        delFn.doFn();
    },
    showThis: function() {
        console.log('req=[[[' + this.req);
        console.log('res=[[[' + this.res);
    }
};


var httpServer = http.createServer(delFn.serverFn).listen('8900');

console.log('***************************** Welcome *****************************');
console.log('');
console.log('                       node服务器开启成功 ^_^');
console.log('');
console.log('***************************** GL & HF *****************************');
