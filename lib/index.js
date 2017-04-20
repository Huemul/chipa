const remark = require('remark')()
const R = require('ramda')
const glob = require('glob')

const { readFile } = require('./utils')

// buildRegExp :: String -> RegExp
const buildRegExp = R.ifElse(
  Boolean,
  lang => new RegExp(`^(${lang})`),
  R.always(/^\w*/)
)

// langMatcher :: String|[String] -> RegExp
const langMatcher = R.ifElse(
  R.is(Array),
  R.compose(buildRegExp, R.join('|')),
  buildRegExp
)

// isLangBlock -> String -> (String -> Bool)
const isLangBlock = lang =>
  R.both(
    R.compose(R.test(langMatcher(lang)), R.defaultTo(''), R.prop('lang')),
    R.compose(R.equals('code'), R.prop('type'))
  )

// pick :: { lang: a, value: a, ... } -> { lang: a, value: a }
const pick = R.pick(['lang', 'value'])

// extractMeta :: String -> String
const extractMeta = lang => R.compose(R.trim, R.replace(langMatcher(lang), ''))

// extractLang :: String -> String
const extractLang = lang => R.compose(R.head, R.match(langMatcher(lang)))

// perseMeta :: String -> Object -> Object
const parseMeta = lang => node => ({
  value: node.value,
  lang: node.lang && extractLang(lang)(node.lang),
  meta: node.lang && extractMeta(lang)(node.lang),
})

// hasSnippets :: [Object] -> [Object]
const hasSnippets = R.compose(Boolean, R.length, R.prop('snippets'))

// parseFile :: String -> String? -> Promise(Object)
const parseFile = (file, lang) => {
  return readFile(file)
    .then(remark.parse)
    .then(R.prop('children'))
    .then(R.filter(isLangBlock(lang)))
    .then(R.map(pick))
    .then(R.map(parseMeta(lang)))
    .then(s => ({ snippets: s, file, lang: lang || 'all' }))
}

// parseFile :: String -> String? -> Promise([Object])
const parsePath = (path, lang) =>
  new Promise((res, resj) => {
    glob(path, (err, files) => {
      if (err) {
        rej(err)
      }
      const all = Promise.all(files.map(file => parseFile(file, lang))).then(
        R.filter(hasSnippets)
      )

      res(all)
    })
  })

module.exports = {
  parseFile,
  parsePath,
}