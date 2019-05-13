import firebase from "react-native-firebase"
import SingleChatHandler from "./SingleChatHandler"
import ConnectyCubeHandler from "./ConnectyCubeHandler"
import UserHandler from "./UserHandler";

class LoadingHandler{
    static initApp(userId){
        //push notifications
        return firebase.messaging().hasPermission().then(async enabled => {
            if (enabled) {
                var instance = ConnectyCubeHandler.getInstance()
                //user comes from login -> reconnect to connectycube
                if (instance === null) {
                    await ConnectyCubeHandler.setInstance()
                    await ConnectyCubeHandler.createSession(userId)
                }
                const CCUserId = ConnectyCubeHandler.getCCUserId()
                await SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')
                return firebase.messaging().getToken().then(token => {
                    ConnectyCubeHandler.createPushNotificationSubscription(token)
                    return UserHandler.createPushNotificationSubscription(token)
                })
            } else {
                firebase.messaging().requestPermission().then(() => {
                    alert("User Now Has Permission")
                }).catch(error => {
                    console.log(error)
                    alert("Error", error)
                    // User has rejected permissions
                })
            }
        })
    }
}
LoadingHandler.shared = new LoadingHandler();
export default LoadingHandler;