import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import ProfileHandler from "../res/ProfileHandler";

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

                //current user must have his info in local
                ProfileHandler.handleLocalState(user.uid).then(
                    ()=> this.props.navigation.navigate('Home')
                )

                /*push notifications
                firebase.messaging().hasPermission()
                    .then(enabled => {
                        if (enabled) {
                            firebase.messaging().getToken().then(token => {
                                console.log("LOG: ", token);
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

                this.notificationListener = firebase.notifications().onNotification((notification) => {
                    // Process your notification as required
                    const {
                        body,
                        data,
                        notificationId,
                        sound,
                        subtitle,
                        title
                    } = notification;
                    console.log("LOG: ", title, body, JSON.stringify(data))
                });
                */
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