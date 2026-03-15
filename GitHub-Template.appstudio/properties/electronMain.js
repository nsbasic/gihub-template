/* globals
  require:false
  process:false
  electronDevTools:false
*/

// eslint-disable-next-line
const { app, BrowserWindow, Menu } = require('electron');

// eslint-disable-next-line
const openDevTools = {electronDevTools};

let mainWindow;

// eslint-disable-next-line
function createWindow() {
  'use strict';

  // see https://electronjs.org/docs/api/browser-window for all options
  mainWindow = new BrowserWindow({
    width: (openDevTools) ? 768 + 512 : 768,
    height: 1004,
    title: '{title}',
    webPreferences: { nodeIntegration: true, contextIsolation: false, enableRemoteModule: true, },
  });

  // set headers to enable SharedArrayBuffer for SQLite WASM
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    details.responseHeaders = details.responseHeaders || {};
    details.responseHeaders['Cross-Origin-Opener-Policy'] = ['same-origin'];
    details.responseHeaders['Cross-Origin-Embedder-Policy'] = ['require-corp'];
    callback({ responseHeaders: details.responseHeaders });
  });

  mainWindow.loadFile('index.html');

  if (openDevTools) mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  'use strict';

  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  'use strict';

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
