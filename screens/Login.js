import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from 'react-native-firebase'
import ConnectyCubeHandler from "../res/ConnectyCubeHandler";

export default class Login extends React.Component {
    state = { email: '', password: '', errorMessage: null }

    handleLogin = () => {
        const { email, password } = this.state;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                //push notifications
                firebase.messaging().hasPermission().then(enabled => {
                    if (enabled) {
                        firebase.messaging().getToken().then(token => {
                            var params = {
                                notification_channel: 'gcm',
                                device: {
                                    platform: 'android',
                                    udid: token
                                },
                                push_token: {
                                    environment: 'development',
                                    client_identification_sequence: token
                                }
                            };

                            ConnectyCubeHandler.getInstance().pushnotifications.subscriptions.create(params, function (error, result) {

                            });

                        })
                        // user has permissions
                    } else {
                        firebase.messaging().requestPermission()
                            .then(() => {
                                alert("User Now Has Permission")
                            })
                            .catch(error => {
                                console.log(error)
                                alert("Error", error)
                                // User has rejected permissions
                            });
                    }
                });
                this.props.navigation.navigate('Loading')
            })
            .catch(error => this.setState({ errorMessage: error.message }))
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Login</Text>
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <Button title="Login" onPress={this.handleLogin} />
                <Button
                    title="Don't have an account? Sign Up"
                    onPress={() => this.props.navigation.navigate('SignUp')}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    }
})