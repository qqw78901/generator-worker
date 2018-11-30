const pinyin = require("js-pinyin");
pinyin.setOptions({checkPolyphone: false, charCase: 0});
module.exports=function(chinese){
    return pinyin.getFullChars(chinese||"");
}