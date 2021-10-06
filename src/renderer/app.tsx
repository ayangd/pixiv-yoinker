import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Illust } from '_/types/illust';
import Illustration from './components/illustration';
// import { Illustration as IllustrationInterface } from '_types/illustration';
import Navigation from './components/navigation';
import Thumbs from './components/thumbs';

const useStyles = createUseStyles({
    app: {
        width: '100vw',
        height: '100vh',
        overflowX: 'hidden',
    },
});

function App() {
    const classes = useStyles();
    const [illusts, setIllusts] = React.useState<Record<string, Illust>>({});
    const [selected, setSelected] = React.useState('');
    const [url, setUrl] = React.useState('');

    React.useEffect(() => {
        let mounted = true;

        (async () => {
            const allIllusts = await window.pixiv.getIllustrationList();
            const illusts_: Record<string, Illust> = {};
            for (const illust of allIllusts) {
                // illusts_.push(JSON.parse(await window.pixiv.getData(post)));
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

    function onThumbnailClick(illustId: string) {
        setSelected(illustId);
    }

    return (
        <div className={classes.app}>
            <Navigation
                url={url}
                onUrlChange={(event) => setUrl(event.target.value)}
            />
            <Thumbs
                illusts={Object.values(illusts)}
                onClick={onThumbnailClick}
                hidden={selected.length !== 0}
            />
            <Illustration
                illust={illusts[selected]}
                hidden={selected.length === 0}
                onBack={() => setSelected('')}
            />
        </div>
    );
}

export default App;
