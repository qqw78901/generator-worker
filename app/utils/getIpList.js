const os = require('os');
module.exports=function(){
    const myIpArr=[];
    try {
        let networkInterfaces = os.networkInterfaces();
        for (let interfaceName in networkInterfaces) {
            networkInterfaces[interfaceName].forEach((itemInterface) => {
                if (itemInterface.family.toLowerCase() === 'ipv4') {
                    myIpArr.push({
                        name: itemInterface.address,
                        value: itemInterface.address
                    })
                }
            });
        }
    } catch (e) {
        myIpArr = [{
            name: '127.0.0.1',
            value: '127.0.0.1'
        }]
    };
    return myIpArr;
}

