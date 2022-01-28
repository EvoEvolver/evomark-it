const { writeOpen, writeEnd } = require("../../common/html_writer")
const { writeSlideEnd } = require("../../rules_command/slide_helper")

function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]

    env.slideSection = null

    let res = []
    if (token.nesting === 1) {
        res.push(writeOpen("SlidesBox", { id: token.attrs.id, voiceLang: token.attrs.voiceLang }))
        env.slidesMode = true
    }
    else {
        writeSlideEnd(res)
        res.push(writeEnd("SlidesBox"))
        env.slidesMode = false
    }
    return res.join("")
}

function beforeTokenize(state, params){
    state.env.useSlides = true
    return ""
}

function beforeRender(state, env, option) {
    env.slidesMode = false
}

module.exports = {
    innerType: 1,
    defaultLabel: true,
    tagName: "Presentation",
    render: render,
    beforeRender: beforeRender,
    beforeTokenize: beforeTokenize
}