import React from 'react'
import { StyleSheet, View, Button, ScrollView } from 'react-native'
import firebase from 'react-native-firebase'
import AccountHandler from "../res/AccountHandler";
import { Text, TextInput, RadioButton } from 'react-native-paper';
import DateTimePicker from "react-native-modal-datetime-picker";
import ConnectyCubeHandler from "../res/ConnectyCubeHandler"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default class SignUp extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            errorMessage: null ,
            name: "",
            surname: "",
            sex: "",
            isDateTimePickerVisible: false,
            birthDate:null
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
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            const userId = firebase.auth().currentUser.uid
            ConnectyCubeHandler.setInstance().then(() => {
                return ConnectyCubeHandler.signUp(this.state.username, userId).then(session => {
                    return AccountHandler.signUp(
                        firebase.auth().currentUser.uid,
                        this.state.name,
                        this.state.surname,
                        this.state.username,
                        false,
                        this.state.sex,
                        session.id,
                        this.state.birthDate)
                }).then(()=>{
                    return ConnectyCubeHandler.login(this.state.username)
                }).then(() => this.props.navigation.navigate('Loading'))
                .catch(error => this.setState({errorMessage: error.message}))
            })
        })
    }

    render() {
        return (
            <ScrollView>
            <View style={styles.container}>
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}
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
                    label="username"
                    mode={"outlined"}
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={username => this.setState({ username })}
                    value={this.state.username}
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

                <Text style={styles.text}>Select your sex</Text>
                <View  style={{flexDirection:"row", justifyContent:"space-between"}}>
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

                <Button title="Show DatePicker" onPress={this.showDateTimePicker} />
                <DateTimePicker
                    mode={"date"}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                />

                <Button title="Sign Up" onPress={this.handleSignUp} />
                <Button
                    title="Already have an account? Login"
                    onPress={() => this.props.navigation.navigate('Login')}
                />
            </View>
            </ScrollView>
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