var bunyan = require('bunyan')
var bformat = require('bunyan-format')  
var formatOut = bformat({ outputMode: 'short' })

module.exports.log = bunyan.createLogger({ name: 'MORNING-MAIL', stream: formatOut, level: 'debug' } );