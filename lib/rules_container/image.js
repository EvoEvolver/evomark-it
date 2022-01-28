const path = require("path");
const { writeClosed } = require("../common/html_writer");
const { getImageClass } = require("./image-helper")

function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    if (!token.attrs.src)
        return ""
    let res = []
    let attrs = { src: path.join(env.outputPathPrefix, token.attrs.src), class: getImageClass(token.attrs.type) }
    let styleAttrs = { width: token.attrs.width, height: token.attrs.height }
    let style = ""
    if (styleAttrs.width)
        style += "width:" + styleAttrs.width + ";"
    if (styleAttrs.height)
        style += "height:" + styleAttrs.height + ";"
    if (style)
        attrs.style = style
    if (token.attrs.src)
        res.push(writeClosed("img", attrs))
    return res.join("")

}

module.exports = {
    innerType: 0, // one line
    render: render
}