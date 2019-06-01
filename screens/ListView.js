import React, {Component} from 'react'
import {StyleSheet, View, Image, ScrollView, FlatList} from 'react-native'
import LoadingComponent from '../components/LoadingComponent'
import UserHandler from "../handler/UserHandler"
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import MeetingsHandler from "../handler/MeetingsHandler"
import { Text, Button, Surface, TouchableRipple } from 'react-native-paper'
import {Icon} from 'react-native-elements'
import MeetingsUpdatesHandler from "../handler/MeetingsUpdatesHandler";
import DateHandler from "../handler/DateHandler";

export default class ListView extends Component{
    constructor(props){
        super(props)
        this.state = {
            loadingDone: false,
            pastMeetings: null
        }
    }

    //<Text style={{fontSize: 18, fontWeight: "bold", color: "white"}}>Past Meetings</Text>
    static navigationOptions = {
        tabBarLabel: <View style={{height:hp("6%")}}>
            <Icon name={"format-list-bulleted"} color={"white"} size={35}/>
        </View>
    }

    componentWillUnmount(){
        MeetingsUpdatesHandler.removeFromFutureToPastMeetingListener()
    }

    async componentDidMount(){
        MeetingsUpdatesHandler.setFromFutureToPastMeeting(this.addMeeting)

        var meetings = await MeetingsHandler.getMeetings()

        //get the id of the other person
        const peopleIds = []
        meetings.forEach(elem => {
            if(!peopleIds.includes(elem.idOpponent)) peopleIds.push(elem.idOpponent)
        })

        const meetingsByPeople = peopleIds.map(person => {
            const filteredMeetings = meetings.filter(meet => meet.idOpponent == person)
            const pastMeetings = filteredMeetings.filter(m => DateHandler.isInThePast(m.date, m.time))
            return ({
                meetings: filteredMeetings,
                atLeastOnePassed: pastMeetings.length > 0,
                feedbackAlreadyGiven: Math.max.apply(Math, filteredMeetings.map(function(o) { return o.feedbackAlreadyGiven}))
            })
        })

        this.setState({
            loadingDone: true,
            pastMeetings: meetingsByPeople
        })
    }

    addMeeting = (date, time, opponentId) => {
        const promises = [UserHandler.getNameAndSurname(opponentId), UserHandler.getUrlPhoto(opponentId)]
        Promise.all(promises).then(results => {
            this.setState((prevState) => {
                const newMeeting = {
                    idOpponent: opponentId,
                    date: date,
                    time: time,
                    isFixed: 1,
                    isPending: 0,
                    nameAndSurname: results[0],
                    urlPhoto: results[1]
                }
                const meetings = [...prevState.pastMeetings, newMeeting]
                return {
                    pastMeetings: meetings
                }
            })
        })
    }

    feedbackGiven = (opponentId) => {
        let toChange = this.state.pastMeetings.filter(elem => {
            return elem.idOpponent == opponentId
        })
        toChange = toChange[0]

        const notToChange = this.state.pastMeetings.filter(elem => {
            return elem.idOpponent != opponentId
        })

        toChange.feedbackAlreadyGiven = 1
        let pastMeetings = [...notToChange, toChange]
        this.setState({
            pastMeetings: pastMeetings
        })
    }

    render() {
        if(this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <ScrollView>
                        <View style={styles.container}>
                            {
                                this.state.pastMeetings.length > 0 &&
                                <FlatList
                                    data={this.state.pastMeetings}
                                    renderItem={({item}) => {
                                        const meetings = item.meetings.map((m,index) => (
                                            <TouchableRipple key={index} onPress={()=>{
                                                this.props.navigation.navigate({routeName: "MeetingInfo",params: {meeting: m}, key:m.idOpponent})
                                            }}>
                                                <View style={{flexDirection: "row", alignItems:"center", marginLeft:wp("10%"), marginRight:wp("5%"), justifyContent:"space-between"}}>
                                                    <Text style={styles.text}>{m.date} {m.time}</Text>
                                                    {m.isFixed != 0 && <Button style={styles.button} mode="outlined" disabled>Fixed</Button>}
                                                    {m.isPending != 0 && <Button style={styles.button} mode="outlined" disabled>Pending</Button>}
                                                    {!m.isFixed != 0 && !m.isPending != 0 && <Button style={styles.button} mode="outlined" disabled>Waiting for you</Button>}
                                                </View>
                                            </TouchableRipple>
                                        ))
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
                        </View>
                    </ScrollView>
                </View>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}

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
    }
});