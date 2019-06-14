import React from 'react'
import { StyleSheet, View, TextInput, Image } from 'react-native'
import firebase from 'react-native-firebase'
import { Text, Button, IconButton, TouchableRipple } from 'react-native-paper'
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
                    {this.state.errorMessage &&
                    <Text style={{color: 'red'}}>
                        {this.state.errorMessage}
                    </Text>}
                    <Image style={{marginTop: hp("10%"),width: wp("40%"), height:wp("40%"), borderRadius:wp("90%")}} source={require('../img/logo.jpg')}/>
                    <Text style={styles.text}>LocalBuddy</Text>
                    <View>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <IconButton icon={"mail-outline"} disabled color={"white"}/>
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor={"white"}
                                color={"white"}
                                onChangeText={email => this.setState({email})}
                                value={this.state.email}
                                style={styles.textInput}
                            />
                        </View>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <IconButton icon={"lock-outline"} disabled color={"white"}/>
                            <TextInput
                                secureTextEntry
                                placeholder="Password"
                                placeholderTextColor={"white"}
                                underlineColor={"white"}
                                onChangeText={password => this.setState({password})}
                                value={this.state.password}
                                style={styles.textInput}
                            />
                        </View>
                    </View>
                    <View style={{marginBottom:hp("10%"), alignItems:"center"}}>
                        <Button
                            mode={"contained"}
                            style={styles.button}
                            color={"white"}
                            onPress={this.handleLogin}>
                            Login
                        </Button>

                        <Text style={styles.text}> or </Text>

                        <TouchableRipple style={{marginTop: hp("1%"), width:wp("80%"), backgroundColor:"white", borderRadius:5}} rippleColor="grey" onPress={this.handleFacebookLogin}>
                            <View style={{flexDirection:"row", alignItems: "center", justifyContent:"center"}}>
                                <Image style={{width: wp("10%"), height:hp("6%"), marginRight:wp("7%"), borderRadius:5}} source={require('../img/facebook_logo.jpeg')}/>
                                <Text style={{color:"black", fontSize: 17}}>
                                    Login with Facebook
                                </Text>
                            </View>
                        </TouchableRipple>
                        <Button
                            mode={"text"}
                            style={styles.button}
                            color={"white"}
                            onPress={() => this.props.navigation.navigate('SignUp')}
                        >
                            Don't have an account? Sign Up
                        </Button>
                    </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    textInput: {
        width: wp('80%'),
        backgroundColor:"transparent",
        borderBottomWidth: 1,
        borderColor: "white",
        color:"white"
    },
    button:{
        marginTop:hp("3%"),
        width: wp("80%"),
        borderRadius: 5
    },
    text:{
        color:"white",
        fontSize: 20,
    },
})