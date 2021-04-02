const sanitizeHtml = require('sanitize-html')

exports.sanitizeHtml = (dirty) => {
  return sanitizeHtml(dirty, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'escape'
  })
}

exports.replaceLineBreak = (text) => {
  return text.replace(/\n/g, '<br>')
}