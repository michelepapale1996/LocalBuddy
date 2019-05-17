import React, {Component} from 'react'
import {StyleSheet, View, Image, ScrollView, FlatList} from 'react-native'
import LoadingComponent from '../components/LoadingComponent'
import UserHandler from "../handler/UserHandler"
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import MeetingsHandler from "../handler/MeetingsHandler"
import { Text, Button } from 'react-native-paper'
import MeetingsUpdatesHandler from "../handler/MeetingsUpdatesHandler";

export default class PastMeetings extends Component{
    constructor(props){
        super(props)
        this.state = {
            loadingDone: false,
            pastMeetings: null
        }
    }

    static navigationOptions ={
        tabBarLabel: <View style={{height:hp("6%")}}><Text style={{fontSize: 18, fontWeight: "bold", color: "white"}}>Past Meetings</Text></View>
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

    componentWillUnmount(){
        MeetingsUpdatesHandler.removeFromFutureToPastMeetingListener()
    }

    componentDidMount(){
        MeetingsUpdatesHandler.setFromFutureToPastMeeting(this.addMeeting)

        MeetingsHandler.getPastMeetings().then(meetings => {
            let promises = meetings.map(meeting => {
                return UserHandler.getNameAndSurname(meeting.idOpponent)
            })

            return Promise.all(promises).then(results=>{
                meetings.forEach((meeting,index)=>{
                    meeting.nameAndSurname = results[index]
                })
                return meetings
            })
        }).then(meetings => {
            let promises = meetings.map(meeting => {
                return UserHandler.getUrlPhoto(meeting.idOpponent)
            })

            return Promise.all(promises).then(results=>{
                meetings.forEach((meeting,index)=>{
                    meeting.urlPhoto = results[index]
                })
                return meetings
            })
        }).then(meetings=>{
            const pastMeetings = meetings.filter(elem => {
                return elem.isFixed == 1
            })

            this.setState({
                loadingDone: true,
                pastMeetings: pastMeetings
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
                            <Text style={styles.header}>Past Meetings</Text>
                            {this.state.pastMeetings.length > 0 &&
                                <FlatList
                                data={this.state.pastMeetings}
                                renderItem={
                                ({item}) => (
                                    <View style={styles.userContainer}>
                                        <Image
                                            style={styles.userPhoto}
                                            source={{uri: item.urlPhoto}}/>
                                        <View style={styles.userInfoContainer}>
                                            <Text style={styles.text}>{item.nameAndSurname}</Text>
                                            <Text>{item.date} {item.time}</Text>
                                        </View>
                                        {!item.feedbackAlreadyGiven &&
                                        <Button
                                            mode={"outlined"}
                                            style={styles.button}
                                            onPress={() => {
                                                this.props.navigation.navigate("Feedback",{
                                                    feedbackedIdUser: item.idOpponent,
                                                    feedbackGiven: this.feedbackGiven
                                                })
                                            }}
                                        >Give feedback</Button>}
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                />
                            }

                            {this.state.pastMeetings.length == 0 && <Text style={styles.text}>You do not have any past meeting.</Text>}
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
        margin: hp("0%"),
        flex: 1,
        backgroundColor: 'white',
    },
    container:{
        justifyContent: 'center',
        flex:1,
        margin:hp("2%"),
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
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
        borderRadius: wp("15%")
    },
    userContainer: {
        flex: 1,
        flexDirection: 'row',
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
        borderRadius: 25
    },
    newMeetingButton:{
        position: 'absolute',
        bottom: 10,
        right: 0,
        left: 300,
        width: wp("15%"),
        height: wp("15%"),
        borderRadius: wp("15%"),
        borderWidth: 1,
        borderColor: 'blue',
        backgroundColor: 'aquamarine',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#52c8ff"
    },
});