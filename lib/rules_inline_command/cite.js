const bibtexParse = require('@orcid/bibtex-parse-js');
const fs = require("fs");
const path = require('path');
const { writeInline, writeWarning } = require('../common/html_writer')


function beforeRender(state, env, option){
    if (env.bibPath) {
        // If bib file has not being loaded
        if (!env.bibDict) {
            // Load the file
            env.bibDict = loadBibDict(path.resolve(env.basePath, env.bibPath))
            // If fail loading
            if (!env.bibDict) {
                // Make the object {} so that the render won't load again
                env.bibDict = "bibPath invalid"
                env.bibKeys = []
                return 
            }
        }
    }else{
        env.bibDict = "bibPath not identified"
        return
    }
    let bibDictCited = {}
    for(key of env.citedKeys){
        bibDictCited[key] = env.bibDict[key]
    }
    env.bibDict = bibDictCited
    env.bibKeys = Object.keys(env.bibDict)
}


function render(tokens, idx, _options, env, slf) {
    
    let citingKey = tokens[idx].content

    let existingKey = []
    let missedKeys = []
    for (let key of citingKey) {
        key = key.trim()
        let index = env.citedKeys.indexOf(key)
        // If key hasn't cited yet
        if (index < 0) {
            if (env.bibKeys.indexOf(key) > -1) {
                existingKey.push(key)
            } else {
                missedKeys.push(key)
            }
        } else {
            existingKey.push(key)
        }
    }
    
    let res = ["<CiteLink "]
    if(existingKey.length!=0){
        res.push(":citingKey='")
        res.push(JSON.stringify(existingKey))
        res.push("'")
    }
    if(missedKeys.length!=0){
        res.push(" :missedKeys='")
        res.push(JSON.stringify(missedKeys))
        res.push("'")
    }
    res.push("/>")
    return  res.join("")

}


function tokenize(state, commandInput) {
    token = state.push("inline_command", "cite", 0)
    token.content = commandInput[0].content.slice(1).split(",")
    for (let key of token.content) {
        state.env.citedKeys.push(key.trim())
    }
}


module.exports = {
    render: render,
    tokenize: tokenize,
    matcher: /^@.*$/g,
    beforeRender: beforeRender
}

function getCiteLinkList(idList, bibKeys, citedKeys) {

    let tagList = []
    let missedKeys = []
    for (let id of idList) {
        id = id.trim()
        let tag = citedKeys.indexOf(id)
        // If key hasn't cited yet
        if (tag < 0) {
            if (bibKeys.indexOf(id) > -1) {
                citedKeys.push(id)
                tagList.push(citedKeys.length - 1)
            } else {
                missedKeys.push(id)
            }
        } else {
            tagList.push(tag)
        }
    }


    // Return if only one cite term
    if (tagList.length == 1) {
        return getCiteLinkStr(tagList, citedKeys, missedKeys)
    }

    tagList.sort()

    // Return if only two cite terms
    if (tagList.length == 2) {
        return getCiteLinkStr(tagList, citedKeys, missedKeys)
    }

    // If tagList.length >= 3
    let citeGroups = []

    for (let i = 0; i < tagList.length;) {
        let groupLen = 1
        for (let j = i + 1; j < tagList.length; j++) {
            if (tagList[j] != tagList[j - 1] + 1) break;
            else groupLen += 1
        }
        if (groupLen == 1) {
            citeGroups.push(tagList[i])
            i += 1
            continue
        }
        if (groupLen == 2) {
            citeGroups.push(tagList[i])
            citeGroups.push(tagList[i + 1])
            i += 2
            continue
        }
        // if groupLen >= 3
        citeGroups.push([tagList[i], tagList[i + groupLen - 1]])
        i += groupLen
    }

    return getCiteLinkStr(citeGroups, citedKeys, missedKeys)
}

function getCiteLinkStr(links, citedKeys, missedKeys) {
    let res = []
    for (let link of links) {
        if (!Array.isArray(link)) {
            res.push(writeInline("a", { class: "cite-link", href: "#cite-def-" + citedKeys[link] }, link + 1))
        } else {
            res.push(writeInline("a", { class: "cite-link", href: "#cite-def-" + citedKeys[link[0]] }, [link[0] + 1, link[1] + 1].join("-")))
        }
    }
    if (missedKeys.length > 0) {
        res.push(writeInline("a", { class: "citekey-miss-link", info: missedKeys.join() }, "?"))
    }
    return res.join()
}

function loadBibDict(path) {
    try {
        let bibtexContent = fs.readFileSync(path, 'utf-8')
        let bibList = bibtexParse.toJSON(bibtexContent)
        let bibDict = {}
        for (let term of bibList) {
            bibDict[term.citationKey] = term
        }
        return bibDict
    } catch (error) {
        console.log(error)
        return null
    }
}