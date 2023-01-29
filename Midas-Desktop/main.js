"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var electron_2 = require("electron");
var fs = require("fs");
// import * as objectToCsv from 'objects-to-csv'
var ObjectsToCsv = require('objects-to-csv');
var win = null;
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1240,
        height: 740,
        minWidth: 1240,
        minHeight: 740,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            // Set to true so that electron-json-storage can use directories.
            enableRemoteModule: true,
            preload: path.join(electron_1.app.getAppPath(), 'dist/assets/preload', 'preload.js'),
            // dev tools for debugging
            devTools: true
        },
        icon: path.join(electron_1.app.getAppPath(), 'dist/assets', 'favicon.ico'),
    });
    // win.webContents.openDevTools()
    // https://stackoverflow.com/a/58548866/600559
    electron_1.Menu.setApplicationMenu(null);
    win.loadFile(path.join(electron_1.app.getAppPath(), 'dist', 'index.html'));
    win.on('closed', function () {
        win = null;
    });
}
electron_1.ipcMain.on('dev-tools', function () {
    if (win) {
        win.webContents.toggleDevTools();
    }
});
electron_1.ipcMain.on('take-screen', function (event, args) {
    electron_2.desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize: { width: 1920, height: 1080 } }).then(function (sources) {
        for (var i = 0; i < sources.length; ++i) {
            console.log('for sources', sources[i]);
            if (sources[i].name === 'Entire Screen') {
                var screenshot = sources[i].thumbnail.toPNG();
                var d = new Date();
                var u = Math.random().toString(36).slice(2) + '_' + Math.random().toString(36).slice(2) + '_' + d.getUTCDate().toString() + d.getUTCMilliseconds().toString();
                // const location = 'E:\\_code\\Midas-Desktop\\src\\assets\\temp\\screenshot_' + u + '.png';
                var location_1 = 'E:\\_code\\tempImages\\' + u + '.png';
                // 'E:\\_code\\Midas-Desktop\\src\\assets\\temp\\screenshot_'
                fs.writeFileSync(location_1, screenshot);
                if (win) {
                    event.sender.send('take-screen-done', { location: location_1, screenshot: screenshot });
                }
            }
        }
    });
});
electron_1.ipcMain.on('open-link', function (event, args) {
    electron_2.shell.openExternal(args[0]);
});
// ipcMain.on('load-buyers', (event, args) => {
//   // Path will be "\AppData\Roaming\midas-desktop\storage"
//   const buyerKey = 'buyers';
//   storage.has(buyerKey, function (error, hasKey) {
//     if (error) throw error;
//     if (!hasKey) {
//       console.log(`didn't have key ${buyerKey}`);
//       storage.set(buyerKey, {
//         buyers: [{
//           name: 'Michal',
//           assignedLetters: ['M']
//         }, {
//           name: 'Henze',
//           assignedLetters: ['H']
//         }, {
//           name: 'Christo',
//           assignedLetters: ['C']
//         }]
//       }, function (error) {
//         if (error) throw error;
//       });
//     }
//     storage.get(buyerKey, function (error, data) {
//       if (error) throw error;
//       console.log(`has key ${buyerKey}`);
//       if (win) {
//         event.sender.send('load-buyers-done', data);
//       }
//     });
//   });
// });
// ipcMain.on('set-buyers', (event, args) => {
//   // Path will be "\AppData\Roaming\midas-desktop\storage"
//   const buyerKey = 'buyers';
//   storage.set(buyerKey, {
//     buyers: args[0]
//   }, function (error) {
//     if (error) throw error;
//   });
// });
// ipcMain.on('create-csv', (event, args) => {
//   const csv = new ObjectsToCsv(args[1]);
//   // Save to file:
//   csv.toDisk(args[0]);
// });
//# sourceMappingURL=main.js.map