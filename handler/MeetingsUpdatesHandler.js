class MeetingsUpdatesHandler{
    static newMeetingListener = null
    static acceptedMeetingListener = null
    static deniedMeetingListener = null
    static fromFutureToPastMeetingListener = null

    static setNewMeetingListener(fn){
        MeetingsUpdatesHandler.newMeetingListener = fn
    }

    static setAcceptedMeetingListener(fn){
        MeetingsUpdatesHandler.acceptedMeetingListener = fn
    }

    static setDeniedMeetingListener(fn){
        MeetingsUpdatesHandler.deniedMeetingListener = fn
    }

    static setFromFutureToPastMeeting(fn){
        MeetingsUpdatesHandler.fromFutureToPastMeetingListener = fn
    }

    static removeNewMeetingListener(){
        MeetingsUpdatesHandler.newMeetingListener = null
    }

    static removeAcceptedMeetingListener(){
        MeetingsUpdatesHandler.acceptedMeetingListener = null
    }

    static removeDeniedMeetingListener(){
        MeetingsUpdatesHandler.deniedMeetingListener = null
    }

    static removeFromFutureToPastMeetingListener(){
        MeetingsUpdatesHandler.fromFutureToPastMeetingListener = null
    }

    static newMeeting(date, time, opponentId){
        if(this.newMeetingListener != null) this.newMeetingListener(date, time, opponentId)
    }

    static deniedMeeting(idOpponent){
        if(this.deniedMeetingListener != null) this.deniedMeetingListener(idOpponent)
    }

    static acceptedMeeting(idOpponent){
        if(this.acceptedMeetingListener != null) this.acceptedMeetingListener(idOpponent)
    }

    static fromFutureToPastMeeting(date, time, opponentId){
        if(this.fromFutureToPastMeetingListener != null) this.fromFutureToPastMeetingListener(date, time, opponentId)
    }
}
MeetingsUpdatesHandler.shared = new MeetingsUpdatesHandler()
export default MeetingsUpdatesHandler