const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),

    // Nouvelles fonctions pour les mises à jour
    checkForUpdates: () => ipcRenderer.send('check_for_updates'),
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
    onDownloadProgress: (callback) => ipcRenderer.on('download_progress', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    onUpdateError: (callback) => ipcRenderer.on('update_error', callback),
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),

});

