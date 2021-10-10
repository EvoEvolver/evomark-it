function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    let res = []
    if(token.nesting == 1){
        if(token.fenceIndex[0] == 0){
            res.push("<ol>")
        }
        res.push("<li>")
    }else{
        res.push("</li>")
        if(token.fenceIndex[0] == token.fenceIndex[1]-1){
            res.push("</ol>")
           
        }
    }
    return res.join("") 
}

module.exports = {
    innerType: 1,
    render: render,
    allowFence: true
}