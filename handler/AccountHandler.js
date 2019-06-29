import IP_ADDRESS from '../ip'
import firebase from "react-native-firebase"
import LocalUserHandler from "../LocalHandler/LocalUserHandler";
import ConnectyCubeHandler from "./ConnectyCubeHandler";
import ChatsHandler from "./ChatsHandler";
import UserHandler from "./UserHandler";

class AccountHandler {
    //from ConnectyCube
    static getUserId(id){
        return new Promise((resolve,reject) => {
            var searchParams = {filter: { field: 'id', param: 'in', value: id }};
            ConnectyCubeHandler.getInstance().users.get(searchParams, function(error, res){
                if(error !== null){
                    reject(error);
                }

                //if the user is a deleted user
                if(res.items.length == 0){
                    reject()
                } else {
                    resolve(res.items[0].user.custom_data)
                }
            })
        })
    }

    static signUp(idAccount, name, surname, username, isBuddy, sex, ccUserId, birthDate){
        //to do request to backend, we have to authenticate the client
        firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
            return fetch(IP_ADDRESS + "/api/users/" + idAccount, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    surname: surname,
                    username: username,
                    isBuddy: isBuddy,
                    idToken: idToken,
                    sex: sex,
                    ccUserId: ccUserId,
                    birthDate: birthDate
                })
            }).catch( err => {
                console.log("Error", err)
                return null
            })
        }).catch(function(error) {
            console.log("Error in retrieving idToken from firebase.auth()", error)
            return null
        });
    }

    static reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    static changePassword(oldPassword, newPassword, repeatedNewPassword){
        return new Promise((resolve, reject) => {
            if(newPassword != repeatedNewPassword){
                reject("NewPassword and repeatedNewPassword do not match")
            }else if(newPassword == "" || repeatedNewPassword == "" || oldPassword ==""){
                reject("No field must be empty")
            }else{
                AccountHandler.reauthenticate(oldPassword).then(() => {
                    var user = firebase.auth().currentUser;
                    user.updatePassword(newPassword).then(() => {
                        resolve("Password updated!")
                    }).catch(error => {
                        reject(error.toString())
                    })
                }).catch(error => {
                    reject(error.toString())
                })
            }
        })
    }

    static deleteAccount = () => {
        const idUser = firebase.auth().currentUser.uid
        //to do request to backend, we have to authenticate the client
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser, {
                method: "DELETE",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id
                })
            }).catch( err => {
                console.log("Error", err)
                return null
            })
        }).then(()=>{
            //the user cannot be deleted from connectycube, otherwise it is not possbile to retrieve old dialogs
            //ConnectyCubeHandler.deleteUser()
            //ChatsHandler.deleteChats()
        }).then(()=> {
            ConnectyCubeHandler.deleteAllSubscriptions()
        }).then(()=>{
            LocalUserHandler.clearStorage()
            return firebase.auth().signOut()
        }).catch(function(error) {
            console.log("Error in retrieving idToken from firebase.auth()", error)
            return null
        });
    }

    static logOut = ()=>{
        return UserHandler.deletePushNotificationSubscriptionForThisDevice().then(()=>{
            LocalUserHandler.clearStorage()
            ConnectyCubeHandler.deletePushNotificationSubscriptionForThisDevice()
            return firebase.auth().signOut()
        })
    }
}

AccountHandler.shared = new AccountHandler();
export default AccountHandler;