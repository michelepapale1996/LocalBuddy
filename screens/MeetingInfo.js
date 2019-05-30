import React, {Component} from 'react'
import {StyleSheet, View, Image, ScrollView, FlatList} from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import LoadingComponent from '../components/LoadingComponent'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import { Text } from 'react-native-paper'

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
            return (
                <View style={styles.mainContainer}>
                    <Text style={styles.text}>Meeting with {this.state.meeting.nameAndSurname}</Text>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <IconButton icon={"access-time"} size={30}/><Text style={styles.text}>{this.state.meeting.date} {this.state.meeting.time}</Text>
                    </View>
                    {
                        this.state.meeting.isFixed != 0 &&
                        <View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <Text>Status: </Text>
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
                        <View>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <Text>Status: </Text>
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
                        <View>
                            <View>
                                <View style={{flexDirection:"row", alignItems:"center"}}>
                                    <Text>Status: </Text>
                                    <Button style={styles.button} mode="outlined" disabled>New</Button>
                                </View>
                                <View style={{flexDirection:"row"}}>
                                    <Button
                                        mode={"outlined"}
                                        style={styles.button}
                                        onPress={() => acceptMeeting(this.state.meeting.idOpponent)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        mode={"outlined"}
                                        style={styles.button}
                                        onPress={() => denyMeeting(this.state.meeting.idOpponent)}
                                        backgroundColor="red"
                                    >
                                        Decline
                                    </Button>
                                </View>
                            </View>
                        </View>
                    }
                </View>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: hp("5%"),
        height: hp("30%"),
        backgroundColor: 'white',
        alignItems:"center",
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