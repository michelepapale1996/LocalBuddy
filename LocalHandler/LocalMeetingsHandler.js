import AsyncStorage from '@react-native-community/async-storage'
import UserHandler from "../handler/UserHandler";
import LocalUserHandler from "./LocalUserHandler";
import DateHandler from "../handler/DateHandler";

class LocalMeetingsHandler {
    static async setMeetings(meetings){
        if(meetings != null){
            let promises = meetings.map(meeting => {
                return UserHandler.getNameAndSurname(meeting.idOpponent)
            })

            meetings = await Promise.all(promises).then(results => {
                meetings.forEach((meeting,index)=>{
                    meeting.nameAndSurname = results[index]
                })
                return meetings
            })

            promises = meetings.map(meeting => {
                return UserHandler.getUrlPhoto(meeting.idOpponent)
            })

            meetings = await Promise.all(promises).then(results => {
                meetings.forEach((meeting,index)=>{
                    meeting.urlPhoto = results[index]
                })
                return meetings
            })
            await AsyncStorage.setItem("meetings", JSON.stringify(meetings));
        }
    }

    static async getMeetings(){
        try {
            const value = await AsyncStorage.getItem('meetings')
            if (value !== null) {
                return JSON.parse(value)
            }else{
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async addMeeting(singleMeeting){
        try {
            var meetings = await LocalMeetingsHandler.getMeetings()
            meetings.push(singleMeeting)
            await AsyncStorage.removeItem('meetings')
            await AsyncStorage.setItem("meetings", JSON.stringify(meetings));
        } catch (error) {
            console.log(error)
        }
    }

    static async updateMeeting(date, time, idOpponent){
        try {
            var meetings = await LocalMeetingsHandler.getMeetings()
            meetings.forEach(elem => {
                if(elem.date == date && elem.time == time && elem.idOpponent == idOpponent){
                    elem.isFixed = 1
                    elem.isPending = 0
                }
            })
            await AsyncStorage.removeItem('meetings')
            await AsyncStorage.setItem("meetings", JSON.stringify(meetings));
        } catch (error) {
            console.log(error)
        }
    }

    static async removeMeeting(date, time, idOpponent){
        try {
            const meetings = await LocalMeetingsHandler.getMeetings()
            var newMeetings = meetings.filter(elem => {
                return elem.idOpponent != idOpponent || (elem.date != date && elem.idOpponent == idOpponent) || (elem.time != time && elem.date == date && elem.idOpponent == idOpponent)
            })
            await AsyncStorage.removeItem('meetings')
            await AsyncStorage.setItem("meetings", JSON.stringify(newMeetings));
        } catch (error) {
            console.log(error)
        }
    }

    static async getFutureMeetings(){
        const meetings = await LocalMeetingsHandler.getMeetings()
        var futureMeetings = meetings.filter(meeting => {
            return !DateHandler.isInThePast(meeting.date, meeting.time)
        })

        return futureMeetings
    }
}
LocalMeetingsHandler.shared = new LocalMeetingsHandler()
export default LocalMeetingsHandler