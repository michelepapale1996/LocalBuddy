import IP_ADDRESS from "../ip"

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
}

UserHandler.shared = new UserHandler()
export default UserHandler