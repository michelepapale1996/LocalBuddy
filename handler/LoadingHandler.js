import firebase from "react-native-firebase"
import SingleChatHandler from "./SingleChatHandler"
import ConnectyCubeHandler from "./ConnectyCubeHandler"
import UserHandler from "./UserHandler";
import LocalStateHandler from "./LocalStateHandler";
import ChatsHandler from "./ChatsHandler";

class LoadingHandler{
    static async initApp(userId){

        var instance = ConnectyCubeHandler.getInstance()
        //user does not come from sign up-> connect to connectycube
        if (instance === null) {
            await ConnectyCubeHandler.setInstance()
            await ConnectyCubeHandler.createSession(userId)
        }
        const CCUserId = ConnectyCubeHandler.getCCUserId()
        //SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')

        //push notifications
        firebase.messaging().hasPermission().then(enabled => {
            if (enabled) {
                firebase.messaging().getToken().then(token => {
                    ConnectyCubeHandler.createPushNotificationSubscription(token)
                    UserHandler.createPushNotificationSubscription(token)
                })
            } else {
                firebase.messaging().requestPermission().then(() => {
                    alert("User Now Has Permission")
                }).catch(error => {
                    alert("Error", error)
                    // User has rejected permissions
                })
            }
        })
    }
}
LoadingHandler.shared = new LoadingHandler();
export default LoadingHandler;