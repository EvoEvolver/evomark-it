const { writeOpen, writeClosed } = require("../common/html_writer");
const path = require("path");

function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    if (token.nesting === 1) {
        let res = []
        res.push(writeOpen('FigureBox', { id: token.attrs.id, index: token.attrs.index, title: token.attrs.title}))
        res.push("<template v-slot:img>")
        if(token.attrs.src)
            res.push(writeClosed("img",{src:path.join(env.outputPathPrefix, token.attrs.src),alt:token.attrs.title}))
        res.push("</template>")
        return res.join("")
    } else {
        // closing tag
        return '</FigureBox>';
    }
}

module.exports = {
    innerType: 4, // Parse paragraphs
    beforeTokenize: null,//getLabeller("Figure"),
    render: render,
    defaultLabel: true,
    tagName: "Figure"
}