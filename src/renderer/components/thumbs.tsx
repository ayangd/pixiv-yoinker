import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Illustration } from '_/types/illustration';
import ThumbPreview from './thumb-preview';

const useStyles = createUseStyles({
    thumbs: ({ hidden }: { hidden: boolean }) => ({
        display: hidden ? 'none' : 'flex',
        flexWrap: 'wrap',
        margin: 'auto',
    }),
});

export interface ThumbsProps {
    illusts: Illustration[];
    onClick?: (illustId: string) => void;
    hidden?: boolean;
}

function Thumbs({ illusts, onClick, hidden }: ThumbsProps) {
    const classes = useStyles({ hidden: hidden ?? false });

    return (
        <div className={classes.thumbs}>
            {illusts.map((post) => {
                const illust = Object.values(post.illust)[0];
                const user = Object.values(post.user)[0];
                const userImageSplit = (user.image as string).split('/');
                const userImage = userImageSplit[userImageSplit.length - 1];

                const illustOnClick =
                    onClick !== undefined
                        ? () => onClick(illust.id)
                        : undefined;

                return (
                    <ThumbPreview
                        illustId={illust.id}
                        illustTitle={illust.title}
                        userId={user.userId}
                        username={user.name}
                        userImage={userImage}
                        onClick={illustOnClick}
                    />
                );
            })}
        </div>
    );
}

export default Thumbs;
