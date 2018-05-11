var packageInfo = require('./package.json');
var fs = require("fs");
var date = new Date();
var SOURCEPath = "dist";

var d = (date.getMonth() + 1).toString() + "";
d += (date.getDate() < 10 ? "0" : '') + date.getDate().toString() + "_";
d += (date.getHours() < 10 ? "0" : '') + date.getHours().toString() + "";
d += (date.getMinutes() < 10 ? "0" : '') + date.getMinutes().toString() + "_";
d += (date.getSeconds() < 10 ? "0" : '') + date.getSeconds().toString() + "";
var zip = SOURCEPath+"_" + packageInfo.name + "_" + d;

// 引入插件
var zipper = require('zip-local');
// 压缩dist文件夹
if (!fs.existsSync("zip_dist")) {
    fs.mkdirSync('zip_dist');
}
if(!fs.existsSync(SOURCEPath)){
    console.warn(SOURCEPath +" is not exist");
    return;
}

zipper.sync.zip(SOURCEPath).compress().save("zip_dist/" + zip + ".zip");
console.log(zip);