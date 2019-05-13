import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import firebase from 'react-native-firebase'
import AccountHandler from "../handler/AccountHandler";
import { Text, TextInput, RadioButton, Button } from 'react-native-paper';
import DateTimePicker from "react-native-modal-datetime-picker";
import ConnectyCubeHandler from "../handler/ConnectyCubeHandler"
import LoadingComponent from "../components/LoadingComponent";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import LoadingHandler from "../handler/LoadingHandler";

export default class SignUp extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            password: "",
            errorMessage: null ,
            name: "",
            surname: "",
            sex: "M",
            isDateTimePickerVisible: false,
            birthDate:null,
            buttonClicked:false
        }
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    }

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    }

    handleDatePicked = date => {
        this.setState({
            birthDate: date
        })
        this.hideDateTimePicker();
    };

    handleSignUp = () => {
        // check that the name and the password are not empty
        if(this.state.name === "" ||
            this.state.username === "" ||
            this.state.email === "" ||
            this.state.password === "" ||
            this.state.birthDate === null) {
            this.setState({errorMessage: "Make sure you have filled all the fields."})
        }else{
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
                this.setState({buttonClicked: true})
                const userId = firebase.auth().currentUser.uid
                ConnectyCubeHandler.setInstance().then(() => {
                    return ConnectyCubeHandler.signUp(userId, userId).then(session => {
                        return AccountHandler.signUp(
                            firebase.auth().currentUser.uid,
                            this.state.name,
                            this.state.surname,
                            userId,
                            false,
                            this.state.sex,
                            session.id,
                            this.state.birthDate)
                    }).then(()=>{
                        return ConnectyCubeHandler.login(userId)
                    }).then(() => {
                        LoadingHandler.initApp(userId).then(()=>{
                            this.props.navigation.navigate('Home')
                        })
                    }).catch(error => this.setState({errorMessage: error.message}))
                })

            }).catch(error => this.setState({errorMessage: error.message}))
        }
    }

    render() {
        if(!this.state.buttonClicked){
            return (
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            {this.state.errorMessage &&
                            <Text style={{ color: 'red' }}>
                                {this.state.errorMessage}
                            </Text>}
                            <Text style={styles.title}>SignUp</Text>
                            <TextInput
                                label="Name"
                                mode={"outlined"}
                                autoCapitalize="none"
                                style={styles.textInput}
                                onChangeText={name => this.setState({ name })}
                                value={this.state.name}
                            />
                            <TextInput
                                label="Surname"
                                mode={"outlined"}
                                autoCapitalize="none"
                                style={styles.textInput}
                                onChangeText={surname => this.setState({ surname })}
                                value={this.state.surname}
                            />
                            <TextInput
                                label="Email"
                                mode={"outlined"}
                                autoCapitalize="none"
                                style={styles.textInput}
                                onChangeText={email => this.setState({ email })}
                                value={this.state.email}
                            />
                            <TextInput
                                secureTextEntry
                                mode={"outlined"}
                                label="Password"
                                autoCapitalize="none"
                                style={styles.textInput}
                                onChangeText={password => this.setState({ password })}
                                value={this.state.password}
                            />
                            <View  style={{flexDirection:"row"}}>
                                <Text style={styles.text}>Select your sex:</Text>
                                <RadioButton.Group
                                    onValueChange={value => this.setState({ sex: value })}
                                    value={this.state.sex}
                                >
                                    <View>
                                        <Text>Male</Text>
                                        <RadioButton value="M" />
                                    </View>
                                    <View>
                                        <Text>Female</Text>
                                        <RadioButton value="F" />
                                    </View>
                                </RadioButton.Group>
                            </View>

                            <Button
                                style={styles.button}
                                mode={"outlined"}
                                onPress={this.showDateTimePicker}>
                                Select your birthdate
                            </Button>
                            <DateTimePicker
                                mode={"date"}
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                                maximumDate={new Date()}
                            />
                        </View>

                        <View>
                            <Button
                                style={styles.button}
                                mode={"outlined"}
                                onPress={this.handleSignUp}>
                                SignUp
                            </Button>
                            <Button
                                style={styles.button}
                                mode={"outlined"}
                                onPress={() => this.props.navigation.navigate('Login')}
                            >
                                Already have an account? Login
                            </Button>
                        </View>
                    </View>
                </ScrollView>
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
        alignItems: 'center'
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
    header: {
        flex: 1,
        marginTop: hp("10%"),
        marginBottom: hp("10%"),
        width: wp('90%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    title:{
        fontSize: 20,
        fontWeight: "bold"
    },
})