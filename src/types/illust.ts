export interface Illust {
    id: string;
    title: string;
    description: string;
    uploadDate: string;
    tags: {
        tag: string;
        translation?: {
            en: string;
        };
    }[];
    width: number;
    height: number;
    pageCount: number;
    userId: string;
}

export interface User {
    id: string;
    name: string;
    extension: string;
}
