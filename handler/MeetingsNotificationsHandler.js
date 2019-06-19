import MeetingsUpdatesHandler from "../updater/MeetingsUpdatesHandler";

var PushNotification = require('react-native-push-notification');
class MeetingsNotificationsHandler{
    static currentScreen;

    static setScreen(screen){
        MeetingsNotificationsHandler.currentScreen = screen
    }

    static newNotification(notification, navigation) {
        const click = notification.userInteraction
        const appInForeground = notification.foreground
        if (appInForeground && MeetingsNotificationsHandler.currentScreen.routeName != "CalendarView" && MeetingsNotificationsHandler.currentScreen.routeName != "ListView") {
            //notify
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
                type: "meeting",

                isLocal: true
            })
        }

        //update
        if(notification.title == "New meeting"){
            MeetingsUpdatesHandler.newMeeting(notification.date, notification.time, notification.idOpponent)
        }else if(notification.title == "Meeting accepted") {
            MeetingsUpdatesHandler.acceptedMeeting(notification.date, notification.time, notification.idOpponent)
        }else if(notification.title == "It's meeting time"){
            MeetingsUpdatesHandler.fromFutureToPastMeeting(notification.date, notification.time, notification.idOpponent)
        }else if(notification.title == "Meeting denied"){
            MeetingsUpdatesHandler.deniedMeeting(notification.date, notification.time, notification.idOpponent)
        }

        //if user tapped on notification
        if(click){
            //app in background and user clicked on notification
            navigation.navigate('ListView')
        }
    }
}
MeetingsNotificationsHandler.shared = new MeetingsNotificationsHandler()
export default MeetingsNotificationsHandler