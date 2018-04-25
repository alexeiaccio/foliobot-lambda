const options = require('../options')
const dynamoDb = require('../db')
const getPages = require('../utils/text-helpers')
const getPagination = require('../utils/get-pagination')
import fetch from 'isomorphic-fetch'
import { fromPromised } from 'folktale/concurrency/task'
import Result from 'folktale/result'
const curry = require('folktale/core/lambda/curry')

const fetchPage = path =>
  fetch(`https://api.telegra.ph/getPage?path=${path}&return_content=true`)
    .then(res => res.json())

const checkResult = value =>
  value.ok                         ? Result.Ok(value)
: value.error === 'PAGE_NOT_FOUND' ? Result.Error('Page not found')
: /* otherwise */                    Result.Error(`Fetch error: ${value.error}`)

const getPageTask = fromPromised(fetchPage)
const getPageExecution = (path) => getPageTask(path)
  .run()
  .future()
  .listen({
    onCancelled: () => console.log('getPageExecution was cancelled'),
    onRejected:  (reason) => console.log(`Fetch error: ${reason}`),
    onResolved:  (value) => value
  })

const answerInlineQueryHandle = curry(4, (answerInlineQuery, path, current, result) => {
  const pages = getPages(result.content)
  const maxPage = pages.length

  return answerInlineQuery(
    [{
      type: 'article',
      id: 1,
      title: result.title ? result.title : 'Page me!',
      description: result.description,
      thumb_url: 'https://github.com/alexeiaccio/foliobot/raw/master/app/public/favicon.png',
      input_message_content: Object.assign({},
        { message_text: pages[current-1] },
        options.parse_mode
      ),
      reply_markup: getPagination(`${path}:${current}`, maxPage)
    }],
    {
      cache_time: 800
    }
  ).catch(err => console.log(err), undefined)
})

const errorHandle = curry(2, (answerInlineQuery, err) => {
  const title = 'Oops...'
  const description = err
  return answerInlineQuery(
    [{
      type: 'article',
      id: 2,
      title,
      description,
      input_message_content: Object.assign({},
        { message_text: `<b>${title}</b> ${description}` },
        options.parse_mode
      )
    }],
    {
      cache_time: 200
    }
  )
})

const getPath = (query) => {
  let path = ''
  let current = 1
  if (query.indexOf('http') === 0) {
    const pathRegExp = /(?:http:\/\/telegra.ph\/)(.*)/g
    path = pathRegExp.exec(query)[1]
  } else if (query.indexOf(':')>=0) {
    const parts = query.split(':')
    current = parseInt(parts[1]) || 1
    path = parts[0]
  } else path = query
  return { path, current }
}

const inlineQueryHandler = ({ inlineQuery, answerInlineQuery }) => {
  const query = inlineQuery.query
  if(query.length > 1) {
    const { path, current } = getPath(query)
    const telegraphContent = getPageExecution(path)
    const makeAnswer = answerInlineQueryHandle(answerInlineQuery, path, current)
    const makeError = errorHandle(answerInlineQuery)

    telegraphContent.map(value =>
      checkResult(value)
        .matchWith({
          Ok:    ({ value }) => makeAnswer(value.result),
          Error: ({ value }) => makeError(value)
        })
    )
  }
}

module.exports = inlineQueryHandler