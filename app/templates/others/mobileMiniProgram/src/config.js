const project = require('../../project.config.json');
const APPID = project.APPID;

const APIS = {
  // 解码基础接口
  decrypt: 'https://mclogin.yy.com/open/wxmp/decrypt',
  // 登陆互联基础接口
  login: 'https://mclogin.yy.com/open/wxmp/login',
};


export {
  APIS,
  APPID,
};
