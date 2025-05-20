import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Recréez __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: false, // Important pour la sécurité
            contextIsolation: true, // Recommandé pour la sécurité
            preload: path.join(__dirname, 'preload.js') // Facultatif, pour isoler davantage le contexte
        }
    });

    if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
        // Mode développement : charger depuis le serveur Vite
        win.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
    } else {
        // Mode production : charger le fichier local généré
        win.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }

    // Ouvrez les outils de développement (facultatif)
    // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

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
