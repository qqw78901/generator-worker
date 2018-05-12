const fs = require('fs');
const specialFile = ['.gitignore','.npmignore','.eslintrc.json','.babelrc','.eslintignore'];
module.exports = {
    init(context, data) {
        return new Promise((resolve, reject) => {
            this.writePackageJSON.apply(context, [data]);
            resolve(1);
        })
    },
   
    writePackageJSON(packageConfig) {
        this.fs.copyTpl(
            this.templatePath('config/'+packageConfig.configTplPath+'/'),
            this.destinationPath(""), packageConfig
        );
        specialFile.forEach((sp) => {
            if(!fs.existsSync(this.templatePath(`config/${packageConfig.configTplPath}/${sp}`))){return;}
            this.fs.copy(
                this.templatePath(`config/${packageConfig.configTplPath}/${sp}`),
                this.destinationPath()+`/${sp!=='.npmignore'?sp:'.gitignore'}`);
        })

    }
}
