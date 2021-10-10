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
                importComponent.push("import " + componentName + " from \"./components/" + basename + "\"")
                addComponent.push("app.component(\"" + componentName + "\"," + componentName + ")")
            }
        })
    });

}


let importComponent = []
let addComponent = []
loadComponents(importComponent, addComponent)


let isSSR = false

let mainHead = `
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

`

let mainHeadSSR = `
const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')
import App from './App.vue'
const app = createSSRApp(App)

`

let mainEnd = `

app.mount('#app')
`


let mainEndSSR = `

const appContent = await renderToString(app)
console.log(appContent)
`

setTimeout(() => {



    let mainComponents = importComponent.join("\n") + "\n" + addComponent.join("\n")

    let mainSrc = (isSSR ? mainHeadSSR : mainHead) + mainComponents + (isSSR ? mainEndSSR : mainEnd)

    fs.writeFileSync(__dirname + (isSSR ? "/src/main_ssr.js" : "/src/main.js"), mainSrc)
}, 100)

