class Updater{
    //this updater is used in order to update screen if they are mounted and there are new updates (maybe the user is using a different device)
    static listeners = []

    static addListener(listener){
        Updater.listeners.push(listener)
    }

    static removeListener(listener){
        Updater.listeners.filter(elem => elem != listener)
    }

    static update(){
        Updater.listeners.forEach(fn => {
            if(fn != null) fn()
        })
    }
}
Updater.shared = new Updater()
export default Updater