# 日常工作流脚手架


## 开发背景 

进入团队不久，便抽时间做了在一个打包期间动态插入script的htmlwebpackPlugin，地址：[html-webpack-insert-script-plugin](https://www.npmjs.com/package/html-webpack-insert-script-plugin)
随后一周并不满足于这个插件，希望每一次开发自动带上这个插件（直到1.6版本才发npm的就知道当时是并没有发包的想法的），并且希望每一次开发时智能生成当前所需要业务的代码文件结构，作为一个懒人，为解决“万事起头难”这一痛点，便再利用空余时间给自己开发了一套脚手架

##项目简介

脚手架功能

- 具体业务功能打开来看
- 设置host功能


模板特性：
 - 兼容ie8，会处理loose，会处理
 - 自带有asset（隔壁同事介绍用的一个会计算图片大小的post-css插件）
 - 图片合并雪碧图插件
 - 手游带有rem计算的属性（目前已用px2rem替代）
 - js，css发布地址可配置，静态资源img地址分开配置

该脚手架具有以下模板 

- common  一个单，多页面的模版
    - 页游（2.x版本统一称为common）
    - 端游（2.x版本统一称为common）
    - 手游（2.x版本统一称为common）
- mobile-simple 移动端单页面 不适用js框架，适合小页面
- mobile-vue 移动端vue页面


### 安装项目

```text
npm install yeoman -g
可以直接安装本代码库
npm install yeoman-worker
也可以在yeoman里搜索安装worker库

```

###更新记录

- v1.1.1 修正多项配置
- v1.2.1 修改util.scss，加入gitignore，增加.xxxx,无文件名文件的克隆 
- v1.3.1 做完年度盛典活动后，把其中尝试用的eslint加入代码 
- v1.3.2 默认注释掉eslint生成的html输出报告，防止误抛线上 
- v1.4.1 大改动，将webpack1改成webpack3,加入设置host的功能 
- v1.4.2 host太烦了，默认关掉，不给乱配 
- v1.4.3 babel配置加上loose 
- v1.4.4 babel配置抽出成.babelrc 
- v1.4.5 修改多项配置 
- v1.5.1 更新依赖到支持node8的版本，主要是node-sass 
- v1.5.2 改改配置 
- v1.6.1 根据日常工作需要更新下配置，尝试发到npm上试试 
抽出时间整理前段时间比较多做的移动端业务做出大调整于是乎有了2.x版本
- v2.1.0 大调整，出于移动端需要，把原来的模板统一归为common，为vue和react框架以及adcenter工作流做准备，加入browserlist，拆分postcss等多项重大修改
- v2.1.3 发包调整fixbug npmignore问题
