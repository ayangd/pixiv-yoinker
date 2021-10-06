import { Illust, User } from './illust';

declare global {
    interface Window {
        pixiv: {
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
