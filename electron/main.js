import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let botProcesses = [];

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
  if (!data.bin || !data.mes || !data.ano || !data.cvv || !data.threads) {
    event.sender.send('bot-stderr', 'Missing required input fields');
    return;
  }
  
  const numThreads = parseInt(data.threads);
  if (isNaN(numThreads) || numThreads < 1 || numThreads > 10) {
    event.sender.send('bot-stderr', 'Invalid number of threads (must be 1-10)');
    return;
  }

  // Kill any existing bot processes
  stopAllBots();
  
  const botScript = path.join(__dirname, '..\\source_bot\\main.mjs');
//    const botScript = path.join(__dirname, 'bot.js');
  
  // Start the requested number of bot processes
  for (let i = 0; i < numThreads; i++) {
    const botProcess = fork(botScript, [data.bin, data.mes, data.ano, data.cvv], {
      silent: true
    });

    botProcess.on('message', (msg) => {
      if (mainWindow && msg) {
        mainWindow.webContents.send('bot-stdout', `[Thread ${i + 1}] ${msg}`);
      }
    });

    botProcess.on('close', (code) => {
      if (mainWindow) {
        event.sender.send('bot-stdout', `[Thread ${i + 1}] Bot process exited with code ${code}`);
      }
      // Remove process from array when it exits
      botProcesses = botProcesses.filter(p => p !== botProcess);
    });
    
    botProcess.on('error', (err) => {
      if (mainWindow) {
        event.sender.send('bot-stderr', `[Thread ${i + 1}] Failed to start bot process: ${err.message}`);
      }
      botProcesses = botProcesses.filter(p => p !== botProcess);
    });

    botProcesses.push(botProcess);
  }
});

function stopAllBots() {
  for (const process of botProcesses) {
    try {
      process.kill();
    } catch (err) {
      console.error('Error killing bot process:', err);
    }
  }
  botProcesses = [];
}

ipcMain.on('stop-bot', () => {
  stopAllBots();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  stopAllBots();
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