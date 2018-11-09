# 小程序demo

> 小程序demo，包括项目配置/基本写法/互联登录等

项目由mpvue生成，已集成了一些页面写法/cookie/登录登录等等，详看GUIDE.md

## 项目结构

```
├─build // 构建脚本
├─config // 构建配置
├─src
│  ├─assets // 资源目录
│  ├─components // 组件
│  ├─css // 公共css
│  ├─pages // 页面
│  ├─main.js // 入口
│  ├─common.js // 公共方法
│  ├─utils.js // 工具方法
│  ├─store.js // vuex store
│  └─app.json // 小程序全局配置
├─index.html
├─REAMDE.md // 正是在下
├─GUIDE.md // 开发指南
└─package.json
```

## 开发步骤

``` bash
# 安装依赖
npm i

# 开发
npm run dev

# 再打开微信web开发工具，添加项目即可

```
