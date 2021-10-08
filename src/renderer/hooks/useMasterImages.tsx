import * as React from 'react';
import { Illust } from '_/types/illust';

function useMasterImages(illust: Illust) {
    const [masterImages, setMasterImages] = React.useState<string[]>([]);

    React.useEffect(() => {
        let mounted = true;

        (async () => {
            let masterImages_: string[] = [];
            for (let i = 0; i < illust.pageCount; i++) {
                masterImages_.push(
                    await window.pixiv.getMasterImage(illust.id, i),
                );
            }
            if (mounted) {
                setMasterImages(masterImages_);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return masterImages;
}

export default useMasterImages;
