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
    let attrList = []
    if (attrs.error) {
        let token = state.push('parse_warning', 'div', 0);
        token.block = true;
        token.info = ["JSON parse error:\"", attrs.error, "\" at string \"", rjson_src, "\""].join("");
        token.map = [startLine, endLine];
        attrs = {}
    }

    labelling(state, attrs, level - 1, { title: tagName })
    addToSectionList(state, attrs.id, level - 1, tagName)

    for (let key in attrs) {
        attrList.push([key, attrs[key]])
    }

    token = state.push('heading_open', 'h' + String(level), 1);
    token.markup = '########'.slice(0, level);
    token.map = [startLine, state.line];
    token.attrs = attrList

    token = state.push('inline', '', 0);

    token.content = tagName

    token.map = [startLine, state.line];
    token.children = [];

    token = state.push('heading_close', 'h' + String(level), -1);
    token.markup = '########'.slice(0, level);

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