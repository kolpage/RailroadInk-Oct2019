//To run from visual studio code debug window follow these instructions.
//1. Click the 4th icon down on the left side of the screen. It looks like a bug.
//2. Click the Gear icon to the right of the dropdown at the top of the left column of the screen.
//3. This should open launch.json. Replace the text in the file with the following. (Ctrl+K,C comment; Ctrl+K,U uncomment)
// {
//   // Use IntelliSense to learn about possible attributes.
//   // Hover to view descriptions of existing attributes.
//   // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
//   "version": "0.2.0",
//   "configurations": [
//       {
//           "type": "node",
//           "request": "launch",
//           "name": "Electron Main",
//           "runtimeExecutable": "${workspaceFolder}/RailroadInk/node_modules/.bin/electron",
//           "program": "${workspaceFolder}/RailroadInk/main.js"
//       },
//   ]
// }

//4. Modify the "runtimeExecutable" and "program" paths to match you computers folder structure.
//   Mine is something like ~/Documents/Electron/RailroadInk/<repo checked out in here>. In visual studio code Electron is set as my workspace.



const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.on('ready', createWindow)