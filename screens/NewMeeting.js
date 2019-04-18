import React, {Component} from "react";
import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import DatePicker from 'react-native-datepicker'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import ChatsHandler from "../res/ChatsHandler"
import LoadingComponent from '../components/LoadingComponent'
import RNPickerSelect from 'react-native-picker-select'
import { Button } from 'react-native-elements'
import MeetingsHandler from "../res/MeetingsHandler";

export default class NewMeeting extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "New Meeting",
            headerRight: (
                <Button
                    onPress={()=>navigation.getParam("saveMeeting", null)()}
                    buttonStyle={styles.button}
                    title="Save"
                    color="#fff"
                />
            ),
        };
    };

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
        const today = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
        const maxDate = (date.getFullYear() + 2) + "-" + date.getMonth() + "-" + date.getDate()
        const time = date.getHours() + ":" + date.getMinutes()

        this.state = {
            date: today,
            today: today,
            maxDate: maxDate,
            time: time,
            users: null,
            chosenUserId: null,
            loadingDone: false
        }
        this.props.navigation.setParams({
            saveMeeting: this.saveMeeting
        })
    }

    componentDidMount() {
        ChatsHandler.getChats().then(chats => {
            const promises = chats.map(user => {
                return ChatsHandler.getUserId(user.CCopponentUserId)
            })

            Promise.all(promises).then(results => {
                return chats.map((user,index) => {
                    return {
                        label: user.nameAndSurname,
                        value: results[index]
                    }
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
                        <DatePicker
                            style={{width: wp("70%")}}
                            date={this.state.date}
                            mode="date"
                            placeholder="select date"
                            format="YYYY-MM-DD"
                            minDate={this.state.today}
                            maxDate={this.state.maxDate}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: wp("20%")
                                },
                                dateInput: {
                                    marginLeft: wp("30%")
                                }
                            }}
                            onDateChange={(date) => {
                                this.setState({date: date})
                            }}
                        />
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.text}>Choose time of the meeting:</Text>
                        <DatePicker
                            style={{width: wp("70%")}}
                            date={this.state.time}
                            mode="time"
                            format="HH:mm"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            minuteInterval={10}
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: wp("20%")
                                },
                                dateInput: {
                                    marginLeft: wp("30%")
                                }
                            }}
                            onDateChange={(time) => {
                                this.setState({time: time});
                            }}
                        />
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