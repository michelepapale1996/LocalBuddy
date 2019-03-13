class MessagesUpdatesHandler{
    static listeners = []

    //used to add a new function that will be called when there is a new update
    static addListener(fn) {
        MessagesUpdatesHandler.listeners.push(fn);
    }

    static removeListeners(fn){
        MessagesUpdatesHandler.listeners = MessagesUpdatesHandler.listeners.filter( elem => {
            if (elem != fn) return elem
        })
    }

    //when there is a new message arrived from ConnectyCube, this method will trigger all the listeners
    static updateFromConnectyCube(msgRcvd, userId) {
        msgRcvd.isLocal = false
        MessagesUpdatesHandler.listeners.forEach(fn => fn(msgRcvd, userId, false));
    }

    //when there is a new message sent from the logged user, this method will trigger all the listeners
    //the difference between the two methods is essentially in the msg parameter that is different
    static updateBecauseLocalSending(msgRcvd, ccOpponentUserId) {
        msgRcvd.isLocal = true
        MessagesUpdatesHandler.listeners.forEach(fn => fn(msgRcvd, ccOpponentUserId, true));
    }
}
MessagesUpdatesHandler.shared = new MessagesUpdatesHandler()
export default MessagesUpdatesHandler