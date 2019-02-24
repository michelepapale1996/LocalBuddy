class UserHandler{
    //status 404 if user does not exist
    static getUserInfo(idUser){
        //call to backend to retrieve user profile
        return fetch("http://192.168.100.8:3000/api/users/" + idUser).then(response => {
            if(response.status == 200){
                response = response.json()
                return response
            }else{
                console.log("Errore nella richiesta")
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
}

UserHandler.shared = new UserHandler()
export default UserHandler