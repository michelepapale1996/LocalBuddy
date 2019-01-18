import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, FlatList, ActivityIndicator, Image, TouchableWithoutFeedback} from 'react-native';
import firebase from 'react-native-firebase'
import Db from '../res/Db'
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

function Loading(){
    return(
        <View style={styles.container}>
            <Text>Loading</Text>
            <ActivityIndicator size="large"/>
        </View>
    )
}

function Chat(props) {
    return(
        <TouchableWithoutFeedback
            onPress={() => props.nav.navigate('SingleChat',
                {
                    chatId: props.item.chatId,
                    nameAndSurname: props.item.nameAndSurname,
                    urlPhotoOther: props.item.urlPhotoOther
                })}>
            <View style={styles.chat}>
                <Image
                    style={styles.userPhoto}
                    source={{uri: props.item.urlPhotoOther}}/>
                <Text style={styles.text}>
                    {props.item.nameAndSurname}
                </Text>
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

    componentDidMount(){
        const id  = firebase.auth().currentUser.uid;
        firebase.database().ref("/users/" + id + "/chats").once("value").then(
            snap => {
                if(snap == ""){
                    //non ha chats
                    this.setState({
                        loadingDone:true
                    })
                }else{
                    //the user has some chats
                    let chats = []
                    let promises = snap.val().map(
                        idChat => {
                            chats.push({chatId: idChat})
                            return firebase.database().ref("/chats/" + idChat).once("value")
                        }
                    )
                    Promise.all(promises).then(
                        result => {
                            result.map(
                                (chat, index) => {
                                    let idOtherUser = "";
                                    if( id == chat.val().idUser1){
                                        idOtherUser = chat.val().idUser2;
                                    }else{
                                        idOtherUser = chat.val().idUser1;
                                    }

                                    let promises1 = [
                                        Db.getNameAndSurnameFromId(idOtherUser),
                                        Db.getUrlPhotoFromId(idOtherUser),
                                        Db.getUrlPhotoFromId(id)
                                    ]
                                    Promise.all(promises1).then(
                                        results => {
                                            chats[index].nameAndSurname = results[0]
                                            chats[index].urlPhotoOther = results[1]
                                            chats[index].urlPhotoUser = results[2]
                                        }
                                    ).then(()=>{
                                        this.setState({
                                            chats: chats,
                                            loadingDone: true
                                        })
                                    })
                                }
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
        textAlign: 'center',
        margin: 10,
    },
    chat: {
        borderWidth: 1,
        flexDirection: 'row'
    },
    userPhoto: {
        width: wp("20%"),
        height: wp("20%"),
        borderRadius: wp("20%")
    }
});
