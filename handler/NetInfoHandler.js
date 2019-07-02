import NetInfo from "@react-native-community/netinfo";
class NetInfoHandler{
    static unsubscribe

    static getInfo(){
        return NetInfo.fetch().then(state => {
            console.log(state)
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
        })
    }

    static subscribe(){
        // Subscribe
        NetInfoHandler.unsubscribe = NetInfo.addEventListener(state => {
            console.log("NET EVENT")
            console.log(state)
        });
    }


}
NetInfoHandler.shared = new NetInfoHandler()
export default NetInfoHandler