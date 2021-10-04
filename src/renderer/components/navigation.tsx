import * as React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    navigation: {
        width: '100%',
        padding: '16px',
        backgroundColor: '#418dff',
    },
    navigationTitle: {
        backgroundColor: '#0007',
        borderRadius: '5px 5px 0 0',
        padding: '2px 8px',
        color: '#bbb',
    },
    navigationContent: {
        display: 'flex',
    },
    navigationInput: {
        flexGrow: '1',
        padding: '4px',
        border: 'none',
        fontSize: '1.2rem',
        borderRadius: '0 0 0 5px',
        transition: '.1s',
        '&:focus': {
            outline: '3px solid #ddd7',
        },
    },
    navigationButton: {
        cursor: 'pointer',
        fontSize: '1.2rem',
        border: 'none',
        textTransform: 'uppercase',
        borderRadius: '0 0 5px 0',
        color: 'white',
        backgroundColor: '#000',
        transition: '.1s',
        '&:hover': {
            backgroundColor: '#777',
        },
    },
});

export interface NavigationProps {
    url: string;
    onUrlChange: React.ChangeEventHandler<HTMLInputElement>;
}

function Navigation({ url, onUrlChange }: NavigationProps) {
    const classes = useStyles();

    return (
        <div className={classes.navigation}>
            <div className={classes.navigationTitle}>Navigate Page</div>
            <div className={classes.navigationContent}>
                <input
                    className={classes.navigationInput}
                    type="text"
                    value={url}
                    onChange={onUrlChange}
                />
                <button
                    className={classes.navigationButton}
                    onClick={() => (window.location.href = url)}
                >
                    Go
                </button>
            </div>
        </div>
    );
}

export default Navigation;
