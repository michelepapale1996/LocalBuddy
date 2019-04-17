import firebase from "react-native-firebase";
import UserHandler from "./UserHandler";
import IP_ADDRESS from "../ip";

class MeetingsHandler {
    static getMeetings(){
        const idUser = firebase.auth().currentUser.uid
        return UserHandler.getUserInfo(idUser).then(user => {
            const keys = Object.keys(user.meetings)
            let toReturn = keys.map(key=>{
                return user.meetings[key]
            })
            return toReturn
        })
    }

    static acceptMeeting(opponentId){
        const idUser = firebase.auth().currentUser.uid
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/acceptMeeting", {
                method: "PUT",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    opponentId: opponentId
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

    static denyMeeting(opponentId) {
        const idUser = firebase.auth().currentUser.uid
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/denyMeeting", {
                method: "PUT",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    opponentId: opponentId
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
MeetingsHandler.shared = new MeetingsHandler()
export default MeetingsHandler