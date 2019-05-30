import {Calendar, CalendarList, Agenda } from 'react-native-calendars';
import React, {Component} from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import {Icon} from 'react-native-elements'
import { Button, FAB, TouchableRipple } from 'react-native-paper'
import MeetingsHandler from "../handler/MeetingsHandler";
import UserHandler from "../handler/UserHandler";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"

export default class FixedMeetings extends Component {
    //<Text style={{fontSize: 18, fontWeight: "bold", color: "white"}}>Fixed Meetings</Text>
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

    componentDidMount(){
        MeetingsHandler.getMeetings().then(meetings => {
            let promises = meetings.map(meeting => {
                return UserHandler.getNameAndSurname(meeting.idOpponent)
            })

            return Promise.all(promises).then(results=>{
                meetings.forEach((meeting,index)=>{
                    meeting.nameAndSurname = results[index]
                })
                return meetings
            })
        }).then(meetings=>{
            this.setState(prevState => {
                meetings.forEach(elem => {
                    if(prevState.items[elem.date] == undefined){
                        prevState.items[elem.date] = [elem]
                    }else{
                        prevState.items[elem.date].push(elem)
                    }
                })
                return {items: prevState.items}
            })
        })
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
                    style={styles.fab}
                    color={"white"}
                    icon="add"
                    onPress={() => this.props.navigation.navigate('NewMeeting')}
                />
            </View>
        );
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
        return (
            <View style={styles.item}>
                <TouchableRipple onPress={()=>this.props.navigation.navigate({routeName: "MeetingInfo",params: {meeting: item}, key:item.idOpponent})}>
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent: "space-between",}}>
                        <View>
                            <Text>{item.time}</Text>
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

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30
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
    text: {
        fontSize: 20,
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
})