import { Illust, User } from './illust';

declare global {
    interface Window {
        pixiv: {
            // getAllIllustrations: () => Promise<string[]>;
            // getData: (path: string) => Promise<string>;
            // getImage: (path: string) => Promise<string>;
            // getMasterList: (illustId: string) => Promise<string[]>;
            getIllustrationList: () => Promise<string[]>;
            getIllustration: (illustId: string) => Promise<Illust>;
            getUser: (userId: string) => Promise<User>;
            getMasterImage: (illustId: string, page: number) => Promise<string>;
            getThumbnailImage: (illustId: string) => Promise<string>;
            getUserImage: (
                userId: string,
                extension: string,
            ) => Promise<string>;
        };
    }
}

export default {};
