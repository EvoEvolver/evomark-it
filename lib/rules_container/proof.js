const { writeOpen, writeInline } = require("../common/html_writer")

module.exports =  {
    innerType : 1,
    render: function(tokens, idx, _options, env, slf) {
        let token = tokens[idx]
        if (token.nesting === 1) {
            // opening tag
            let attrs = token.attrs
            let res = [writeOpen('div', { class: "proof-box" })]
            if (attrs.title)
                res.push(writeInline("span", { class: "remark-title" }, attrs.title))
            return res.join("")
        } else {
            // closing tag
            return '</div>\n';
        }
    },
    
}