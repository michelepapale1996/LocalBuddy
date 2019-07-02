import LocalChatsHandler from "../LocalHandler/LocalChatsHandler";

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
    static updateFromConnectyCube(payload) {
        //connectycube gives notification also for my messages sent by another client -> its payload have the dialog_id to null
        if(payload.dialog_id !== null){
            var time = new Date(0); // The 0 there is the key, which sets the date to the epoch
            time.setUTCSeconds(payload.extension.date_sent);
            const update = {
                text: payload.body,
                chatId: payload.dialog_id,
                createdAt: time
            }
            LocalChatsHandler.addMessage(update, false)
            MessagesUpdatesHandler.listeners.forEach(fn => fn(update, false));
        }
    }

    //when there is a new message sent from the logged user, this method will trigger all the listeners
    //the difference between the two methods is essentially in the msg parameter that is different
    static updateBecauseLocalSending(payload) {
        LocalChatsHandler.addMessage(payload, true)
        MessagesUpdatesHandler.listeners.forEach(fn => fn(payload, true));
    }
}
MessagesUpdatesHandler.shared = new MessagesUpdatesHandler()
export default MessagesUpdatesHandler