
const { writeClosed, writeElement, writeOpen, writeEnd } = require('../lib/renderer');
const path = require('path');
const mb = new require('../lib/index')()
const fs = require("fs");
const { createOutputPath } = require('./helper');

module.exports = function loadMarkboost(filepath, basePath, outputBase) {

    outputPath = createOutputPath(filepath, basePath, outputBase, "vue")

    env = { basePath: basePath, outputPathPrefix: "/" }
    var result = mb.render(fs.readFileSync(filepath, "utf-8"), env);
    var html = ["<template>", result, "</template>"]
    html = html.concat(["<script setup>\n", 'import { provide } from "vue";\n', " let pageEnv=", JSON.stringify(env), '\nprovide("pageEnv",pageEnv);\n','import initPage from "../initPage"\n',
    "initPage(pageEnv,provide)","\n</script>"])

    fs.writeFileSync(outputPath, html.join(""))
}

function renderHeader(env) {
    let res = ["<header>"]
    res.push(writeOpen("div", { }))
    res.push(writeElement("span", null, env.project))
    //res.push(writeElement("span", { class: "right" }, env.title))
    res.push(writeEnd("div"))
    res.push("</header>")
    return res.join("")
}

function renderMathJaxHead(env) {
    let rendered = ["<script>", "MathJax = {"]
    rendered.push("tex: {inlineMath: [['$', '$']],")
    rendered.push(renderMathJaxMacroConfig(env))
    rendered.push("},")
    rendered.push("svg: {fontCache: 'global'},")
    rendered.push("};</script>")
    return rendered.join("")
}

function renderMathJaxMacroConfig(env) {

    if (!env.mathMacros) return ""
    let res = ["macros:{"]

    for (let key in env.mathMacros) {
        res.push(key + ":")
        res.push(JSON.stringify(env.mathMacros[key]))
        res.push(",\n")
    }

    res.push("}")
    return res.join("")
}