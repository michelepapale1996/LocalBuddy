import AsyncStorage from '@react-native-community/async-storage'

class LocalUserHandler {
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

    static async userIsAlreadyInMemory(){
        return AsyncStorage.getAllKeys().then(
            keys => {
                return(keys.includes("user"))
            }
        )
    }

    static clearStorage(){
        return AsyncStorage.clear()
    }

    static async updateBio(text) {
        var user = await LocalUserHandler.getUserInfo()
        await AsyncStorage.removeItem('user')
        user.bio = text
        await LocalUserHandler.storeUserInfo(user)
    }

    static async getCitiesOfTheBuddy(){
        try {
            const value = await AsyncStorage.getItem('citiesWhereIsBuddy')
            if (value !== null) return JSON.parse(value)
            else return null

        } catch (error) {
            console.log(error)
        }
    }

    static async storeCitiesWhereIsBuddy(cities){
        try {
            if(cities.length > 0) await AsyncStorage.setItem("citiesWhereIsBuddy", JSON.stringify(cities));
        } catch (error) {
            console.log(error)
        }
    }

    static async savePreferences(lowerRangeTouristAge, upperRangeTouristAge, onlySameSex){
        var user = await LocalUserHandler.getUserInfo()

        user.preferences.lowerRangeTouristAge = lowerRangeTouristAge
        user.preferences.upperRangeTouristAge = upperRangeTouristAge
        user.preferences.onlySameSex = onlySameSex

        await AsyncStorage.removeItem('user')
        await AsyncStorage.setItem("user", JSON.stringify(user));
    }

    static async isBuddy(isBuddy){
        var user = await LocalUserHandler.getUserInfo()

        user.isBuddy = isBuddy

        await AsyncStorage.removeItem('user')
        await AsyncStorage.setItem("user", JSON.stringify(user));
    }

    static async addCityWhereIsBuddy(cityId, cityName){
        const city = {cityId: cityId, cityName: cityName}
        var cities = await LocalUserHandler.getCitiesOfTheBuddy()
        if(cities != null){
            cities.push(city)
            await AsyncStorage.removeItem('citiesWhereIsBuddy')
            LocalUserHandler.storeCitiesWhereIsBuddy(cities)
        } else {
            LocalUserHandler.storeCitiesWhereIsBuddy([city])
        }
    }

    static async deleteCity(cityId){
        var cities = await LocalUserHandler.getCitiesOfTheBuddy()
        cities = cities.filter(city =>{
            return city.cityId != cityId
        })
        await AsyncStorage.removeItem('citiesWhereIsBuddy')
        LocalUserHandler.storeCitiesWhereIsBuddy(cities)
    }
}

LocalUserHandler.shared = new LocalUserHandler();
export default LocalUserHandler;