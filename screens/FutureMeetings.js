import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, ScrollView, FlatList} from 'react-native';
import { Button } from 'react-native-elements'
import LoadingComponent from '../components/LoadingComponent'
import UserHandler from "../res/UserHandler";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import MeetingsHandler from "../res/MeetingsHandler";

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

    return(
        <View style={styles.container}>
            <Text style={styles.header}>New Proposals</Text>
            <FlatList
                data={props.new}
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
                                containerViewStyle={styles.button}
                                buttonStyle={styles.button}
                                onPress={() => acceptMeeting(item.idOpponent)}
                                backgroundColor="blue"
                                title="Accept"
                            />
                            <Button
                                containerViewStyle={styles.button}
                                buttonStyle={styles.button}
                                onPress={() => denyMeeting(item.idOpponent)}
                                backgroundColor="red"
                                title="Deny"
                            />
                        </View>
                    )
                }
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

function AlreadyFixedMeetings(props){
    denyMeeting = (idOpponent)=>{
        MeetingsHandler.denyMeeting(idOpponent).then(()=>{
            props.deniedMeeting(idOpponent)
        })
    }

    return(
        <View style={styles.container}>
            <Text style={styles.header}>Fixed Proposals</Text>
            <FlatList
                data={props.fixed}
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
                                containerViewStyle={styles.button}
                                buttonStyle={styles.button}
                                onPress={() => denyMeeting(item.idOpponent)}
                                backgroundColor="red"
                                title="Delete"
                            />
                        </View>
                    )
                }
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

function PendingMeetings(props){
    denyMeeting = (idOpponent)=>{
        MeetingsHandler.denyMeeting(idOpponent).then(()=>{
            props.deniedMeeting(idOpponent)
        })
    }

    return(
        <View style={styles.container}>
            <Text style={styles.header}>Pending Meetings</Text>
            <FlatList
                data={props.pending}
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
                                containerViewStyle={styles.button}
                                buttonStyle={styles.button}
                                onPress={() => denyMeeting(item.idOpponent)}
                                backgroundColor="red"
                                title="Delete"
                            />
                        </View>
                    )
                }
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default class FutureMeetings extends Component{
    constructor(props){
        super(props)
        this.state = {
            loadingDone: false,
            newMeetings: null,
            alreadyFixedMeetings: null,
            pendingMeetings: null
        }
    }

    componentDidMount(){
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
            const newMeetings = meetings.filter(elem => {
                return elem.isFixed == 0 && elem.isPending == 0
            })
            const alreadyFixedMeetings = meetings.filter(elem => {
                return elem.isFixed == 1
            })

            const pendingMeetings = meetings.filter(elem => {
                return elem.isPending == 1
            })

            this.setState({
                loadingDone: true,
                newMeetings: newMeetings,
                alreadyFixedMeetings: alreadyFixedMeetings,
                pendingMeetings: pendingMeetings
            })
        })
    }

    acceptedMeeting = (idOpponent) => {
        this.setState((prevState) => {
            let selectedMeeting = prevState.newMeetings.filter(elem => {
                return elem.idOpponent == idOpponent
            })
            selectedMeeting = selectedMeeting[0]

            //change isFixed of the selected Meeting
            selectedMeeting.isFixed = 1

            const newMeetings = prevState.newMeetings.filter(elem => {
                return elem.idOpponent != idOpponent
            })

            const alreadyFixedMeetings = [...prevState.alreadyFixedMeetings, selectedMeeting]
            return {
                newMeetings: newMeetings,
                alreadyFixedMeetings: alreadyFixedMeetings
            }
        })
    }

    deniedMeeting = (idOpponent) => {
        this.setState((prevState) => {
            const newMeetings = prevState.newMeetings.filter(elem => {
                return elem.idOpponent != idOpponent
            })

            const alreadyFixedMeetings = prevState.alreadyFixedMeetings.filter(elem => {
                return elem.idOpponent != idOpponent
            })

            const pendingMeetings = prevState.pendingMeetings.filter(elem => {
                return elem.idOpponent != idOpponent
            })

            return {
                newMeetings: newMeetings,
                alreadyFixedMeetings: alreadyFixedMeetings,
                pendingMeetings: pendingMeetings
            }
        })
    }

    addPendingMeeting = (date, time, opponentId)=>{
        const promises = [UserHandler.getNameAndSurname(opponentId), UserHandler.getUrlPhoto(opponentId)]
        Promise.all(promises).then(results => {
            this.setState((prevState) => {
                const newPendingMeeting = {
                    idOpponent: opponentId,
                    date: date,
                    time: time,
                    isFixed: 0,
                    isPending: 1,
                    nameAndSurname: results[0],
                    urlPhoto: results[1]
                }
                const pendingMeetings = [...prevState.newMeetings, newPendingMeeting]
                return {
                    pendingMeetings: pendingMeetings
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
                            new={this.state.newMeetings}
                            acceptedMeeting={this.acceptedMeeting}
                            deniedMeeting={this.deniedMeeting}/>
                        <AlreadyFixedMeetings
                            fixed={this.state.alreadyFixedMeetings}
                            deniedMeeting={this.deniedMeeting}/>
                        <PendingMeetings
                            pending={this.state.pendingMeetings}
                            deniedMeeting={this.deniedMeeting}/>
                    </ScrollView>
                    <Button
                        icon={{
                            name: "add",
                            size: 30,
                            color: "blue"
                        }}
                        onPress={() => this.props.navigation.navigate('NewMeeting', {
                            addPendingMeeting: this.addPendingMeeting
                        })}
                        buttonStyle={styles.newMeetingButton}
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
    }
});