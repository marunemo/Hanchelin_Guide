import React from 'react';
import { WebView } from 'react-native-webview'

const AppInfoWebWiew = () => {
    return (
        <WebView
            onShouldStartLoadWithRequest={() => true}
            source={{ uri: 'https://seokmin01.github.io/' }}
        />
    );
};

export default AppInfoWebWiew;