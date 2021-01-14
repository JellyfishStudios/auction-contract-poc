import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

ReactDOM.render(
    <App />,
    document.getElementById('app-root'));

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
    });
}

if(module.hot){
    module.hot.accept()
}
