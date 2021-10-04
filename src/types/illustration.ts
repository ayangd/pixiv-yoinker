export interface Illustration {
    illust: Record<
        string,
        {
            id: string;
            title: string;
            description: string;
            uploadDate: string;
            tags: {
                tags: {
                    tag: string;
                    translation?: {
                        en: string;
                    };
                }[];
            };
            width: number;
            height: number;
        }
    >;
    user: Record<
        string,
        {
            userId: string;
            name: string;
            image: string;
        }
    >;
}
