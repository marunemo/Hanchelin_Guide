import React from 'react';
import { WebView } from 'react-native-webview'

const AppInfoWebWiew = () => {
    return (
        <WebView
            onShouldStartLoadWithRequest={() => true}
            source={{ uri: 'https://www.notion.so/f6b6fe484295414c95c57d362fcb0180' }}
        />
    );
};

export default AppInfoWebWiew;