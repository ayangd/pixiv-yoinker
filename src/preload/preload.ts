import { contextBridge } from 'electron';
import * as JSZip from 'jszip';
import {
    createWriteStream,
    existsSync,
    readdirSync,
    readFileSync,
} from 'original-fs';
import { Illust, User } from '_/types/illust';
import { Illustration } from '_/types/illustration';

let zip: JSZip;

async function preprocess() {
    const illustPaths = readdirSync('data/');
    if (illustPaths.length === 0) {
        return;
    }

    let isNewZip: boolean = false;
    if (!existsSync('data.zip')) {
        zip = new JSZip();
        isNewZip = true;
    } else {
        zip = await JSZip.loadAsync(readFileSync('data.zip'));
    }

    for (const illustPath of illustPaths) {
        const illust: Illustration = JSON.parse(
            readFileSync(`data/${illustPath}`).toString('utf-8'),
        );
        const illustIllust = Object.values(illust.illust)[0];
        const illustUser = Object.values(illust.user)[0];

        const profileExtension_ = illustUser.image.split('.');
        const profileExtension =
            profileExtension_[profileExtension_.length - 1];
        const profileName = `${illustUser.userId}.${profileExtension}`;
        const originalProfile_ = illustUser.image.split('/');
        const originalProfile = originalProfile_[originalProfile_.length - 1];

        const transformedIllust: Illust = {
            id: illustIllust.id,
            title: illustIllust.title,
            description: illustIllust.description,
            uploadDate: illustIllust.uploadDate,
            tags: illustIllust.tags.tags,
            width: illustIllust.width,
            height: illustIllust.height,
            pageCount: illustIllust.pageCount,
            userId: illustUser.userId,
        };
        const transformedUser: User = {
            id: illustUser.userId,
            name: illustUser.name,
            extension: profileExtension,
        };

        zip.folder('user')?.file(
            `${transformedUser.id}.json`,
            JSON.stringify(transformedUser),
        );
        zip.folder('profile')?.file(
            profileName,
            readFileSync(`images/user-profile/${originalProfile}`),
        );
        zip.folder('illust')?.file(
            `${transformedIllust.id}.json`,
            JSON.stringify(transformedIllust),
        );
        zip.folder('thumbnail')?.file(
            `${transformedIllust.id}.jpg`,
            readFileSync(`images/thumbnail/${transformedIllust.id}.jpg`),
        );
        const masterImages = readdirSync('images/master/').filter(
            (master) => master.match(`${transformedIllust.id}_p.+`) !== null,
        );
        for (const masterImage of masterImages) {
            zip.folder('master')?.file(
                masterImage.match(/\d+_p\d+/)![0] + '.jpg',
                readFileSync(`images/master/${masterImage}`),
            );
        }
    }

    zip.generateNodeStream({
        type: 'nodebuffer',
        streamFiles: true,
        compression: 'DEFLATE',
    }).pipe(createWriteStream('data.zip'));
}

contextBridge.exposeInMainWorld('pixiv', {
    // getAllIllustrations: async () => {
    //     preprocess();
    //     return readdirSync('data/');
    // },
    // getData: async (path: string) =>
    //     readFileSync('data/' + path).toString('utf-8'),
    // getImage: async (path: string) =>
    //     'data:image/png;base64, ' +
    //     readFileSync('images/' + path).toString('base64'),
    // getMasterList: async (illustId: string) =>
    //     readdirSync('images/master/').filter(
    //         (master) => master.match(`${illustId}_p.+`) !== null,
    //     ),
    getIllustrationList: async () => {
        await preprocess();
        return zip
            .folder('illust')!
            .file(/.*/)
            .map((i) => i.name.match(/.*\/(\d+)\.json/)![1]);
    },
    getIllustration: async (illustId: string) =>
        JSON.parse(
            await zip
                .folder('illust')!
                .file(`${illustId}.json`)!
                .async('string'),
        ) as Illust,
    getUser: async (userId: string) => {
        const userFolder = zip.folder('user');
        if (userFolder === null) {
            throw new Error('user folder not found');
        }
        const userFile = userFolder.file(`${userId}.json`);
        if (userFile === null) {
            throw new Error('user data not found');
        }
        return JSON.parse(await userFile.async('string'));
    },
    getMasterImage: async (illustId: string, page: number) => {
        const masterFolder = zip.folder('master');
        if (masterFolder === null) {
            throw new Error('master folder not found');
        }
        const masterFile = masterFolder.file(`${illustId}_p${page}.jpg`);
        if (masterFile === null) {
            throw new Error('master not found');
        }
        const masterData = await masterFile.async('base64');
        return 'data:image/jpg;base64, ' + masterData;
    },
    getThumbnailImage: async (illustId: string) => {
        const thumbnailFolder = zip.folder('thumbnail');
        if (thumbnailFolder === null) {
            throw new Error('thumbnail folder not folder');
        }
        const thumbnailFile = thumbnailFolder.file(`${illustId}.jpg`);
        if (thumbnailFile === null) {
            throw new Error('thumbnail not found');
        }
        const thumbnailData = await thumbnailFile.async('base64');
        return 'data:image/jpg;base64, ' + thumbnailData;
    },
    getUserImage: async (userId: string, extension: string) => {
        const profileFolder = zip.folder('profile');
        if (profileFolder === null) {
            throw new Error('profile folder not found');
        }
        const profileFile = profileFolder.file(`${userId}.${extension}`);
        if (profileFile === null) {
            throw new Error('profile not found');
        }
        const profileData = await profileFile.async('base64');
        return `data:image/${extension};base64, ${profileData}`;
    },
});
