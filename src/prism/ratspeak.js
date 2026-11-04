// One Prism theme for both modes: colours come from the docs tokens in custom.css.
const theme = {
  plain: {color: 'var(--tk-plain)', backgroundColor: 'var(--code-bg)'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: 'var(--tk-com)'}},
    {types: ['keyword', 'builtin', 'parameter', 'variable', 'assign-left', 'atrule', 'selector', 'important', 'property', 'tag'], style: {color: 'var(--tk-kw)'}},
    {types: ['string', 'char', 'attr-value', 'inserted', 'url', 'regex'], style: {color: 'var(--tk-str)'}},
    {types: ['function', 'class-name'], style: {color: 'var(--tk-fn)'}},
    {types: ['number', 'boolean', 'constant', 'symbol', 'deleted'], style: {color: 'var(--tk-num)'}},
    {types: ['punctuation', 'operator'], style: {color: 'var(--tk-punc)'}},
  ],
};

export default theme;
