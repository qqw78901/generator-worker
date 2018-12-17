module.exports = function (ip, domain) {
    const host = require('host');
    try {
        let dev = host.get(domain);
        let tips = `set`;
        if (dev && dev.length > 0) {
            console.info(`-----------host ${domain} 已经存在-----------`)
            tips = `changed`;
        }
        host.set(ip, domain, "local-dev", true);
        console.info(`-----------host ${domain} ${tips}-----------`);
    } catch (e) {
        console.warn(e);
    }

}