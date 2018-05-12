const generators = require('yeoman-generator');
const actionConfig = require('./actionConfig');
const actionTemplates = require('./actionTemplates');
module.exports = generators.extend({
    prompting: function () {
        var self = this;
        return this.prompt([{
            type: 'input',
            name: 'title',
            message: '项目名（英文）：',
            default: this.appname // Default to current folder name
        }, {
            type: 'input',
            name: 'description',
            message: '项目名(中文）：',
            default: this.appname // Default to current folder name
        }, {
            type: 'input',
            name: 'version',
            message: 'version：',
            default: "1.0.0"
        }, {
            type: 'input',
            name: 'prodJsCSSPath',
            message: 'prodJsCSSPath：',
            default: ""
        }, {
            type: 'input',
            name: 'prodImgPath',
            message: 'prodImgPath:',
            default: ""
        }, {
            type: 'input',
            name: 'ip',
            message: 'ip:',
            default: "127.0.0.1"
        }, {
            type: 'input',
            name: 'port',
            message: '端口:',
            default: "80"
        }, {
            type: 'list',
            name: 'type',
            message: '业务类型:',
            default: "yeyou",
            choices: [{
                name: "页游",
                value: "yeyou"
            }, {
                name: "端游",
                value: "duanyou"
            }, {
                name: "手游",
                value: "shouyou"
            }, {
                name: "新模板-移动端-simple",
                value: "tpl-mobileSimple"
            }, {
                name: "新模板-移动端-vue",
                value: "tpl-mobileVue"
            }, {
                name: "新模板-移动端-react",
                value: "tpl-mobileReact"
            }]
        }, {
            type: 'confirm',
            name: 'needjQuery',
            message: 'needjQuery?',
            default: true
        }, {
            type: 'confirm',
            name: 'needFangXieChi',
            message: '打包加入防劫持?',
            default: false
        }, {
            type: 'confirm',
            name: 'setHost',
            message: '需要设置ip的host成dev.yy.com吗?',
            default: false
        }, {
            type: 'confirm',
            name: 'installDependencies',
            message: '需要安装依赖吗?',
            default: true
        }]).then(data => {
            var type = data.type;
            data.configTplPath = 'common';
            if (type.indexOf('tpl') > -1) {
                data.configTplPath = type.split('-')[1];
                //no need fangjiechi
                if (data.needFangXieChi) {
                    data.needFangXieChi = false;
                    this.log("选择新模板，不支持添加防劫持，已关闭防劫持选项");
                }
            }
            return data;
        }).then((data) => {
            this.log(data);
            actionConfig.init(this, data).then((status) => {
                actionTemplates.init(this, data);
                if(!data.installDependencies){
                    this.log("completed with no package installed");
                    return;
                }
                 this.installDependencies({
                   bower: false,
                     npm: false,
                    yarn: true,
                     callback: () => {
                        this.log("package completed");
                     }
                 });
            })
        })
    },
})