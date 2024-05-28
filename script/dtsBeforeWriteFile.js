const { paths } = require('./config')

function dtsBeforeWriteFile(filePath, content) {
  let newContent = content

  for (const key in paths) {
    newContent = newContent.replace(
      new RegExp(`[(from)|(import)]\\s*(["|']${key}["|'])`, 'g'),
      (data) => {
        return data.replace(new RegExp(key, 'g'), paths[key])
      },
    )
  }

  return { filePath, content: newContent }
}

module.exports = dtsBeforeWriteFile
