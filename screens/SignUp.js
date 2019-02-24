import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from 'react-native-firebase'
import AccountHandler from "../res/AccountHandler";

export default class SignUp extends React.Component {
    state = { email: '', password: '', errorMessage: null , name: "", surname: ""}
    handleSignUp = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(()=> {
                const user = firebase.auth().currentUser;

                firebase.auth().currentUser.getIdToken(true).then((idToken) => {
                    AccountHandler.signUp(user.uid, this.state.name, this.state.surname,this.state.username, 0, idToken)
                }).catch(function(error) {
                    console.log("ERRORE", error)
                });
            })
            .then(() => this.props.navigation.navigate('TabNavigator'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Sign Up</Text>
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}
                <TextInput
                    placeholder="Name"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                />
                <TextInput
                    placeholder="Surname"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={surname => this.setState({ surname })}
                    value={this.state.surname}
                />
                <TextInput
                    placeholder="username"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={username => this.setState({ username })}
                    value={this.state.username}
                />
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <Button title="Sign Up" onPress={this.handleSignUp} />
                <Button
                    title="Already have an account? Login"
                    onPress={() => this.props.navigation.navigate('Login')}
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