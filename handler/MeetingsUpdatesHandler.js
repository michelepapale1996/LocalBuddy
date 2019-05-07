class MeetingsUpdatesHandler{
    static newMeetingListener = null
    static acceptedMeetingListener = null
    static deniedMeetingListener = null

    static setNewMeetingListener(fn){
        MeetingsUpdatesHandler.newMeetingListener = fn
    }

    static setAcceptedMeetingListener(fn){
        MeetingsUpdatesHandler.acceptedMeetingListener = fn
    }

    static setDeniedMeetingListener(fn){
        MeetingsUpdatesHandler.deniedMeetingListener = fn
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

    static newMeeting(date, time, opponentId){
        if(this.newMeetingListener != null) this.newMeetingListener(date, time, opponentId)
    }

    static deniedMeeting(idOpponent){
        if(this.deniedMeetingListener != null) this.deniedMeetingListener(idOpponent)
    }

    static acceptedMeeting(idOpponent){
        if(this.acceptedMeetingListener != null)this.acceptedMeetingListener(idOpponent)
    }
}
MeetingsUpdatesHandler.shared = new MeetingsUpdatesHandler()
export default MeetingsUpdatesHandler