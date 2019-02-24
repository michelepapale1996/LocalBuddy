class AccountHandler {
    static signUp(idAccount, name, surname, username, isBuddy, idToken){
        return fetch("http://192.168.100.8:3000/api/Accounts/" + idAccount, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                surname: surname,
                username: username,
                isBuddy: isBuddy,
                idToken: idToken
            })
        }).then(response => {
            //console.log(idToken)
            //console.log(response)
        }).catch( err => console.log(err))
    }
}

AccountHandler.shared = new AccountHandler();
export default AccountHandler;