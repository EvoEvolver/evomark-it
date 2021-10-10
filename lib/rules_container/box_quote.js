const { writeOpen, writeEnd } = require("../common/html_writer");

module.exports = {
    render: function (tokens, idx, _options, env, slf) {
        if (tokens[idx].nesting === 1) {
            // opening tag
            return writeOpen("div", { class: "box-quote" })

        } else {
            // closing tag
            return writeEnd("div");
        }
    },
    innerType: 1
}