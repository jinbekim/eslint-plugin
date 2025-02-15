const noForEachRule = require('./no-forEach-on-HTMLCollection');
const plugin = { rules: { 'no-forEach-on-HTMLCollection': noForEachRule } };
module.exports = plugin;
