import React from 'react'
import { View, StyleSheet, Button } from 'react-native'
import AccountHandler from "../res/AccountHandler";
import { Text, TextInput } from 'react-native-paper';

export default class ChangePassword extends React.Component {
    state = { oldPassword: '', newPassword: '', errorMessage: null , repeatNewPassword: ""}

    static navigationOptions = () => {
        return {
            title: "Cambia password"
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
                    placeholder="Vecchia password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={oldPassword => this.setState({ oldPassword })}
                    value={this.state.oldPassword}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Nuova password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={newPassword => this.setState({ newPassword })}
                    value={this.state.newPassword}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Ripeti la nuova password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={repeatNewPassword => this.setState({ repeatNewPassword })}
                    value={this.state.repeatNewPassword}
                />
                <Button title="Change password" onPress={this.handleChangePassword} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    }
})
