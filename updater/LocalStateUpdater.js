class LocalStateUpdater {
    static updaters = []

    static setUpdater(updater){
        LocalStateUpdater.updaters.push(updater)
    }

    static removeUpdater(updater){
        LocalStateUpdater.updaters = LocalStateUpdater.updaters.filter(elem => elem != updater)
    }

    static update(state){
        LocalStateUpdater.updaters.forEach(u => u(state))
    }
}

LocalStateUpdater.shared = new LocalStateUpdater();
export default LocalStateUpdater;