import IP_ADDRESS from '../ip'
import firebase from "react-native-firebase"

class AccountHandler {
    static signUp(idAccount, name, surname, username, isBuddy){
        //to do request to backend, we have to authenticate the client
        firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
            return fetch(IP_ADDRESS + "/api/Accounts/" + idAccount, {
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
                    idToken: idToken
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
}

AccountHandler.shared = new AccountHandler();
export default AccountHandler;