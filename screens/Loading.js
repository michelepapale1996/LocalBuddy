import React from 'react'
import firebase from 'react-native-firebase'
import LoadingComponent from "../components/LoadingComponent";
import LoadingHandler from "../res/LoadingHandler";
import ChatsHandler from "../res/ChatsHandler";
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
        const appInForeground = notification.foreground

        if(appInForeground){
            PushNotification.localNotification({
                /* Android Only Properties */
                ticker: "My Notification Ticker", // (optional)
                autoCancel: true, // (optional) default: true
                largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
                smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                vibrate: true, // (optional) default: true
                vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                group: "group", // (optional) add group to message

                /* iOS and Android properties */
                title: notification.title, // (optional)
                message: notification.message, // (required)
                //custom data
                chatId: notification.chatId,
                nameAndSurname: notification.opponentName,
                urlPhotoOther: notification.urlPhotoOther,
                CCopponentUserId: notification.CCopponentUserId,
                userName: notification.opponentName
            })
        }

        //if user tapped on notification
        if(click){
            //app in background and user clicked on notification -> go to singleChat
            this.props.navigation.navigate('SingleChat',
                {
                    chatId: notification.chatId,
                    nameAndSurname: notification.opponentName,
                    urlPhotoOther: notification.urlPhotoOther,
                    CCopponentUserId: notification.CCopponentUserId,
                    userName: notification.opponentName
                })
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
                    //user is logged
                    LoadingHandler.initApp(user.uid).then(()=>{
                        this.props.navigation.navigate('Home')
                    })
                } else {
                    this.props.navigation.navigate('Login')
                }
            }
        })
    }

    render() {
        return (
            <LoadingComponent/>
        )
    }
}