import firebase from 'react-native-firebase'

class Db {
    static getNameAndSurnameFromId(id){
        return new Promise(
            (resolve,reject) => {
                firebase.database().ref("/users/" + id).once("value").then(
                    snap => {
                        resolve(snap.val().name + " " +snap.val().surname)
                    }
                ).catch(
                    err => console.log(err)
                )
            }
        )
    }

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
                    promises = result.map(
                        (chat,index) => {
                            const messages = chat.val().messages
                            let messagesArray = []

                            for(key in messages){
                                messagesArray.push(messages[key])
                            }

                            //sort the messages in date order
                            messagesArray.sort(function(a,b){
                                return new Date(b.createdAt) - new Date(a.createdAt);
                            })

                            let idOtherUser = "";
                            if( id == chat.val().idUser1){
                                idOtherUser = chat.val().idUser2;
                            }else{
                                idOtherUser = chat.val().idUser1;
                            }

                            let promisesInfoChat = [
                                Db.getNameAndSurnameFromId(idOtherUser),
                                Db.getUrlPhotoFromId(idOtherUser),
                                Db.getUrlPhotoFromId(id)
                            ]

                            return Promise.all(promisesInfoChat).then(
                                results => {
                                    return {
                                        chatId: chats[index],
                                        lastMessageText: messagesArray[0].text,
                                        lastMessageTime: messagesArray[0].createdAt,
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

    static getUrlPhotoFromId = (userId) => {
        return new Promise(
            resolve => {
                firebase.storage().ref("/PhotosProfile/" + userId).getDownloadURL().then(
                    (url) => {
                        resolve(url)
                    }
                ).catch(
                    ()=> {
                        firebase.storage().ref("/PhotosProfile/blank.png").getDownloadURL().then(
                            (url) => {
                                resolve(url)
                            }
                        )
                    }
                )
            }
        )
    }
}

Db.shared = new Db();
export default Db;