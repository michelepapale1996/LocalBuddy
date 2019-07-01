import {Calendar, CalendarList, Agenda } from 'react-native-calendars';
import React, {Component} from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import {Icon} from 'react-native-elements'
import { Button, FAB, TouchableRipple } from 'react-native-paper'
import UserHandler from "../handler/UserHandler"
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import DateHandler from "../handler/DateHandler"
import MeetingsUpdatesHandler from "../updater/MeetingsUpdatesHandler"
import LocalMeetingsHandler from "../LocalHandler/LocalMeetingsHandler";
import MeetingsHandler from "../handler/MeetingsHandler";

export default class CalendarView extends Component {
    static navigationOptions ={
        tabBarLabel: <View style={{height:hp("6%")}}>
            <Icon name={"event"} color={"white"} size={35}/>
        </View>
    }

    constructor(props) {
        super(props);
        this.state = {
            items: {}
        };
    }

    componentWillUnmount(){
        rol(this)
        //remove listeners for this UI
        MeetingsUpdatesHandler.removeAcceptedMeetingListener(this.acceptedMeeting)
        MeetingsUpdatesHandler.removeDeniedMeetingListener(this.deniedMeeting)
        MeetingsUpdatesHandler.removeNewMeetingListener(this.newMeeting)
        MeetingsUpdatesHandler.removeNewPendingMeetingListener(this.addPendingMeeting)
        MeetingsUpdatesHandler.removeFromFutureToPastMeetingListener(this.changeFromFutureToPastMeeting)
    }

    async componentDidMount(){
        loc(this)
        MeetingsUpdatesHandler.setNewPendingMeetingListener(this.addPendingMeeting)
        MeetingsUpdatesHandler.setAcceptedMeetingListener(this.acceptedMeeting)
        MeetingsUpdatesHandler.setDeniedMeetingListener(this.deniedMeeting)
        MeetingsUpdatesHandler.setNewMeetingListener(this.newMeeting)
        MeetingsUpdatesHandler.setFromFutureToPastMeeting(this.changeFromFutureToPastMeeting)

        //const meetings = await MeetingsHandler.getMeetings()
        const meetings = await LocalMeetingsHandler.getMeetings()
        if(meetings != null){
            this.setState(prevState => {
                meetings.forEach(elem => {
                    if(prevState.items[elem.date] == undefined){
                        prevState.items[elem.date] = [elem]
                    }else{
                        prevState.items[elem.date].push(elem)
                    }
                })
                return {
                    items: prevState.items,
                }
            })
        }
    }

    newMeeting = (meeting) => {
        this.createMeeting(meeting)
    }

    addPendingMeeting = (meeting) => {
        this.createMeeting(meeting)
    }

    createMeeting = (meeting) => {
        this.setState(prevState => {
            if(prevState.items[meeting.date] == undefined) prevState.items[meeting.date] = [meeting]
            else prevState.items[meeting.date].push(meeting)

            return { items: prevState.items }
        })
    }

    acceptedMeeting = (date, time, idOpponent) => {
        var meetingToUpdate = this.state.items[date].filter(elem => elem.idOpponent == idOpponent && elem.date == date && elem.time == time)[0]
        meetingToUpdate.isFixed = 1
        meetingToUpdate.isPending = 0

        this.deniedMeeting(date, time, idOpponent)

        this.setState(prevState => {
            prevState.items[date] = prevState.items[date].filter(elem =>
                elem.idOpponent != idOpponent || (elem.idOpponent == idOpponent && elem.date != date) || (elem.idOpponent == idOpponent && elem.date == date && elem.time != time)
            )
            prevState.items[date].push(meetingToUpdate)

            return {
                items: prevState.items
            }
        })
    }

    deniedMeeting = (date, time, idOpponent) => {
        this.setState((prevState) => {
            prevState.items[date] = prevState.items[date].filter(elem =>
                elem.idOpponent != idOpponent || (elem.idOpponent == idOpponent && elem.date != date) || (elem.idOpponent == idOpponent && elem.date == date && elem.time != time)
            )
            return {
                items: prevState.items
            }
        })
    }

    changeFromFutureToPastMeeting = (date, time, opponentId) => {
        this.setState({loadingDone: true})
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Agenda
                    ref={(agenda) => { this.agenda = agenda }}
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    theme={{
                        //calendarBackground: '#34495e',
                        'stylesheet.calendar.header': {
                            week: {
                                marginBottom: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }
                        }
                    }}
                />
                <FAB
                    style={{
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "#52c8ff"
                    }}
                    color={"white"}
                    icon="add"
                    onPress={() => this.props.navigation.navigate('NewMeeting')}
                />
            </View>
        )
    }

    loadItems(day) {
        for (let i = -15; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = this.timeToString(time);
            if (!this.state.items[strTime]) {
                this.state.items[strTime] = [];
            }
        }
    }

    renderItem(item) {
        const isFuture = !DateHandler.isInThePast(item.date, item.time)

        const styles = StyleSheet.create({
            item: {
                backgroundColor: 'white',
                borderRadius: 5,
                padding: 10,
                marginRight: 10,
                marginTop: 17
            },
            userPhoto: {
                width: wp("15%"),
                height: wp("15%"),
                borderRadius: wp("15%")
            },
            text: {
                fontSize: 20,
            },
            button:{
                borderRadius: 5,
            }
        })

        return (
            <View style={styles.item}>
                <TouchableRipple onPress={()=>this.props.navigation.navigate({routeName: "MeetingInfo", params: {meeting: item}, key:item.idOpponent})}>
                    <View style={{flex: 1, flexDirection:"row", alignItems:"center", justifyContent: "space-between",}}>
                        <View style={{flex: 1}}>
                            <View style={{flex: 1, flexDirection: "row", alignItems:"center", justifyContent:"space-between", marginRight:wp("5%")}}>
                                <Text>{item.time}</Text>
                                    {isFuture==1 && item.isFixed != 0 &&
                                    <Button style={styles.button} mode="outlined" disabled>Fixed</Button>}
                                    {isFuture==1 && item.isPending != 0 &&
                                    <Button style={styles.button} mode="outlined" disabled>Pending</Button>}
                                    {isFuture==1 && !item.isFixed != 0 && !item.isPending != 0 &&
                                    <Button style={styles.button} mode="outlined" disabled>Waiting for you</Button>}
                            </View>
                            <Text style={styles.text}>{item.nameAndSurname}</Text>
                        </View>
                        <Image style={styles.userPhoto} source={{uri: item.urlPhoto}}/>
                    </View>
                </TouchableRipple>
            </View>
        );
    }

    renderEmptyDate() {
        return (
            <View/>
            //<View style={styles.emptyDate}><Text>You do not have any meeting in this date!</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
}