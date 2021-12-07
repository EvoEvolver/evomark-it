
var unescapeAll = require('../common/utils').unescapeAll;
var escapeHtml = require('../common/utils').escapeHtml;
const { writeElement } = require('../common/html_writer');

var default_rules = {};

default_rules.code_inline = function (tokens, idx, options, env, slf) {
  var token = tokens[idx];

  return '<code' + slf.renderAttrs(token) + '>' +
    escapeHtml(tokens[idx].content) +
    '</code>';
};

default_rules.equ_inline = function (tokens, idx, options, env, slf) {
  return '<EquInline tex="' + escapeHtml(tokens[idx].content) +'">'+
    '</EquInline>';
};

default_rules.equ_block = function (tokens, idx, options, env, slf) {
  return '<EquBlock tex="' + escapeHtml(tokens[idx].content) +'">'+
    '</EquBlock>';
};

default_rules.document_begin = function (tokens, idx, options, env, slf) {
  return '<DocumentBegin/>'
};

default_rules.document_end = function (tokens, idx, options, env, slf) {
  return '<DocumentEnd/>'
};


default_rules.code_block = function (tokens, idx, options, env, slf) {
  var token = tokens[idx];

  return '<pre' + slf.renderAttrs(token) + '><code>' +
    escapeHtml(tokens[idx].content) +
    '</code></pre>\n';
};


default_rules.fence = function (tokens, idx, options, env, slf) {
  var token = tokens[idx],
    info = token.info ? unescapeAll(token.info).trim() : '',
    langName = '',
    langAttrs = '',
    highlighted, i, arr, tmpAttrs, tmpToken;

  if (info) {
    arr = info.split(/(\s+)/g);
    langName = arr[0];
    langAttrs = arr.slice(2).join('');
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  if (highlighted.indexOf('<pre') === 0) {
    return highlighted + '\n';
  }

  // If language exists, inject class gently, without modifying original token.
  // May be, one day we will add .deepClone() for token and simplify this part, but
  // now we prefer to keep things local.
  if (info) {
    i = token.attrIndex('class');
    tmpAttrs = token.attrs ? token.attrs.slice() : [];

    if (i < 0) {
      tmpAttrs.push(['class', options.langPrefix + langName]);
    } else {
      tmpAttrs[i] = tmpAttrs[i].slice();
      tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
    }

    // Fake token just to render attributes
    tmpToken = {
      attrs: tmpAttrs
    };

    return '<pre><code' + slf.renderAttrs(tmpToken) + '>'
      + highlighted
      + '</code></pre>\n';
  }


  return '<pre><code' + slf.renderAttrs(token) + '>'
    + highlighted
    + '</code></pre>\n';
};


default_rules.image = function (tokens, idx, options, env, slf) {
  var token = tokens[idx];

  // "alt" attr MUST be set, even if empty. Because it's mandatory and
  // should be placed on proper position for tests.
  //
  // Replace content with actual value

  token.attrs[token.attrIndex('alt')][1] =
    slf.renderInlineAsText(token.children, options, env);

  return slf.renderToken(tokens, idx, options);
};


default_rules.hardbreak = function (tokens, idx, options /*, env */) {
  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
default_rules.softbreak = function (tokens, idx, options /*, env */) {
  return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};


default_rules.text = function (tokens, idx /*, options, env */) {
  return escapeHtml(tokens[idx].content);
};


default_rules.html_block = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};
default_rules.html_inline = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};


/* 
 * Evomark modify begin
 */
default_rules.parse_warning = function (tokens, idx /*, options, env */) {
  let tagName = tokens[idx].tag || "div"
  return writeElement(tagName, { class: "parse_warning" }, tokens[idx].content)
};

module.exports = default_rules