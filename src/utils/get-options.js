const Markup = require('telegraf/markup')

const getOptions = ( query, maxpage ) => {
  const parts = query.split(':')
  const current = parseInt(parts[1]) || 1
  const path = parts[0]
  const maxPage = parseInt(maxpage)

  return Markup.inlineKeyboard([
    [
      Markup.urlButton('Web view', `http://telegra.ph/${path}`),
      Markup.switchToChatButton('Forward page', `${path}:${current}`)
    ], [
      Markup.callbackButton(`↪️ Back`, `${path}:${current}`)
    ]
  ])
}

module.exports = getOptions