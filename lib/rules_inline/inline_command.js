const { isString } = require("../common/utils");
const parseDict = require("../helpers/parse_dict");
const parseNestableLabel = require("../helpers/parse_nestable_label");
const { tokenize } = require('../rules_inline_command/index')


/*

Command type:
0: [] text
1: {} dict
2: () text
3: error

*/


module.exports = function inlineCommand(state, silent) {

    if (state.src.charCodeAt(state.pos) !== 0x5B/* [ */) { return false; }
    let pos = state.pos
    let max = state.posMax
    let commandInput = []
    while (pos < max) {
        let nextPos = -1
        let command = null
        switch (state.src.charCodeAt(pos)) {
            case 0x5B: { /* [ */
                nextPos = parseNestableLabel(state.src, pos, max, "[", "]")
                if (nextPos > 0) command = { content: state.src.slice(pos + 1, nextPos - 1), type: 0 }
            }
                break
            case 0x7B: { /* { */
                nextPos = parseNestableLabel(state.src, pos, max, "{", "}")
                if (nextPos > 0) {
                    let dict
                    try {
                        dict = parseDict(state.src.slice(pos, nextPos), "json")
                        command = { content: dict, type: 1 }
                    } catch (error) {
                        command = { content: error.message, type: 3 }
                    }
                }
            }
                break
            case 0x28: { /* ( */
                nextPos = parseNestableLabel(state.src, pos, max, "(", ")")
                if (nextPos > 0) command = { content: state.src.slice(pos + 1, nextPos - 1), type: 2 }
            }
                break
            default: {
                break
            }
        }
        if (command) commandInput.push(command)
        else break


        pos = nextPos
    }

    state.pos = pos
    tokenize(state, commandInput)

    return true
}