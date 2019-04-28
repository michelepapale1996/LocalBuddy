import firebase from "react-native-firebase"
import SingleChatHandler from "./SingleChatHandler"
import ConnectyCubeHandler from "./ConnectyCubeHandler"

class LoadingHandler{
    static initApp(userId){
        //push notifications
        return firebase.messaging().hasPermission().then(enabled => {
            if (enabled) {
                const instance = ConnectyCubeHandler.getInstance()
                //user has opened the app and it was previously logged in -> reconnect to connectycube
                if (instance === null){
                    return ConnectyCubeHandler.setInstance().then(() => {
                        return ConnectyCubeHandler.createSession(userId).then(()=> {
                            const CCUserId = ConnectyCubeHandler.getCCUserId()
                            SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')
                            return firebase.messaging().getToken().then(token => {
                                ConnectyCubeHandler.createPushNotificationSubscription(token)
                            })
                        })
                    })
                }
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