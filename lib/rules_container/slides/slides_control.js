const { writeOpen, writeEnd } = require("../../common/html_writer");

module.exports = {
    render: function (tokens, idx, _options, env, slf) {

        if (tokens[idx].nesting === 1) {
            // opening tag
            let attr = { ":clkIn": tokens[idx].attrs.clkIn }
            if(tokens[idx].attrs.autoIn){
                attr[":autoIn"] = tokens[idx].attrs.autoIn
            }
            return writeOpen("SlidesControl", attr)

        } else {
            // closing tag
            return writeEnd("SlidesControl");
        }
    },
    innerType: 0
}