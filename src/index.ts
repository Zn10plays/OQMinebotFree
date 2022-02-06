import { app, BrowserWindow, ipcMain, Notification } from 'electron'
import { join } from 'path'

async function createWindow () {
  const main = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    darkTheme: true,
    center: true,
    title: 'OQMinebotFree',
    autoHideMenuBar: true,
    fullscreen: true
  })

  await main.loadFile(join(__dirname, '/public/index.html'))
  // main.openDevTools()
}

app.on('ready', async () => {
  await createWindow()

  app.setAppUserModelId('Litegraph')
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('notification', (event, data) => {
  const notification = new Notification(data)
  notification.show()
})
