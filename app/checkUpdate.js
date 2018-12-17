const NpmView = require('npmview');
const VersionCompare = require('./utils/versionCmpare');

function updateChecker(packageName) {
    return new Promise((resolve, reject) => {
        const localInfo = require(`${packageName}/package.json`);
        const localVersion = localInfo.version;
        NpmView(packageName, function (err, remoteVersion) {
            if (err) {
                console.error('无法获取' + packageName + '包的信息')
                reject(err);
                return true;
            }
            if (VersionCompare(localVersion, remoteVersion) < 0) {
                //  版本检查 非最新版
                resolve({
                    packageName,
                    localVersion,
                    remoteVersion,
                    updated: false
                });
                return true;
            } else {
                resolve({
                    packageName,
                    localVersion,
                    remoteVersion,
                    updated: true
                });
                return true;
            }
        });
        return false;
    })


}
/**
 * 检查更新返回一个结果即OK
 */
module.exports = function (packageList) {
    return new Promise((resolve, reject) => {
        const waitList = [];
        const promiseList = packageList.map(packageName => {
            return updateChecker(packageName);
        });
        Promise.all(promiseList).then(results => {
            results.forEach(item => {
                if (!item.updated) {
                    waitList.push(item);
                }
            });
            resolve(waitList)
        }).catch(error => {
            console.warn(error);
            reject(error);
        })
    })



}
module.exports.updateMySelf = function updateMySelf(ctx) {
    ctx.log('正在执行自动更新')
    let err = ctx.spawnCommandSync('npm', ['install', '--global'].concat('generator-worker@beta'), {
            stdio: 'inherit'
        });
        if(!err){
            cts.log('已更新完毕，请重新执行命令');
        }
}