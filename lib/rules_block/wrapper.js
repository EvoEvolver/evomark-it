const { parseTagNameAttrs } = require("../helpers/parse_tag_attrs")
const { tokenize: tokenizeContainer } = require("../rules_container")

const marker_container = "="
const marker_command = "-"
const min_markers = 3
const marker_char1 = marker_container.charCodeAt(0)
const marker_char2 = marker_command.charCodeAt(0)
const fence_str = "~"

const marker_starter = ">"
const marker_closer = "|"


module.exports = function getWrapperParser(tokenizeContainer, tokenizeCommand) {
    function parseWrapper(state, startLine, endLine, silent) {
        var pos, currentLine, marker_count, markup,
            start = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];
        var auto_closed = false

        // Check out the first character quickly,
        // this should filter out most of non-spaces
        //
        var opener_char = state.src.charCodeAt(start)
        if ((marker_char1 !== opener_char) && (marker_char2 !== opener_char)) { return false; }
        var opener_str = String.fromCharCode(opener_char)

        // Check out the rest of the marker string
        //
        for (pos = start + 1; pos <= max; pos++) {
            if (opener_str !== state.src[pos]) {
                break;
            }
        }

        marker_count = pos - start;
        if (marker_count < min_markers) { return false; }

        markup = state.src.slice(start, pos);

        let hasStarterMark = false
        if (state.src[pos] == marker_closer) {
            return false;
        }
        else if (state.src[pos] == marker_starter) {
            hasStarterMark = true
            pos++
        }

        let afterMarkup = state.src.slice(pos, max).trim()
        let afterLen = afterMarkup.length
        // Check single line container
        var single_line = true
        var pos1 = 0
        for (; pos1 < markup.length; pos1++) {
            if (markup[markup.length - 1 - pos1] !== afterMarkup[afterLen - pos1 - 1]) {
                single_line = false
                break;
            }
        }
        if (single_line) {
            afterMarkup = afterMarkup.slice(0, afterLen - pos1).trim()
        }

        let tag_error = null
        let tagName, attrs
        try {
            let tagNameAttrs = parseTagNameAttrs(afterMarkup)
            tagName = tagNameAttrs.tagName
            attrs = tagNameAttrs.attrs
        } catch (error) {
            tag_error = error.message
        }

        // Since start is found, we can report success here in validation mode
        //
        if (silent) { return true; }

        // Search for the end of the block
        //
        currentLine = startLine;

        let fenceLines = []
        let nestingLevel = hasStarterMark ? 1 : 0
        if (!single_line) {
            for (; ;) {
                currentLine++;
                // unclosed block should be auto-closed by end of document.
                // also block seems to be auto-closed by end of parent
                if (currentLine >= endLine) {
                    break;
                }

                start = state.bMarks[currentLine] + state.tShift[currentLine];
                max = state.eMarks[currentLine];

                // non-empty line with negative indent should stop the list:
                // - ```
                //  test
                if (start < max && state.sCount[currentLine] < state.blkIndent) {
                    break;
                }

                let isInnerFence = false
                let counting_str = opener_str
                let line_open_str = state.src[start]

                if (line_open_str !== opener_str) {
                    if (line_open_str !== fence_str)
                        continue;
                    else {
                        isInnerFence = true
                        counting_str = fence_str
                    }
                }

                // closing fence should be indented less than 4 spaces
                if (state.sCount[currentLine] - state.blkIndent >= 4) {
                    continue;
                }

                // count markers
                for (pos = start + 1; pos <= max; pos++) {
                    if (counting_str !== state.src[pos]) {
                        break;
                    }
                }

                // closing code fence must be at least as long as the opening one
                if (pos - start < marker_count) { continue; }

                if (!isInnerFence) {
                    if (state.src[pos] == marker_starter) {
                        nestingLevel++
                        if (!hasStarterMark)
                            continue
                    } else if (state.src[pos] == marker_closer) {
                        nestingLevel--
                        pos++
                        if (!hasStarterMark)
                            continue
                    }
                }


                // make sure tail has spaces only
                pos = state.skipSpaces(pos);

                if (pos < max) { continue; }

                if (!isInnerFence) {
                    // end found!
                    if ((!hasStarterMark) || nestingLevel == 0) {
                        auto_closed = true;
                        break;
                    }
                } else {
                    // fence found!
                    fenceLines.push(currentLine)
                    continue
                }
            }
        } else {
            auto_closed = true
        }
        if (fenceLines.length > 0)
            //console.log(fenceLines)

            if (tag_error) {
                let token = state.push('parse_warning', 'div', 0);
                token.block = true;
                token.content = "Fail to resolve parameters: \"" + tag_error + "\"";
                token.map = [startLine, currentLine];
                state.line = currentLine + 1
                return true
            }

        if (!auto_closed) {
            let token = state.push('parse_warning', 'div', 0);
            token.block = true;
            token.content = "Container not closed";
            token.map = [startLine, currentLine];
            state.line = currentLine + 1
            return true
        }

        if (opener_str === marker_container) {
            tokenizeContainer(state, tagName, attrs, startLine, currentLine, fenceLines)
            return true;
        }
        else if (opener_str === marker_command) {
            tokenizeCommand(state, tagName, attrs, startLine, currentLine, fenceLines)
            return true;
        }

    }
    return parseWrapper
}