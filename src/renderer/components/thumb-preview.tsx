import * as React from 'react';
import Image from './image';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    thumbPreview: {
        minWidth: '184px',
        maxWidth: '184px',
        margin: '12px',
    },
    thumb: ({ thumbClickable }: { thumbClickable: boolean }) => ({
        borderRadius: '8px',
        cursor: thumbClickable ? 'pointer' : '',
    }),
    title: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    images: {
        display: 'inline-block',
        width: '100%',
    },
    userImage: {
        borderRadius: '50%',
        width: '24px',
        height: '24px',
    },
    user: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
});

export interface ThumbPreview {
    illustId: string;
    illustTitle: string;
    userId: string;
    username: string;
    userImage: string;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

function ThumbPreview({
    illustId,
    illustTitle,
    userId,
    username,
    userImage,
    onClick,
}: ThumbPreview) {
    const classes = useStyles({ thumbClickable: onClick !== undefined });

    return (
        <div className={classes.thumbPreview}>
            <Image
                className={`${classes.thumb} ${classes.images}`}
                src={`thumbnail/${illustId}.jpg`}
                onClick={onClick}
            />
            <div className={classes.title}>
                <a href={`https://www.pixiv.net/en/artworks/${illustId}`}>
                    {illustTitle}
                </a>
            </div>
            <div>
                <a
                    className={classes.user}
                    href={`https://www.pixiv.net/en/users/${userId}`}
                >
                    <Image
                        className={`${classes.images} ${classes.userImage}`}
                        src={`user-profile/${userImage}`}
                    />
                    {username}
                </a>
            </div>
        </div>
    );
}

export default ThumbPreview;
