// Paragraph

'use strict';


module.exports = function paragraph(state, startLine, _endLine) {
  var content, terminate, i, l, token, oldParentType,
    nextLine = startLine + 1,
    terminatorRules = state.md.block.ruler.getRules('paragraph')
    , endLine = state.lineMax;

  if (_endLine) endLine = _endLine // Newly added by Zijian

  oldParentType = state.parentType;
  state.parentType = 'paragraph';

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine;

  let open_token = state.push('paragraph_open', 'div', 1);
  open_token.map = [startLine, state.line];
  open_token.attrs = { class: "paragraph" }
  token = state.push('inline', '', 0);
  token.content = content;

  token.map = [startLine, state.line];
  token.children = [];

  let close_token = state.push('paragraph_close', 'div', -1);
  close_token.tokenMap = open_token
  open_token.tokenMap = close_token

  state.parentType = oldParentType;

  return true;
};
