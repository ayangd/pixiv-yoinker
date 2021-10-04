/**
 * Entry point of the Election app.
 */
import * as path from 'path';
import * as url from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, app, Menu, MenuItem } from 'electron';
import { writeFile, writeFileSync } from 'original-fs';

let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
    // Create the browser window.
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
    // mainWindow.loadURL('https://www.pixiv.net/en/artworks/92985202');

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    const dbg = mainWindow.webContents.debugger;
    try {
        dbg.attach('1.3');
    } catch (err) {
        console.log(`Debugger attach failed: ${err}`);
    }

    dbg.sendCommand('Fetch.enable', {
        patterns: [
            { urlPattern: 'https://i.pximg.net/*', requestStage: 'Response' },
            { urlPattern: 'https://www.pixiv.net/*', requestStage: 'Response' },
        ],
    }).catch((err) => console.log(`Fetch.enable failed: ${err.message}`));

    var getResponse = async (requestId: string) => {
        const res = await dbg.sendCommand('Fetch.getResponseBody', {
            requestId: requestId,
        });
        return res.base64Encoded
            ? Buffer.from(res.body, 'base64')
            : Buffer.from(res.body, 'utf-8');
    };

    dbg.on('message', async (e, m, p) => {
        if (m === 'Fetch.requestPaused') {
            if (
                p.request.url.match(
                    /https:\/\/www\.pixiv\.net\/en\/artworks\/\d+/,
                ) != null
            ) {
                console.log(`Page URL: ${p.request.url}`);
                const filenamee = p.request.url.split('/');
                const filename =
                    'data/' + filenamee[filenamee.length - 1] + '.json';
                const content =
                    (await getResponse(p.requestId))
                        .toString()
                        .match(
                            /<meta\s+name="preload-data"\s+id="meta-preload-data"\s+content='(.+)'>/,
                        )?.[1] ?? '{}';
                writeFile(filename, content, () => {});
            } else if (
                p.request.url.match(
                    /https:\/\/i\.pximg\.net\/img-master\/img.+_p\d+_master.+/,
                ) !== null
            ) {
                console.log(`Image URL: ${p.request.url}`);
                const filenamee = p.request.url.split('/');
                const filename =
                    'images/master/' + filenamee[filenamee.length - 1];
                writeFile(filename, await getResponse(p.requestId), () => {});
            } else if (
                p.request.url.match(
                    /https:\/\/i\.pximg\.net\/.+250x250.+img-master\/img.+square1200.+/,
                ) !== null
            ) {
                console.log(`Thumbnail URL: ${p.request.url}`);
                const filenameregex = p.request.url.match(/\/(\d+)_p.+(\..+)/);
                const filename =
                    'images/thumbnail/' + filenameregex[1] + filenameregex[2];
                writeFile(filename, await getResponse(p.requestId), () => {});
            } else if (
                p.request.url.match(
                    /https:\/\/i\.pximg\.net\/.+250x250.+custom-thumb\/img.+custom1200.+/,
                ) !== null
            ) {
                console.log(`Thumbnail URL: ${p.request.url}`);
                const filenameregex = p.request.url.match(/\/(\d+)_p.+(\..+)/);
                const filename =
                    'images/thumbnail/' + filenameregex[1] + filenameregex[2];
                writeFile(filename, await getResponse(p.requestId), () => {});
            } else if (
                p.request.url.match(
                    /https:\/\/i\.pximg\.net\/user-profile\/img.+/,
                ) !== null
            ) {
                console.log(`User Profile Image URL: ${p.request.url}`);
                const filenamee = p.request.url.split('/');
                const filename =
                    'images/user-profile/' + filenamee[filenamee.length - 1];
                writeFile(filename, await getResponse(p.requestId), () => {});
            }

            await dbg.sendCommand('Fetch.continueRequest', {
                requestId: p.requestId,
            });
        }
    });
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
