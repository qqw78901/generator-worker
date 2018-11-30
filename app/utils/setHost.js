const host = require('host');
module.exports = function (ip, domain) {
    try {
        let dev = host.get(domain);
        let tips = `set`;
        if (dev && dev.length > 0) {
            console.info(`-----------host ${domain} 已经存在-----------`)
            tips = `changed`;
        }
        host.set(ip, domain, "local-dev", true, "本地开发环境---yeoman")
        console.info(`-----------host ${domain} ${tips}-----------`);
    } catch (e) {
        console.warn(e);
    }

}