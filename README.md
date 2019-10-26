# RailroadInk-Oct2019
First repo for Railroad Ink development

To get this repo working on a new branch, run the following commands:
npm install

If that doesn't work, try these:
npm install typescript -g
npm install --save-dev webpack webpack-cli ts-loader
npm install --save-dev react react-dom @types/react @type/react-dom
npm install --save-dev html-webpack-plugin

In .vscode folder modify/create these files to enable building from VS Code. Assumes Workspace is set to be /RailroadInk/ folder.
Breakpoints in TS files don't work. Breakpoints in JS files do. Something with sourcemaps not being found because webpack prefixes them.
launch.json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "protocol": "inspector",
            "name": "Electron Main",
            "preLaunchTask": "build",
            "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
            "windows": {
                "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron.cmd"
              },
            "program": "${workspaceFolder}/dist/main.js",
            "outFiles": ["${workspaceFolder}/dist/*.js", "${workspaceFolder}/dist/*.js.map"]
        },
    ]
}

tasks.json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558 
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "label": "build",
            "type": "npm",
            "script": "build"
        }
    ]
}