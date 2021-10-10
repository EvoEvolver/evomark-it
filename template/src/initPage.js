import katex from "katex/dist/katex.mjs";

export default function initPage(pageEnv, vueProvide) {
    /*
    if (import.meta.hot) {
        import.meta.hot.accept((newModule) => {
            console.log('updated')
        })
    }
    if (window.MathJax) {
        //if(typeof MathJax.typesetPromise == "function")
        window.MathJax.config.tex.macros = pageEnv.mathMacros || {}
        //console.log(pageEnv.mathMacros)
        window.MathJax.startup.getComponents()
        setTimeout(() => {
            window.MathJax.typesetPromise()
        }, 10);   // I don't know why we need this setTimeout, but it works

    } else {
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$']],
                macros: pageEnv.mathMacros || {}
            },
            svg: {
                fontCache: 'global'
            }
        };

        (function () {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',//'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
                script.async = true;
            document.head.appendChild(script);
        })();

    }
    */
   
    vueProvide("katexAPI",katex)
    document.title = pageEnv.title || "EvoMark Project"
    return
}