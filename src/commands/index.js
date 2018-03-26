const { Composer } = require('telegraf')

const composer = new Composer()


// Modules
const helpHandler = require('./help-handler')

// Commands
composer.command('help', helpHandler)

module.exports = composer