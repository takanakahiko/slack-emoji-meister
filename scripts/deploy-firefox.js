var fs = require('fs');
var deploy = require('firefox-extension-deploy');

var pjson = require('../package.json');
console.log(pjson.version);
 
deploy({
  // obtained by following the instructions here:
  // https://addons-server.readthedocs.io/en/latest/topics/api/auth.html
  // or from this page:
  // https://addons.mozilla.org/en-US/developers/addon/api/key/
  issuer: process.env.FIREFOX_ISSUER,
  secret: process.env.FIREFOX_SECRET,
 
  // the ID of your extension
  id: process.env.FIREFOX_EXTENSION_ID,
  // the version to publish
  version: pjson.version,
 
  // a ReadStream containing a .zip (WebExtensions) or .xpi (Add-on SDK)
  src: fs.createReadStream(`packages/slack-emoji-meister.v${pjson.version}.firefox.xpi.zip`),
}).then(function() {
  // success!
  console.log('success!')
}, function(err) {
  // failure :(
  console.error(e)
});
