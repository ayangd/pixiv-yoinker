import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Illust } from '_/types/illust';
import ThumbPreview from './thumb-preview';

const useStyles = createUseStyles({
    thumbs: ({ hidden }: { hidden: boolean }) => ({
        display: hidden ? 'none' : 'flex',
        flexWrap: 'wrap',
        margin: 'auto',
    }),
});

export interface ThumbsProps {
    illusts: Illust[];
    onClick?: (illustId: string) => void;
    hidden?: boolean;
}

function Thumbs({ illusts, onClick, hidden }: ThumbsProps) {
    const classes = useStyles({ hidden: hidden ?? false });

    return (
        <div className={classes.thumbs}>
            {illusts.map((illust) => {
                const illustOnClick =
                    onClick !== undefined
                        ? () => onClick(illust.id)
                        : undefined;

                return <ThumbPreview illust={illust} onClick={illustOnClick} />;
            })}
        </div>
    );
}

export default Thumbs;
