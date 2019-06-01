import React, {Component} from 'react'
import {StyleSheet, View, Image, ScrollView, FlatList} from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import LoadingComponent from '../components/LoadingComponent'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import { Text } from 'react-native-paper'
import DateHandler from "../handler/DateHandler";

export default class MeetingInfo extends Component{
    constructor(props){
        super(props)
        this.state = {
            loadingDone: true,
            meeting: props.navigation.getParam('meeting', 'Error'),
        }
    }

    static navigationOptions = ({ navigation }) => {
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

    render() {

        if(this.state.loadingDone != false) {
            const isFuture = !DateHandler.isInThePast(this.state.meeting.date, this.state.meeting.time)
            if(isFuture){
                return (
                    <View style={styles.mainContainer}>
                        {
                            this.state.meeting.isFixed != 0 &&
                            <View style={{flex: 1, justifyContent:"space-between"}}>
                                <View>
                                    <Text style={{fontWeight:"bold", ...styles.text}}>Who you are meeting</Text>
                                    <Text style={styles.text}>{this.state.meeting.nameAndSurname}</Text>

                                    <Text style={{fontWeight:"bold", ...styles.text}}>Date</Text>
                                    <Text style={styles.text}>{this.state.meeting.date} {this.state.meeting.time}</Text>

                                    <Text style={{fontWeight:"bold", ...styles.text}}>Status</Text>
                                    <Button style={styles.button} mode="outlined" disabled>Fixed</Button>
                                </View>

                                <Button
                                    mode={"outlined"}
                                    style={styles.button}
                                    onPress={() => denyMeeting(this.state.meeting.idOpponent)}
                                    backgroundColor="red"
                                >
                                    Delete
                                </Button>
                            </View>
                        }
                        {
                            this.state.meeting.isPending != 0 &&
                            <View style={{flex: 1, justifyContent:"space-between"}}>
                                <View>
                                    <Text style={{fontWeight:"bold", ...styles.text}}>Who you are meeting</Text>
                                    <Text style={styles.text}>{this.state.meeting.nameAndSurname}</Text>

                                    <Text style={{fontWeight:"bold", ...styles.text}}>Date</Text>
                                    <Text style={styles.text}>{this.state.meeting.date} {this.state.meeting.time}</Text>

                                    <Text>Status</Text>
                                    <Button style={styles.button} mode="outlined" disabled>Pending</Button>
                                </View>

                                <Button
                                    mode={"outlined"}
                                    style={styles.button}
                                    onPress={() => denyMeeting(this.state.meeting.idOpponent)}
                                    backgroundColor="red"
                                >
                                    Delete
                                </Button>
                            </View>
                        }
                        {
                            !this.state.meeting.isFixed != 0 && !this.state.meeting.isPending != 0 &&
                            <View style={{flex: 1, justifyContent:"space-between"}}>
                                <View>
                                    <Text style={{fontWeight:"bold", ...styles.text}}>Who you are meeting</Text>
                                    <Text style={styles.text}>{this.state.meeting.nameAndSurname}</Text>

                                    <Text style={{fontWeight:"bold", ...styles.text}}>Date</Text>
                                    <Text style={styles.text}>{this.state.meeting.date} {this.state.meeting.time}</Text>

                                    <Text style={{fontWeight:"bold", ...styles.text}}>Status</Text>
                                    <Button style={styles.button} mode="outlined" disabled>Waiting for you</Button>
                                </View>

                                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                    <Button
                                        mode={"outlined"}
                                        style={{width:wp("40%"), ...styles.button}}
                                        onPress={() => acceptMeeting(this.state.meeting.idOpponent)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        mode={"outlined"}
                                        style={{width:wp("40%"), ...styles.button}}
                                        onPress={() => denyMeeting(this.state.meeting.idOpponent)}
                                        backgroundColor="red"
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
                    <View style={{flex: 1, justifyContent:"space-between"}}>
                        <View>
                            <Text style={{fontWeight:"bold", ...styles.text}}>Who you are meeting</Text>
                            <Text style={styles.text}>{this.state.meeting.nameAndSurname}</Text>

                            <Text style={{fontWeight:"bold", ...styles.text}}>Date</Text>
                            <Text style={styles.text}>{this.state.meeting.date} {this.state.meeting.time}</Text>

                            <Text style={{fontWeight:"bold", ...styles.text}}>Status</Text>
                            <Button style={styles.button} mode="outlined" disabled>Passed</Button>
                        </View>
                    </View>
                )
            }
        }else{
            return(<LoadingComponent/>)
        }
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        marginTop: hp("5%"),
        marginBottom: hp("5%"),
        marginLeft: wp("3%"),
        marginRight: wp("3%"),
        height: hp("30%"),
        backgroundColor: 'white',
        justifyContent:"space-between"
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