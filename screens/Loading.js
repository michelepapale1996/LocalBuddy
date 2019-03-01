import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import LocalStateHandler from "../res/LocalStateHandler";
import ConnectyCubeHandler from "../res/ConnectyCubeHandler";
import {NotificationsAndroid} from 'react-native-notifications';

// On Android, we allow for only one (global) listener per each event type.


NotificationsAndroid.setNotificationOpenedListener((notification) => {
    console.log("Notification opened by device user", notification.getData());
    alert(JSON.stringify(notification))
});

export default class Loading extends React.Component {
    //authFlag used because onAuthStateChanged can be called multiple times and the job must be done once
    authFlag = false;

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if(user && !this.authFlag){
                this.authFlag = true

                /* TO DO CALL TO BACKEND
                firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                    console.log(idToken)
                }).catch(function(error) {
                    // Handle error
                });*/

                ConnectyCubeHandler.setInstance(user.uid).then(()=>{
                    //push notifications
                    firebase.messaging().hasPermission().then(enabled => {
                        if (enabled) {
                            firebase.messaging().getToken().then(token => {
                                console.log(token)
                                var params = {
                                    notification_channel: 'gcm',
                                    device: {
                                        platform: 'android',
                                        udid: token
                                    },
                                    push_token: {
                                        environment: 'development',
                                        client_identification_sequence: token
                                    }
                                };

                                ConnectyCubeHandler.getInstance().pushnotifications.subscriptions.create(params, function(error, result){

                                });

                            })
                            // user has permissions
                        } else {
                            firebase.messaging().requestPermission()
                                .then(() => {
                                    alert("User Now Has Permission")
                                })
                                .catch(error => {
                                    console.log(error)
                                    alert("Error", error)
                                    // User has rejected permissions
                                });
                        }
                    });

                    //current user must have his info in local
                    return LocalStateHandler.handleLocalState(user.uid)
                }).then(
                    ()=> this.props.navigation.navigate('Home')
                )

            }else{
                this.props.navigation.navigate('Login')
            }

        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Loading</Text>
                <ActivityIndicator size="large" />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})