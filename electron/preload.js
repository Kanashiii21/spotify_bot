const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startBot: (data) => ipcRenderer.send('start-bot', data),
  stopBot: () => ipcRenderer.send('stop-bot'),
  onStdout: (callback) => {
    ipcRenderer.on('bot-stdout', (_, msg) => callback(msg));
    return () => ipcRenderer.removeListener('bot-stdout', callback);
  },
  onStderr: (callback) => {
    ipcRenderer.on('bot-stderr', (_, msg) => callback(msg));
    return () => ipcRenderer.removeListener('bot-stderr', callback);
  }
});