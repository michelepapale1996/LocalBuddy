import IP_ADDRESS from '../ip'
import firebase from "react-native-firebase";
class CityHandler{

    //get buddies of that city
    static getCity(cityId){
        return fetch(IP_ADDRESS + "/api/cities/" + cityId).then(response => {
            if(response.status == 200){
                return response.json()
            }else{
                return null
            }
        }).catch( err => console.log(err))
    }

    //getCity
    static getFilteredCity(cityId){
        const idUser = firebase.auth().currentUser.uid
        //to do request to backend, we have to authenticate the client
        return firebase.auth().currentUser.getIdToken(true).then(function(id) {
            console.log(IP_ADDRESS + "/api/cities/" + cityId + "/filtered")
            return fetch(IP_ADDRESS + "/api/cities/" + cityId + "/filtered", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: id,
                    idUser: idUser
                })
            }).then(response => {
                if(response.status == 200){
                    return response.json()
                }else{
                    return null
                }
            }).catch( err => {
                console.log("Error", err)
                return null
            })
        }).catch(function(error) {
            console.log("Error in retrieving idToken from firebase.auth()", error)
            return null
        })
    }
}

CityHandler.shared = new CityHandler()
export default CityHandler