const noForEachRule = require('./no-forEach-on-HTMLCollection');
const plugin = { rules: { 'no-forEach': noForEachRule } };
module.exports = plugin;
