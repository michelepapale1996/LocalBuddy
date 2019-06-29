import React, {Component} from 'react'
import {StyleSheet, View, Image, ScrollView, FlatList} from 'react-native'
import LoadingComponent from '../components/LoadingComponent'
import UserHandler from "../handler/UserHandler"
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import MeetingsHandler from "../handler/MeetingsHandler"
import { Text, Button, Surface, TouchableRipple, FAB } from 'react-native-paper'
import {Icon} from 'react-native-elements'
import MeetingsUpdatesHandler from "../updater/MeetingsUpdatesHandler";
import DateHandler from "../handler/DateHandler";
import LocalMeetingsHandler from "../LocalHandler/LocalMeetingsHandler";

export default class ListView extends Component{
    constructor(props){
        super(props)
        this.state = {
            loadingDone: false,
            meetings: null
        }
    }

    //<Text style={{fontSize: 18, fontWeight: "bold", color: "white"}}>Past Meetings</Text>
    static navigationOptions = {
        tabBarLabel: <View style={{height:hp("6%")}}>
            <Icon name={"format-list-bulleted"} color={"white"} size={35}/>
        </View>
    }

    componentWillUnmount(){
        rol()
        //remove listeners for this UI
        MeetingsUpdatesHandler.removeAcceptedMeetingListener(this.acceptedMeeting)
        MeetingsUpdatesHandler.removeDeniedMeetingListener(this.deniedMeeting)
        MeetingsUpdatesHandler.removeNewMeetingListener(this.newMeeting)
        MeetingsUpdatesHandler.removeNewPendingMeetingListener(this.addPendingMeeting)
        MeetingsUpdatesHandler.removeFromFutureToPastMeetingListener(this.changeFromFutureToPastMeeting)
    }

    async componentDidMount(){
        loc(this)
        //add listeners for this UI
        MeetingsUpdatesHandler.setNewPendingMeetingListener(this.addPendingMeeting)
        MeetingsUpdatesHandler.setAcceptedMeetingListener(this.acceptedMeeting)
        MeetingsUpdatesHandler.setDeniedMeetingListener(this.deniedMeeting)
        MeetingsUpdatesHandler.setNewMeetingListener(this.newMeeting)
        MeetingsUpdatesHandler.setFromFutureToPastMeeting(this.changeFromFutureToPastMeeting)

        //var meetings = await MeetingsHandler.getMeetings()
        var meetings = await LocalMeetingsHandler.getMeetings()

        //get the id of the others
        const peopleIds = []
        meetings.forEach(elem => {
            if(!peopleIds.includes(elem.idOpponent)) peopleIds.push(elem.idOpponent)
        })

        const meetingsByPeople = peopleIds.map(person => {
            const filteredMeetings = meetings.filter(meet => meet.idOpponent == person)
            const pastMeetings = filteredMeetings.filter(m => DateHandler.isInThePast(m.date, m.time))
            return ({
                idOpponent: person,
                meetings: filteredMeetings,
                atLeastOnePassed: pastMeetings.length > 0,
                feedbackAlreadyGiven: Math.max.apply(Math, filteredMeetings.map(function(o) { return o.feedbackAlreadyGiven}))
            })
        })

        this.setState({
            loadingDone: true,
            meetings: meetingsByPeople
        })
    }

    //called when the user gives a new feedback
    feedbackGiven = (opponentId) => {
        let toChange = this.state.meetings.filter(elem => {
            return elem.idOpponent == opponentId
        })
        toChange = toChange[0]

        const notToChange = this.state.meetings.filter(elem => {
            return elem.idOpponent != opponentId
        })

        toChange.feedbackAlreadyGiven = 1
        let meetings = [...notToChange, toChange]
        this.setState({
            meetings: meetings
        })
    }

    newMeeting = (meeting) => {
        this.createMeeting(meeting)
    }

    addPendingMeeting = (meeting) => {
        this.createMeeting(meeting)
    }

    createMeeting = (meeting) => {
        this.setState(prevState => {
            var meetingsWithOpponent = prevState.meetings.filter(m => m.idOpponent == meeting.idOpponent)[0]
            const otherMeetings = prevState.meetings.filter(m => m.idOpponent != meeting.idOpponent)

            //if there exists already meetings with the opponent
            if(meetingsWithOpponent !== undefined){
                meetingsWithOpponent.meetings.push(meeting)
            } else {
                meetingsWithOpponent = {
                    idOpponent: meeting.idOpponent,
                    atLeastOnePassed: false,
                    feedbackAlreadyGiven: 0,
                    meetings: [meeting]
                }
            }
            otherMeetings.push(meetingsWithOpponent)
            return { meetings: otherMeetings }
        })
    }

    acceptedMeeting = (date, time, idOpponent) => {
        this.setState((prevState) => {
            let meetingsWithOpponent = prevState.meetings.filter(elem => elem.idOpponent == idOpponent && elem.date == date && elem.time == time)[0]
            const otherMeetings = prevState.meetings.filter(m =>
                elem.idOpponent != idOpponent || (elem.idOpponent == idOpponent && elem.date != date) || (elem.idOpponent == idOpponent && elem.date == date && elem.time != time)
            )
            meetingsWithOpponent.meetings.forEach(m => {
                if (m.isFixed == 0){
                    m.isFixed = 1
                    m.isPending = 0
                }
            })

            otherMeetings.push(meetingsWithOpponent)
            return {
                meetings: otherMeetings
            }
        })
    }

