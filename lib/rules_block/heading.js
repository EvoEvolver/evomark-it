// heading (#, ##, ...)

'use strict';

const { getLabeller } = require("../helpers/labeller");
const { parseTagNameAttrs } = require("../helpers/parse_tag_attrs");

const labelling = getLabeller("Section")

var isSpace = function isSpace(code) {
    switch (code) {
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
}


function heading(state, startLine, endLine, silent) {
    var ch, level, tmp, token,
        pos = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];

    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

    ch = state.src.charCodeAt(pos);

    if (ch !== 0x23/* # */ || pos >= max) { return false; }

    // count heading level
    level = 1;
    ch = state.src.charCodeAt(++pos);
    while (ch === 0x23/* # */ && pos < max && level <= 6) {
        level++;
        ch = state.src.charCodeAt(++pos);
    }

    if (level > 6 || (pos < max && !isSpace(ch))) { return false; }

    if (silent) { return true; }

    // Let's cut tails like '    ###  ' from the end of string

    max = state.skipSpacesBack(max, pos);
    tmp = state.skipCharsBack(max, 0x23, pos); // #
    if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
        max = tmp;
    }

    state.line = startLine + 1;

    let afterMarkup = state.src.slice(pos, max).trim();

    let { tagName, attrs } = parseTagNameAttrs(afterMarkup)

    if (attrs.error) {
        let token = state.push('parse_warning', 'div', 0);
        token.block = true;
        token.info = ["JSON parse error:\"", attrs.error, "\" at string \"", rjson_src, "\""].join("");
        token.map = [startLine, endLine];
        attrs = {}
    }

    labelling(state, attrs, level - 1, { title: tagName })
    addToSectionList(state, attrs.id, level - 1, tagName)


    let open_token = state.push('heading_open', 'h' + String(level), 1);
    open_token.markup = '########'.slice(0, level);
    open_token.map = [startLine, state.line];
    open_token.attrs = attrs
    
    let content_token = state.push('inline', '', 0);

    content_token.content = tagName

    content_token.map = [startLine, state.line];
    content_token.children = [];

    let close_token = state.push('heading_close', 'h' + String(level), -1);
    close_token.markup = '########'.slice(0, level);
    close_token.tokenMap = open_token
    open_token.tokenMap = close_token

    return true;
};

module.exports = heading

function addToSectionList(state, id, level, title) {
    let env = state.env;
    if (!env.sectionList) {
        env.sectionList = []
    }
    env.sectionList.push([id, level, title])
}