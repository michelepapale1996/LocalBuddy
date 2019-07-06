import NetInfo from "@react-native-community/netinfo";
import ConnectyCubeHandler from "./ConnectyCubeHandler";
import SingleChatHandler from "./SingleChatHandler";
class NetInfoHandler{
    static unsubscribe
    static isConnected = true

    static getInfo(){
        return NetInfo.fetch().then(state => {
            //NetInfoHandler.isConnected = state.isConnected
        })
    }

    static subscribe(){
        NetInfoHandler.getInfo()
        // Subscribe
        NetInfoHandler.unsubscribe = NetInfo.addEventListener(state => {
            //NetInfoHandler.isConnected = state.isConnected
            if(state.isConnected){

            }
        });
    }


}
NetInfoHandler.shared = new NetInfoHandler()
export default NetInfoHandler