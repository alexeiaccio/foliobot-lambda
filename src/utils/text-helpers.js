const curry = require('folktale/core/lambda/curry')

const isTag = curry(2, (list, tag) => list.some(elem => elem === tag))

const filterTags = (tag) => {
  const telegramTags = ['b', 'strong', 'i', 'em', 'a', 'code', 'pre']  
  const headerTags = ['h3', 'h4']  
  const listTags = ['li']
  let filteredTag
  isTag(telegramTags, tag)  ? filteredTag = tag
: isTag(headerTags, tag)    ? filteredTag = 'strong'
: isTag(listTags, tag)      ? filteredTag = 'em'
: /* otherwise */             filteredTag = undefined
  return filteredTag
}

const clearContent = (content) => {  
  const includedRegExp = /[<.+?>.+?](<.+?>)(.+?)(<\/.+?>)[.+?</.+?>]/g  
  const replacer = (str, first, second) => `>${second}<`
  return content
    .replace(includedRegExp,  replacer)
    .replace(/(\n)+/g , '\n')
}

const parseContent = (children) => {
  const paragraphTags = ['h3', 'h4', 'li'] 
  let parsed = ''
  children.map(node => {    
    const tag = filterTags(node.tag)
    if (node.children) {      
      if(tag && tag !== undefined) {
        parsed += `<${tag}${node.attrs && node.attrs.href ? ` href=${node.attrs.href}` : ''}>${parseContent(node.children)}</${tag}>${isTag(paragraphTags, tag) ? '\n' : ''}`
      } else {
        parsed += `${parseContent(node.children)}\n`
      }
    } else if(node.tag) {
      parsed += ''
    } else {
      parsed += node
    }
    return parsed
  })
  return parsed
}

const getContent = (content) => (clearContent(parseContent([{'tag': 'div', 'children': content}])))

const findBreakTag = (str) => {
  const endRegExp = /(<(\/??)(\w+)[\s.*]?>)[^>]*?$/gm
  const startRegExp = /^.*?[^<]?(<(\/??)(\w+).*?>)/gm
  const matchEnd = endRegExp.exec(str)
  const matchStart = startRegExp.exec(str) 
  let newStr = str
  if (matchEnd !== null || matchStart !== null) {
    if (matchEnd[2] !== '/')
      newStr += `</${matchEnd[3]}>`    
    if (matchStart[2] === '/')
      newStr = `<${matchStart[3]}>${str}`
  }
  return newStr
}

const getMaxPage = (text) => (Math.floor(text.split('').length / 600))

const getParts = (text) => {
  const parts = []
  const wordArray = text.split(' ')
  const partsCount = getMaxPage(text)  
  const count = wordArray.length / partsCount
  for (let i = 0; i <= partsCount; i += 1) {
    const part = wordArray
      .slice( i < 1 ? 0 : count*(i), count*(i + 1))
      .join(' ')
    parts.push(findBreakTag(part))
  }
  if (parts[parts.length-1] === '') parts.pop()
  return parts
}

const getPages = (content) => (getParts(getContent(content)))

module.exports = getPages