declare global {
    interface Window {
        pixiv: {
            getAllIllustrations: () => Promise<string[]>;
            getData: (path: string) => Promise<string>;
            getImage: (path: string) => Promise<string>;
            getMasterList: (illustId: string) => Promise<string[]>;
        };
    }
}

export default {};
