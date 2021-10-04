import { contextBridge } from 'electron';
import { readdir, readdirSync, readFile, readFileSync } from 'original-fs';

contextBridge.exposeInMainWorld('pixiv', {
    getAllIllustrations: async () => readdirSync('data/'),
    getData: async (path: string) =>
        readFileSync('data/' + path).toString('utf-8'),
    getImage: async (path: string) =>
        'data:image/png;base64, ' +
        readFileSync('images/' + path).toString('base64'),
    getMasterList: async (illustId: string) =>
        readdirSync('images/master/').filter(
            (master) => master.match(`${illustId}_p.+`) !== null,
        ),
});
