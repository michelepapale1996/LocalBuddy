import IP_ADDRESS from "../ip"
import firebase from "react-native-firebase";

class UserHandler{
    //status 404 if user does not exist
    static getUserInfo(idUser){
        return fetch(IP_ADDRESS + "/api/users/" + idUser).then(response => {
            if(response.status == 200){
                response = response.json()
                return response
            }else{
                console.log("Error in the request: ", response.status)
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
            return user.photoPath
        })
    }

    static getCities(userId){
        return this.getUserInfo(userId).then(user => {
            return user.cities
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

    static getPreferences() {
        const idUser = firebase.auth().currentUser.uid
        return UserHandler.getUserInfo(idUser).then(user => {
            return user.preferences
        })
    }
}

UserHandler.shared = new UserHandler()
export default UserHandler