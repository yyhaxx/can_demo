//引入文件
const
    os = require('os'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    mime = require('mime'),
    open = require('open');

const
    hostname = '127.0.0.1',
    port = 8900;

let netInfo = os.networkInterfaces();



console.log(netInfo.en0[1].address, '\n\n\n');

console.log(os.userInfo());
