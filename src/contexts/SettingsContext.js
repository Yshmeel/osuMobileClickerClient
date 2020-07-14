import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export let settings = {
    ip: "",
    port: "",
    cache: {
        socketConnection: null
    }
};

export const SETTINGS_CONTEXT_FUNCTIONS = {
    set: (key, value) => {
        settings[key] = value;
    },
    get: (key, value) => {
        return settings[key];
    },
    save: () => {
        let newSettings = Object.assign({}, settings);
        delete newSettings['cache']

        AsyncStorage.setItem("settings", JSON.stringify(newSettings))
    },
    setSocketConnection: (socket) => {
        if(settings.cache === undefined) {
            settings.cache = {
                socketConnection: null
            };
        }
        settings.cache.socketConnection = socket;
    },
    getSocketConnection: () => {
        if(settings.cache === undefined) {
            settings.cache = {
                socketConnection: null
            };
        }

        return settings.cache.socketConnection;
    },
    load: () => {
        return new Promise(resolve => {
            AsyncStorage.getItem("settings", (err, data) => {
                if(data !== null) {
                    settings = JSON.parse(data);
                    resolve();
                } else {
                    resolve();
                }
            })
        })
    }
};

export const SETTINGS_CREATE_CONTEXT_DEFAULT = {
    settings,
    ...SETTINGS_CONTEXT_FUNCTIONS
}

export const SettingsContext = React.createContext(SETTINGS_CREATE_CONTEXT_DEFAULT);
