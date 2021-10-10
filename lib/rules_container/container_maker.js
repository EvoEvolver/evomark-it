module.exports.simpleOneLineRule = function (componentName) {
    return {
        render: () => { return "<" + componentName + "/>" },
        innerType: 0,
    }
}

module.exports.compositeOneLine = function (...oneLines) {
    function render(tokens, idx, _options, env, slf) {
        let res = []
        for (let item of oneLines) {
            res.push(item.render(tokens, idx, _options, env, slf))
        }
        return res.join("\n")
    }
    return {
        innerType: 0,
        beforeTokenize: null,
        render: render
    }
}