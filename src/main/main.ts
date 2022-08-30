/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Notification, powerMonitor, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { generateMessage } from './notificationMessages';
import Store from 'electron-store';
import { schema, SchemaType } from './userSchema';



class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const store = new Store<SchemaType>(schema);

/**
 * Event listener to get key from store (user preferences)
 */
ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});

/**
 * Event listener to store key, value pair into store for persistant user preferences
 */
ipcMain.on('electron-store-set', async (_event, key, val) => {
  store.set(key, val);
});

let notification: Notification | null = null;

/**
 * Creates the notification
 * 
 * @param msg Notification message
 */
const createNotification = (msg: string) => {
  if (process.platform !== 'darwin') {
    notification = new Notification({
      title: "Posture Up!",
      body: msg
    });
  } else {
    notification = new Notification({
      title: "Posture Up!",
      body: msg,
      sound: '~/Library/Sounds',
      actions: [{ type: "button", text: "Yes" }, { type: "button", text: "No" }]
    });
  }

}
/**
 * Displays notification to user
 * 
 * Creates event listener for user input (yes/no)
 * 
 * @param msg - Notifcication Message
 * 
 */
const showNotification = (msg: string) => {
  notification?.show()
  notification?.addListener('action', (_event, index) => {
    if (!mainWindow?.isFocused()) {
      mainWindow?.blur();
    }
    mainWindow?.webContents.send("notification-response", index === 0, msg)
    notification?.close()
  })
}

/**
 * Event listener to create notification from renderer interval
 * 
 * Does not notify if system is locked
 */
ipcMain.handle('notify', () => {
  if (powerMonitor.getSystemIdleState(10) !== 'locked') {
    const msg = generateMessage();
    createNotification(msg)
    showNotification(msg);
    return msg;
  }
  return;
})

/**
 * Event listener to close notification from device
 * 
 */
ipcMain.on('closeNotification', () => {
  notification?.close();
})


/**
 * Below constains Electron-React Boilerplate Code
 * 
 */

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// if (isDebug) {
//   require('electron-debug')();
// }

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};


const createWindow = async () => {
  // if (isDebug) {
  //   await installExtensions();
  // }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 900,
    height: 750,
    minWidth: 400,
    minHeight: 650,
    icon: getAssetPath('SpineColorIcon.png'),
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};


app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
