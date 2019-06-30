import { Dimensions } from "react-native";

class OrientationHandler{
    static orientation =  ""

    static getOrientation = () => {
            if(Dimensions.get("window").width < Dimensions.get("window").height){
                OrientationHandler.orientation = "portrait"
                console.log("portrait")
            }else{
                OrientationHandler.orientation = "landscape"
                console.log("landscape")
            }
        }
}
OrientationHandler.shared = new OrientationHandler()
export default OrientationHandler