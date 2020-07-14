import React from 'react';
import {SettingsContext} from "../contexts/SettingsContext";
import {Router, Scene} from "react-native-router-flux";
import Setup from "./scenes/Setup";
import Game from "./scenes/Game";
import {Text, View} from "react-native";
import styles from "../styles";

class MobileClicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadedCache: false
        };
    }
    async componentDidMount() {
        this.context.load().then((data) => {
            this.setState({
                loadedCache: true
            });
        })
    }

    render() {
        return !this.state.loadedCache ? (
            <View style={styles.container}>
                <Text style={{
                    fontSize: 24,
                    textAlign: "center"
                }}>Loading cache...</Text>
            </View>
        ) : (
            <SettingsContext.Consumer>
                {props => {
                    return (
                        <Router showNavigationBar={false}>
                            <Scene key={"root"} hideNavBar={true} hideTabBar={true} >
                                <Scene key={"setup"} component={Setup} initial={true}/>
                                <Scene key={"game"} component={Game} />
                            </Scene>
                        </Router>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}

MobileClicker.contextType = SettingsContext;
export default MobileClicker;
