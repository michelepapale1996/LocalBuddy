import React from 'react'
import { StyleSheet, View } from 'react-native'
import firebase from 'react-native-firebase'
import { Text, TextInput, Button } from 'react-native-paper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import LoadingHandler from "../handler/LoadingHandler";
import LoadingComponent from "../components/LoadingComponent";

export default class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errorMessage: null,
        buttonClicked: false
    }

    handleLogin = () => {
        const {email, password} = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            this.setState({buttonClicked: true})
            const userId = firebase.auth().currentUser.uid
            LoadingHandler.initApp(userId).then(() => {
                this.props.navigation.navigate('Home')
            })
        }).catch(error => this.setState({errorMessage: error.message}))
    }

    render() {
        if (!this.state.buttonClicked) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>
                    {this.state.errorMessage &&
                    <Text style={{color: 'red'}}>
                        {this.state.errorMessage}
                    </Text>}
                    <TextInput
                        mode={"outlined"}
                        label="Email"
                        onChangeText={email => this.setState({email})}
                        value={this.state.email}
                        style={styles.textInput}
                    />
                    <TextInput
                        mode={"outlined"}
                        secureTextEntry
                        label="Password"
                        onChangeText={password => this.setState({password})}
                        value={this.state.password}
                        style={styles.textInput}
                    />
                    <Button
                        mode={"outlined"}
                        style={styles.button}
                        onPress={this.handleLogin}>
                        Login
                    </Button>
                    <Button
                        mode={"outlined"}
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('SignUp')}
                    >
                        Don't have an account? Sign Up
                    </Button>
                </View>
            )
        } else {
            return <LoadingComponent/>
        }
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
        width: '90%',
        marginTop: 8
    },
    button:{
        marginLeft:0,
        marginRight:0,
        borderRadius: 25
    },
    title:{
        fontSize: 20,
        fontWeight: "bold"
    },
})