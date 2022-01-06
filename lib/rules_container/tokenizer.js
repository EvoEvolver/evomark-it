'use strict';

const parseParagraph = require("../rules_block/paragraph")
const { loadDict } = require("../helpers/load_dict");
const parseDict = require("../helpers/parse_dict");

module.exports.getTokenizer = function (rules, remarkNames) {

    const tokenizeContainer = function (state, tagName, params, startLine, endLine, fenceLines) {
        let old_parent = state.parentType;
        let old_line_max = state.lineMax;
        state.parentType = 'container';
        state.lineMax = endLine;

        let tagRule = rules[tagName]

        if (!tagRule) {
            if (remarkNames.indexOf(tagName) > -1) {
                tagRule = rules.Remark
                params.tagName = tagName
                tagName = "Remark"
            } else {
                let token = state.push('parse_warning', 'div', 0);
                token.block = true;
                token.content = "Unknown tag name \"" + tagName + "\"";
                token.map = [startLine, endLine];
                state.parentType = old_parent;
                state.lineMax = old_line_max;
                state.line = endLine + 1;
                return
            }
        }


        if (tagRule.beforeTokenize) tagRule.beforeTokenize(state, params)
        if (tagRule.defaultLabel) {
            if (!params.tagName) defaultLabel(state, params, 0, tagName)
            else defaultLabel(state, params, 0, params.tagName)
        }
        let innerType

        if (typeof tagRule.innerType == "number")
            innerType = () => tagRule.innerType
        else if (typeof tagRule.innerType == "function")
            innerType = tagRule.innerType
        else
            throw new Error("innerType must be number or function")

        if (fenceLines.length == 0 && (!tagRule.allowFence)) {
            tokenizeByInnerType(innerType(0, 0), state, params, tagName, startLine, endLine)
        } else if (tagRule.allowFence) {
            let fenceStart = startLine
            let numFence = fenceLines.length + 1
            fenceLines.push(endLine)
            for (let i = 0; i < numFence; i++) {
                tokenizeByInnerType(innerType(i, numFence), state, params, tagName, fenceStart, fenceLines[i], [i, numFence])
                fenceStart = fenceLines[i]
            }
        } else {
            let token = state.push('parse_warning', 'div', 0);
            token.block = true;
            token.content = "Container \"" + tagName + "\" doesn't accept fences";
            token.map = [startLine, endLine];
            state.parentType = old_parent;
            state.lineMax = old_line_max;
            state.line = endLine + 1;
            return
        }

        state.parentType = old_parent;
        state.lineMax = old_line_max;
        state.line = endLine + 1;
    }
    return tokenizeContainer
}

function tokenizeByInnerType(innerType, state, params, tagName, startLine, endLine, fenceIndex) {
    switch (innerType) {
        case 1: // innerType is block
            {
                tokenizeNestable(state, params, tagName, startLine, endLine, fenceIndex)
                break
            }
        case 0: // one line command
            {
                tokenizeOneLine(state, params, tagName, startLine, endLine, fenceIndex)
                break
            }
        case 4: // Parse paragraphs
            {
                tokenizeParagraph(state, params, tagName, startLine, endLine, fenceIndex)
                break
            }
        case 2: // direct pass
            {
                tokenizeDirectPass(state, params, tagName, startLine, endLine, fenceIndex)
                break
            }
        case 3: // object pass
            {
                tokenizeDict(state, params, tagName, startLine, endLine, fenceIndex)
                break
            }
        default:

    }
}

function tokenizeNestable(state, params, tagName, startLine, endLine, fenceIndex) {
    let open_token = state.push('container_open', tagName, 1);
    open_token.block = true;
    open_token.attrs = params;
    open_token.map = [startLine, endLine];
    open_token.fenceIndex = fenceIndex
    
    if (startLine != endLine) state.md.block.tokenize(state, startLine + 1, endLine);

    let close_token = state.push('container_close', tagName, -1);
    close_token.block = true;
    close_token.fenceIndex = fenceIndex

    close_token.tokenMap = open_token
    open_token.tokenMap = close_token
}

