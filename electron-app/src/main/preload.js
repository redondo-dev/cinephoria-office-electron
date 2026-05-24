const { contextBridge, ipcRenderer } = require('electron');

// Exposition sécurisée des APIs au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Informations système
    platform: process.platform,
    versions: process.versions,
    
    // Communication avec le main process
    onMenuNewIncident: (callback) => ipcRenderer.on('menu-new-incident', callback),
    onMenuExportIncidents: (callback) => ipcRenderer.on('menu-export-incidents', callback),
    
    // Méthodes pour communiquer avec le main process
    showSaveDialog: (options) => ipcRenderer.invoke('dialog:showSaveDialog', options),
    showMessageBox: (options) => ipcRenderer.invoke('dialog:showMessageBox', options),
    
    // Gestion des fichiers
    saveFile: (content, filename) => ipcRenderer.invoke('file:save', content, filename),
    
    // Remove listeners (nettoyage)
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Exposition sécurisée de Node.js APIs si nécessaire
contextBridge.exposeInMainWorld('nodeAPI', {
    // Exemple d'exposition d'APIs Node.js sécurisées
    path: {
        join: (...paths) => {
            const path = require('path');
            return path.join(...paths);
        },
        basename: (filepath) => {
            const path = require('path');
            return path.basename(filepath);
        }
    }
});