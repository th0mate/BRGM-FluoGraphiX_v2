/// <reference types="vite/client" />
interface DownloadProgress {
    percent: number;
    transferred: number;
    total: number;
    version?: string;
}

interface ElectronAPI {
    checkForUpdates: () => void;
    onUpdateAvailable: (callback: (event: any, info: any) => void) => void;
    onDownloadProgress: (callback: (event: any, progressObj: DownloadProgress) => void) => void;
    onUpdateDownloaded: (callback: (event: any, info: any) => void) => void;
    onUpdateNotAvailable: (callback: () => void) => void;
    onUpdateError: (callback: (event: any, message: string) => void) => void;
    getAppVersion: () => string | Promise<string>;
}

interface Window {
    electronAPI: ElectronAPI;
}

