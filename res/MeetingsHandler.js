import firebase from "react-native-firebase";
import UserHandler from "./UserHandler";
import IP_ADDRESS from "../ip";

class MeetingsHandler {
    static getFutureMeetings(){
        const idUser = firebase.auth().currentUser.uid
        return UserHandler.getFutureMeetings(idUser).then(meetings => {
            //user maybe hasn't meetings
            if(meetings == null) return []
            return meetings
        })
    }

    static getPastMeetings(){
        const idUser = firebase.auth().currentUser.uid
        return UserHandler.getPastMeetings(idUser).then(meetings => {
            //user maybe hasn't meetings
            if(meetings == null) return []
            return meetings
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

    static createMeeting(date, time, opponentId) {
        const idUser = firebase.auth().currentUser.uid
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/createMeeting", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    opponentId: opponentId,
                    date: date,
                    time: time
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