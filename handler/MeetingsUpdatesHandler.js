class MeetingsUpdatesHandler{
    static newMeetingListener = null
    static acceptedMeetingListener = null
    static deniedMeetingListener = null
    static fromFutureToPastMeetingListener = null
    static newPendingMeetingListener = null

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

    static setNewPendingMeetingListener(fn){
        MeetingsUpdatesHandler.newPendingMeetingListener = fn
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

    static removeNewPendingMeetingListener(){
        MeetingsUpdatesHandler.newPendingMeetingListener = null
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

    static newPendingMeeting(date, time, opponentId){
        if(this.newPendingMeetingListener != null) this.newPendingMeetingListener(date, time, opponentId)
    }
}
MeetingsUpdatesHandler.shared = new MeetingsUpdatesHandler()
export default MeetingsUpdatesHandler