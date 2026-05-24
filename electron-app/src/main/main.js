const { app, BrowserWindow } = require('electron');
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
      enableRemoteModule: false
    },
    show: false
  });

  // Charger la page des incidents
  mainWindow.loadFile(path.join(__dirname, '../incidents/incidents.html'));

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.openDevTools(); // Ouvrir les DevTools pour le développement
  });

  // Gérer la fermeture
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Quand Electron est prêt
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