import * as React from 'react';
import { createUseStyles } from 'react-jss';
import useIllusts from '_/renderer/hooks/useIllusts';
import Illustration from '_/renderer/components/illustration';
import Navigation from '_/renderer/components/navigation';
import Thumbs from '_/renderer/components/thumbs';

const useStyles = createUseStyles({
    app: {
        width: '100vw',
        height: '100vh',
        overflowX: 'hidden',
    },
});

function App() {
    const classes = useStyles();
    const illusts = useIllusts();
    const [selected, setSelected] = React.useState('');
    const [url, setUrl] = React.useState('');

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
