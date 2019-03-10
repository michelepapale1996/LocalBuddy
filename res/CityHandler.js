import IP_ADDRESS from '../ip'
class CityHandler{
    static getCity(cityId){
        return fetch(IP_ADDRESS + "/api/cities/" + cityId).then(response => {
            if(response.status == 200){
                return response.json()
            }else{
                return null
            }
        }).catch( err => console.log(err))
    }
}

CityHandler.shared = new CityHandler()
export default CityHandler