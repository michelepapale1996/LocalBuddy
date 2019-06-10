import React from 'react'
import { StyleSheet, View } from 'react-native'
import firebase from 'react-native-firebase'
import { Text, TextInput, Button } from 'react-native-paper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import LoadingHandler from "../handler/LoadingHandler";
import LoadingComponent from "../components/LoadingComponent";
import {AccessToken, GraphRequest, LoginManager, GraphRequestManager} from 'react-native-fbsdk';
import UserHandler from "../handler/UserHandler";
import AccountHandler from "../handler/AccountHandler";
import ConnectyCubeHandler from "../handler/ConnectyCubeHandler";
import LocalStateHandler from "../handler/LocalStateHandler";

export default class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errorMessage: null,
        buttonClicked: false
    }

    handleLogin = () => {
        const {email, password} = this.state;
        if(email == "" || password == ""){
            this.setState({errorMessage: "Make sure you have filled all the fields."})
        }else{
            this.setState({buttonClicked: true})
            firebase.auth().signInWithEmailAndPassword(email, password).then(async () => {
                const userId = firebase.auth().currentUser.uid
                const userInfo = await UserHandler.getUserInfo(userId)
                LocalStateHandler.storeUserInfo(userInfo)
                LoadingHandler.initApp(userId).then(() => {
                    this.props.navigation.navigate('Chat')
                })
            }).catch(error => this.setState({
                errorMessage: error.message,
                buttonClicked: false
            }))
        }
    }

    handleFacebookLogin = async () => {
        this.setState({buttonClicked: true})
        const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_birthday', "user_gender", "user_photos"]);
        if (result.isCancelled) {
            // handle this however suites the flow of your app
            this.setState({buttonClicked: false})
            return
        }
        // get the access token
        const data = await AccessToken.getCurrentAccessToken();
        if (!data) {
            // handle this however suites the flow of your app
            this.setState({buttonClicked: false})
            return
        }
        // create a new firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        // login with credential
        const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

        const userId = firebaseUserCredential.user._user.uid
        UserHandler.getUserInfo(userId).then(userInfo => {
            if (userInfo) {
                //user exists
                //save in local
                LocalStateHandler.storeUserInfo(userInfo)
                LoadingHandler.initApp(userId).then(() => {
                    this.props.navigation.navigate('Chat')
                })
            } else {
                //user is signing up
                const name = firebaseUserCredential.additionalUserInfo.profile.first_name
                const surname = firebaseUserCredential.additionalUserInfo.profile.last_name
                const birthDate =firebaseUserCredential.additionalUserInfo.profile.birthday
                const sex = firebaseUserCredential.additionalUserInfo.profile.gender == "male" ? "M" : "F"
                ConnectyCubeHandler.setInstance().then(() => {
                    return ConnectyCubeHandler.signUp(userId, userId).then(session => {
                        return AccountHandler.signUp(
                            userId,
                            name,
                            surname,
                            userId,
                            false,
                            sex,
                            session.id,
                            birthDate)
                    }).then(()=>{
                        const graphRequest = new GraphRequest('/me', {
                            accessToken: data.accessToken,
                            parameters: {
                                fields: {
                                    string: 'picture.height(600)',
                                },
                            },
                        }, (error, result) => {
                            if (error) {
                                console.error(error)
                            } else {
                                UserHandler.setUrlPhoto(result.picture.data.url)
                            }
                        })
                        new GraphRequestManager().addRequest(graphRequest).start()
                        //const photoPath = firebaseUserCredential.user._user.photoURL
                        //return UserHandler.setUrlPhoto(photoPath)
                    }).then(()=>{
                        return ConnectyCubeHandler.login(userId)
                    }).then(async () => {
                        //save in local
                        const user = await UserHandler.getUserInfo(userId)
                        await LocalStateHandler.storeUserInfo(user)

                        LoadingHandler.initApp(userId).then(()=>{
                            this.props.navigation.navigate('Chat')
                        })
                    }).catch(error => this.setState({errorMessage: error.message}))
                })
            }
        })
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
                        onPress={this.handleFacebookLogin}>
                        Login with Facebook
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
        width: wp('90%'),
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