//引入文件
var http = require('http'),
    // mongodb = require('mongodb'),
    sys = require('sys'),
    // io = require('socket.io'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs');

//config
var aIndex = ['index.html', 'default.html', 'index.htm', 'default.htm'],
    iInNum = 0,
    admin = {
        email: 'emial:win7killer@163.com',
        tel: ''
    };

var sStyles = `
<style>
*{
    padding: 0;
    margin: 0;
    list-style: none;
}
body{
    background: #efefef;
    padding: 10px;
}
.clearfix{
    clear: both;
}
.clearfix:after{
    content: ' ';
    clear: both;
    visibility: hidden;
    height: 0;
    overflow: hidden;
}
.item{
    float: left;
    width: 200px;
    margin-bottom: 20px;
    border-left: 1px solid #333;
    padding: 2px 10px;
}
</style>
`;


//全局变量
var routerCfg = require('./router.config.js');
var basePath = './';

var dir = path.resolve(__dirname, basePath);
console.log('-------------\n', dir, '\n-------------\n\n');
var delFn = {
    q: null,
    s: null,
    rewrite: function() {
        this.q.url = this.q.url.replace(/\/$/, '');
        this.q._file = this.q.url.replace(/\?.*/, '');
        this.q._search = this.q.url.match(/\?[^#]+/);
    },
    doFn: function() {
        console.log('____>\n', this.q.url);
        if (this.q.url == '') {
            delFn.getDir();
        } else {
            var sFile = path.resolve(dir, '.' + delFn.q._file);

            var content = mime.lookup(sFile);
            var encodeString = null;
            if (/(text|javascript|css|html|xml|svg|markdown)/i.test(content)) {
                encodeString = 'utf-8';
                content = content + ';charset="utf-8"';
            }
            fs.readFile(sFile, encodeString, function(err, data) {
                if (err) {
                    // console.log(err, '\n', sFile, '\n\n\n\n');
                    fs.stat(sFile, function(err, stats) {
                        if (err) {
                            // console.log(err);
                            delFn.erFn();
                        } else {
                            // console.log(stats);
                            if(stats.isFile()) {
                                delFn.resFile(content, data);
                            } else if (stats.isDirectory()) {
                                delFn.getDir();
                            } else {
                                delFn.erFn();
                            }
                        }
                    });
                } else {
                    delFn.resFile(content, data);
                }
            });
        }

    },
    resFile: function(content, data) {
        delFn.s.writeHead(200, {
            'Content-Type': content
        });
        delFn.s.write(data);
        delFn.s.end();
    },
    getDir: function() {
        var names = fs.readdirSync(path.resolve(dir, '.' + delFn.q._file));
        var preUrl = delFn.q._file.replace(/(\/)[^\/]+$/, '$1');
        var list = `
            <li class="item"><a href="${delFn.q.url}">./</a></li>
            <li class="item"><a href="${preUrl}">../</a></li>
        `;
        names.forEach(function(item, i) {
            console.log(path.resolve(dir, '.' + delFn.q._file, './' + item));
            var stats = fs.statSync(path.resolve(dir, '.' + delFn.q._file, './' + item));

            console.log(stats.isFile());
            if (stats && stats.isFile()) {
                list += `<li class="item"><a href="${delFn.q._file}/${item}">${item}</a></li>`;
            } else {
                list += `<li class="item"><a href="${delFn.q._file}/${item}">${item}/</a></li>`
            }


        });
        var fileDom = `
            ${sStyles}
            <h1>file:</h1>
            <ul class="clearfix">${list}</ul>
        `;
        delFn.s.writeHead(200, {
            'Content-Type': 'text/html;charset="utf-8"'
        });
        delFn.s.write(fileDom);
        delFn.s.end();
    },
    erFn: function() {
        delFn.s.writeHead(404, {
            'Content-Type': 'text/html;charset="utf-8"'
        });
        var str = '';
        fs.readFile(dir + '/404.html', 'utf-8', function(err, data) {
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
        // console.log(req.url);
        if (!/^\/+$/.test(req.url)) {
            for (var i = 0, l = aIndex.length; i < l; i++) {
                // console.log('^\\/+' + aIndex[i] + '$');
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
