/// <reference types="vite/client" />
interface ElectronAPI {
    checkForUpdates: () => void;
    onUpdateAvailable: (callback: (event: any, info: any) => void) => void;
    onDownloadProgress: (callback: (event: any, progressObj: any) => void) => void;
    onUpdateDownloaded: (callback: (event: any, info: any) => void) => void;
    onUpdateNotAvailable: (callback: () => void) => void;
    onUpdateError: (callback: (event: any, message: string) => void) => void;
}

interface Window {
    electronAPI: ElectronAPI;
}