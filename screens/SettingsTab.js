import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, ScrollView, TouchableWithoutFeedback} from 'react-native';
import firebase from 'react-native-firebase'
import LocalStateHandler from "../res/LocalStateHandler";
import UserHandler from "../res/UserHandler";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

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

function ChangePassword() {
    return(
        <View style={styles.singleOptionContainer}>
            <TouchableWithoutFeedback
                onPress={()=>alert("todo")}>
                <Text style={styles.text}>Cambia password</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

function DeleteAccount() {
    return(
        <View style={styles.singleOptionContainer}>
            <TouchableWithoutFeedback
                onPress={()=>alert("todo")}>
                <Text style={styles.text}>Elimina account</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

function LogOut(props) {
    return(
        <View style={styles.singleOptionContainer}>
            <TouchableWithoutFeedback
                onPress={() => firebase.auth().signOut()
                    .then(() => {
                        LocalStateHandler.clearStorage()
                        props.nav.navigate('Loading')
                    })
                    .catch(function(error) {
                        console.log(error)})}>
                <Text style={styles.text}>Log out</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default class SettingsTab extends Component {
    constructor(props){
        super(props)
        this.state = {
            isBuddy:0
        }
    }

    componentDidMount(){
        const userId = firebase.auth().currentUser.uid;
        UserHandler.isBuddy(userId).then(response => {
            this.setState({isBuddy: response})
        })
    }

    render() {
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
                        <ChangePassword/>
                        <DeleteAccount/>
                        <LogOut nav={this.props.navigation}/>
                    </View>
                </ScrollView>
            </View>
        );
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
