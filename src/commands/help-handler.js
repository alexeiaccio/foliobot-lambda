const options = require('../options')

const instructionMessage = `\
Use oficial @telegraph bot to make your page.

Then start inline query @foliobot in target chat with link to Telegraph's page.
`

const helpHandler = ({ replyWithHTML }) => 
  replyWithHTML(instructionMessage, options.parse_mode)


module.exports = helpHandler
