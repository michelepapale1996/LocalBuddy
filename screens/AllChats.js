import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, FlatList, ActivityIndicator, Image, TouchableWithoutFeedback} from 'react-native';
import firebase from 'react-native-firebase'
import Db from '../res/Db'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import ChatsHandler from "../res/ChatsHandler";

function Loading(){
    return(
        <View style={styles.container}>
            <Text>Loading</Text>
            <ActivityIndicator size="large"/>
        </View>
    )
}

function Chat(props) {
    var getTime = () => {
        const time = new Date(props.item.createdAt)
        const now = new Date()
        let lastMessageTime = ""

        if(time.getDate() == now.getDate()){
            let minutes = 0;
            if (time.getMinutes() < 10){
                minutes = "0" + time.getMinutes()
            }else{
                minutes = time.getMinutes()
            }
            lastMessageTime = time.getHours() + ":" + minutes
        }else if(time.getDate() + 1== now.getDate()){
            lastMessageTime = "Ieri"
        }else{
            lastMessageTime = time.getDate() + "/" + (time.getMonth()+1) + "/" + time.getFullYear()
        }
        return lastMessageTime
    }

    const lastMessageTime = getTime()

    return(
        <TouchableWithoutFeedback
            onPress={() => props.nav.navigate('SingleChat',
                {
                    chatId: props.item.chatId,
                    nameAndSurname: props.item.nameAndSurname,
                    urlPhotoOther: props.item.urlPhotoOther
                })}>
            <View style={styles.singleChatContainer}>
                <Image
                    style={styles.userPhoto}
                    source={{uri: props.item.urlPhotoOther}}/>
                <View style={styles.singleChat}>
                    <View style={{flexDirection: "row", justifyContent:"space-between"}}>
                        <Text style={styles.text}>
                            {props.item.nameAndSurname}
                        </Text>
                        <Text>
                            {lastMessageTime}
                        </Text>
                    </View>
                    <Text>
                        {props.item.lastMessageText}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default class AllChats extends Component {
    constructor(props){
        super(props)

        this.state = {
            chats: [],
            loadingDone: false
        }
    }

    static navigationOptions = () => {
        return {
            title: "Chat"
        };
    };

    setChats = (idChats) => {
        Db.getChatsInfoFromChatId(idChats).then(
            chats => {
                chats = ChatsHandler.sortInDateOrder(chats)

                this.setState({
                    chats: chats,
                    loadingDone: true
                })
            }
        )
    }

    componentDidMount(){
        const id  = firebase.auth().currentUser.uid;

        //get all the chats of the logged user
        firebase.database().ref("/users/" + id + "/chats").on("value",
            snap => {
                if(snap.val() == null){
                    //it does not have chats
                    this.setState({
                        loadingDone:true
                    })
                }else{
                    //the user has some chats
                    let idChats = []
                    valSnap = snap.val()
                    for(var key in valSnap){
                        idChats.push(valSnap[key])
                    }

                    //load chat the first time
                    this.setChats(idChats)

                    //Add listeners to all chats
                    idChats.map(
                        chatId=> {
                            firebase.database().ref("/chats/" + chatId).on("value",
                                () => this.setChats(idChats)
                            )
                        }
                    )
                }
            }
        )
    }

    render() {
        if(this.state.loadingDone != false){
            if(this.state.chats.length != 0) {
                return (
                    <FlatList
                        data={this.state.chats}
                        renderItem={
                            ({item}) => (
                                <Chat item={item} nav={this.props.navigation}/>
                            )
                        }
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                    />
                )
            }else{
                return(
                    <View>
                        <Text>Non hai ancora alcuna chat!</Text>
                    </View>
                )
            }
        }else{
            return(<Loading/>)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold"
    },
    singleChat: {
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'column',
        marginLeft: wp("3%")
    },
    singleChatContainer: {
        flexDirection: 'row',
        margin: wp("3%"),
        height: hp("10%")
    },
    userPhoto: {
        width: wp("15%"),
        height: wp("15%"),
        borderRadius: wp("15%")
    }
});
