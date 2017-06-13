//引入文件
const
    os = require('os'),
    fs = require('fs'),
    net = require('net'),
    url = require('url'),
    http = require('http'),
    path = require('path'),
    mime = require('mime'),
    open = require('open');

const _netWorkInfo = os.networkInterfaces(),
    hostname = '127.0.0.1' || _netWorkInfo.en0[0].address || _netWorkInfo.en0[0].address,
    port = 8888;

//config
var aIndex = ['index.html', 'default.html', 'index.htm', 'default.htm'],
    iInNum = 0,
    admin = {
        email: 'emial:win7killer@163.com',
        tel: ''
    };

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
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
    margin-bottom: 10px;
    /* border-left: 1px solid #333; */
    /* padding: 2px 10px; */
}
</style>
`;

//全局变量
var basePath = './www';

var dir = path.resolve(__dirname);
console.log(`
-------------------------------------
    dir: ${dir}
-------------------------------------
`);

var delFn = {
    q: null,
    s: null,
    rewrite: function() {
        this.q.url = this.q.url.replace(/\/$/, '');
        this.q._file = this.q.url.replace(/\?.*/, '');
        this.q._search = this.q.url.match(/\?[^#]+/);
        console.log('-->request: ', this.q.url, '\n');
        console.log('ip:  ', getClientIp(this.q), '\n===============================');
    },
    doFn: function() {
        console.log(this.q.method);
        if (this.q.url == '') {
            delFn.getDir();
        } else {
            var sFile = path.resolve(dir, '.' + delFn.q._file);

            var content = mime.lookup(sFile);
            var encodeString = null;
            if (/(text|javascript|css|html|xml|svg|markdown|json)/i.test(content)) {
                encodeString = 'utf-8';
                content = content + ';charset="utf-8"';
            }
            fs.readFile(sFile, encodeString, function(err, data) {
                if (err) {
                    fs.stat(sFile, function(err, stats) {
                        if (err) {
                            delFn.erFn();
                        } else {
                            if (stats.isFile()) {
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
            var stats = fs.statSync(path.resolve(dir, '.' + delFn.q._file, './' + item));
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
        if (!/^\/+$/.test(req.url)) {
            for (var i = 0, l = aIndex.length; i < l; i++) {
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
    }
};

var httpServer = http.createServer(delFn.serverFn).listen(port, function() {

    console.log(`
    ***************************** Welcome *****************************\n
                           node服务器开启成功 ^_^
                                端口${port}
                        author: ${admin.email}\n
    ***************************** GL & HF *****************************
    `);
    open(`http://${hostname}:${port}`);
});
httpServer.on('connect', (req, cltSocket, head) => {
  // 连接到一个来源服务器
  var srvUrl = url.parse(`http://${req.url}`);
  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 连接已建立\r\n' +
                    '委托代理: Node.js-代理\r\n' +
                    '\r\n');
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
});
