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
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    skipTaskbar: true,
    hasShadow: false,
  });

  win.webContents.openDevTools()

  // https://stackoverflow.com/a/58548866/600559
  Menu.setApplicationMenu(null);

  app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

  win.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));

  win.on('closed', () => {
    win = null;
  });

  // win.setIgnoreMouseEvents(true, { forward: true });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, 'normal');
  // win.maximize();
}



ipcMain.on('dev-tools', () => {
  if (win) {
    win.webContents.toggleDevTools();
  }
});

ipcMain.on('take-screen', (event, args) => {
  desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize: { width: 1920, height: 1080 }, fetchWindowIcons: true }).then(sources => {
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


ipcMain.on('get-windows', (event, args) => {
  desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize: { width: 1920, height: 1080 }, fetchWindowIcons: true  }).then(sources => {

    for (let i = 0; i < sources.length; ++i) {
        const screenshot = sources[i].thumbnail.toPNG();
        const d = new Date();
        const u = Math.random().toString(36).slice(2) + '_' + Math.random().toString(36).slice(2) + '_' + d.getUTCDate().toString() + d.getUTCMilliseconds().toString();
        // const location = 'E:\\_code\\Midas-Desktop\\src\\assets\\temp\\screenshot_' + u + '.png';
        // const location = 'E:\\_code\\tempImages\\' + u + '.png';
        const location = 'E:\\_code\\tempImages\\' + u + '.png';
        // 'E:\\_code\\Midas-Desktop\\src\\assets\\temp\\screenshot_'
        sources[i]["thumbPath"] = location;
        fs.writeFileSync(location, screenshot);

    }

    if (win) {
      event.sender.send('get-windows-done', { sources });
    } else {
      console.log('NO WIN takeScreenShot')
    }
  }
  );
})

ipcMain.on('resize-window', (event, args) => {
  if (win) {
    if(win.isFullScreen()) {
      win.setFullScreen(false)
      // win.setIgnoreMouseEvents(true, { forward: true });
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      win.setAlwaysOnTop(true, 'normal');
      // width: 850,
      // height: 750,
      win.setSize(850, 750);
    } else {
      win.setFullScreen(true)
      win.setIgnoreMouseEvents(true, { forward: true });
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      win.setAlwaysOnTop(true, 'normal');
    }

  } else {
    console.log('NO WIN takeScreenShot')
  }
})
