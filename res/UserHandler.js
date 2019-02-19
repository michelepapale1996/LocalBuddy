class UserHandler {
    static signUp(idUser, name, surname, isBuddy, idToken){
        return fetch("http://192.168.100.8:3000/api/users/" + idUser, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                surname: surname,
                isBuddy: isBuddy,
                idToken: idToken
            })
        }).then(response => {
            //console.log(idToken)
            //console.log(response)
        }).catch( err => console.log(err))
    }
}

UserHandler.shared = new UserHandler();
export default UserHandler;