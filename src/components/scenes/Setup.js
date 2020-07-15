import React from 'react';
import {SettingsContext} from "../../contexts/SettingsContext";
import { View, Text, StyleSheet, TextInput } from 'react-native';
import {
    TouchableOpacity
} from 'react-native-gesture-handler';
import styles from '../../styles';
import {Linking} from "expo/build/deprecated.web";
import {
    Actions
} from "react-native-router-flux";
import MobileClicker from "../MobileClicker";

const REGEX_IP = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/gim;

class Setup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ip: "",
            port: "",
            errors: {
                ip: null,
                port: null,
                global: null
            },
            loading: false,
            webSocketWork: false
        };
    }

    componentDidMount() {
        this.setState({
            ip: this.context.get("ip"),
            port: this.context.get("port"),
        });
    }

    changeInputValue = (key, text) => {
        let state = this.state;
        state[key] = text;

        this.setState(state)
    }

    validate = () => {
        let errors = this.state.errors;

        if(this.state.ip === "") {
            errors.ip = 'This field is required';
        } else {
            errors.ip = null;
        }
        if(this.state.port === "") {
            errors.port = 'This field is required';
        } else {
            errors.port = null;
        }

        this.setState({
            errors
        });
        return errors.ip === null && errors.port === null;
    }

    connect = () => {
        if(!this.validate()) return false;

        let { ip, port } = this.state;

        this.setState({
            loading: true,
            connectWebSocket: true
        });

        try {
            if(!this.state.ip.match(REGEX_IP)) {
                throw new Error("Wrong IP address");
                return false;
            }

            let webSocket = new WebSocket(`ws://${ip}:${port}/`);

            webSocket.onopen = (e) => {
                console.log("Connect WebSocket = " + this.state.connectWebSocket);
                if(!this.state.connectWebSocket) return false;
                console.log("Connected to WebSocket");
                this.setState({
                    loading: false,
                    connectWebSocket: false
                });
                this.context.set("ip", this.state.ip);
                this.context.set("port", this.state.port);
                this.context.save();
                this.context.setSocketConnection(webSocket);
                this.setGlobalError(null);
                Actions.game();
            };

            webSocket.onerror = (e) => {
                console.log("Error on WebSocket");
                console.error(e);
                this.setGlobalError("Something went wrong, maybe try another IP address?\nError message: " + e.message);
                this.setState({
                    loading: false
                });
            };

            webSocket.onclose = (e) => {
                console.log("Close WebSocket");
            }

        } catch(e) {
            console.error(e);
            this.setGlobalError("Something went wrong, maybe try another IP address?\nError message: " + e.message);
            this.setState({
                loading: false
            });
        }
    }

    setGlobalError = (error) => {
        let errors = this.state.errors;
        errors['global'] = error;

        this.setState({
            errors
        });
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {props => {
                    return (
                        <View style={styles.container}>
                            <Text style={componentStyles.title}>Welcome to osu!mobile clicker</Text>
                            {!this.state.loading ? (
                                <>
                                    <View style={componentStyles.settingsReadme}>
                                        <Text style={componentStyles.text}>Firstfully, you need to setup an Socket Server.</Text>
                                        <View style={componentStyles.texts}>
                                            <Text>You can download a server from</Text>
                                            <TouchableOpacity onPress={() => {
                                                Linking.openURL("https://github.com/Yshmeel/osuMobileClickerServer");
                                            }}>
                                                <Text style={{
                                                    ...componentStyles.textComponent,
                                                    color: "red",
                                                    fontSize: 14
                                                }}>Github</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={componentStyles.texts}>
                                            <Text style={componentStyles.textRed}>IMPORTANT!</Text>
                                            <Text style={componentStyles.textComponent}>Follow instructions in README</Text>
                                        </View>
                                    </View>
                                    <View style={componentStyles.settingsForm}>
                                        <Text style={componentStyles.text}>Secondly, you shound start your Socket Server,
                                            and he will output listening IP and PORT(in format: (ip:port)) which you need to
                                            write in inputs below.</Text>
                                        {this.state.errors.global !== null && <Text style={componentStyles.globalError}>
                                            An error has appeared: {this.state.errors.global}
                                        </Text>}
                                        <View style={styles.formInput}>
                                            <Text style={styles.formInputLabel}>Socket Server IP:</Text>
                                            <TextInput
                                                style={styles.inputStyle}
                                                placeholder={"Write Socket Server IP"}
                                                onChangeText={text => this.changeInputValue("ip", text)}
                                                value={this.state.ip}
                                            />
                                            {this.state.errors.ip !== null && (
                                                <Text style={styles.formInputError}>
                                                    {this.state.errors.ip}
                                                </Text>
                                            )}
                                        </View>
                                        <View style={styles.formInput}>
                                            <Text style={styles.formInputLabel}>Socket Server Port:</Text>
                                            <TextInput
                                                style={styles.inputStyle}
                                                placeholder={"Write Socket Server Port"}
                                                onChangeText={text => this.changeInputValue("port", text)}
                                                value={this.state.port}
                                            />
                                            {this.state.errors.port !== null && (
                                                <Text style={styles.formInputError}>
                                                    {this.state.errors.port}
                                                </Text>
                                            )}
                                        </View>
                                        <View style={styles.formInput}>
                                            <TouchableOpacity onPress={this.connect}>
                                                <View style={{...styles.button, ...styles.buttonSuccess}}>
                                                    <Text style={styles.buttonText}>Connect</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text>Now we are trying to connect your socket server...</Text>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            loading: false,
                                            connectWebSocket: false
                                        })
                                    }}>
                                        <View style={{...styles.button, ...styles.buttonDanger, marginTop: 10}}>
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}

Setup.contextType = SettingsContext;
export default Setup;

const componentStyles = StyleSheet.create({
    title: {
        fontSize: 36,
        fontFamily: "fira-sans-bold"
    },
    settingsReadme: {
        marginTop: 10
    },
    text: {
        fontSize: 14,
        fontFamily: "fira-sans-regular"
    },
    texts: {
        display: "flex",
        flexDirection: "row"
    },
    textRed: {
        color: "red"
    },
    textComponent: {
        marginLeft: 3
    },
    settingsForm: {
        marginTop: 30
    },
    globalError: {
        color: "red",
        paddingTop: 10
    }
})
