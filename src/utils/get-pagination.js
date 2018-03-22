const Markup = require('telegraf/markup')

const getPagination = ( query, maxpage ) => {
    const keysTop = []
    const keysBottom = []
    const parts = query.split(':')
    const current = parseInt(parts[1]) || 1
    const path = parts[0]
    const maxPage = parseInt(maxpage)

    if (maxPage>2) {
      if (current==1) {
        keysBottom.push( 
          Markup.urlButton('Web view', `http://telegra.ph/${path}`) 
        )
      } else {
        keysBottom.push( 
          Markup.callbackButton('First', `${path}:1`) 
        )
      }
      keysBottom.push( 
        Markup.callbackButton(`${current} · ${maxPage}`, `${path}:${current}`)
      )
      if (current==maxPage) {
        keysBottom.push( 
          Markup.switchToChatButton('Forward', path.toString()) 
        )
      } else {
        keysBottom.push( 
          Markup.callbackButton(`Last`, `${path}:${maxPage}`) 
        )
      }
    }
    if (maxPage==2 && current==1) {
      keysTop.push( 
        Markup.urlButton('Web view', `http://telegra.ph/${path}`) 
      )
    }
    if (current>1) {
      keysTop.push( 
        Markup.callbackButton('Previous', `${path}:${current - 1}`) 
      )
    }
    if (current<maxPage) {
      keysTop.push( 
        Markup.callbackButton('Next', `${path}:${current + 1}`) 
      )
    }
    if (maxPage==2 && current==maxPage) {
      keysTop.push( 
        Markup.switchToChatButton('Forward', path.toString()) 
      )
    }
    
    return Markup.inlineKeyboard( [ keysTop, keysBottom ] )
  }

  module.exports = getPagination