import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let currentBot = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0a0f0d',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    autoHideMenuBar: process.platform !== 'darwin',
  });

     mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  mainWindow.loadURL('http://localhost:5173');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}      

ipcMain.on('start-bot', (event, data) => {
  if (!data.bin || !data.mes || !data.ano || !data.cvv) {
    event.sender.send('bot-stderr', 'Missing required input fields');
    return;
  }
  
  const botScript = path.join(__dirname, '..\\source_bot\\main.mjs');
//    const botScript = path.join(__dirname, 'bot.js');
  
  // Configure child process with silent: true to capture stdout/stderr
  currentBot = fork(botScript, [data.bin, data.mes, data.ano, data.cvv], {
    silent: true
  });

  // Handle IPC messages from the child process
  currentBot.on('message', (msg) => {
    if (mainWindow && msg) {
      mainWindow.webContents.send('bot-stdout', msg);
    }
  });

  currentBot.on('close', (code) => {
    if (mainWindow) {
      event.sender.send('bot-stdout', `Bot process exited with code ${code}`);
    }
    currentBot = null;
  });
  
  currentBot.on('error', (err) => {
    if (mainWindow) {
      event.sender.send('bot-stderr', `Failed to start bot process: ${err.message}`);
    }
    currentBot = null;
  });
});

ipcMain.on('stop-bot', () => {
  if (currentBot) {
    currentBot.kill();
    currentBot = null;
  }
});

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

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});