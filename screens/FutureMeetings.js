import React, {Component} from 'react'
import {StyleSheet, View, Image, ScrollView, FlatList} from 'react-native'
import { Button, FAB } from 'react-native-paper'
import LoadingComponent from '../components/LoadingComponent'
import UserHandler from "../handler/UserHandler"
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import MeetingsHandler from "../handler/MeetingsHandler"
import { Text } from 'react-native-paper'
import MeetingsUpdatesHandler from "../handler/MeetingsUpdatesHandler"

function NewProposals(props){
    acceptMeeting = (idOpponent)=>{
        MeetingsHandler.acceptMeeting(idOpponent).then(()=>{
            props.acceptedMeeting(idOpponent)
        })
    }

    denyMeeting = (idOpponent)=>{
        MeetingsHandler.denyMeeting(idOpponent).then(()=>{
            props.deniedMeeting(idOpponent)
        })
    }

    const newMeetings = props.meetings.filter(elem => {
        return elem.isFixed == 0 && elem.isPending == 0
    })

    if(newMeetings.length != 0){
        return(
            <View style={styles.container}>
                <Text style={styles.header}>New Proposals</Text>
                <FlatList
                    data={newMeetings}
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
                                <Button
                                    mode={"outlined"}
                                    style={styles.button}
                                    onPress={() => acceptMeeting(item.idOpponent)}
                                >
                                    Accept
                                </Button>
                                <Button
                                    mode={"outlined"}
                                    style={styles.button}
                                    onPress={() => denyMeeting(item.idOpponent)}
                                >
                                    Decline
                                </Button>
                            </View>
                        )
                    }
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </View>)
    }else{
        return(
            <View style={styles.container}>
                <Text style={styles.header}>New Proposals</Text>
                <Text style={styles.text}>You do not have any proposals.</Text>
            </View>
        )
    }
}

function AlreadyFixedMeetings(props){
    denyMeeting = (idOpponent)=>{
        MeetingsHandler.denyMeeting(idOpponent).then(()=>{
            props.deniedMeeting(idOpponent)
        })
    }

    const fixed = props.meetings.filter(elem => {
        return elem.isFixed == 1
    })

    if(fixed.length != 0){
        return(
            <View style={styles.container}>
                <Text style={styles.header}>Fixed Proposals</Text>
                <FlatList
                    data={fixed}
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
                                <Button
                                    mode={"outlined"}
                                    style={styles.button}
                                    onPress={() => denyMeeting(item.idOpponent)}
                                >
                                    Delete
                                </Button>
                            </View>
                        )
                    }
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }else{
        return(
            <View style={styles.container}>
                <Text style={styles.header}>Fixed Proposals</Text>
                <Text style={styles.text}>You do not have any proposals.</Text>
            </View>
        )
    }

}

function PendingMeetings(props){
    denyMeeting = (idOpponent)=>{
        MeetingsHandler.denyMeeting(idOpponent).then(()=>{
            props.deniedMeeting(idOpponent)
        })
    }

    const pending = props.meetings.filter(elem => {
        return elem.isPending == 1
    })

    if(pending.length != 0){
        return(
            <View style={styles.container}>
                <Text style={styles.header}>Pending Meetings</Text>
                <FlatList
                    data={pending}
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
                                <Button
                                    mode={"outlined"}
                                    style={styles.button}
                                    onPress={() => denyMeeting(item.idOpponent)}
                                    backgroundColor="red"
                                >
                                    Delete
                                </Button>
                            </View>
                        )
                    }
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }else{
        return(
            <View style={styles.container}>
                <Text style={styles.header}>Pending Meetings</Text>
                <Text style={styles.text}>You do not have any pending meeting.</Text>
            </View>
        )
    }
}

export default class FutureMeetings extends Component{
    constructor(props){
        super(props)
        this.state = {
            loadingDone: false,
            meetings: null
        }
    }

    static navigationOptions ={
        tabBarLabel: <View style={{height:hp("6%")}}><Text style={{fontSize: 18, fontWeight: "bold", color: "white"}}>Future Meetings</Text></View>
    }

    componentWillUnmount(){
        MeetingsUpdatesHandler.removeAcceptedMeetingListener()
        MeetingsUpdatesHandler.removeDeniedMeetingListener()
        MeetingsUpdatesHandler.removeNewMeetingListener()
    }

    componentDidMount(){
        MeetingsUpdatesHandler.setAcceptedMeetingListener(this.acceptedMeeting)
        MeetingsUpdatesHandler.setDeniedMeetingListener(this.deniedMeeting)
        MeetingsUpdatesHandler.setNewMeetingListener(this.newMeeting)

        MeetingsHandler.getFutureMeetings().then(meetings => {
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
            this.setState({
                loadingDone: true,
                meetings: meetings
            })
        })
    }

    acceptedMeeting = (idOpponent) => {
        this.setState((prevState) => {
            let meetings = prevState.meetings.filter(elem => {
                if (elem.idOpponent == idOpponent){
                    elem.isFixed = 1
                    elem.isPending = 0
                }
                return elem
            })

            return {
                meetings: meetings
            }
        })
    }

    deniedMeeting = (idOpponent) => {
        this.setState((prevState) => {
            console.log(prevState.meetings)
            const meetings = prevState.meetings.filter(elem => {
                return elem.idOpponent != idOpponent
            })

            return {
                meetings: meetings
            }
        })
    }

    addPendingMeeting = (date, time, opponentId)=>{
        const promises = [UserHandler.getNameAndSurname(opponentId), UserHandler.getUrlPhoto(opponentId)]
        Promise.all(promises).then(results => {
            this.setState((prevState) => {
                const meeting = {
                    idOpponent: opponentId,
                    date: date,
                    time: time,
                    isFixed: 0,
                    isPending: 1,
                    nameAndSurname: results[0],
                    urlPhoto: results[1]
                }
                const meetings = [...prevState.meetings, meeting]
                return {
                    meetings: meetings
                }
            })
        })
    }

    newMeeting = (date, time, opponentId) => {
        const promises = [UserHandler.getNameAndSurname(opponentId), UserHandler.getUrlPhoto(opponentId)]
        Promise.all(promises).then(results => {
            this.setState((prevState) => {
                const newMeeting = {
                    idOpponent: opponentId,
                    date: date,
                    time: time,
                    isFixed: 0,
                    isPending: 0,
                    nameAndSurname: results[0],
                    urlPhoto: results[1]
                }
                const meetings = [...prevState.meetings, newMeeting]
                return {
                    meetings: meetings
                }
            })
        })
    }

    render() {
        if(this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <ScrollView>
                        <NewProposals
                            meetings={this.state.meetings}
                            acceptedMeeting={this.acceptedMeeting}
                            deniedMeeting={this.deniedMeeting}/>
                        <AlreadyFixedMeetings
                            meetings={this.state.meetings}
                            deniedMeeting={this.deniedMeeting}/>
                        <PendingMeetings
                            meetings={this.state.meetings}
                            deniedMeeting={this.deniedMeeting}/>
                    </ScrollView>
                    <FAB
                        style={styles.fab}
                        color={"white"}
                        icon="add"
                        onPress={() => this.props.navigation.navigate('NewMeeting', {
                            addPendingMeeting: this.addPendingMeeting
                        })}
                    />
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
        backgroundColor: '#F5FCFF',
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
        fontWeight: "bold"
    },
    header:{
        height: hp("5%"),
        fontSize: 20,
        color: "green",
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#52c8ff"
    },
});