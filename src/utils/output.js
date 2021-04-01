const sanitizeHtml = require('sanitize-html')

exports.sanitizeHtml = (dirty) => {
  return sanitizeHtml(dirty)
}

exports.replaceLineBreak = (text) => {
  return text.replace(/\n/g, '<br>')
}