import React from 'react';
import {
    View,
    Text
} from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class OSUButton extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let {
            buttonColor = "green",
            buttonTitle = "KEY 1",
            onPress = () => {

            },
            onRelease = () => {

            },
            style = {}
        } = this.props;

        return (
            <TouchableOpacity onPressIn={onPress} onPressOut={onRelease}>
                <View style={{
                    ...componentStyles.button,
                    backgroundColor: buttonColor,
                    ...style
                }}>
                    <Text style={componentStyles.text}>{buttonTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }

}

const componentStyles = {
    button: {
        paddingLeft: 100,
        paddingRight: 100,
        paddingTop: 130,
        paddingBottom: 130
    },
    text: {
        textAlign: "center",
        color: "#fff",
        fontFamily: "fira-sans-bold",
        fontSize: 24
    }
};
