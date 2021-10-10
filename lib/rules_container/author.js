const { writeWarning } = require("../common/html_writer");

function beforeRender(state, env, option) {
    if (!env.author) {
        return
    }
    if (!env.affils) {
        env.affils = {}
    }
    if (!env.authorNotes) {
        env.authorNotes = {}
    }
    if (typeof env.author == String) {
        env.author = [{ givenName: env.author }]
    }
    if (!Array.isArray(env.author)) env.author = [env.author]

    let affilIndices = preProcessNoteDict(env.author, env.affils, "affil", true)
    let noteIndices = preProcessNoteDict(env.author, env.authorNotes, "note", false)
    env.authorBoxRecord = { affilIndices: affilIndices, noteIndices: noteIndices }
}

function render(tokens, idx, _options, env, slf) {
    if (!env.author) {
        return writeWarning("No author specified")
    }
    return "<author-box></author-box>"
}

function preProcessNoteDict(objects, noteDict, attrName, mergeSame) {
    let usedNote = []
    let noteIndices = {}
    for (let obj of objects) {
        let notes = obj[attrName]
        if (!notes) continue;
        if (!Array.isArray(notes)) {
            obj[attrName] = [notes]
            notes = obj[attrName]
        }
        for (let i in notes) {
            let note = notes[i]
            // If this note is not registered
            if (!noteDict[note]) {
                // Find whether a value in the noteDict match the affil string
                let existingKey = null
                if (mergeSame) {
                    existingKey = getKeyByValue(noteDict, note)
                    if (existingKey) {
                        notes[i] = existingKey
                        note = existingKey
                    }
                }
                if ((!existingKey) || (!mergeSame)) {
                    let newKey = "not-registered-" + Object.keys(noteDict).length
                    noteDict[newKey] = note
                    notes[i] = newKey
                    note = newKey
                }
            }
            let index = usedNote.indexOf(note)
            if (index < 0) {
                usedNote.push(note)
                noteIndices[note] = usedNote.length
            }
        }
    }
    return noteIndices
}



function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

module.exports = {
    innerType: 0,
    beforeTokenize: null,
    render: render,
    beforeRender: beforeRender
}