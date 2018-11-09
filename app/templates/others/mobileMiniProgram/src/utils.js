
import { 
  APIS,
} from '@/config';

export function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatDate(s, fmt='yyyyMMdd') {
  let date = null;

  if (typeof s === 'object') {
    date = s;
  }else {
    const timestamp = typeof s === 'string' ? Number(s) :s;
    date = new Date(timestamp);
  }

  let format = fmt;

  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
/* eslint-disable */
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1)
            ? (o[k])
            : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }

  return format;
}

export function setCookies(name, cookieObj) {
  let cookies = '';

  Object.keys(cookieObj).map((key) => {
    cookies += `${key}=${cookieObj[key]};`;
    return false;
  });

  wx.setStorageSync(name, cookies);
}

export function requestWithCookie(option){
  const header = Object.assign(
    {},
    option.header,
    {
      cookie: wx.getStorageSync('cookie')
    }
  )
  const newOption = Object.assign(
    {},
    option,
    {
      header
    }
  )

  return wx.request(newOption)
}

export function decrypt({
  data,
  dataType,
  success,
  fail,
}) {
  requestWithCookie({
    url: APIS.decrypt,
    data: {
      encryptData: data.encryptedData, // 小程序获取用户信息返回的加密数据
      iv: data.iv, // 小程序获取用户信息返回的加密初始向量
    },
    success(res) {
      if (dataType === 'json') {
        success(JSON.parse(res.data.data));
      } else {
        success(res.data.data);
      }
    },
    fail(res) {
      fail(res);
    },
  });
}

export default {
  formatNumber,
  formatDate,
  requestWithCookie,
  setCookies,
};
