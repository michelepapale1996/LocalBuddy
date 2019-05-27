import React, {Component} from 'react';
import {StyleSheet, View, Alert, ScrollView } from 'react-native';
import firebase from 'react-native-firebase'
import LocalStateHandler from "../handler/LocalStateHandler";
import UserHandler from "../handler/UserHandler";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import LoadingComponent from '../components/LoadingComponent'
import CitiesOfBuddy from "./CitiesOfBuddy";
import { Text, TouchableRipple } from 'react-native-paper';
import AccountHandler from "../handler/AccountHandler";

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
                <TouchableRipple onPress={this.stopToBeBuddy}>
                    <View style={styles.singleOptionContainer}>
                        <Text style={styles.text}>Stop to be buddy</Text>
                    </View>
                </TouchableRipple>
            </View>
        )
    }else{
        return(
            <TouchableRipple onPress={this.becomeBuddy}>
                <View style={styles.singleOptionContainer}>
                    <Text style={styles.text}>Become buddy</Text>
                </View>
            </TouchableRipple>
        )
    }
}

function YourCities(props) {
    return (
        <TouchableRipple onPress={() => props.nav.navigate('CitiesOfBuddy')}>
            <View style={styles.singleOptionContainer}>
                <Text style={styles.text}>Your cities</Text>
            </View>
        </TouchableRipple>
    )
}

function WhoCanFindMe(props) {
    return (
        <TouchableRipple
            onPress={() => props.nav.navigate('WhoCanFindMe')}>
            <View style={styles.singleOptionContainer}>
                <Text style={styles.text}>Who can find me</Text>
            </View>
        </TouchableRipple>
    )
}

function ChangePassword(props) {
    return(
        <TouchableRipple onPress={()=>props.nav.navigate("ChangePassword")}>
            <View style={styles.singleOptionContainer}>
                <Text style={styles.text}>Change password</Text>
            </View>
        </TouchableRipple>
    )
}

function DeleteAccount(props) {
    deleteAccount = () =>{
        AccountHandler.deleteAccount().then(()=>{
            props.nav.navigate('Loading')
        })
    }

    deleteAlert = () => {
        Alert.alert(
            'Delete account',
            'Are you sure you want to delete your account? The action will not be reversible.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {text: 'OK', onPress: () => this.deleteAccount()},
            ],
            {cancelable: true}
        );
    }

    return(
        <TouchableRipple onPress={deleteAlert}>
            <View style={styles.singleOptionContainer}>
                <Text style={styles.text}>Delete account</Text>
            </View>
        </TouchableRipple>
    )
}

export default class Settings extends Component {
    static navigationOptions = {
        title: "Settings",
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#2fa1ff'
        },
        headerTitleStyle: {
            color: 'white'
        }
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
                            <DeleteAccount nav={this.props.navigation}/>

                            <TouchableRipple onPress={() =>{
                                this.setState({loadingDone: false})
                                AccountHandler.logOut().then(() => {
                                    this.props.navigation.navigate('Loading')
                                })
                            }}>
                                <View style={styles.singleOptionContainer}>
                                    <Text style={styles.text}>Log out</Text>
                                </View>
                            </TouchableRipple>

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
        backgroundColor: 'white',
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
        fontWeight:"bold"
    }
});
