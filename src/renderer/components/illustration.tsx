import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Illust } from '_/types/illust';
import { Illustration } from '_/types/illustration';
import { parseBreaks } from '../utils';

const useStyles = createUseStyles({
    illustration: ({ hidden }: { hidden: boolean }) => ({
        display: hidden ? 'none' : 'flex',
        flexDirection: 'column',
    }),
    backButton: {
        padding: '8px',
        fontSize: '1.4rem',
        border: 'none',
        backgroundColor: 'black',
        color: 'white',
        width: '100%',
        transition: '.1s',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#444',
        },
        '&:active': {
            backgroundColor: '#888',
        },
    },
    image: {
        display: 'block',
        width: 'auto',
        height: '100vh',
        padding: '8px',
    },
    imageContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    titleText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        margin: '8px',
    },
    description: {
        color: 'black',
        margin: '32px',
        padding: '16px',
        background: '#ddd',
        borderRadius: '4px',
    },
    tagContainer: {
        marginTop: '16px',
        '& > span': {
            display: 'inline-block',
            margin: '4px',
            padding: '4px 8px',
            backgroundColor: '#bbb',
            '& > span:nth-child(1)': {
                color: 'black',
            },
            '& > span:nth-child(2)': {
                color: 'gray',
            },
        },
    },
});

export interface IllustrationProps {
    illust?: Illust;
    hidden?: boolean;
    onBack?: () => void;
}

function Illustration({ illust, hidden, onBack }: IllustrationProps) {
    if (illust === undefined) {
        return <></>;
    }
    const classes = useStyles({ hidden: hidden ?? false });
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

    return (
        <div className={classes.illustration}>
            <div>
                <button className={classes.backButton} onClick={onBack}>
                    &lt; Back
                </button>
            </div>
            <div className={classes.description}>
                <div className={classes.titleText}>
                    <a href={`https://www.pixiv.net/en/artworks/${illust.id}`}>
                        {illust.title}
                    </a>
                </div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: parseBreaks(illust.description),
                    }}
                />
                <div className={classes.tagContainer}>
                    {illust.tags.map((tag: any) => (
                        <span>
                            <span>#{tag.tag}</span>
                            <span>
                                {tag.translation !== undefined
                                    ? ' ' + tag.translation.en
                                    : ''}
                            </span>
                        </span>
                    ))}
                </div>
            </div>
            <div className={classes.imageContainer}>
                {masterImages.map((masterImage) => (
                    <img className={classes.image} src={masterImage} />
                ))}
            </div>
        </div>
    );
}

export default Illustration;
