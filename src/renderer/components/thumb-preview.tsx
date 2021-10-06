import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Illust, User } from '_/types/illust';

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
    illust: Illust;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

function ThumbPreview({ illust, onClick }: ThumbPreview) {
    const classes = useStyles({ thumbClickable: onClick !== undefined });
    const [user, setUser] = React.useState<User>();
    const [thumbnailImage, setThumbnailImage] = React.useState('');
    const [userImage, setUserImage] = React.useState('');

    React.useEffect(() => {
        let mounted = true;

        (async () => {
            const user_ = await window.pixiv.getUser(illust.userId);
            const thumbnailImage_ = await window.pixiv.getThumbnailImage(
                illust.id,
            );
            const userImage_ = await window.pixiv.getUserImage(
                user_.id,
                user_.extension,
            );
            if (mounted) {
                setUser(user_);
                setThumbnailImage(thumbnailImage_);
                setUserImage(userImage_);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return user === undefined ? (
        <></>
    ) : (
        <div className={classes.thumbPreview}>
            <img
                className={`${classes.thumb} ${classes.images}`}
                src={thumbnailImage}
                onClick={onClick}
            />
            <div className={classes.title}>
                <a href={`https://www.pixiv.net/en/artworks/${illust.id}`}>
                    {illust.title}
                </a>
            </div>
            <div>
                <a
                    className={classes.user}
                    href={`https://www.pixiv.net/en/users/${user.id}`}
                >
                    <img
                        className={`${classes.images} ${classes.userImage}`}
                        src={userImage}
                    />
                    {user.name}
                </a>
            </div>
        </div>
    );
}

export default ThumbPreview;
