import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import {
    SettingsContext,
    SETTINGS_CREATE_CONTEXT_DEFAULT
} from "./src/contexts/SettingsContext";
import {FiraSans_400Regular, FiraSans_700Bold, useFonts} from "@expo-google-fonts/fira-sans";
import {Text, View} from "react-native";
import Setup from "./src/components/scenes/Setup";
import * as Font from 'expo-font';
import styles from './src/styles';
import Game from "./src/components/scenes/Game";
import MobileClicker from "./src/components/MobileClicker";

class App extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            fontsLoaded: false
        };
    }

    async componentDidMount() {
        /* Load custom fonts */
        await Font.loadAsync({
            'fira-sans-bold': require("./assets/fonts/TTNorms-Bold.ttf"),
            'fira-sans-regular': require("./assets/fonts/TTNorms-Regular.ttf"),
        });

        this.setState({
            fontsLoaded: true
        });
    }

    render() {
        return !this.state.fontsLoaded ? (
            <View style={styles.container}>
                <Text style={{
                    fontSize: 24,
                    textAlign: "center"
                }}>Loading app...</Text>
            </View>
        ) : (
            <SettingsContext.Provider value={SETTINGS_CREATE_CONTEXT_DEFAULT}>
                <MobileClicker />
            </SettingsContext.Provider>
        );
    }

}

App.contextType = SettingsContext;
export default App;
