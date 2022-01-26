const { writeWarning } = require('../common/html_writer');
const { loadDict } = require('../helpers/load_dict');
const parseDict = require('../helpers/parse_dict');
const Token = require('../token');
const { writeSlideEnd, writeSlideOpen } = require('./slide_helper');

function beforeTokenize(state, params, content) {
        state.env.slideMode = true
}

function beforeRender(state, env, option) {
    if (!env.useSlides)
        return
    let slidesRanges = []
    let tokens = state.tokens
    let open = -1
    let end = -1
    let inSlidesBox = false
    let insertList = []

    // The following loop find all the ranges of single slides
    for (let pos = 0; pos < tokens.length; pos++) {
        if (tokens[pos].tag == "SlidesBox") {
            if (!inSlidesBox) {
                // Find a new slide box
                open = pos
                inSlidesBox = true
                let nextToken = tokens[pos + 1]
                if (nextToken.tag != 'Slide' || nextToken.type != 'command') {
                    insertList.push([pos + 1,new Token("command", "Slide", 0)])
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

    insertList.sort((ins1,ins2)=>ins1[0]-ins2[0])
    // This will insert the slides control tags, without process the clk attrs
    let insIndices = insertList.map((ins, index) => ins[0] + index)
    let insContent = insertList.map((ins, index) => ins[1])
    let modifiedTokens = Array(tokens.length + insIndices.length)
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
            let openToken = new Token("container_open", "SlidesControl", 1)
            openToken.attrs = { clk: tokens[pos].attrs.clk }
            insertList.push([pos,openToken])
            if (token.nesting == 0) {
                insertList.push([pos + 1,new Token("container_close", "SlidesControl", -1)])
                continue
            }
            let findClose = false
            for (; pos < range[1]; pos++) {
                if (tokens[pos] == token.tokenMap) {
                    insertList.push([pos + 1,new Token("container_close", "SlidesControl", -1)])
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
    let thenDict = {}
    for (let i in tokens) {
        if (tokens[i].tag == "Slide") {
            thenDict = {}
            inSlide = true
            playCount = 0
            lastClk = "1"
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
        if (clk === "then") {
            token.attrs.clkIn = lastClk
            thenDict[lastClk] = thenDict[lastClk] ? thenDict[lastClk] + 1 : 1
            token.attrs.autoIn = String(thenDict[lastClk])
            continue
        }
        if (clk === "") {
            playCount++
            token.attrs.clkIn = String(playCount)
            lastClk = token.attrs.clkIn
            continue
        }
        // default
        token.attrs.clkIn = String(clk)
    }

}


function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    if(!env.slidesMode){
        return writeWarning("Slides command can only be used in SlidesBox container")
    }
    let res = []
    let config
    try {
        config = parseDict(token.content, token.attrs.lang || "toml")
    }catch(error){
        res.push(writeWarning(error.message))
    }
    Object.assign(token.attrs, config)
    let lastToken = tokens[idx - 1]
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