class MessagesUpdatesHandler{
    static listeners = []

    //used to add a new function that will be called when there is a new update
    static addListener(fn) {
        MessagesUpdatesHandler.listeners.push(fn);
    }

    //todo: check that works!
    static removeListeners(fn){
        MessagesUpdatesHandler.listeners = MessagesUpdatesHandler.listeners.filter( elem => {
            if (elem != fn) return elem
        })
    }

    //when there is a new message, this method will trigger all the listeners
    static update(msgRcvd, userId) {
        MessagesUpdatesHandler.listeners.forEach(fn => fn(msgRcvd, userId));
    }
}
MessagesUpdatesHandler.shared = new MessagesUpdatesHandler()
export default MessagesUpdatesHandler