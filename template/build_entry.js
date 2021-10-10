const fs = require('fs');
const path = require('path');

const iterateFiles = require('node-dir').files;
const src = path.resolve(__dirname, "./components")

async function loadComponents(importComponent, addComponent) {

    iterateFiles(src, function (err, files) {
        if (err) throw err;
        files.forEach(function (filepath) {
            let basename = path.basename(filepath)
            let extname = path.extname(basename)
            let componentName = basename.slice(0, basename.lastIndexOf("."))
            if (extname == ".vue" && (basename[0] != "_")) {
                importComponent.push("import " + componentName + " from \"../components/" + basename + "\"")
                addComponent.push("app.component(\"" + componentName + "\"," + componentName + ")")
            }
        })
    });

}


let importComponent = []
let addComponent = []

loadComponents(importComponent, addComponent)


setTimeout(() => {

    let mainComponents = importComponent.join("\n") + "\nexport function load_modules(app){\n" + addComponent.join("\n") +"\n}"

    let mainSrc =  mainComponents

    fs.writeFileSync(__dirname + ("/src/load_modules.js"), mainSrc)
}, 100)

