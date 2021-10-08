/**
 * Entry point of the Election app.
 */
import * as path from 'path';
import * as url from 'url';
import { BrowserWindow, app, Menu, MenuItem, ipcMain } from 'electron';
import * as JSZip from 'jszip';
import attachYoinkingDebugger from '_/main/yoinking-debugger';

let mainWindow: Electron.BrowserWindow | null;
let { zip_: zip, setZip } = (() => {
    var zip_ = new JSZip();
    function setZip(zip: JSZip) {
        zip_ = zip;
    }
    return { zip_, setZip };
})();

ipcMain.handle('getData', async (event, ...args) => {
    const result = await zip.generateAsync({ type: 'uint8array' });
    setZip(new JSZip());
    return result;
});

function createWindow(): void {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            webSecurity: true,
            devTools: process.env.NODE_ENV !== 'production',
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.bundle.js'),
        },
    });

    const menu = Menu.getApplicationMenu();
    menu?.append(
        new MenuItem({
            label: 'Home',
            click: () => {
                mainWindow
                    ?.loadURL(
                        url.format({
                            pathname: path.join(__dirname, './index.html'),
                            protocol: 'file:',
                            slashes: true,
                        }),
                    )
                    .finally(() => {
                        /* no action */
                    });
            },
        }),
    );
    Menu.setApplicationMenu(menu);

    // // and load the index.html of the app.
    mainWindow
        .loadURL(
            url.format({
                pathname: path.join(__dirname, './index.html'),
                protocol: 'file:',
                slashes: true,
            }),
        )
        .finally(() => {
            /* no action */
        });

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    attachYoinkingDebugger(mainWindow, zip);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
