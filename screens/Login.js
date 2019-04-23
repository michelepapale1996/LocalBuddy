import React from 'react'
import { StyleSheet, View, Button } from 'react-native'
import firebase from 'react-native-firebase'
import { Text, TextInput } from 'react-native-paper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import ConnectyCubeHandler from "../res/ConnectyCubeHandler";

export default class Login extends React.Component {
    state = { email: '', password: '', errorMessage: null }

    handleLogin = () => {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            this.props.navigation.navigate('Loading')
        }).catch(error => this.setState({ errorMessage: error.message }))
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
                    mode={"outlined"}
                    label="Email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                    style={styles.textInput}
                />
                <TextInput
                    mode={"outlined"}
                    secureTextEntry
                    label="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                    style={styles.textInput}
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
        height: hp("7%"),
        width: '90%',
        marginTop: 8
    }
})