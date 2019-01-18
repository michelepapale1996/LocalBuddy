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

    static sendNewMessage(chatId, userId, message){
        firebase.database().ref("chats/" + chatId + "/messages").push(
            {
                createdAt: message.createdAt,
                idUser: userId,
                text: message.text
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