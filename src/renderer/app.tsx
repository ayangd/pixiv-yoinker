import * as React from 'react';
import { createUseStyles } from 'react-jss';
import Illustration from './components/illustration';
import { Illustration as IllustrationInterface } from '_types/illustration';
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
    const [illusts, setIllusts] = React.useState<IllustrationInterface[]>([]);
    const [selected, setSelected] = React.useState('');
    const selectedIllust = React.useMemo(
        () =>
            illusts.find(
                (illust) => Object.values(illust.illust)[0].id === selected,
            ),
        [selected, illusts],
    );
    const [url, setUrl] = React.useState('');

    React.useEffect(() => {
        let mounted = true;

        (async () => {
            const allIllusts = await window.pixiv.getAllIllustrations();
            const allContents = [];
            for (const post of allIllusts) {
                allContents.push(JSON.parse(await window.pixiv.getData(post)));
            }
            if (mounted) {
                setIllusts(allContents);
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
                illusts={illusts}
                onClick={onThumbnailClick}
                hidden={selected.length !== 0}
            />
            <Illustration
                illustData={selectedIllust}
                hidden={selected.length === 0}
                onBack={() => setSelected('')}
            />
        </div>
    );
}

export default App;
