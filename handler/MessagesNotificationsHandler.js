import MeetingsNotificationsHandler from "./MeetingsNotificationsHandler";

var PushNotification = require('react-native-push-notification');
class MessagesNotificationsHandler{
    static currentScreen;

    static setScreen(screen) {
        MeetingsNotificationsHandler.currentScreen = screen
    }

    static newNotification(notification, navigation){
        const click = notification.userInteraction
        const appInForeground = notification.foreground
        if(appInForeground && MeetingsNotificationsHandler.currentScreen != "AllChats" && MeetingsNotificationsHandler.currentScreen != "SingleChat"){
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
            navigation.navigate('SingleChat', {
                chatId: notification.chatId,
                nameAndSurname: notification.opponentName,
                urlPhotoOther: notification.urlPhotoOther,
                CCopponentUserId: notification.CCopponentUserId,
                userName: notification.opponentName
            })
        }
    }
}
MessagesNotificationsHandler.shared = new MessagesNotificationsHandler()
export default MessagesNotificationsHandler