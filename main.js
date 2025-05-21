import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.maximize();

    if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, 'dist', 'index.html'));

        win.webContents.on('will-navigate', (event, url) => {
            const parsedUrl = new URL(url);
            if (parsedUrl.protocol === 'file:' && !parsedUrl.pathname.endsWith('index.html')) {
                event.preventDefault();
                win.loadFile(path.join(__dirname, 'dist', 'index.html'));
            }
        });
        win.webContents.on('will-redirect', (event, url) => {
            const parsedUrl = new URL(url);
            if (parsedUrl.protocol === 'file:' && !parsedUrl.pathname.endsWith('index.html')) {
                event.preventDefault();
                win.loadFile(path.join(__dirname, 'dist', 'index.html'));
            }
        });
    }
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
