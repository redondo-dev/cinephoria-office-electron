const { Menu, dialog } = require('electron');

function createApplicationMenu() {
    const template = [
        {
            label: 'Fichier',
            submenu: [
                {
                    label: 'Nouvel Incident',
                    accelerator: 'Ctrl+N',
                    click: () => {
                        // Émettre un événement pour créer un nouvel incident
                        const { getCurrentWindow } = require('electron');
                        const win = getCurrentWindow();
                        if (win) {
                            win.webContents.send('menu-new-incident');
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exporter les incidents',
                    accelerator: 'Ctrl+E',
                    click: () => {
                        const { getCurrentWindow } = require('electron');
                        const win = getCurrentWindow();
                        if (win) {
                            win.webContents.send('menu-export-incidents');
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Quitter',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        const { app } = require('electron');
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Édition',
            submenu: [
                { role: 'undo', label: 'Annuler' },
                { role: 'redo', label: 'Rétablir' },
                { type: 'separator' },
                { role: 'cut', label: 'Couper' },
                { role: 'copy', label: 'Copier' },
                { role: 'paste', label: 'Coller' }
            ]
        },
        {
            label: 'Affichage',
            submenu: [
                { role: 'reload', label: 'Recharger' },
                { role: 'forceReload', label: 'Forcer le rechargement' },
                { role: 'toggleDevTools', label: 'Outils de développement' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom normal' },
                { role: 'zoomIn', label: 'Zoom avant' },
                { role: 'zoomOut', label: 'Zoom arrière' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Plein écran' }
            ]
        },
        {
            label: 'Aide',
            submenu: [
                {
                    label: 'À propos',
                    click: () => {
                        dialog.showMessageBox({
                            type: 'info',
                            title: 'À propos',
                            message: 'Cinephoria Office',
                            detail: 'Version 1.0.0\nApplication de gestion des incidents pour le cinéma Cinephoria'
                        });
                    }
                }
            ]
        }
    ];

    // Menu spécifique pour macOS
    if (process.platform === 'darwin') {
        template.unshift({
            label: 'Cinephoria Office',
            submenu: [
                { role: 'about', label: 'À propos de Cinephoria Office' },
                { type: 'separator' },
                { role: 'services', label: 'Services' },
                { type: 'separator' },
                { role: 'hide', label: 'Masquer Cinephoria Office' },
                { role: 'hideOthers', label: 'Masquer les autres' },
                { role: 'unhide', label: 'Afficher tout' },
                { type: 'separator' },
                { role: 'quit', label: 'Quitter Cinephoria Office' }
            ]
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

module.exports = { createApplicationMenu };