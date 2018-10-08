const nodeFs = require("fs");
const host = require('host');
let folderArray = ["src", "src/css", "src/entry", "src/images", "src/images/sprites"];
let actionTemplates = {
    init(context, data) {
        return new Promise((resolve, reject) => {
            this.initHost.apply(context, [data]);
            this.createFolder.apply(context, [folderArray]);
            this.createTemplates.apply(context, [data]);
            this.createDependence.apply(context, [data]);
            resolve(1);
        });
    },
    initHost(config) {
        if (config.setHost) {
            let dev = host.get('dev.yy.com');
            let tips = `set`;
            if (dev && dev.length > 0) {
                console.info("-----------host dev.yy.com 已经存在-----------")
                tips = `changed`;
            }
            host.set(config.ip, "dev.yy.com", "local dev", true, "本地开发环境---yeoman")
            console.info(`-----------host dev.yy.com ${tips}-----------`);
        }
    },
    createFolder(destnations) {
        destnations.forEach((val, i) => {
            let destnation = this.destinationPath(val);
            if (!nodeFs.existsSync(destnation)) {
                nodeFs.mkdirSync(destnation);
                console.info("create " + destnation);
            } else {
                console.info("exist " + destnation);
            }
        });
    },
    createTemplates(config) {
        // this.fs.write(this.destinationPath('src/js/index.js'), "");
        this.fs.copy(
            this.templatePath(`entry/${config.configTplPath}/`),
            this.destinationPath('src/entry')
        );
        this.fs.copy(
            this.templatePath(`css/${config.configTplPath}/`),
            this.destinationPath('src/css')
        );
        this.fs.copyTpl(
            this.templatePath(`html/${config.configTplPath}/index.html`),
            this.destinationPath('src/index.html'), config
        );
        let othersPath = this.templatePath(`others/${config.configTplPath}`);
        if (nodeFs.existsSync(othersPath)) {
            this.fs.copy(
                this.templatePath(`others/${config.configTplPath}/`),
                this.destinationPath('src')
            );
        }

    },
    createDependence(config) {
        if (!config.needTimeStat) {
            return;
        }
        /*    this.fs.copy(
                this.templatePath('dependence/HtmlWebpackInsertPlugin.js'),
                this.destinationPath('HtmlWebpackInsertPlugin.js')
            );*/
        let timeStatFile = ['common_header'];
        timeStatFile.forEach((val) => {
            this.fs.copy(
                this.templatePath('dependence/timestat/' + val + ".tpl"),
                this.destinationPath('lib/timestat/' + val + ".js")
            );
        })
    }
}
module.exports = actionTemplates;