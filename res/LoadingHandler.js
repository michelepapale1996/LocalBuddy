import firebase from "react-native-firebase";
import SingleChatHandler from "./SingleChatHandler";
import ConnectyCubeHandler from "./ConnectyCubeHandler";

class LoadingHandler{
    static initApp(userId){
        //push notifications
        return firebase.messaging().hasPermission().then(enabled => {
            if (enabled) {
                const instance = ConnectyCubeHandler.getInstance()
                //user has opened the app and it was previously logged in -> reconnect to connectycube
                if (instance === null){
                    ConnectyCubeHandler.setInstance().then(() => {
                        ConnectyCubeHandler.createSession(userId).then(()=> {
                            const CCUserId = ConnectyCubeHandler.getCCUserId()
                            SingleChatHandler.connectToChat(CCUserId, 'LocalBuddy')
                            firebase.messaging().getToken().then(token => {
                                var params = {
                                    notification_channel: 'gcm',
                                    device: {
                                        platform: 'android',
                                        udid: token
                                    },
                                    push_token: {
                                        environment: 'development',
                                        client_identification_sequence: token
                                    }
                                };

                                ConnectyCubeHandler.getInstance().pushnotifications.subscriptions.create(params, function (error, result) {
                                });

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