import React from 'react'
import firebase from 'react-native-firebase'
import LoadingComponent from "../components/LoadingComponent";
import LoadingHandler from "../handler/LoadingHandler";
import MessagesNotificationsHandler from "../handler/MessagesNotificationsHandler";
import MeetingsNotificationsHandler from "../handler/MeetingsNotificationsHandler";
import UserHandler from "../handler/UserHandler";
var PushNotification = require('react-native-push-notification');

export default class Loading extends React.Component {
    //authFlag used because onAuthStateChanged can be called multiple times and the job must be done once
    authFlag = false;

    constructor(props) {
        super(props)
        this.configure(this.onNotification);
    }

    onNotification = (notification) =>{
        if(notification.type == "meeting"){
            MeetingsNotificationsHandler.newNotification(notification, this.props.navigation)
        }else{
            MessagesNotificationsHandler.newNotification(notification, this.props.navigation)
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
            requestPermissions: true
        })
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if(!this.authFlag) {
                this.authFlag = true
                if (user) {
                    //check if the user exists
                    UserHandler.getUserInfo(user.uid).then(userInfo => {
                        if (userInfo) {
                            //user is logged
                            LoadingHandler.initApp(user.uid).then(() => {
                                this.props.navigation.navigate('Home')
                            })
                        } else {
                            this.props.navigation.navigate('Login')
                        }
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