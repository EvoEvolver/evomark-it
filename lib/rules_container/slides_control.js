const { writeOpen, writeEnd } = require("../common/html_writer");

module.exports = {
    render: function (tokens, idx, _options, env, slf) {

        if (tokens[idx].nesting === 1) {
            // opening tag
            return writeOpen("SlidesControl", { ":clkIn": tokens[idx].attrs.clkIn })

        } else {
            // closing tag
            return writeEnd("SlidesControl");
        }
    },
    innerType: 0
}