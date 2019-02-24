class CityHandler{
    static getCity(cityId){
        return fetch("http://192.168.100.8:3000/api/cities/" + cityId).then(response => {
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