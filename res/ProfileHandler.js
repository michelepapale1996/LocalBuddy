import {AsyncStorage} from "react-native"

class ProfileHandler {

    static getUserInfo(idUser){
        //call to backend to retrieve userProfile
        return fetch("http://192.168.100.8:3000/api/users/" + idUser).then(response => {
            return response.json()
        }).catch( err => console.log(err))
    }

    static async storeUserInfo(user){
        try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            console.log(error)
        }
    }

    static async retrieveUserInfo(){
        try {
            const value = await AsyncStorage.getItem('user')
            if (value !== null) {
                return JSON.parse(value)
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async userIsAlreadyInMemory(){
        return AsyncStorage.getAllKeys().then(
            keys => {
                return(keys.includes("user"))
            }
        )
    }

    static async handleLocalState(userId){
        //check if the current user info are already in memory
        return ProfileHandler.userIsAlreadyInMemory().then(
            result => {
                if(!result){
                    //download user info and store in local memory
                    return ProfileHandler.getUserInfo(userId).then(
                        userInfo => {
                            ProfileHandler.storeUserInfo(userInfo)
                        }
                    )
                }
            }
        )
    }

    static async clearStorage(){
        return AsyncStorage.clear()
    }
}

ProfileHandler.shared = new ProfileHandler();
export default ProfileHandler;