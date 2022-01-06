const { writeOpen, writeInline, writeEnd } = require("../common/html_writer")
const { writeSlideOpen, writeSlideEnd } = require("../rules_command/slide_helper")

function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    let res = []
    if (token.nesting === 1) {
        res.push(writeOpen("SlidesBox",{ref:token.attrs.id}))
        let nextToken = tokens[idx + 1]
    }
    else {
        writeSlideEnd(res)
        res.push(writeEnd("SlidesBox"))
    }
    return res.join("")
}

function beforeRender(state, env, option) {
    env.useSlides = true
}

module.exports = {
    innerType: 1,
    defaultLabel: true,
    tagName: "Slides",
    render: render,
    beforeRender: beforeRender
}