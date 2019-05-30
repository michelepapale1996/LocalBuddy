import React, {Component} from 'react'
import {StyleSheet, View, Image, ScrollView, FlatList} from 'react-native'
import LoadingComponent from '../components/LoadingComponent'
import UserHandler from "../handler/UserHandler"
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import MeetingsHandler from "../handler/MeetingsHandler"
import { Text, Button, Surface, TouchableRipple } from 'react-native-paper'
import {Icon} from 'react-native-elements'
import MeetingsUpdatesHandler from "../handler/MeetingsUpdatesHandler";

export default class PastMeetings extends Component{
    constructor(props){
        super(props)
        this.state = {
            loadingDone: false,
            pastMeetings: null
        }
    }

    //<Text style={{fontSize: 18, fontWeight: "bold", color: "white"}}>Past Meetings</Text>
    static navigationOptions ={
        tabBarLabel: <View style={{height:hp("6%")}}>
            <Icon name={"format-list-bulleted"} color={"white"} size={35}/>
        </View>
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

    async componentDidMount(){
        MeetingsUpdatesHandler.setFromFutureToPastMeeting(this.addMeeting)

        var meetings = await MeetingsHandler.getMeetings()

        const peopleIds = []
        meetings.forEach(elem => {
            if(!peopleIds.includes(elem.idOpponent)) peopleIds.push(elem.idOpponent)
        })

        const meetingsByPeople = peopleIds.map(person => {
            return meetings.filter(meet => meet.idOpponent == person)
        })

        this.setState({
            loadingDone: true,
            pastMeetings: meetingsByPeople
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
                                        const meetings = item.map((meet,index) => (
                                            <TouchableRipple key={index} onPress={()=>{
                                                this.props.navigation.navigate({routeName: "MeetingInfo",params: {meeting: meet}, key:meet.idOpponent})
                                            }}>
                                                <View style={{flexDirection: "row", alignItems:"center", marginLeft:wp("10%"), justifyContent:"space-between"}}>
                                                    <Text style={styles.text}>{meet.date} {meet.time}</Text>
                                                    {meet.isFixed != 0 && <Button style={styles.button} mode="outlined" disabled>Fixed</Button>}
                                                    {meet.isPending != 0 && <Button style={styles.button} mode="outlined" disabled>Pending</Button>}
                                                    {!meet.isFixed != 0 && !meet.isPending != 0 && <Button style={styles.button} mode="outlined" disabled>New</Button>}
                                                </View>
                                            </TouchableRipple>
                                        ))
                                        return(
                                            <Surface style={styles.opponentMeetings}>
                                                <View style={styles.userContainer}>
                                                    <Image
                                                        style={styles.userPhoto}
                                                        source={{uri: item[0].urlPhoto}}/>
                                                    <Text style={styles.text}>{item[0].nameAndSurname}</Text>
                                                </View>
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
        margin: hp("0%"),
        flex: 1,
        backgroundColor: 'white',
    },
    container:{
        justifyContent: 'center',
        flex:1,
        margin:hp("2%"),
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