const { writeEnd, writeOpen } = require('../common/html_writer');
const { loadDict } = require('../helpers/load_dict');
const parseDict = require('../helpers/parse_dict');
const Token = require('../token');
const { writeSlideEnd, writeSlideOpen } = require('./slide_helper');

function beforeTokenize(state, params, content) {

    try {
        let config
        if (params.src) {
            config = loadDict(state.env.basePath, params, "toml")
        } else {
            config = parseDict(content, params.lang || "toml")
        }
        state.env.slideMode = true
    } catch (error) {
        let token = state.push('parse_warning', 'div', 0);
        token.block = true;
        token.content = error.message;
    }

}

function beforeRender(state, env, option) {
    if (!env.useSlides)
        return
    let slidesRanges = []
    let tokens = state.tokens
    let open = -1
    let end = -1
    let inSlidesBox = false
    let insertList = [[], []]

    // The following loop find all the ranges of single slides
    for (let pos = 0; pos < tokens.length; pos++) {
        if (tokens[pos].tag == "SlidesBox") {
            if (!inSlidesBox) {
                // Find a new slide box
                open = pos
                inSlidesBox = true
                let nextToken = tokens[pos + 1]
                if (nextToken.tag != 'Slide' || nextToken.type != 'command') {
                    insertList[1].push(new Token("command", "Slide", 0))
                    insertList[0].push(pos + 1)
                }
            } else {
                end = pos
                inSlidesBox = false
                slidesRanges.push([open, end])
            }
        }
    }
    // This loop find where to insert slides control tags
    for (let slideRange of slidesRanges) {
        makeSlideInsertList(insertList, slideRange, tokens, env)
    }

    // This will insert the slides control tags, without process the clk attrs
    let insIndices = insertList[0].map((value, index) => value + index)
    let insContent = insertList[1]
    let modifiedTokens = Array(tokens.length + insertList[0].length)
    for (let i = 0; i < insIndices.length; i++) {
        modifiedTokens[insIndices[i]] = insContent[i]
    }
    let pos = 0
    for (let i = 0; i < insIndices.length; i++) {
        for (; pos + i < insIndices[i]; pos++) {
            modifiedTokens[pos + i] = tokens[pos]
        }
    }
    for (; pos < tokens.length; pos++) {
        modifiedTokens[pos + insIndices.length] = tokens[pos]
    }
    state.tokens = modifiedTokens

    // Post-process the clk attrs
    processClk(state.tokens, env)
}


function makeSlideInsertList(insertList, range, tokens, env) {

    for (let pos = range[0] + 1; pos < range[1]; pos++) {

        if (tokens[pos].attrs && typeof tokens[pos].attrs.clk === "string") {
            let token = tokens[pos]
            insertList[0].push(pos)
            let openToken = new Token("container_open", "SlidesControl", 1)
            openToken.attrs = { clk: tokens[pos].attrs.clk }
            insertList[1].push(openToken)
            if (token.nesting == 0) {
                insertList[0].push(pos + 1)
                insertList[1].push(new Token("container_close", "SlidesControl", -1))
                continue
            }
            let findClose = false
            for (; pos < range[1]; pos++) {
                if (tokens[pos] == token.tokenMap) {
                    insertList[0].push(pos + 1)
                    insertList[1].push(new Token("container_close", "SlidesControl", -1))
                    findClose = true
                    break
                }
            }
            if (!findClose) {
                console.warn("SlidesControl not closed!")
            }
        }
    }
}


function processClk(tokens, env) {
    let inSlide = false
    let playCount = 1
    let lastClk = "1"
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].tag == "Slide") {
            inSlide = true
            playCount = 1
            continue
        }
        if (!inSlide) { continue }

        if (tokens[i].tag == "SlidesBox" && tokens.nesting == -1) {
            inSlide = false
            continue
        }
        let token = tokens[i]
        if (token.tag != "SlidesControl" || token.nesting != 1) {
            continue
        }
        let clk = token.attrs.clk
        if (clk[0] === "#") {
            token.attrs.clkIn = clk.slice(1)
            lastClk = token.attrs.clkIn
            continue
        }
        if (clk === "with") {
            token.attrs.clkIn = lastClk
            continue
        }
        if (clk === "") {
            token.attrs.clkIn = String(playCount)
            lastClk = token.attrs.clkIn
            playCount++
            continue
        }
        // default
        token.attrs.clkIn = String(clk)
    }

}


function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    let lastToken = tokens[idx - 1]
    let res = []
    let slideClass = token.attrs.type
    if (lastToken.type == 'container_open' && lastToken.tag == 'SlidesBox') {
        writeSlideOpen(tokens, idx, env, res)
    }
    else {
        writeSlideEnd(res)
        writeSlideOpen(tokens, idx, env, res)
    }
    return res.join("")
}

module.exports = {
    beforeRender: beforeRender,
    beforeTokenize: beforeTokenize,
    render: render
}