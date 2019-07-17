import React from 'react'
import { StyleSheet, View, TextInput, Image, ScrollView } from 'react-native'
import firebase from 'react-native-firebase'
import { Text, Button, IconButton, TouchableRipple, Snackbar } from 'react-native-paper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import LoadingHandler from "../handler/LoadingHandler";
import LoadingComponent from "../components/LoadingComponent";
import {AccessToken, GraphRequest, LoginManager, GraphRequestManager} from 'react-native-fbsdk';
import UserHandler from "../handler/UserHandler";
import AccountHandler from "../handler/AccountHandler";
import ConnectyCubeHandler from "../handler/ConnectyCubeHandler";
import LocalUserHandler from "../LocalHandler/LocalUserHandler";
import LocalMeetingsHandler from "../LocalHandler/LocalMeetingsHandler";
import ChatsHandler from "../handler/ChatsHandler";
import LocalChatsHandler from "../LocalHandler/LocalChatsHandler";
import SingleChatHandler from "../handler/SingleChatHandler";
import OrientationHandler from "../handler/OrientationHandler";
import NetInfoHandler from "../handler/NetInfoHandler";

export default class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errorMessage: null,
        buttonClicked: false,
        isPresentError: false
    }

    handleLogin = () => {
        if(NetInfoHandler.isConnected){
            const {email, password} = this.state;
            if(email == "" || password == ""){
                this.setState({isPresentError: true, errorMessage: "Make sure you have filled all the fields."})
            }else{
                this.setState({buttonClicked: true})
                firebase.auth().signInWithEmailAndPassword(email, password).then(async () => {
                    const userId = firebase.auth().currentUser.uid
                    const userInfo = await UserHandler.getUserInfo(userId)
                    LoadingHandler.initAppBecauseLogin(userInfo).then(() => {
                        this.props.navigation.navigate('Chat')
                    })
                }).catch(error => this.setState({
                    errorMessage: error.message,
                    isPresentError: true,
                    buttonClicked: false
                }))
            }
        } else {
            alert("You are not connected to the network. Check your connection and retry.")
        }
    }

    componentDidMount(){
        loc(this)
    }

    componentWillUnmount(){
        rol(this)
    }

    handleFacebookLogin = async () => {
        if(NetInfoHandler.isConnected){
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
            UserHandler.getUserInfo(userId).then(async userInfo => {
                if (userInfo) {
                    //user exists
                    LoadingHandler.initAppBecauseLogin(userInfo).then(() => {
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
                            }, async (error, result) => {
                                if (error) {
                                    console.error(error)
                                } else {
                                    //console.log(result.picture.data.url)
                                    await UserHandler.setUrlPhoto(result.picture.data.url)
                                    LoadingHandler.initAppBecauseSignUp(userId).then(()=>{
                                        this.props.navigation.navigate('Chat')
                                    })
                                }
                            })
                            new GraphRequestManager().addRequest(graphRequest).start()
                            //const photoPath = firebaseUserCredential.user._user.photoURL
                            //return UserHandler.setUrlPhoto(photoPath)
                        }).catch(error => this.setState({isPresentError: true, errorMessage: error.message}))
                    })
                }
            })
        } else {
            alert("You are not connected to the network. Check your connection and retry.")
        }
    }

    render() {
        var styles;
        if(OrientationHandler.orientation == "portrait") {
            styles = StyleSheet.create({
                container: {
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                },
                textInput: {
                    width: wp('80%'),
                    backgroundColor: "transparent",
                    borderBottomWidth: 1,
                    borderColor: "white",
                    color: "white",
                    fontSize: hp("2%")
                },
                button: {
                    marginTop: hp("3%"),
                    width: wp("80%"),
                    borderRadius: 5,
                    height: hp("6%"),
                    fontSize: hp("2%")
                },
                text: {
                    color: "white",
                    fontSize: hp("4%")
                },
                logo: {
                    marginTop: hp("10%"),
                    width: wp("40%"),
                    height:wp("40%"),
                    borderRadius:wp("90%")
                },
                facebookButton: {
                    marginTop: hp("1%"),
                    height:hp("6%"),
                    justifyContent:"center",
                    width:wp("80%"),
                    backgroundColor:"white",
                    borderRadius:5
                },
                facebookLogo:{
                    width: wp("10%"),
                    height:hp("6%"),
                    marginRight:wp("7%"),
                    borderRadius:5
                }
            })
        } else {
            styles = StyleSheet.create({
                container: {
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                },
                textInput: {
                    width: wp('80%'),
                    backgroundColor: "transparent",
                    borderBottomWidth: 1,
                    borderColor: "white",
                    color: "white",
                    fontSize: hp("2%")
                },
                button: {
                    marginTop: hp("3%"),
                    width: wp("80%"),
                    borderRadius: 5,
                    height: hp("10%"),
                    fontSize: hp("2%")
                },
                text: {
                    color: "white",
                    fontSize: hp("4%")
                },
                logo: {
                    marginTop: hp("5%"),
                    width: wp("20%"),
                    height:wp("20%"),
                    borderRadius:wp("90%")
                },
                facebookButton: {
                    marginTop: hp("1%"),
                    height:hp("10%"),
                    justifyContent:"center",
                    width:wp("80%"),
                    backgroundColor:"white",
                    borderRadius:5
                },
                facebookLogo:{
                    width: wp("5%"),
                    height:hp("10%"),
                    marginRight:wp("7%"),
                    borderRadius:5
                }
            })
        }

        if (!this.state.buttonClicked) {
            return (
                <ScrollView style={{flex:1, backgroundColor: '#2c3e50'}}>
                    <View style={{justifyContent: "space-between", ...styles.container}}>
                        <View style={{alignItems: 'center'}}>
                            <Image style={styles.logo} source={require('../img/logo.jpg')}/>
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
                        </View>
                        <View style={{marginTop: hp("7%"), alignItems:"center"}}>
                            <TouchableRipple style={styles.facebookButton} rippleColor="grey" onPress={this.handleLogin}>
                                <Text style={{color:"black", fontSize: hp("2%"), textAlign:"center"}}>
                                    Login
                                </Text>
                            </TouchableRipple>

                            <Text style={{color: "white", fontSize: hp("2%")}}> or </Text>

                            <TouchableRipple style={styles.facebookButton} rippleColor="grey" onPress={this.handleFacebookLogin}>
                                <View style={{flexDirection:"row", alignItems: "center", justifyContent:"center"}}>
                                    <Image style={styles.facebookLogo} source={require('../img/facebook_logo.jpeg')}/>
                                    <Text style={{color:"black", fontSize: hp("2%")}}>
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
                        <Snackbar
                            visible={this.state.isPresentError}
                            onDismiss={() => this.setState({ isPresentError: false })}
                            action={{
                                label: 'Ok',
                                onPress: () => {
                                    this.setState({ isPresentError: false })
                                },
                            }}
                        >
                            {this.state.errorMessage}
                        </Snackbar>
                    </View>
                </ScrollView>
            )
        } else {
            return <LoadingComponent/>
        }
    }
}