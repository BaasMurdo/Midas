import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';
import { shell, desktopCapturer } from 'electron';
import * as storage from 'electron-json-storage';
const fs = require("fs");

// import * as objectToCsv from 'objects-to-csv'
const ObjectsToCsv = require('objects-to-csv');

let win: BrowserWindow | null = null;

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  win = new BrowserWindow({
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
      preload: path.join(app.getAppPath(), 'dist/assets/preload', 'preload.js'),
      // dev tools for debugging
      devTools: true
    },
    icon: path.join(app.getAppPath(), 'dist/assets', 'favicon.ico'),
  });

  // win.webContents.openDevTools()

  // https://stackoverflow.com/a/58548866/600559
  Menu.setApplicationMenu(null);

  win.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));

  win.on('closed', () => {
    win = null;
  });
}

ipcMain.on('dev-tools', () => {
  if (win) {
    win.webContents.toggleDevTools();
  }
});

ipcMain.on('take-screen', (event, args) => {
  desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize: { width: 1920, height: 1080 } }).then(sources => {
    for (let i = 0; i < sources.length; ++i) {
      console.log('for sources', sources[i])
      if (sources[i].name === 'Entire Screen') {
        const screenshot = sources[i].thumbnail.toPNG();
        const d = new Date();
        const u = Math.random().toString(36).slice(2) + '_' + Math.random().toString(36).slice(2) + '_' + d.getUTCDate().toString() + d.getUTCMilliseconds().toString();
        // const location = 'E:\\_code\\Midas-Desktop\\src\\assets\\temp\\screenshot_' + u + '.png';
        const location = 'E:\\_code\\tempImages\\' + u + '.png';
        // 'E:\\_code\\Midas-Desktop\\src\\assets\\temp\\screenshot_'
        fs.writeFileSync(location, screenshot);

        if (win) {
          event.sender.send('take-screen-done', { location, screenshot });
        }

      }
    }
  }
  );
})

ipcMain.on('open-link', (event, args) => {
  shell.openExternal(args[0]);
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


