import IP_ADDRESS from '../ip'
import firebase from "react-native-firebase"

class AccountHandler {
    static signUp(idAccount, name, surname, username, isBuddy, idToken){
        //to do request to backend, we have to authenticate the client
        firebase.auth().currentUser.getIdToken(true).then(function(id) {
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
                    idToken: id
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
}

AccountHandler.shared = new AccountHandler();
export default AccountHandler;