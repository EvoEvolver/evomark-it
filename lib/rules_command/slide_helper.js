const { writeOpen, writeEnd } = require("../common/html_writer")


function writeSlideOpen(tokens, idx, env, res) {
    let token = tokens[idx]
    let attrs = { type: "default"}
    if (token.tag == 'Slide' || token.attrs.type)
        attrs.type = token.attrs.type
    if(token.attrs.title)
        attrs.title = token.attrs.title
    if(token.attrs.section){
        attrs.section = token.attrs.section
        env.slideSection = attrs.section
    } else if(env.slideSection){
        attrs.section = env.slideSection
    }
    let pos = idx + 1
    while (true) {
        let currToken = tokens[pos]
        if (currToken.tag == "Slide" || currToken.tag == "SlidesBox")
            break
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