'use strict';

module.exports.getTokenizer = function (rules) {

    const tokenizeInlineCommand = function (state, commandInput) {
        let commandHead = commandInput[0].content
        let commandRule = null
        for (let rule of Object.values(rules)) {
            if (rule.matcher && commandHead.match(rule.matcher)) {
                commandRule = rule
            }
        }

        if (!commandRule) {
            commandRule = rules.link
        }

        commandRule.tokenize(state, commandInput)

    }

    return tokenizeInlineCommand
}