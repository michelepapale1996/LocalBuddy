import AsyncStorage from "@react-native-community/async-storage";
import ChatsHandler from "../handler/ChatsHandler";

class LocalChatsHandler {
    static updates = []


    static async setChats(chats){
        if(chats !== null) await AsyncStorage.setItem("chats", JSON.stringify(chats));
    }

    static async getChats(){
        try {
            const value = await AsyncStorage.getItem('chats')
            if (value !== null) {
                return JSON.parse(value)
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async getMessages(){
        try {
            const value = await AsyncStorage.getItem('messages')
            if (value !== null) {
                return JSON.parse(value)
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async getMessagesWith(chatId){
        try {
            var messages = await AsyncStorage.getItem('messages')
            if (messages !== null) {
                messages = JSON.parse(messages)
                console.log(messages)
                messages.forEach((dialog, index) => {
                    if(dialog[0].chatId == chatId) return messages[index]
                })
                return []
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    //called if there is not a dialog
    static async addChat(){
        try {
            var chats = await ChatsHandler.getChats()
            await AsyncStorage.removeItem('chats')
            await AsyncStorage.setItem("chats", JSON.stringify(chats));
        } catch (error) {
            console.log(error)
        }
    }

    //called if there is already a dialog
    static async updateChats(payload){
        try {
            var chats = await LocalChatsHandler.getChats()
            chats.forEach((elem, index) => {
                if(elem.chatId === payload.chatId){
                    chats[index].lastMessageText = payload.text
                    chats[index].createdAt = payload.createdAt
                }
            })
            await AsyncStorage.removeItem('chats')
            await AsyncStorage.setItem("chats", JSON.stringify(chats));
        } catch (error) {
            console.log(error)
        }
    }

    static async addMessage(payload){
        try {
            var messages = await LocalChatsHandler.getMessages()
            var chatFound = messages.filter(chat => {
                return chat[0].chatId === payload.chatId
            })
            chatFound = chatFound[0]
            if(chatFound != null){
                LocalChatsHandler.updateChats(payload)
                chatFound.push(payload)
            }else{
                //create a new chat
                LocalChatsHandler.addChat()
                chatFound = [payload]
            }

            const otherChats = messages.filter(chat => {
                return chat.chatId != payload.chatId
            })
            await AsyncStorage.removeItem('messages')

            if(otherChats.length > 0) await AsyncStorage.setItem("messages", JSON.stringify([chatFound, otherChats]));
            else await AsyncStorage.setItem("messages", JSON.stringify([chatFound]));
        } catch (error) {
            console.log(error)
        }
    }
}

LocalChatsHandler.shared = new LocalChatsHandler()
export default LocalChatsHandler