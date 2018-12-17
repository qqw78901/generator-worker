const Generator = require('yeoman-generator');
const getIpList = require('./utils/getIpList');
const getPinYin = require('./utils/getPinYin');
const setHost = require('./utils/setHost');
const checkUpdate = require('./checkUpdate');
const updateMySelf = require('./checkUpdate').updateMySelf;
const TemplatePC = require('worker-template-pc');
const TemplateMobileSimple = require('worker-template-mobile-simple');
const TemplatePCReact = require('worker-template-pc-react');

const TemplateMiniProgram = require('worker-template-miniprogram');
const Template = {
    PC: TemplatePC,
    MobileSimple: TemplateMobileSimple,
    PCReact: TemplatePCReact,
    MiniProgram: TemplateMiniProgram
}
module.exports = class extends Generator {
    initializing (){
        this.log('正在检查更新...')
        return new Promise((resolve,reject)=>{
            checkUpdate(['worker-template-pc','worker-template-mobile-simple','worker-template-pc-react','worker-template-miniprogram']).then(
                (result)=>{
                    if(result.length){
                        const logs = result.map(item=>{
                            return `${item.packageName}有最新版${item.remoteVersion},当前版本${item.localVersion}`
                        });
                        this.log(logs.join('\n'));
                        this.log('即将执行自动更新');
                        updateMySelf(this,()=>{
                        });
                        reject(new Error('等待更新完毕或执行全局安装generator-worker'));
                        // reject(new Error('即将执行自动更新'));
                    }else{
                        this.log('所有模块都是最新版')
                        resolve();
                    }
                }
            ).catch(error=>{
                console.error(error);
                resolve();
            })
        })
   
    }
    prompting() {
        var myIpArr = getIpList();
        this.developerName = this.user.git.name() || "";
        var developer = getPinYin(this.developerName);
        var appName = this.determineAppname().replace(/ /g, '-');
        return this.prompt([{
                type: 'input',
                name: 'developer',
                message: '姓名(英文)：',
                default: developer // Default to current folder name
            }, {
                type: 'input',
                name: 'title',
                message: '项目名（英文）：',
                default: appName // Default to current folder name
            }, {
                type: 'input',
                name: 'description',
                message: '项目名(中文）：',
                default: appName // Default to current folder name
            }, {
                type: 'input',
                name: 'version',
                message: 'version：',
                default: "1.0.0"
            }, {
                type: 'list',
                name: 'type',
                message: '业务类型:',
                default: "PC",
                choices: [{
                        name: "移动端-小程序",
                        value: "MiniProgram"
                    },
                    {
                        name: "PC端-无框架",
                        value: "PC"
                    },
                    {
                        name: "PC端-React",
                        value: "PCReact"
                    }, {
                        name: "移动端-无框架",
                        value: "MobileSimple"
                    }, 
                    // {
                    //     name: "移动端-vue",
                    //     value: "tpl-mobileVue"
                    // }, 
                    // {
                    //     name: "移动端-react",
                    //     value: "tpl-mobileReact"
                    // }
                ]
            }])
            /**
             *  handle developerName
             */
            .then(data => {
                data.developerName = this.developerName;
                return data;
            })
            /**
             * ask by template
             */
            .then((data) => {
                return Template[data.type].prompt.call(this, data, myIpArr);
            })
            /**
             * init host and dependence
             */
            .then(data => {
                if (data.setHost) {
                    setHost(data.ip,data.host);
                }
                return data;
            })
            .then(data => {
                this.config = data;
            });
    }
    writing() {
        const {
            config
        } = this;
        Template[config.type].write(this);
    }
}