// https://github.com/michael-ciniawsky/postcss-load-config

const replaceTagSelectorMap = require('postcss-mpvue-wxss/lib/wxmlTagMap')

const optopns = {
  cleanSelector: ['*'],
  remToRpx: 100,
  replaceTagSelector: Object.assign(replaceTagSelectorMap, {
    '*': 'view, text' // 将覆盖前面的 * 选择器被清理规则
  })
}

module.exports = {
  "plugins": {
    "postcss-mpvue-wxss": optopns
  }
}
