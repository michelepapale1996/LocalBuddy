import firebase from "react-native-firebase"
import SingleChatHandler from "./SingleChatHandler"
import ConnectyCubeHandler from "./ConnectyCubeHandler"
import UserHandler from "./UserHandler";
import ChatsHandler from "./ChatsHandler";
import LocalChatsHandler from "../LocalHandler/LocalChatsHandler";
import MessagesUpdatesHandler from "../updater/MessagesUpdatesHandler";
import LocalStateUpdater from "../updater/LocalStateUpdater";
import LocalMeetingsHandler from "../LocalHandler/LocalMeetingsHandler";
import LocalUserHandler from "../LocalHandler/LocalUserHandler";
import NetInfoHandler from "./NetInfoHandler";

class LoadingHandler{
    static async initAppBecauseAlredyLoggedIn(userId){
        //NetInfoHandler.subscribe()
        await ConnectyCubeHandler.setInstance()
        await ConnectyCubeHandler.createSession(userId)
        const CCUserId = ConnectyCubeHandler.getCCUserId()
        SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')
    }

    static async initAppBecauseLogin(userInfo){
        await ConnectyCubeHandler.setInstance()
        await ConnectyCubeHandler.createSession(userInfo.id)
        const CCUserId = ConnectyCubeHandler.getCCUserId()
        await SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')

        //save in local
        await LocalUserHandler.storeUserInfo(userInfo)
        const citiesWhereIsBuddy = await UserHandler.getCitiesOfTheBuddy(userInfo.id)
        await LocalUserHandler.storeCitiesWhereIsBuddy(citiesWhereIsBuddy)
        await LocalMeetingsHandler.setMeetings(userInfo.meetings)

        const chats = await ChatsHandler.getChats()
        await LocalChatsHandler.setChats(chats)

        //saving in local single chats
        const promises = chats.map(chat => SingleChatHandler.retrieveChatHistory(chat.chatId, 100, null, null))
        var messages = {}
        await Promise.all(promises).then(async results => {
            results.forEach((res, index) => {
                messages[chats[index].chatId] = res
            })
            await LocalChatsHandler.setMessages(messages)
        })

        LoadingHandler.setPushNotification()
    }

    static async initAppBecauseSignUp(userId){
        //save in local
        const user = await UserHandler.getUserInfo(userId)
        await LocalUserHandler.storeUserInfo(user)

        await ConnectyCubeHandler.login(userId)
        const CCUserId = ConnectyCubeHandler.getCCUserId()
        await SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')

        LoadingHandler.setPushNotification()
    }

    static async setPushNotification(){
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