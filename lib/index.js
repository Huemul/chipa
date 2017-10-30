const Remark = require('remark')
const R = require('ramda')
const glob = require('glob')

const remark = Remark()

const { readFile } = require('./utils')

// buildRegExp :: String -> RegExp
const buildRegExp = R.ifElse(
  Boolean,
  lang => new RegExp(`^(${lang})`),
  R.always(/^\w*/)
)

// langMatcher :: String|[String] -> RegExp
const langMatcher = R.compose(buildRegExp, R.when(R.is(Array), R.join('|')))

// isLangBlock -> String -> (String -> Bool)
const isLangBlock = lang =>
  R.both(
    R.compose(R.test(langMatcher(lang)), R.defaultTo(''), R.prop('lang')),
    R.compose(R.equals('code'), R.prop('type'))
  )

// extractMeta :: String -> String
const extractMeta = lang => R.compose(R.trim, R.replace(langMatcher(lang), ''))

// extractLang :: String -> String
const extractLang = lang => R.compose(R.head, R.match(langMatcher(lang)))

// pickValues :: String -> Object -> Object
const pickValues = lang => ({ value, lang: sLang, position }) => ({
  value,
  line: R.path(['start', 'line'], position) + 1,
  lang: sLang && extractLang(lang)(sLang),
  meta: sLang && extractMeta(lang)(sLang),
})

// hasSnippets :: [Object] -> [Object]
const hasSnippets = R.compose(Boolean, R.length, R.prop('snippets'))

// extractSingle :: String -> String? -> Promise(Object)
const extractSingle = (file, lang) => {
  return readFile(file)
    .then(remark.parse)
    .then(R.prop('children'))
    .then(R.filter(isLangBlock(lang)))
    .then(R.map(pickValues(lang)))
    .then(s => ({ snippets: s, file, lang: lang || 'all' }))
}

// extract :: String -> String? -> Promise([Object])
const extract = (path, lang) =>
  new Promise((res, rej) => {
    glob(path, (err, files) => {
      if (err) {
        rej(err)
      }
      const ps = files.map(file => extractSingle(file, lang))
      const all = Promise.all(ps).then(R.filter(hasSnippets))

      res(all)
    })
  })

module.exports = {
  extractSingle,
  extract,
}
