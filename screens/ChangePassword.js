import React from 'react'
import { View, StyleSheet } from 'react-native'
import AccountHandler from "../handler/AccountHandler"
import { Text, TextInput, Button } from 'react-native-paper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default class ChangePassword extends React.Component {
    state = { oldPassword: '', newPassword: '', errorMessage: null , repeatNewPassword: ""}

    static navigationOptions = () => {
        return {
            title: "Change password",
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#2fa1ff'
            },
            headerTitleStyle: {
                color: 'white'
            }
        };
    };

    handleChangePassword = () => {
        AccountHandler.changePassword(this.state.oldPassword, this.state.newPassword, this.state.repeatNewPassword)
            .then(response=>{
                alert("Password changed!")
            }).catch(error => this.setState({ errorMessage: error }))
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}
                <TextInput
                    secureTextEntry
                    mode={"outlined"}
                    label="Old password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={oldPassword => this.setState({ oldPassword })}
                    value={this.state.oldPassword}
                />
                <TextInput
                    secureTextEntry
                    mode={"outlined"}
                    label="New password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={newPassword => this.setState({ newPassword })}
                    value={this.state.newPassword}
                />
                <TextInput
                    secureTextEntry
                    mode={"outlined"}
                    label="Repeat new password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={repeatNewPassword => this.setState({ repeatNewPassword })}
                    value={this.state.repeatNewPassword}
                />
                <Button mode={"outlined"} onPress={this.handleChangePassword}>Change password</Button>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    textInput: {
        height: hp("7%"),
        width: wp('90%'),
        marginTop: 8
    }
})
