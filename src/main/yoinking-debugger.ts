import { BrowserWindow } from 'electron';
import JSZip from 'jszip';

function attachYoinkingDebugger(mainWindow: BrowserWindow, zip: JSZip) {
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
                // writeFile(filename, content, () => {});
                zip.file(filename, content);
            } else if (
                p.request.url.match(
                    /https:\/\/i\.pximg\.net\/img-master\/img.+_p\d+_master.+/,
                ) !== null
            ) {
                console.log(`Image URL: ${p.request.url}`);
                const filenamee = p.request.url.split('/');
                const filename =
                    'images/master/' + filenamee[filenamee.length - 1];
                // writeFile(filename, await getResponse(p.requestId), () => {});
                zip.file(filename, await getResponse(p.requestId), {
                    binary: true,
                });
            } else if (
                p.request.url.match(
                    /https:\/\/i\.pximg\.net\/.+250x250.+img-master\/img.+square1200.+/,
                ) !== null
            ) {
                console.log(`Thumbnail URL: ${p.request.url}`);
                const filenameregex = p.request.url.match(/\/(\d+)_p.+(\..+)/);
                const filename =
                    'images/thumbnail/' + filenameregex[1] + filenameregex[2];
                // writeFile(filename, await getResponse(p.requestId), () => {});
                zip.file(filename, await getResponse(p.requestId), {
                    binary: true,
                });
            } else if (
                p.request.url.match(
                    /https:\/\/i\.pximg\.net\/.+250x250.+custom-thumb\/img.+custom1200.+/,
                ) !== null
            ) {
                console.log(`Thumbnail URL: ${p.request.url}`);
                const filenameregex = p.request.url.match(/\/(\d+)_p.+(\..+)/);
                const filename =
                    'images/thumbnail/' + filenameregex[1] + filenameregex[2];
                // writeFile(filename, await getResponse(p.requestId), () => {});
                zip.file(filename, await getResponse(p.requestId), {
                    binary: true,
                });
            } else if (
                p.request.url.match(
                    /https:\/\/i\.pximg\.net\/user-profile\/img.+/,
                ) !== null
            ) {
                console.log(`User Profile Image URL: ${p.request.url}`);
                const filenamee = p.request.url.split('/');
                const filename =
                    'images/user-profile/' + filenamee[filenamee.length - 1];
                // writeFile(filename, await getResponse(p.requestId), () => {});
                zip.file(filename, await getResponse(p.requestId), {
                    binary: true,
                });
            }

            await dbg.sendCommand('Fetch.continueRequest', {
                requestId: p.requestId,
            });
        }
    });
}

export default attachYoinkingDebugger;