function tokenizeOneLine(state, params, tagName, startLine, endLine, fenceIndex) {
    if (startLine == endLine) {
        let token = state.push('container_alone', tagName, 0);
        token.block = true;
        token.attrs = params;
        token.map = [startLine, endLine];
        token.fenceIndex = fenceIndex
    } else {
        let token = state.push('parse_warning', 'div', 0);
        token.block = true;
        token.content = "Command \"" + tagName + "\" should be one line";
        token.map = [startLine, endLine];
    }
}

function tokenizeDirectPass(state, params, tagName, startLine, endLine, fenceIndex) {
    let token = state.push('container_alone', tagName, 0);
    token.attrs = params;
    token.map = [startLine, endLine];
    token.fenceIndex = fenceIndex

    let content = null
    if (startLine != endLine) {
        let contentStart = state.bMarks[startLine + 1] + state.tShift[startLine + 1]
        let contentEnd = state.eMarks[endLine - 1]
        content = state.src.slice(contentStart, contentEnd);
    }
    token.content = content

}

function tokenizeParagraph(state, params, tagName, startLine, endLine, fenceIndex) {
    let open_token = state.push('container_open', tagName, 1);
    open_token.attrs = params;
    open_token.map = [startLine, endLine];
    //let t = state.src.slice(state.bMarks[startLine+1],state.bMarks[endLine])
    open_token.fenceIndex = fenceIndex

    if (startLine+1 != endLine) {
        state.line = startLine + 1
        state.lineMax = endLine

        do {
            parseParagraph(state, state.line)
        } while (state.line < endLine);
    }

    let close_token = state.push('container_close', tagName, -1);
    close_token.fenceIndex = fenceIndex
    close_token.tokenMap = open_token
    open_token.tokenMap = close_token
}

function tokenizeDict(state, params, tagName, startLine, endLine, fenceIndex) {
    let token = state.push('container_alone', tagName, 0);
    token.attrs = params;
    token.map = [startLine, endLine];
    token.fenceIndex = fenceIndex

    let contentRaw = null
    if (startLine != endLine) {
        let contentStart = state.bMarks[startLine + 1] + state.tShift[startLine + 1]
        let contentEnd = state.eMarks[endLine - 1]
        contentRaw = state.src.slice(contentStart, contentEnd);
    }

    if (contentRaw.trim() != "" && params.src) {
        let token = state.push('parse_warning', 'div', 0);
        token.block = true;
        token.content = "Content inside the container will be ignored with content is specified!";
    }

    token.info = contentRaw

    try {
        if (params.src) {
            token.content = loadDict(state.env.basePath, params, "toml")
        } else {
            token.content = parseDict(contentRaw, params.lang || "toml")
        }
    } catch (error) {
        let token1 = state.push('parse_warning', 'div', 0);
        token1.block = true;
        token1.content = error.message;
        token1.map = [startLine, endLine];
        token.content = { }
    }

}


function defaultLabel(state, params, level, tagName) {

    const env = state.env
    let tagCounter = env.counter[tagName]
    level = level || 0

    // Create counter if hasn't
    if (!tagCounter) {
        tagCounter = new Array(level + 1).fill(0)
        env.counter[tagName] = tagCounter
    } else if (tagCounter[level] === undefined) {
        tagCounter = tagCounter.concat(new Array(level + 1 - tagCounter.length).fill(0))
        env.counter[tagName] = tagCounter
    }

    // Update counter
    if (!params.no_index) {
        tagCounter[level]++
        // Make counter after current level all zero
        for (let i = level + 1; i < tagCounter.length; i++) {
            tagCounter[i] = 0
        }
    } else {
        return
    }

    let index = tagCounter.slice(0, level + 1) // assign a copy of the index

    // Assign default id
    if (!params.id) {
        params.id = toLowerLine(tagName) + "-" + index.join('-')
    }
    // Register idNames
    env.idNames[params.id]

    let record = {
        tagName: tagName,
        index: index
    }
    env.idNames[params.id] = record
    params.index = index.join(".")
}

function toLowerLine(str) {
    var temp = str.replace(/[A-Z]/g, function (match) {
        return "-" + match.toLowerCase();
    });
    if (temp.slice(0, 1) === '-') {
        temp = temp.slice(1);
    }
    return temp;
};