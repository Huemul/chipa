const remark        = require("remark")()
const Task          = require('data.task')
const R             = require('ramda')

const { readFile }  = require('./utils')

const buildRegExp = R.ifElse(
  Boolean,
  lang => new RegExp(`^(${lang})`),
  R.always(/^\w*/)
)


const langMatcher = R.ifElse(
  R.is(Array),
  R.compose(buildRegExp, R.join('|')),
  buildRegExp
)

const isLangBlock = lang => R.both(
  R.compose(
    R.test(langMatcher(lang)), 
    R.defaultTo(''),
    R.prop('lang')
  ),
  R.compose(
    R.equals('code'), 
    R.prop('type')
  )
)

const pick = R.pick([ 'lang', 'value' ])

const extractMeta = lang => R.replace(langMatcher(lang), '')

const extractLang = lang => R.compose(
  R.head, 
  R.match(langMatcher(lang))
)

const parseMeta = lang => (node) => ({
  value: node.value,
  lang: extractLang(lang)(node.lang),
  meta: extractMeta(lang)(node.lang)
}) 

const log = (...arg) => console.log(...arg)

const parse = (file, config = { }) => {
  readFile(file)
    .then(remark.parse)
    .then(R.prop('children'))
    .then(R.filter(isLangBlock(config.lang)))
    .then(R.map(pick))
    .then(R.map(parseMeta(config.lang)))
    .then(s => ({ snippets: s, file, lang: config.lang || 'all' }))
    .then(o => JSON.stringify(o, null, '\t'))
    .then(log, log)
} 

parse('example.md')

parse('example.md', { lang: ['js', 'javascript'] })

parse('example.md', { lang: 'go' })
