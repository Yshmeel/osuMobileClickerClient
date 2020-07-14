import React from 'react';
import {
    View,
    Text
} from 'react-native';
import styles from '../../styles';
import {SettingsContext} from "../../contexts/SettingsContext";
import OSUButton from "../OSUButton";
import {
    Vibration
} from 'react-native';

class Game extends React.Component {
    constructor(props) {
        super(props);
    }

    onPress(keyId) {
        let socketConnection = this.context.getSocketConnection();

        socketConnection.send(JSON.stringify({
            event: "key_press_" + keyId
        }))
        Vibration.vibrate(1, false);
    }

    onRelease(keyId) {
        let socketConnection = this.context.getSocketConnection();

        socketConnection.send(JSON.stringify({
            event: "key_release_" + keyId
        }))
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {props => {
                    return (
                        <View style={{
                            ...styles.container,
                            paddingTop: 40
                        }}>
                            <Text style={componentStyles.title}>osu! mobile clicker: Buttons</Text>
                            <View style={{
                                paddingTop: 30
                            }}>
                                <OSUButton style={{marginBottom: 10}}
                                           buttonTitle={"Key 1"} onPress={this.onPress.bind(this, 1)}
                                           onRelease={this.onRelease.bind(this, 1)}
                                           buttonColor={"green"}/>
                                <OSUButton buttonTitle={"Key 2"} onPress={this.onPress.bind(this, 2)}
                                           onRelease={this.onRelease.bind(this, 2)}
                                           buttonColor={"red"}/>
                            </View>
                        </View>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}

const componentStyles = {
    title: {
        fontSize: 24,
        fontFamily: "fira-sans-bold"
    }
}

Game.contextType = SettingsContext;
export default Game;
