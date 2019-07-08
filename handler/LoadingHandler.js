import firebase from "react-native-firebase"
import SingleChatHandler from "./SingleChatHandler"
import ConnectyCubeHandler from "./ConnectyCubeHandler"
import UserHandler from "./UserHandler";
import ChatsHandler from "./ChatsHandler";
import LocalChatsHandler from "../LocalHandler/LocalChatsHandler";
import LocalMeetingsHandler from "../LocalHandler/LocalMeetingsHandler";
import LocalUserHandler from "../LocalHandler/LocalUserHandler";
import NetInfoHandler from "./NetInfoHandler";
import Updater from "../updater/Updater";

class LoadingHandler{
    static async initAppBecauseAlredyLoggedIn(userId){
        await ConnectyCubeHandler.setInstance()
        await ConnectyCubeHandler.createSession(userId)
        NetInfoHandler.subscribe()
        const CCUserId = ConnectyCubeHandler.getCCUserId()
        SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')

        //update info user and meetings
        UserHandler.getUserInfo(userId).then(async userInfo => {
            //save in local
            await LocalUserHandler.storeUserInfo(userInfo)
            await UserHandler.getCitiesOfTheBuddy(userInfo.id).then(citiesWhereIsBuddy => {
                LocalUserHandler.storeCitiesWhereIsBuddy(citiesWhereIsBuddy)
            })
            await LocalMeetingsHandler.setMeetings(userInfo.meetings)

            //when the local state is updated -> fire the updaters
            Updater.update()
        })
    }

    static async initAppBecauseLogin(userInfo){
        await ConnectyCubeHandler.setInstance()
        await ConnectyCubeHandler.createSession(userInfo.id)
        const CCUserId = ConnectyCubeHandler.getCCUserId()
        await SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')

        //save in local
        await LocalUserHandler.storeUserInfo(userInfo)
        UserHandler.getCitiesOfTheBuddy(userInfo.id).then(citiesWhereIsBuddy => {
            LocalUserHandler.storeCitiesWhereIsBuddy(citiesWhereIsBuddy)
        })
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
        NetInfoHandler.subscribe()
    }

    static async initAppBecauseSignUp(userId){
        NetInfoHandler.subscribe()
        //save in local
        const user = await UserHandler.getUserInfo(userId)
        await LocalUserHandler.storeUserInfo(user)

        await ConnectyCubeHandler.login(userId)
        const CCUserId = ConnectyCubeHandler.getCCUserId()
        await SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')

        LoadingHandler.setPushNotification()
        NetInfoHandler.subscribe()
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