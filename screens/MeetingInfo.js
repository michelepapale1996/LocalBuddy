import React, {Component} from 'react'
import {StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import LoadingComponent from '../components/LoadingComponent'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import { Text } from 'react-native-paper'
import DateHandler from "../handler/DateHandler";
import MeetingsHandler from "../handler/MeetingsHandler";
import MeetingsUpdatesHandler from "../updater/MeetingsUpdatesHandler";

export default class MeetingInfo extends Component{
    constructor(props){
        super(props)
        this.state = {
            loadingDone: true,
            meeting: props.navigation.getParam('meeting', 'Error')
        }
    }

    static navigationOptions = () => {
        return {
            title: "Meeting Info",
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#2fa1ff'
            },
            headerTitleStyle: {
                color: 'white'
            }
        }
    }

    acceptMeeting = (date, time, idOpponent)=>{
        MeetingsHandler.acceptMeeting(date, time, idOpponent).then(()=>{
            MeetingsUpdatesHandler.acceptedMeeting(date, time, idOpponent)
            this.setState(prevState => {
                const meeting = prevState.meeting
                meeting.isFixed = 1
                meeting.isPending = 0
                return {meeting: meeting}
            })
        })
    }

    denyMeeting = (date, time, idOpponent)=>{
        MeetingsHandler.denyMeeting(date, time, idOpponent).then(()=>{
            MeetingsUpdatesHandler.deniedMeeting(date, time, idOpponent)
            this.props.navigation.goBack()
        })
    }

    componentDidMount(){
        loc(this)
    }

    componentWillUnmount(){
        rol()
    }

    render() {
        const styles = StyleSheet.create({
            mainContainer: {
                flex:1,
                marginTop: hp("5%"),
                marginLeft: wp("3%"),
                marginRight: wp("3%"),
                height: hp("30%"),
                backgroundColor: 'white',
                justifyContent:"space-between"
            },
            container:{
                justifyContent: 'center',
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
                borderRadius: 5
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
            const isFuture = !DateHandler.isInThePast(this.state.meeting.date, this.state.meeting.time)
            if(isFuture){
                return (
                    <View style={styles.mainContainer}>
                        {
                            this.state.meeting.isFixed != 0 &&
                            <View style={{flex: 1, justifyContent:"space-between", marginBottom: hp("5%")}}>
                                <View>
                                    <View style={styles.container}>
                                        <Text style={{fontWeight:"bold", ...styles.text}}>Who</Text>
                                        <Text style={styles.text}>{this.state.meeting.nameAndSurname}</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{fontWeight:"bold", ...styles.text}}>Date</Text>
                                        <Text style={styles.text}>{this.state.meeting.date} {this.state.meeting.time}</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{fontWeight:"bold", ...styles.text}}>Status</Text>
                                        <Button style={styles.button} disabled>Fixed</Button>
                                    </View>
                                </View>

                                <Button
                                    style={{backgroundColor:"#e74c3c",...styles.button}}
                                    color={"white"}
                                    onPress={() => this.denyMeeting(this.state.meeting.date, this.state.meeting.time, this.state.meeting.idOpponent)}
                                >
                                    Delete
                                </Button>
                            </View>
                        }
                        {
                            this.state.meeting.isPending != 0 &&
                            <View style={{flex: 1, justifyContent:"space-between", marginBottom: hp("5%")}}>
                                <View>
                                    <View style={styles.container}>
                                        <Text style={{fontWeight:"bold", ...styles.text}}>Who</Text>
                                        <Text style={styles.text}>{this.state.meeting.nameAndSurname}</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{fontWeight:"bold", ...styles.text}}>When</Text>
                                        <Text style={styles.text}>{this.state.meeting.date} {this.state.meeting.time}</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text>Status</Text>
                                        <Button style={styles.button} disabled>Pending</Button>
                                    </View>
                                </View>

                                <Button
                                    style={{backgroundColor:"#e74c3c",...styles.button}}
                                    onPress={() => this.denyMeeting(this.state.meeting.date, this.state.meeting.time, this.state.meeting.idOpponent)}
                                    color={"white"}
                                >
                                    Delete
                                </Button>
                            </View>
                        }
                        {
                            !this.state.meeting.isFixed != 0 && !this.state.meeting.isPending != 0 &&
                            <View style={{flex: 1, justifyContent:"space-between", marginBottom: hp("5%")}}>
                                <View>
                                    <View style={styles.container}>
                                        <Text style={{fontWeight:"bold", ...styles.text}}>Who</Text>
                                        <Text style={styles.text}>{this.state.meeting.nameAndSurname}</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{fontWeight:"bold", ...styles.text}}>When</Text>
                                        <Text style={styles.text}>{this.state.meeting.date} {this.state.meeting.time}</Text>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={{fontWeight:"bold", ...styles.text}}>Status</Text>
                                        <Button style={styles.button} disabled>Waiting for you</Button>
                                    </View>
                                </View>

                                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                    <Button
                                        style={{width:wp("40%"), backgroundColor:"#52c8ff", ...styles.button}}
                                        color={"white"}
                                        onPress={() => this.acceptMeeting(this.state.meeting.date, this.state.meeting.time, this.state.meeting.idOpponent)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        style={{width:wp("40%"), backgroundColor:"#e74c3c", ...styles.button}}
                                        color={"white"}
                                        onPress={() => this.denyMeeting(this.state.meeting.date, this.state.meeting.time, this.state.meeting.idOpponent)}
                                    >
                                        Decline
                                    </Button>
                                </View>
                            </View>
                        }
                    </View>
                )
            }else{
                //meeting passed
                return(
                    <View style={styles.mainContainer}>
                    <View style={{flex: 1, justifyContent:"space-between"}}>
                        <View>
                            <View style={styles.container}>
                                <Text style={{fontWeight:"bold", ...styles.text}}>Who</Text>
                                <Text style={styles.text}>{this.state.meeting.nameAndSurname}</Text>
                            </View>
                            <View style={styles.container}>
                                <Text style={{fontWeight:"bold", ...styles.text}}>When</Text>
                                <Text style={styles.text}>{this.state.meeting.date} {this.state.meeting.time}</Text>
                            </View>
                            <View style={styles.container}>
                                <Text style={{fontWeight:"bold", ...styles.text}}>Status</Text>
                                <Button style={styles.button} disabled>Passed</Button>
                            </View>
                        </View>
                    </View>
                    </View>
                )
            }
        }else{
            return(<LoadingComponent/>)
        }
    }
}