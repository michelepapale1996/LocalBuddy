import AsyncStorage from '@react-native-community/async-storage'
//import {AsyncStorage} from 'react-native'
import UserHandler from "./UserHandler";

class LocalStateHandler {
    static async storeUserInfo(user){
        if(user.meetings != null){
            user.meetings = Object.values(user.meetings)
        }

        try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            console.log(error)
        }
    }

    static async getUserInfo(){
        try {
            const value = await AsyncStorage.getItem('user')
            if (value !== null) {
                return JSON.parse(value)
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async getChats(){
        try {
            const value = await AsyncStorage.getItem('chats')
            if (value !== null) {
                return JSON.parse(value)
            }else{
                return []
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
        return LocalStateHandler.userIsAlreadyInMemory().then(
            result => {
                if(!result){
                    //download user info and store in local memory
                    return UserHandler.getUserInfo(userId).then(userInfo => {
                        LocalStateHandler.storeUserInfo(userInfo)
                    })
                }
            }
        )
    }

    static clearStorage(){
        return AsyncStorage.clear()
    }

    static async updateBio(text) {
        var user = await LocalStateHandler.getUserInfo()
        await LocalStateHandler.clearStorage()
        user.bio = text
        await LocalStateHandler.storeUserInfo(user)
    }
}

LocalStateHandler.shared = new LocalStateHandler();
export default LocalStateHandler;