import cc from "connectycube-reactnative"
import UserHandler from "./UserHandler"
import MessagesUpdatesHandler from "./MessagesUpdatesHandler"
import DeviceInfo from 'react-native-device-info'

const CREDENTIALS = {
    appId: 422,
    authKey: '5p5-Z4cXyAO6q9X',
    authSecret: '64hACuSZBc2aEVT'
};
const CONFIG = {
    debug: { mode: 1 } // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
};

class ConnectyCubeHandler{
    static CCinstance = null
    static CCUserId = null

    //called by connectyCube
    static onMessage(userId, message) {
        MessagesUpdatesHandler.updateFromConnectyCube(message, userId)
    }

    static setInstance(){
        return new Promise((resolve,reject) =>{
            ConnectyCubeHandler.CCinstance = new cc.ConnectyCube()
            ConnectyCubeHandler.CCinstance.init(CREDENTIALS,CONFIG);
            ConnectyCubeHandler.CCinstance.createSession(function(error, session) {
                if(error !== null) reject(error)
                resolve(session)
            })
        })
    }

    //create a session for the user (IN CASE OF LOGIN)
    static createSession(userId){
        return new Promise((resolve, reject) => {
            UserHandler.getUsername(userId).then(username => {
                var userCredentials = {login: username, password: 'LocalBuddy'};
                ConnectyCubeHandler.CCinstance.createSession(userCredentials, function (error, session) {
                    if (error !== null) reject(error)
                    ConnectyCubeHandler.CCUserId = session.user_id
                    ConnectyCubeHandler.CCinstance.chat.onMessageListener = ConnectyCubeHandler.onMessage;
                    resolve(session)
                });
            })
        })
    }

    static signUp(login, id){
        const userProfile = {
            'login': login,
            'password': "LocalBuddy",
            'custom_data': id
        }

        return new Promise((resolve, reject) => {
            ConnectyCubeHandler.CCinstance.users.signup(userProfile, function(error, user){
                if(error !== null) reject(error)
                resolve(user)
            })
        })
    }

    //in case of SIGN UP
    static login(username){
        return new Promise((resolve, reject) => {
            ConnectyCubeHandler.CCinstance.login({login: username, password: 'LocalBuddy'}, function(error, user){
                if(error !== null) reject(error)
                ConnectyCubeHandler.CCUserId = user.id
                resolve(user)
            })
        })
    }

    static deletePushNotificationSubscription(){
        const uniqueId = DeviceInfo.getUniqueID()
        ConnectyCubeHandler.CCinstance.pushnotifications.subscriptions.list(function(error, subscriptions){
            if (!error) {
                const toDelete = subscriptions.filter(sub => sub.subscription.device.udid == uniqueId)[0]
                var subscriptionId = toDelete.subscription.id;
                ConnectyCubeHandler.CCinstance.pushnotifications.subscriptions.delete(subscriptionId, function(error){

                })
            }
        })
    }

    static deleteUser(){
        ConnectyCubeHandler.CCinstance.users.delete(function(error){
        });
    }

    static getInstance(){
        return ConnectyCubeHandler.CCinstance
    }

    static getCCUserId(){
        return ConnectyCubeHandler.CCUserId
    }

    static createPushNotificationSubscription(token) {
        const uniqueId = DeviceInfo.getUniqueID()
        var params = {
            notification_channel: 'gcm',
            device: {
                platform: 'android',
                udid: uniqueId
            },
            push_token: {
                environment: 'development',
                client_identification_sequence: token
            }
        }
        return ConnectyCubeHandler.getInstance().pushnotifications.subscriptions.create(params, function (error, result) {
        })
    }
}
ConnectyCubeHandler.shared = new ConnectyCubeHandler()
export default ConnectyCubeHandler