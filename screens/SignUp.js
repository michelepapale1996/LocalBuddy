import React from 'react'
import { StyleSheet, View, ScrollView, TextInput } from 'react-native'
import firebase from 'react-native-firebase'
import AccountHandler from "../handler/AccountHandler";
import { Text, RadioButton, Button, IconButton, Snackbar } from 'react-native-paper';
import DateTimePicker from "react-native-modal-datetime-picker";
import ConnectyCubeHandler from "../handler/ConnectyCubeHandler"
import LoadingComponent from "../components/LoadingComponent";
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import LoadingHandler from "../handler/LoadingHandler";
import LocalUserHandler from "../LocalHandler/LocalUserHandler";
import UserHandler from "../handler/UserHandler";
import DateHandler from "../handler/DateHandler";
import SingleChatHandler from "../handler/SingleChatHandler";

export default class SignUp extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            password: "",
            passwordRepeated: "",
            errorMessage: null ,
            name: "",
            surname: "",
            sex: "M",
            isDateTimePickerVisible: false,
            birthDate:null,
            buttonClicked:false,
            isPresentError: false
        }
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    }

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    }


    handleDatePicked = date => {
        this.setState({birthDate: date})
        this.hideDateTimePicker();
    };

    handleSignUp = () => {
        if(this.state.password !== this.state.passwordRepeated){
            this.setState({isPresentError: true, errorMessage: "The passwords you typed are different"})
        }
        // check that the name and the password are not empty
        else if(this.state.name === "" ||
            this.state.username === "" ||
            this.state.email === "" ||
            this.state.password === "" ||
            this.state.birthDate === null) {
            this.setState({isPresentError: true, errorMessage: "Make sure you have filled all the fields."})
        }else{
            this.setState({buttonClicked: true})
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(async () => {
                const userId = firebase.auth().currentUser.uid
                await ConnectyCubeHandler.setInstance()

                const session = await ConnectyCubeHandler.signUp(userId, userId)
                await AccountHandler.signUp(
                        userId,
                        this.state.name,
                        this.state.surname,
                        userId,
                        false,
                        this.state.sex,
                        session.id,
                        this.state.birthDate)
                //save in local
                const user = await UserHandler.getUserInfo(userId)
                await LocalUserHandler.storeUserInfo(user)

                await ConnectyCubeHandler.login(userId)
                await LoadingHandler.initApp(userId)
                const CCUserId = ConnectyCubeHandler.getCCUserId()
                SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')
                this.props.navigation.navigate('Chat')
            }).catch(error => {
                this.setState({
                    isPresentError: true,
                    errorMessage: error.message,
                    buttonClicked: false
                })
            })
        }
    }

    componentDidMount(){
        loc(this)
    }

    componentWillUnmount(){
        rol(this)
    }

    render() {
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
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
                marginTop:hp("2%"),
                width: wp("80%"),
                borderRadius: 5
            },
            header: {
                flex: 1,
                marginTop: hp("10%"),
                marginBottom: hp("10%"),
                width: wp('90%'),
                justifyContent: 'center',
                alignItems: 'center'
            },
            text:{
                color:"white",
                fontSize: 20,
            },
        })

        if(!this.state.buttonClicked){
            return (
                <View style={styles.container}>
                    <ScrollView style={{flex:1}}>
                        <View style={styles.header}>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <IconButton icon={"person"} disabled color={"white"}/>
                                <TextInput
                                    placeholder="Name"
                                    placeholderTextColor={"white"}
                                    autoCapitalize="none"
                                    style={styles.textInput}
                                    onChangeText={name => this.setState({ name })}
                                    value={this.state.name}
                                />
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <IconButton icon={"person"} disabled color={"white"}/>
                                <TextInput
                                    placeholder="Surname"
                                    placeholderTextColor={"white"}
                                    autoCapitalize="none"
                                    style={styles.textInput}
                                    onChangeText={surname => this.setState({ surname })}
                                    value={this.state.surname}
                                />
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <IconButton icon={"mail-outline"} disabled color={"white"}/>
                                <TextInput
                                    placeholder="Email"
                                    placeholderTextColor={"white"}
                                    autoCapitalize="none"
                                    style={styles.textInput}
                                    onChangeText={email => this.setState({ email })}
                                    value={this.state.email}
                                />
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <IconButton icon={"lock-outline"} disabled color={"white"}/>
                                <TextInput
                                    secureTextEntry
                                    placeholder="Password"
                                    placeholderTextColor={"white"}
                                    autoCapitalize="none"
                                    style={styles.textInput}
                                    onChangeText={password => this.setState({ password })}
                                    value={this.state.password}
                                />
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <IconButton icon={"lock-outline"} disabled color={"white"}/>
                                <TextInput
                                    secureTextEntry
                                    placeholder="Repeat Password"
                                    placeholderTextColor={"white"}
                                    autoCapitalize="none"
                                    style={styles.textInput}
                                    onChangeText={passwordRepeated => this.setState({ passwordRepeated })}
                                    value={this.state.passwordRepeated}
                                />
                            </View>
                            <View style={{marginTop: wp("2%"), width: wp("80%"), flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                                <View style={{flexDirection:"row"}}>
                                    <RadioButton.Group
                                        onValueChange={value => this.setState({ sex: value })}
                                        value={this.state.sex}
                                    >
                                        <View style={{flexDirection:"row", alignItems:"center"}}>
                                            <RadioButton value="M" color={"white"} uncheckedColor={"white"}/>
                                            <Text style={styles.text}>Male</Text>
                                        </View>
                                        <View style={{flexDirection:"row", alignItems:"center"}}>
                                            <RadioButton value="F" color={"white"} uncheckedColor={"white"}/>
                                            <Text style={styles.text}>Female</Text>
                                        </View>
                                    </RadioButton.Group>
                                </View>
                            </View>

                            <Button
                                mode={"contained"}
                                style={styles.button}
                                color={"white"}
                                onPress={this.showDateTimePicker}>
                                {this.state.birthDate !== null ? DateHandler.dateToString(this.state.birthDate) : "Birthdate"}
                            </Button>
                            <DateTimePicker
                                mode={"date"}
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                                maximumDate={new Date()}
                            />
                        </View>

                        <View style={{alignItems:"center", marginTop:hp("10%")}}>
                            <Button
                                mode={"contained"}
                                style={styles.button}
                                color={"white"}
                                onPress={this.handleSignUp}>
                                SignUp
                            </Button>
                            <Button
                                mode={"text"}
                                style={styles.button}
                                color={"white"}
                                onPress={() => this.props.navigation.navigate('Login')}
                            >
                                Already have an account? Login
                            </Button>
                        </View>
                    </ScrollView>
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
            )
        } else {
            return <LoadingComponent/>
        }
    }

}