import cc from "connectycube-reactnative";
import UserHandler from "./UserHandler";
import MessagesUpdatesHandler from "./MessagesUpdatesHandler";

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

    static onMessage(userId, message) {
        MessagesUpdatesHandler.updateFromConnectyCube(message, userId)
    }

    static init(userId){
        return UserHandler.getUsername(userId).then(
            username => {
                ConnectyCubeHandler.CCinstance = new cc.ConnectyCube()
                ConnectyCubeHandler.CCinstance.init(CREDENTIALS,CONFIG);
                return ConnectyCubeHandler._createSession(username, 'LocalBuddy')
            }
        )
    }

    static _createSession(username, pwd){
        var userCredentials = {login: username, password: pwd};
        return new Promise((resolve, reject) => {
            ConnectyCubeHandler.CCinstance.createSession(userCredentials, function(error, session) {
                if(error !== null) reject(error)
                ConnectyCubeHandler.CCinstance.chat.onMessageListener = ConnectyCubeHandler.onMessage;
                resolve(session)
            });
        })
    }

    static setInstance(userId){
        return ConnectyCubeHandler.init(userId).then(
            session => {
                ConnectyCubeHandler.CCUserId = session.user_id
                return ConnectyCubeHandler.CCinstance
            }
        )
    }

    static getInstance(){
        return ConnectyCubeHandler.CCinstance
    }

    static getCCUserId(){
        return ConnectyCubeHandler.CCUserId
    }
}
ConnectyCubeHandler.shared = new ConnectyCubeHandler()
export default ConnectyCubeHandler