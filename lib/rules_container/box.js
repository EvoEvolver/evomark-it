const { writeOpen, writeEnd } = require("../common/html_writer");

module.exports = {
    render: function (tokens, idx, _options, env, slf) {
        if (tokens[idx].nesting === 1) {
            // opening tag
            if (tokens[idx].attrs.style)
                return writeOpen("div", { style: tokens[idx].attrs.style })
            else
                return writeOpen("div")

        } else {
            // closing tag
            return writeEnd("div");
        }
    },
    innerType: 1
}