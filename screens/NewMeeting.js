import React, { Component } from "react"
import { StyleSheet, View, ScrollView } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker"
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import ChatsHandler from "../handler/ChatsHandler"
import LoadingComponent from '../components/LoadingComponent'
import RNPickerSelect from 'react-native-picker-select'
import MeetingsHandler from "../handler/MeetingsHandler"
import { Text, Button } from 'react-native-paper'
import DateHandler from "../handler/DateHandler";
import MeetingsUpdatesHandler from "../updater/MeetingsUpdatesHandler";
import LocalChatsHandler from "../LocalHandler/LocalChatsHandler";
import LocalUserHandler from "../LocalHandler/LocalUserHandler";
import LocalMeetingsHandler from "../LocalHandler/LocalMeetingsHandler";
import NetInfoHandler from "../handler/NetInfoHandler";

export default class NewMeeting extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "New Meeting",
            headerRight: (
                <Button
                    mode={"outlined"}
                    onPress={()=> navigation.getParam("saveMeeting", null)()}
                    style={{
                        marginLeft:0,
                        marginRight:0,
                        borderRadius: 5,
                        borderColor: "white"
                    }}
                    color={"white"}
                >
                    Save
                </Button>
            ),
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#2fa1ff'
            },
            headerTitleStyle: {
                color: 'white'
            }
        }
    }

    saveMeeting = async () => {
        if(this.state.chosenUserId == null) {
            alert("Please, choose a person.")
        }else{
            //if the user is not connected to the internet, he cannot create the meeting
            if(NetInfoHandler.isConnected){
                MeetingsHandler.createMeeting(this.state.date, this.state.time, this.state.chosenUserId).then(()=>{
                    MeetingsUpdatesHandler.newPendingMeeting(this.state.date, this.state.time, this.state.chosenUserId)
                    this.props.navigation.goBack()
                })
            }else{
                alert("You are not connected to the network. Check your connection and retry.")
            }
        }
    }

    constructor(props) {
        super(props)
        const date = new Date()
        const today = DateHandler.dateToString(date)
        const time = DateHandler.timeToString(date)

        //nameAndSurnameOpponent is used when the user has tapped the button add a meeting from the profile of the other user
        this.state = {
            date: today,
            today: today,
            time: time,
            users: null,
            chosenUserId: this.props.navigation.getParam("opponentId", null),
            nameAndSurnameOpponent: this.props.navigation.getParam("nameAndSurnameOpponent", null),
            loadingDone: false,
            isDatePickerVisible: false,
            isTimePickerVisible: false
        }
        this.props.navigation.setParams({
            saveMeeting: this.saveMeeting
        })
    }

    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    }

    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    }

    handleDatePicked = date => {
        this.setState({date: DateHandler.dateToString(date)})
        this.hideDatePicker();
    }

    showTimePicker = () => {
        this.setState({ isTimePickerVisible: true });
    }

    hideTimePicker = () => {
        this.setState({ isTimePickerVisible: false });
    }

    handleTimePicked = time => {
        this.setState({time: DateHandler.timeToString(time)})
        this.hideTimePicker();
    }

    async componentDidMount() {
        //user can arrive here or from the profile of the other user or from the meetings handler.
        //in the former case, nameAndSurnameOpponent and idOpponent is setted
        //in the latter, we have to retrieve all the users with whom the user has a chat
        if(this.state.nameAndSurnameOpponent == null){
            //const chats = await ChatsHandler.getChats()
            const chats = await LocalChatsHandler.getChats()
            const usersWithChat = chats.map(user => ({
                label: user.nameAndSurname,
                value: user.opponentUserId
            }))

            //do not show opponents with whom the user has already a future meeting and user with account deleted
            //const meetings = await MeetingsHandler.getFutureMeetings()
            const meetings = await LocalMeetingsHandler.getFutureMeetings()
            const users = usersWithChat.filter(elem => {
                return meetings.filter(m => m.idOpponent == elem.value) == 0 && elem.value !== undefined
            })
            this.setState({
                users: users,
                loadingDone: true
            })
        }else{
            this.setState({loadingDone: true})
        }
    }

    render() {
        const styles = StyleSheet.create({
            mainContainer: {
                flex: 1,
                backgroundColor: 'white',
            },
            container:{
                marginTop:hp("5%"),
                marginLeft:wp("5%"),
                marginRight:wp("5%"),
                borderBottomWidth:1,
                borderColor: "grey"
            },
            singleOptionContainer:{
                flex:1,
                margin: wp("3%"),
                height: hp("5%")
            },
            text: {
                fontSize: 20,
                fontWeight: "bold",
            },
            header:{
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
                borderRadius: 5,
                borderColor: "white"
            }
        });

        if (this.state.loadingDone != false) {
            return (
                <ScrollView>
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        <Text style={styles.text}>Who</Text>
                        {this.state.nameAndSurnameOpponent != null && <Text style={styles.text}>{this.state.nameAndSurnameOpponent}</Text>}
                        {
                            this.state.nameAndSurnameOpponent == null &&
                            <RNPickerSelect
                                placeholder={{
                                    label: 'Select a person',
                                    value: null,
                                    color: '#9EA0A4',
                                }}
                                items={this.state.users}
                                onValueChange={value => {
                                    this.setState({
                                        chosenUserId: value,
                                    });
                                }}
                                style={pickerSelectStyles}
                                useNativeAndroidPickerStyle={false}
                            />
                        }
                    </View>
                        <View style={styles.container}>
                            <Text style={styles.text}>When</Text>
                            <Button onPress={this.showDatePicker}>{this.state.date}</Button>
                            <DateTimePicker
                                isVisible={this.state.isDatePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDatePicker}
                                minimumDate={new Date()}
                            />
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.text}>Time</Text>
                            <Button onPress={this.showTimePicker}>{this.state.time}</Button>
                            <DateTimePicker
                                mode={"time"}
                                isVisible={this.state.isTimePickerVisible}
                                onConfirm={this.handleTimePicked}
                                onCancel={this.hideTimePicker}
                            />
                        </View>
                </View>
                </ScrollView>
            )
        } else {
            return (<LoadingComponent/>)
        }
    }
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 4,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        borderBottomWidth:0,
        paddingVertical: 8,
        borderColor: "#34495e",
        color:"black",
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});