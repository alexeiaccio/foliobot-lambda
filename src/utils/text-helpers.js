const filterTags = (tag) => {
  if (tag === 'b' || tag === 'strong' || tag === 'i' || tag === 'em' || tag === 'a' || tag === 'code' || tag === 'pre') {
    filteredTag = tag
  } else if (tag === 'h3' || tag === 'h4') {
    filteredTag = 'strong'
  } else if (tag === 'li') {
    filteredTag = 'em'
  } else {
    filteredTag = undefined
  }
  return filteredTag
}

const clearContent = (content) => {  
  const includedRegExp = /[<.+?>.+?](<.+?>)(.+?)(<\/.+?>)[.+?<\/.+?>]/g  
  const replacer = (str, first, second, third, offset, s) => `>${second}<`

  return content
    .replace(includedRegExp,  replacer)
    .replace(/(\n)+/g , '\n')
}

const parseContent = (children) => {
  let parsed = ''
  children.map(node => {    
    const tag = filterTags(node.tag)
    if (node.children) {      
      node.tag && tag !== undefined ?
        parsed += `<${tag}${node.attrs && node.attrs.href ? ` href=${  node.attrs.href}` : ''}>${parseContent(node.children)}</${tag}>${node.tag === 'li' || node.tag === 'h3' || node.tag === 'h4' ? '\n' : ''}` :
        parsed += `${parseContent(node.children)}\n`
    } else node.tag ? parsed += '' : parsed += node
  })
  return parsed
}

const getContent = (content) => (clearContent(parseContent([{'tag': 'div', 'children': content}])))

const findBreakTag = (str) => {
  const endRegExp = /(<(\/??)(\w+)[\s.*]?>)[^>]*?$/gm
  const startRegExp = /^.*?[^<]?(<(\/??)(\w+).*?>)/gm
  matchEnd = endRegExp.exec(str)
  matchStart = startRegExp.exec(str)
  if (matchEnd !== null || matchStart !== null) {
    if (matchEnd[2] !== '/') str += `</${matchEnd[3]}>`
    if (matchStart[2] === '/') str = `<${matchStart[3]}>${  str}`
  }
  return str
}

const getMaxPage = (text) => (Math.floor(text.split('').length / 600))

const getParts = (text) => {
  const parts = []
  const wordArray = text.split(' ')
  const letterCount = text.split('').length
  const partsCount = getMaxPage(text)  
  const count = wordArray.length / partsCount
  for (let i = 0; i <= partsCount; i++) {
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