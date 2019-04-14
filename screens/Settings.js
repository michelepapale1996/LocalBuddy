import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, ScrollView, TouchableWithoutFeedback} from 'react-native';
import firebase from 'react-native-firebase'
import LocalStateHandler from "../res/LocalStateHandler";
import UserHandler from "../res/UserHandler";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import LoadingComponent from '../components/LoadingComponent'
import CitiesOfBuddy from "./CitiesOfBuddy";

function BuddyComponent(props){

    stopToBeBuddy = () => {
        UserHandler.stopToBeBuddy()
        props.isBuddyUpdater(0)
    }

    becomeBuddy = () => {
        UserHandler.becomeBuddy()
        props.isBuddyUpdater(1)
    }

    if(props.isBuddy == 1){
        return(
            <View>
                <WhoCanFindMe nav={props.nav}/>
                <YourCities nav={props.nav}/>
                <View style={styles.singleOptionContainer}>
                    <TouchableWithoutFeedback
                        onPress={this.stopToBeBuddy}>
                        <Text style={styles.text}>Stop to be buddy</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }else{
        return(
            <View style={styles.singleOptionContainer}>
                <TouchableWithoutFeedback
                    onPress={this.becomeBuddy}>
                    <Text style={styles.text}>Become buddy</Text>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

function YourCities(props) {
    return (
        <View style={styles.singleOptionContainer}>
            <TouchableWithoutFeedback
                onPress={() => props.nav.navigate('CitiesOfBuddy')}>
                <Text style={styles.text}>Your cities</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

function WhoCanFindMe(props) {
    return (
        <View style={styles.singleOptionContainer}>
            <TouchableWithoutFeedback
                onPress={() => props.nav.navigate('WhoCanFindMe')}>
                <Text style={styles.text}>Who can find me</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

function ChangePassword(props) {
    return(
        <View style={styles.singleOptionContainer}>
            <TouchableWithoutFeedback
                onPress={()=>props.nav.navigate("ChangePassword")}>
                <Text style={styles.text}>Change password</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

function DeleteAccount() {
    deleteAlert = () => {
        Alert.alert(
            'Delete account',
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
                <Text style={styles.text}>Delete account</Text>
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
            title: "Settings"
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

    //function to change the state of this component from other components
    isBuddyUpdater = (itIs) => {
        this.setState({
            isBuddy: itIs
        })
    }

    render() {
        if(this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <ScrollView>
                        <View style={styles.container}>
                            <Text style={styles.header}>Preferences</Text>
                            <BuddyComponent isBuddy={this.state.isBuddy} isBuddyUpdater={this.isBuddyUpdater} nav={this.props.navigation}/>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.header}>Account</Text>
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
        flex:1,
        margin:hp("2%"),
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
    },
    singleOptionContainer:{
        flex:1,
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
    }
});
