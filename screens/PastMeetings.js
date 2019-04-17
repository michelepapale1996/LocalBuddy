import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, ScrollView, TouchableWithoutFeedback} from 'react-native';
import firebase from 'react-native-firebase'
import LoadingComponent from '../components/LoadingComponent'
import UserHandler from "../res/UserHandler";

export default class FutureMeetings extends Component{
    constructor(props){
        super(props)
        this.state = {
            loadingDone: false
        }
    }

    componentDidMount(){
        const userId = firebase.auth().currentUser.uid;
    }

    render() {
        if(this.state.loadingDone != false) {
            return (
                <Text>Ciao</Text>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}