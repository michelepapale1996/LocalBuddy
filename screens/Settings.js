import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, ScrollView, TouchableWithoutFeedback} from 'react-native';
import firebase from 'react-native-firebase'
import LocalStateHandler from "../res/LocalStateHandler";
import UserHandler from "../res/UserHandler";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import LoadingComponent from '../components/LoadingComponent'

function BuddyComponent(props){
    if(props.isBuddy == 1){
        return(
            <View style={styles.singleOptionContainer}>
                <TouchableWithoutFeedback
                    onPress={()=>{alert("todo")}}>
                    <Text style={styles.text}>Smetti di essere un buddy</Text>
                </TouchableWithoutFeedback>
            </View>
        )
    }else{
        return(
            <View style={styles.singleOptionContainer}>
                <TouchableWithoutFeedback
                    onPress={()=>{alert("todo")}}>
                    <Text style={styles.text}>Diventa un buddy</Text>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

function WhoCanFindMe() {
    return(
        <View style={styles.singleOptionContainer}>
            <TouchableWithoutFeedback
                onPress={()=>alert("todo")}>
                <Text style={styles.text}>Chi può trovarmi</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

function ChangePassword(props) {
    return(
        <View style={styles.singleOptionContainer}>
            <TouchableWithoutFeedback
                onPress={()=>props.nav.navigate("ChangePassword")}>
                <Text style={styles.text}>Cambia password</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

function DeleteAccount() {
    deleteAlert = () => {
        Alert.alert(
            'Elimina account',
            'Sei sicuro di voler eliminare l\'account? L\'azione sarà irreversibile.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: true}
        );
    }

    return(
        <View style={styles.singleOptionContainer}>
            <TouchableWithoutFeedback
                onPress={deleteAlert}>
                <Text style={styles.text}>Elimina account</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

function LogOut(props) {
    logOutAlert = (props) => {
        Alert.alert(
            'Vuoi procedere al logout da LocalBuddy?',
            '',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        firebase.auth().signOut().then(() => {
                            LocalStateHandler.clearStorage()
                            props.nav.navigate('Loading')
                        }).catch(function(error) {
                            console.log(error)
                        })
                    }
                },
            ]
        )
    }

    return(
        <View style={styles.singleOptionContainer}>
            <TouchableWithoutFeedback
                onPress={() => this.logOutAlert(props)}>
                <Text style={styles.text}>Log out</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default class Settings extends Component {
    static navigationOptions = () => {
        return {
            title: "Impostazioni"
        };
    };

    constructor(props){
        super(props)
        this.state = {
            loadingDone: false
        }
    }

    componentDidMount(){
        const userId = firebase.auth().currentUser.uid;
        UserHandler.isBuddy(userId).then(response => {
            this.setState({
                isBuddy: response,
                loadingDone: true
            })
        })
    }

    render() {
        if(this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <ScrollView>
                        <View style={styles.container}>
                            <Text style={styles.header}>Preferenze</Text>
                            <WhoCanFindMe/>
                            <BuddyComponent isBuddy={this.state.isBuddy}/>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.header}>Gestione account</Text>
                            <ChangePassword nav={this.props.navigation}/>
                            <DeleteAccount/>
                            <LogOut nav={this.props.navigation}/>
                        </View>
                    </ScrollView>
                </View>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        margin: hp("0%"),
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container:{
        margin:hp("2%"),
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
    },
    singleOptionContainer:{
        margin: wp("3%"),
        height: hp("5%")
    },
    text:{
        fontSize: 20
    },
    header:{
        height: hp("5%"),
        fontSize: 20,
        color: "green",
        fontWeight:"bold"
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});
