import React, { Component } from "react"
import { StyleSheet, View } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import ChatsHandler from "../handler/ChatsHandler"
import LoadingComponent from '../components/LoadingComponent'
import RNPickerSelect from 'react-native-picker-select'
import MeetingsHandler from "../handler/MeetingsHandler"
import AccountHandler from "../handler/AccountHandler"
import { Text, Button } from 'react-native-paper'
import DateHandler from "../handler/DateHandler";

export default class NewMeeting extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "New Meeting",
            headerRight: (
                <Button
                    mode={"outlined"}
                    onPress={()=>navigation.getParam("saveMeeting", null)()}
                    style={styles.button}
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

    saveMeeting = () => {
        if(this.state.chosenUserId == null) {
            alert("Please, choose a person.")
        }else{
            MeetingsHandler.createMeeting(this.state.date, this.state.time, this.state.chosenUserId).then(()=>{
                this.props.navigation.getParam("addPendingMeeting", null)(this.state.date, this.state.time, this.state.chosenUserId)
                this.props.navigation.goBack()
            })
        }
    }

    constructor(props) {
        super(props)
        const date = new Date()
        const today = DateHandler.dateToString(date)
        const time = DateHandler.timeToString(date)

        this.state = {
            date: today,
            today: today,
            time: time,
            users: null,
            chosenUserId: null,
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

    componentDidMount() {
        ChatsHandler.getChats().then(chats => {
            const promises = chats.map(user => {
                return AccountHandler.getUserId(user.CCopponentUserId)
            })

            Promise.all(promises).then(results => {
                return chats.map((user, index) => {
                    return {
                        label: user.nameAndSurname,
                        value: results[index]
                    }
                })
            }).then(usersWithChat => {
                //do not consider users already having a meeting with me
                return MeetingsHandler.getFutureMeetings().then(meetings => {
                    return usersWithChat.filter(elem => {
                        return meetings.filter(m => m.idOpponent == elem.value) == 0
                    })
                })
            }).then(users=>{
                this.setState({
                    users: users,
                    loadingDone: true
                })
            })
        })
    }

    render() {
        if (this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        <Text style={styles.text}>Who do you want to meet?</Text>
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
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.text}>Choose the date of the meeting:</Text>
                        <Button onPress={this.showDatePicker}>Select a date</Button>
                        <DateTimePicker
                            isVisible={this.state.isDatePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDatePicker}
                            minimumDate={new Date()}
                        />
                        <Text style={styles.text}>Date chosen: {this.state.date}</Text>
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.text}>Choose time of the meeting:</Text>
                        <Button onPress={this.showTimePicker}>Select time</Button>
                        <DateTimePicker
                            mode={"time"}
                            isVisible={this.state.isTimePickerVisible}
                            onConfirm={this.handleTimePicked}
                            onCancel={this.hideTimePicker}
                        />
                        <Text style={styles.text}>Time chosen: {this.state.time}</Text>
                    </View>
                </View>
            )
        } else {
            return (<LoadingComponent/>)
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
        fontWeight: "bold",
        textAlign:"center"
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
        borderRadius: 25
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'transparent',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});