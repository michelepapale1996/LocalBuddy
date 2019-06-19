class MeetingsUpdatesHandler{
    static newMeetingListener = []
    static acceptedMeetingListener = []
    static deniedMeetingListener = []
    static fromFutureToPastMeetingListener = []
    static newPendingMeetingListener = []

    static setNewMeetingListener(fn){
        MeetingsUpdatesHandler.newMeetingListener.push(fn)
    }

    static setAcceptedMeetingListener(fn){
        MeetingsUpdatesHandler.acceptedMeetingListener.push(fn)
    }

    static setDeniedMeetingListener(fn){
        MeetingsUpdatesHandler.deniedMeetingListener.push(fn)
    }

    static setFromFutureToPastMeeting(fn){
        MeetingsUpdatesHandler.fromFutureToPastMeetingListener.push(fn)
    }

    static setNewPendingMeetingListener(fn){
        MeetingsUpdatesHandler.newPendingMeetingListener.push(fn)
    }

    static removeNewMeetingListener(fn){
        MeetingsUpdatesHandler.newMeetingListener = MeetingsUpdatesHandler.newMeetingListener.filter(elem => elem != fn)
    }

    static removeAcceptedMeetingListener(fn){
        MeetingsUpdatesHandler.acceptedMeetingListener = MeetingsUpdatesHandler.acceptedMeetingListener.filter(elem => elem != fn)
    }

    static removeDeniedMeetingListener(fn){
        MeetingsUpdatesHandler.deniedMeetingListener = MeetingsUpdatesHandler.deniedMeetingListener.filter(elem => elem != fn)
    }

    static removeFromFutureToPastMeetingListener(fn){
        MeetingsUpdatesHandler.fromFutureToPastMeetingListener = MeetingsUpdatesHandler.fromFutureToPastMeetingListener.filter(elem => elem != fn)
    }

    static removeNewPendingMeetingListener(fn){
        MeetingsUpdatesHandler.newPendingMeetingListener = MeetingsUpdatesHandler.newPendingMeetingListener.filter(elem => elem != fn)
    }

    static newMeeting(date, time, opponentId){
        this.newMeetingListener.forEach(fn => fn(date, time, opponentId))
    }

    static deniedMeeting(date, time, idOpponent){
        this.deniedMeetingListener.forEach(fn => fn(date, time, idOpponent))
    }

    static acceptedMeeting(date, time, idOpponent){
        this.acceptedMeetingListener.forEach(fn => fn(date, time, idOpponent))
    }

    static fromFutureToPastMeeting(date, time, opponentId){
        this.fromFutureToPastMeetingListener.forEach(fn => fn(date, time, opponentId))
    }

    static newPendingMeeting(date, time, opponentId){
        this.newPendingMeetingListener.forEach(fn => fn(date, time, opponentId))
    }
}
MeetingsUpdatesHandler.shared = new MeetingsUpdatesHandler()
export default MeetingsUpdatesHandler