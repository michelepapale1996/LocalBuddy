import firebase from "react-native-firebase"
import SingleChatHandler from "./SingleChatHandler"
import ConnectyCubeHandler from "./ConnectyCubeHandler"
import UserHandler from "./UserHandler";
import ChatsHandler from "./ChatsHandler";
import LocalChatsHandler from "../LocalHandler/LocalChatsHandler";
import MessagesUpdatesHandler from "../updater/MessagesUpdatesHandler";
import LocalStateUpdater from "../updater/LocalStateUpdater";

class LoadingHandler{
    static async initApp(userId){
        await ConnectyCubeHandler.setInstance()
        ConnectyCubeHandler.createSession(userId).then(()=>{
            const CCUserId = ConnectyCubeHandler.getCCUserId()
            //SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')
        })
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