    deniedMeeting = (date, time, idOpponent) => {
        this.setState(prevState => {
            const meetingsWithOtherUsers = prevState.meetings.filter(elem => {
                return elem.idOpponent != idOpponent
            })

            var meetingsWithTheSameUser = prevState.meetings.filter(elem => {
                return elem.idOpponent == idOpponent
            })
            meetingsWithTheSameUser = meetingsWithTheSameUser[0]

            var filteredMeetingsWithTheSameUser = meetingsWithTheSameUser.meetings.filter(meeting => {
                console.log(meeting)
                return meeting.date != date || (meeting.date == date && meeting.time != time)
            })

            var meetings = meetingsWithOtherUsers
            if(filteredMeetingsWithTheSameUser.length > 0){
                meetingsWithTheSameUser.meetings = filteredMeetingsWithTheSameUser
                meetings.push(meetingsWithTheSameUser)
            }

            return {
                meetings: meetings
            }
        })
    }

    changeFromFutureToPastMeeting = (date, time, opponentId) => {
        this.setState({loadingDone: true})
    }

    render() {
        const styles = StyleSheet.create({
            mainContainer: {
                flex: 1,
                backgroundColor: 'white',
            },
            container:{
                justifyContent: 'center',
                flex:1,
            },
            singleOptionContainer:{
                flex:1,
                margin: wp("3%"),
                height: hp("5%")
            },
            text: {
                fontSize: 20,
            },
            header:{
                height: hp("5%"),
                fontSize: 20,
                fontWeight:"bold"
            },
            userPhoto: {
                width: wp("15%"),
                height: wp("15%"),
                marginRight: wp("5%"),
                borderRadius: wp("15%")
            },
            userContainer: {
                flex: 1,
                flexDirection: 'row',
                alignItems:"center",
                margin: wp("3%"),
                height: hp("10%")
            },
            userInfoContainer: {
                flex:1,
                margin: wp("1%"),
                height: hp("10%")
            },
            button:{
                marginLeft:0,
                marginRight:0,
                borderRadius: 5,
                borderWidth: 1,
            },
            opponentMeetings:{
                elevation: 5,
                marginBottom: hp("1%"),
                marginTop: hp("1%"),
                marginLeft: wp("1%"),
                marginRight: wp("1%"),
                borderRadius: 4
            },
            fab: {
                position: 'absolute',
                margin: 16,
                right: 0,
                bottom: 0,
                backgroundColor: "#52c8ff"
            },
        });

        if(this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <ScrollView>
                        <View style={styles.container}>
                            {
                                this.state.meetings.length > 0 &&
                                <FlatList
                                    data={this.state.meetings}
                                    extraData={this.state.meetings}
                                    renderItem={({item}) => {
                                        const meetings = item.meetings.map((m,index) => {
                                            const isFuture = !DateHandler.isInThePast(m.date, m.time)
                                            return (
                                                <TouchableRipple key={index} onPress={()=>{
                                                    this.props.navigation.navigate({routeName: "MeetingInfo",params: { meeting: m }, key: m.idOpponent})
                                                }}>
                                                    <View style={{flexDirection: "row", alignItems:"center", marginLeft:wp("10%"), marginTop:hp("1%"), marginBottom:hp("1%"),marginRight:wp("5%"), justifyContent:"space-between"}}>
                                                        <Text style={styles.text}>{m.date} {m.time}</Text>
                                                        {isFuture == 1 && m.isFixed != 0 && <Button style={styles.button} mode="outlined" disabled>Fixed</Button>}
                                                        {isFuture == 1 && m.isPending != 0 && <Button style={styles.button} mode="outlined" disabled>Pending</Button>}
                                                        {isFuture == 1 && !m.isFixed != 0 && !m.isPending != 0 && <Button style={styles.button} mode="outlined" disabled>Waiting for you</Button>}

                                                        {isFuture != 1 && <Button style={styles.button} mode="outlined" disabled>Passed</Button>}
                                                    </View>
                                                </TouchableRipple>
                                            )}
                                        )
                                        return(
                                            <Surface style={styles.opponentMeetings}>
                                                <TouchableRipple onPress={() => this.props.navigation.navigate('BuddyProfile', {idUser: item.meetings[0].idOpponent})}>
                                                    <View style={styles.userContainer}>
                                                        <Image style={styles.userPhoto} source={{uri: item.meetings[0].urlPhoto}}/>
                                                        <Text style={{fontWeight: "bold",...styles.text}}>{item.meetings[0].nameAndSurname}</Text>
                                                        {item.feedbackAlreadyGiven === 0 && item.atLeastOnePassed &&
                                                            <Button style={styles.button} mode="outlined" onPress={()=>{
                                                                this.props.navigation.navigate("Feedback", {feedbackedIdUser: item.meetings[0].idOpponent, feedbackGiven: this.feedbackGiven})
                                                            }}>Add a feedback</Button>}
                                                    </View>
                                                </TouchableRipple>
                                                {meetings}
                                            </Surface>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            }
                            {
                                this.state.meetings.length == 0 &&
                                <View style={{flex: 1, alignItems:"center", justifyContent: 'center'}}>
                                    <Text style={{fontWeight:"bold", textAlign: 'center', ...styles.text}}>You do not have any meeting yet.</Text>
                                </View>
                            }
                        </View>
                    </ScrollView>
                    <FAB
                        style={styles.fab}
                        color={"white"}
                        icon="add"
                        onPress={() => this.props.navigation.navigate('NewMeeting')}
                    />
                </View>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}