import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

async function setupAutoUpdater() {
    const { autoUpdater } = await import('electron-updater');
    const logModule = await import('electron-log');
    const log = logModule.default || logModule;

    // --- Configuration de electron-updater ---
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';
    autoUpdater.autoDownload = false;
    // --- Fin de la configuration de electron-updater ---

    // --- Gestion des événements de mise à jour ---
    autoUpdater.on('update-available', (info) => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Mise à jour disponible',
            message: 'Une nouvelle version est disponible. Voulez-vous la télécharger maintenant ?',
            buttons: ['Oui', 'Non']
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.downloadUpdate();
                mainWindow.webContents.send('update_download_started');
            }
        });
        mainWindow.webContents.send('update-available', info);
    });

    autoUpdater.on('update-not-available', (info) => {
        mainWindow.webContents.send('update-not-available', info);
    });

    autoUpdater.on('error', (err) => {
        dialog.showErrorBox('Erreur de mise à jour', 'Une erreur est survenue lors de la vérification ou du téléchargement de la mise à jour.');
        log.error('Erreur autoUpdater:', err);
        mainWindow.webContents.send('update_error', err.message);
    });

    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = "Vitesse de téléchargement: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - Téléchargé ' + progressObj.percent + '%';
        log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
        log.info(log_message);
        mainWindow.webContents.send('download_progress', progressObj);
    });

    autoUpdater.on('update-downloaded', (info) => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Mise à jour téléchargée',
            message: 'La mise à jour a été téléchargée et est prête à être installée. L\'application va redémarrer pour appliquer la mise à jour.',
            buttons: ['Redémarrer maintenant', 'Plus tard']
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
        mainWindow.webContents.send('update-downloaded', info);
    });

    // --- Gestion des communications IPC depuis le rendu (si nécessaire) ---
    ipcMain.on('check_for_updates', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });

    // Vérifier les mises à jour peu après le démarrage de l'application
    mainWindow.webContents.once('dom-ready', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.maximize();

    if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
    } else {
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
        mainWindow.webContents.on('will-navigate', (event, url) => {
            const parsedUrl = new URL(url);
            if (parsedUrl.protocol === 'file:' && !parsedUrl.pathname.endsWith('index.html')) {
                event.preventDefault();
                mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
            }
        });
        mainWindow.webContents.on('will-redirect', (event, url) => {
            const parsedUrl = new URL(url);
            if (parsedUrl.protocol === 'file:' && !parsedUrl.pathname.endsWith('index.html')) {
                event.preventDefault();
                mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
            }
        });
    }

    setupAutoUpdater();
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
