import * as React from 'react';
import { Illust } from '_/types/illust';

function useIllust() {
    const [illusts, setIllusts] = React.useState<Record<string, Illust>>({});

    React.useEffect(() => {
        let mounted = true;

        (async () => {
            const allIllusts = await window.pixiv.getIllustrationList();
            const illusts_: Record<string, Illust> = {};
            for (const illust of allIllusts) {
                illusts_[illust] = await window.pixiv.getIllustration(illust);
            }
            if (mounted) {
                setIllusts(illusts_);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return illusts;
}

export default useIllust;
