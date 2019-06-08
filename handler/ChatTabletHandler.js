//used to link the allChats and SingleChat component in the chatTablet screen
class ChatTabletHandler{
    static listener = null

    //used to add a new function that will be called when there is a new update
    static addListener(fn) {
        ChatTabletHandler.listener = fn
    }

    static removeListener(){
        ChatTabletHandler.listener = null
    }

    static update(state){
        ChatTabletHandler.listener(state)
    }
}
ChatTabletHandler.shared = new ChatTabletHandler()
export default ChatTabletHandler