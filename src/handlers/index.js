const { Composer } = require('telegraf')

const composer = new Composer()


// Modules
const inlineQueryHandler = require('./inline-query-handler')
const callbackQueryHandler = require('./callback-query-handler')

// Commands
composer.on('inline_query', inlineQueryHandler)
composer.on('callback_query', callbackQueryHandler)

module.exports = composer
