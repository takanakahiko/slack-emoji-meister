const main = async() => {

    const webStore = require('chrome-webstore-upload')({
        extensionId: process.env.CHROME_EXTENSION_ID,
        clientId: process.env.CHROME_CLIENT_ID,
        clientSecret: process.env.CHROME_CLIENT_SECRET,
        refreshToken: process.env.CHROME_REFRESH_TOKEN
    });
    
    const fs = require('fs');
    var pjson = require('../package.json');
    console.log(pjson.version);
    
    try{
        const myZipFile = fs.createReadStream(`packages/slack-emoji-meister.v${pjson.version}.chrome.zip`);
        await webStore.uploadExisting(myZipFile);
        await webStore.publish();
    }catch(e){
        console.error(e)
    }
    
}

(async() => {
    await main()
})()