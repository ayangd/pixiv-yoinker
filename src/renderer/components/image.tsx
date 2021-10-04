import * as React from 'react';

export interface ImageProps extends React.HTMLAttributes<HTMLImageElement> {
    src: string;
    width?: number;
    height?: number;
}

function Image({ src, ...imgProps }: ImageProps) {
    const [data, setData] = React.useState('');

    React.useEffect(() => {
        let mounted = true;

        (async () => {
            const base64data = await window.pixiv.getImage(src);
            if (mounted) {
                setData(base64data);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return <img src={data} {...imgProps} />;
}

export default Image;
