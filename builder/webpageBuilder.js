const path = require('path')
const { exec } = require('child_process');

function linkToTemplate(src, templateSrc) {

    var cmd = ['ln -sf', path.resolve(process.cwd(),src,"./.evomark_ir"), path.resolve(process.cwd(),path.join(templateSrc, "src"))].join(" ")

    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Linked to template by",cmd)
        if(stdout) console.log(`stdout: ${stdout}`);
        if(stderr) console.log(`stderr: ${stderr}`);
    })

}

module.exports.linkToTemplate = linkToTemplate

function startDevMode(){
    console.log("Page available on\n"+"http://localhost:"+process.env.evomark_dev_port)
    exec("vite --config ./evomark/template/vite.config.js", (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }
        if(stdout) console.log(`stdout: ${stdout}`);
        if(stderr) console.log(`stderr: ${stderr}`);
    })
}

module.exports.startDevMode = startDevMode