import { app, BrowserWindow, ipcMain, Menu, shell, desktopCapturer, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';


let win: BrowserWindow | null = null;

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }

});

function createWindow() {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 850,
    height: 750,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      allowRunningInsecureContent: true,
      contextIsolation: true,  // false if you want to run e2e test with Spectron
      preload: path.join(app.getAppPath(), 'dist/assets/preload', 'preload.js'),
      devTools: true
    },
    icon: path.join(app.getAppPath(), 'dist/assets', 'favicon.ico'),
  });

  win.webContents.openDevTools()

  // https://stackoverflow.com/a/58548866/600559
  Menu.setApplicationMenu(null);

  app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

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

      if (sources[i].id.toLowerCase() === 'window:22742420:0') {
        const screenshot = sources[i].thumbnail.toPNG();
        const d = new Date();
        const u = Math.random().toString(36).slice(2) + '_' + Math.random().toString(36).slice(2) + '_' + d.getUTCDate().toString() + d.getUTCMilliseconds().toString();
        // const location = 'E:\\_code\\Midas-Desktop\\src\\assets\\temp\\screenshot_' + u + '.png';
        const location = 'E:\\_code\\tempImages\\' + u + '.png';
        // 'E:\\_code\\Midas-Desktop\\src\\assets\\temp\\screenshot_'
        fs.writeFileSync(location, screenshot);

        if (win) {
          event.sender.send('take-screen-done', { location, screenshot });
        } else {
          console.log('NO WIN takeScreenShot')
        }

      } else {
        console.log('no window found')
      }
    }
  }
  );
})

ipcMain.on('open-link', (event, args) => {
  shell.openExternal(args[0]);
});

// ipcMain.on('set-live', async (event, args) => {

//   let stream = null;
//   let sourceId = 'window:22742420:0';

//   stream = await args[0].mediaDevices.getUserMedia({
//     audio: false,
//     video: {
//       mandatory: {
//         chromeMediaSource: 'desktop',
//         chromeMediaSourceId: sourceId,
//         minWidth: 1280,
//         maxWidth: 1280,
//         minHeight: 720,
//         maxHeight: 720
//       }
//     }
//   })

//   if (win) {
//     event.sender.send('set-live-done', { stream });
//   } else {
//     console.log('NO WIN takeScreenShot')
//   }
// });
