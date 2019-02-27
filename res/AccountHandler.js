import IP_ADDRESS from '../ip'
class AccountHandler {
    static signUp(idAccount, name, surname, username, isBuddy, idToken){
        return fetch(IP_ADDRESS + ":3000/api/Accounts/" + idAccount, {
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