const { writeOpen, writeEnd, writeInlineWarning } = require("../common/html_writer");
const { loadDict } = require("../helpers/load_dict");

module.exports = {
    render(tokens, idx, _options, env, slf) {
        if (tokens[idx].nesting === 1) {
            let attrs = tokens[idx].attrs
            let credit_index = env.creditInfo.length
            let credit_info = {}
            try {
                if(attrs.src){
                    let info_in_file = loadDict(env.basePath,{src:attrs.src})
                    Object.assign(credit_info,info_in_file) 
                }
            } catch (error) {
                return writeInlineWarning("Fail to load the credit file")+writeOpen("CreditBox")
            }
            Object.assign(credit_info,attrs)
            let id = credit_index
            credit_info.id = id
            env.creditInfo.push(credit_info)
            return writeOpen("CreditBox",{id:id})
        } else {
            return writeEnd("CreditBox");
        }
    },
    innerType: 1,
    beforeRender(state, env, option) {
        env.creditInfo = []
    }
}