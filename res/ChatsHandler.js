import firebase from 'react-native-firebase'
import Db from "./Db";

class ChatsHandler {
    static getLastMessage(messages){
        let messagesArray = []
        for(key in messages){
            messagesArray.push(messages[key])
        }
        messagesArray = ChatsHandler.sortInDateOrder(messagesArray)

        return messagesArray[0]
    }

    //this function assumes that each object in container has a field called createdAt
    static sortInDateOrder(container){
        container.sort(function(a,b){
            return new Date(b.createdAt) - new Date(a.createdAt);
        })
        return container
    }
}

ChatsHandler.shared = new ChatsHandler();
export default ChatsHandler;
