const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Garder une référence globale de la fenêtre
let mainWindow;

function createWindow() {
  // Créer la fenêtre du navigateur
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: false
    },
    show: false
  });

  // Charger la page des incidents
  mainWindow.loadFile(path.join(__dirname, '../incidents/incidents.html'));

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (!app.isPackaged) { mainWindow.webContents.openDevTools(); }
  });

  // Gérer la fermeture
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Quand Electron est prêt
ipcMain.on('app:is-packaged', (event) => {
  event.returnValue = app.isPackaged;
});

app.whenReady().then(createWindow);

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});