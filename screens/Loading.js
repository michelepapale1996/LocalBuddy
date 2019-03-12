import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, ToastAndroid } from 'react-native'
import firebase from 'react-native-firebase'
import LocalStateHandler from "../res/LocalStateHandler";
import ConnectyCubeHandler from "../res/ConnectyCubeHandler";
import SingleChatHandler from "../res/SingleChatHandler";
var PushNotification = require('react-native-push-notification');

export default class Loading extends React.Component {
    //authFlag used because onAuthStateChanged can be called multiple times and the job must be done once
    authFlag = false;

    constructor(props) {
        super(props)
        this.configure(this.onNotification);
    }

    onNotification = (notification) =>{
        const click = notification.userInteraction
        //if user tapped on notification
        if(click){
            this.props.navigation.navigate('SingleChat',
                {
                    chatId: notification.chatId,
                    nameAndSurname: notification.opponentName,
                    urlPhotoOther: notification.urlPhotoOther,
                    CCopponentUserId: notification.CCopponentUserId,
                    userName: notification.opponentName
                })
        }else{
            //app in foreground
        }
    }

    configure(onNotification){
        PushNotification.configure({
            // (required) Called when a remote or local notification is opened or received
            onNotification: onNotification,

            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: "164893696006",

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: false,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true,
        });
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if(!this.authFlag) {
                this.authFlag = true

                if (user) {
                    ConnectyCubeHandler.setInstance(user.uid).then(() => {

                        const CCUserId = ConnectyCubeHandler.getCCUserId()
                        SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')

                        //current user must have his info in local
                        return LocalStateHandler.handleLocalState(user.uid)
                    }).then(() => this.props.navigation.navigate('Home'))
                } else {
                    this.props.navigation.navigate('Login')
                }
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