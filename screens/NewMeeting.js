import React, {Component} from "react";
import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import DatePicker from 'react-native-datepicker'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import ChatsHandler from "../res/ChatsHandler"
import LoadingComponent from '../components/LoadingComponent'

export default class NewMeeting extends Component {
    static navigationOptions = () => {
        return {
            title: "New Meeting"
        };
    };

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
            loadingDone: false
        }
    }

    componentDidMount() {
        ChatsHandler.getChats().then(chats => {
            const usersWithChat = chats.map(user => {
                return {
                    nameAndSurname: user.nameAndSurname,
                    urlPhoto: user.urlPhotoOther
                }
            })
            this.setState({
                users: usersWithChat,
                loadingDone: true
            })
        })
    }

    render() {
        if (this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        <Text style={styles.text}>Who do you want to meet?</Text>
                        <FlatList
                            data={this.state.users}
                            renderItem={
                                ({item}) => (
                                    <View style={styles.userContainer}>
                                        <Image
                                            style={styles.userPhoto}
                                            source={{uri: item.urlPhoto}}/>
                                        <View style={styles.userInfoContainer}>
                                            <Text style={styles.text}>{item.nameAndSurname}</Text>
                                        </View>
                                    </View>
                                )
                            }
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
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