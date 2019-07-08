import IP_ADDRESS from "../ip"
import firebase from "react-native-firebase";
import DeviceInfo from "react-native-device-info/deviceinfo";

class UserHandler{
    //status 404 if user does not exist
    static getUserInfo(idUser){
        return fetch(IP_ADDRESS + "/api/users/" + idUser).then(response => {
            if(response.status == 200){
                response = response.json()
                return response
            }else{
                //the user has been eliminated or it does not exist
                return null
            }
        }).catch( err => console.log(err))
    }

    static getNameAndSurname(id){
        return this.getUserInfo(id).then(user=>{
            return user.name + " " + user.surname
        })
    }

    static getUrlPhoto(id) {
        return this.getUserInfo(id).then(user => {
            return user.urlPhoto
        })
    }

    static getUsername(id) {
        return this.getUserInfo(id).then(user => {
            return user.username
        })
    }

    static isBuddy(id){
        return this.getUserInfo(id).then(user => {
            return user.isBuddy
        })
    }

    static getPreferences() {
        const idUser = firebase.auth().currentUser.uid
        return UserHandler.getUserInfo(idUser).then(user => {
            return user.preferences
        })
    }

    static setUrlPhoto(url) {
        const idUser = firebase.auth().currentUser.uid
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/photoProfile", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    url: url
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

    static getCitiesOfTheBuddy(userId){
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + userId + "/citiesOfBuddy", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id
                })
            }).then(response => {
                if(response.status == 200){
                    response = response.json()
                    return response
                }else{
                    console.log("Error in the request of the cities of the buddies: ", response.status)
                    return null
                }
            }).catch( err => {
                console.log("Error", err)
                return null
            })
        }).catch(function(error) {
            console.log("Error in retrieving idToken from firebase.auth()", error)
            return null
        });
    }

    static stopToBeBuddy(){
        const idUser = firebase.auth().currentUser.uid
        //to do request to backend, we have to authenticate the client
        firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/stopToBeBuddy", {
                method: "PUT",
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
        }).catch(function(error) {
            console.log("Error in retrieving idToken from firebase.auth()", error)
            return null
        });
    }

    static becomeBuddy(){
        const idUser = firebase.auth().currentUser.uid
        //to do request to backend, we have to authenticate the client
        firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/becomeBuddy", {
                method: "PUT",
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
        }).catch(function(error) {
            console.log("Error in retrieving idToken from firebase.auth()", error)
            return null
        });
    }

    static addCity(cityId, cityName) {
        const idUser = firebase.auth().currentUser.uid
        //to do request to backend, we have to authenticate the client
        firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/becomeBuddy/city", {
                method: "PUT",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    cityId: cityId,
                    cityName: cityName
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

    static deleteCity(cityId){
        const idUser = firebase.auth().currentUser.uid
        firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/becomeBuddy/city", {
                method: "DELETE",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    cityId: cityId
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

    static savePreferences(lowerRange, upperRange, onlySameSex){
        const idUser = firebase.auth().currentUser.uid
        //to do request to backend, we have to authenticate the client
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/preferences", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    lowerRange: lowerRange,
                    upperRange: upperRange,
                    onlySameSex: onlySameSex
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

    static saveBiography(text){
        const idUser = firebase.auth().currentUser.uid
        //to do request to backend, we have to authenticate the client
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/biography", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    text: text
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

    static addFeedback(feedbackedIdUser, starCount, text) {
        const idUser = firebase.auth().currentUser.uid
        //to do request to backend, we have to authenticate the client
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + feedbackedIdUser + "/addFeedback", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    starCount: starCount,
                    text: text,
                    opponentId: idUser
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

    static createPushNotificationSubscription(token){
        const uniqueDeviceId = DeviceInfo.getUniqueID()
        const idUser = firebase.auth().currentUser.uid
        //to do request to backend, we have to authenticate the client
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/pushNotificationToken", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    pushNotificationToken: token,
                    uniqueDeviceId: uniqueDeviceId
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

    static deletePushNotificationSubscriptionForThisDevice(){
        const uniqueDeviceId = DeviceInfo.getUniqueID()
        const idUser = firebase.auth().currentUser.uid

        //to do request to backend, we have to authenticate the client
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            return fetch(IP_ADDRESS + "/api/users/" + idUser + "/pushNotificationToken", {
                method: "DELETE",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    uniqueDeviceId: uniqueDeviceId
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

UserHandler.shared = new UserHandler()
export default UserHandler