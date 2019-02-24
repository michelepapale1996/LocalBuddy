import firebase from 'react-native-firebase'
import ChatsHandler from "./ChatsHandler";
import UserHandler from "./UserHandler";

class Db {
    static createChatBetween(idUser, idOtherUser){
        //create node in /chats
        var ref = firebase.database().ref("/chats").push(
            {
                idUser1: idUser,
                idUser2: idOtherUser,
                messages: ""
            }
        )

        //create node in each user!
        firebase.database().ref("/users/" + idUser + "/chats/").child(idOtherUser).set(ref.key)
        firebase.database().ref("/users/" + idOtherUser + "/chats/").child(idUser).set(ref.key)

        return ref.key
    }

    static sendNewMessage(chatId, userId, message){
        firebase.database().ref("chats/" + chatId + "/messages").push(
            {
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                idUser: userId,
                text: message.text
            }
        )
    }

    //used in allChats to retrieve all the info of the given chatIds
    static getChatsInfoFromChatId(chats){
        const id = firebase.auth().currentUser.uid
        let promisesAllChats = []
        chats.map(
            chat=>{
                promisesAllChats.push(firebase.database().ref("/chats/" + chat).once("value"))
            }
        )

        return new Promise(resolve => {
            Promise.all(promisesAllChats).then(
                result => {
                    const promises = result.map(
                        (chat,index) => {
                            const messages = chat.val().messages
                            const lastMessage = ChatsHandler.getLastMessage(messages)

                            let idOtherUser = "";
                            if( id == chat.val().idUser1){
                                idOtherUser = chat.val().idUser2;
                            }else{
                                idOtherUser = chat.val().idUser1;
                            }

                            let promisesInfoChat = [
                                UserHandler.getNameAndSurname(idOtherUser),
                                UserHandler.getUrlPhoto(idOtherUser),
                                UserHandler.getUrlPhoto(id)
                            ]
                            return Promise.all(promisesInfoChat).then(
                                results => {
                                    return {
                                        chatId: chats[index],
                                        lastMessageText: lastMessage.text,
                                        createdAt: lastMessage.createdAt,
                                        nameAndSurname: results[0],
                                        urlPhotoOther: results[1],
                                        urlPhotoUser: results[2]
                                    }
                                }
                            )
                        }
                    )
                    Promise.all(promises).then(chatsInfo => resolve(chatsInfo))
                }
            )
        })
    }

    static getChatIdFromUsersIds(idLoggedUser, id){
        return new Promise(
            resolve => {
                const query = "/users/" + idLoggedUser + "/chats/" + id
                firebase.database().ref(query).once("value").then(
                    chatId =>{
                        resolve(chatId.val())
                    }
                )
            }
        )
    }
}

Db.shared = new Db();
export default Db;