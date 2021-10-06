import * as React from 'react';

export interface ImageProps extends React.HTMLAttributes<HTMLImageElement> {
    src: string;
    width?: number;
    height?: number;
}

function Image({ src, ...imgProps }: ImageProps) {
    return <img src={src} {...imgProps} />;
}

export default Image;
