const { writeOpen, writeEnd } = require("../common/html_writer")


function writeSlideOpen(tokens, idx, env, res) {
    let token = tokens[idx]
    let attrs = { type: "default"}
    if (token.tag == 'Slide' || token.attrs.type)
        attrs.type = token.attrs.type

    let indicesToPlay = []
    let pos = idx + 1
    while (true) {
        let currToken = tokens[pos]
        if (currToken.tag == "Slide" || currToken.tag == "SlidesBox")
            break
        if (currToken.attrs && currToken.attrs.clk === "") {
            let index = indicesToPlay.length + 1
            indicesToPlay.push(index)
            currToken.attrs.index = index
        }
        pos++
    }
    res.push(writeOpen("VueperSlide"))
    res.push(writeOpen("SlidesContent", attrs))
}

module.exports.writeSlideOpen = writeSlideOpen

function writeSlideEnd(res) {
    res.push(writeEnd("SlidesContent"))
    res.push(writeEnd("VueperSlide"))
}

module.exports.writeSlideEnd = writeSlideEnd