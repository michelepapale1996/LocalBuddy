import React, {Component} from 'react'
import {StyleSheet, View, FlatList, Image } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from "react-native-responsive-screen"
import ChatsHandler from "../handler/ChatsHandler"
import MessagesUpdatesHandler from "../updater/MessagesUpdatesHandler"
import LoadingComponent from '../components/LoadingComponent'
import { Text, TouchableRipple, Portal, Dialog, Button, Paragraph } from 'react-native-paper'
import ConnectyCubeHandler from "../handler/ConnectyCubeHandler";
import LocalChatsHandler from "../LocalHandler/LocalChatsHandler";
import OrientationHandler from "../handler/OrientationHandler";

function Chat(props) {
    const lastMessageTime = props.getTime(props.item.createdAt)
    return(
        <TouchableRipple
            style={props.styles.mainChatContainer}
            onLongPress={()=>{
                props.setDialogIdToDelete(props.item.chatId)
                props.show()
            }}
            onPress={() =>{
                props.nav.navigate({routeName: 'SingleChat',
                    key: props.item.chatId,
                    params:{
                        chatId: props.item.chatId,
                        opponentNameAndSurname: props.item.nameAndSurname,
                        urlPhotoOther: props.item.urlPhotoOther,
                        CCopponentUserId: props.item.CCopponentUserId,
                        opponentUserId: props.item.opponentUserId
                    }})
            }}>
            <View style={props.styles.singleChatContainer}>
                <Image
                    style={props.styles.userPhoto}
                    source={{uri: props.item.urlPhotoOther}}/>
                <View style={{borderBottomWidth: 1, borderColor:"grey", flex:1}}>
                    <View style={props.styles.singleChat}>
                        <View style={{flexDirection: "row", justifyContent:"space-between"}}>
                            <Text style={props.styles.text}>
                                {props.item.nameAndSurname}
                            </Text>
                            <Text>
                                {lastMessageTime}
                            </Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent:"space-between"}}>
                            <Text>
                                {props.item.lastMessageText}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableRipple>
    )
}

export default class AllChats extends Component {
    constructor(props){
        super(props)

        this.state = {
            chats: [],
            loadingDone: false,
            isDialogVisible: false,
            dialogIdToDelete: null
        }
    }

    static navigationOptions = {
        title: "Chat",
        headerStyle: {
            backgroundColor: '#2fa1ff'
        },
        headerTitleStyle: {
            color: 'white'
        }
    };

    componentWillUnmount(){
        rol(this)
        MessagesUpdatesHandler.removeListeners(this.onMessageRcvd)
    }

    getTime = (createdAt) => {
        const time = new Date(createdAt)
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
        }else if(time.getDate() + 1 == now.getDate()){
            lastMessageTime = "Yesterday"
        }else{
            lastMessageTime = time.getDate() + "/" + (time.getMonth()+1) + "/" + time.getFullYear()
        }
        return lastMessageTime
    }

    onMessageRcvd = (payload, isLocal)=>{
        this.setState(prevState => {
            if(isLocal) {
                var toUpdate = prevState.chats.filter((elem) => elem.chatId == payload.chatId)[0]
                var otherChats = prevState.chats.filter((elem) => elem.chatId != payload.chatId)
                //if the user is starting a new conversation, toUpdate will be null
                if (toUpdate == null || toUpdate == undefined) {
                    toUpdate = {
                        chatId: payload.chatId,
                        CCopponentUserId: payload.ccOpponentUserId,
                        nameAndSurname: payload.opponentUsername,
                        urlPhotoOther: payload.urlPhotoOther
                    }
                }
                toUpdate.lastMessageText = payload.text
                var time = new Date(payload.createdAt)
                toUpdate.createdAt = time.toUTCString()

                var allChats = [toUpdate]
                //if the user has not other chats
                if (otherChats.length != 0){
                    otherChats.forEach(elem => allChats.push(elem))
                }
                return ({
                    chats: allChats
                })
            } else {
                //new message from another user
                toUpdate = prevState.chats.filter((elem) => elem.chatId == payload.chatId)[0]
                otherChats = prevState.chats.filter((elem) => elem.chatId != payload.chatId)

                //if the user is starting a new conversation, toUpdate will be null
                if(toUpdate == null || toUpdate == undefined){
                    ChatsHandler.getChats().then(chats =>{
                        this.setState({chats})
                    })
                } else {
                    toUpdate.lastMessageText = payload.text
                    toUpdate.createdAt = payload.createdAt

                    var allChats = [toUpdate]
                    //if the user has not other chats
                    if (otherChats.length != 0){
                        otherChats.forEach(elem => allChats.push(elem))
                    }
                    return ({
                        chats: allChats
                    })
                }
            }
        })
    }

    _showDialog = () => this.setState({ isDialogVisible: true });

    _hideDialog = () => this.setState({ isDialogVisible: false });

    setDialogIdToDelete = (dialogID) => this.setState({ dialogIdToDelete: dialogID})

    async componentDidMount(){
        loc(this)
        MessagesUpdatesHandler.addListener(this.onMessageRcvd)
        LocalChatsHandler.getChats().then(chats => {
            this.setState({
                chats: chats,
                loadingDone: true
            })
        })

    }

    render() {
        var styles;
        if(OrientationHandler.orientation == "portrait"){
            styles = StyleSheet.create({
                container: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                },
                text: {
                    fontSize: 20,
                    fontWeight: "bold"
                },
                singleChat: {
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent:"center",
                    marginLeft: wp("3%"),
                    marginRight: wp("3%"),
                },
                singleChatContainer: {
                    flex:1,
                    flexDirection: 'row',
                    alignItems:"center",
                    marginLeft: wp("3%"),
                    marginRight: wp("1%"),
                },
                userPhoto: {
                    width: wp("15%"),
                    height: wp("15%"),
                    borderRadius: wp("15%")
                },
                mainChatContainer:{
                    height:hp("12%")
                }
            })
        }else{
            styles = StyleSheet.create({
                container: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                },
                text: {
                    fontSize: 20,
                    fontWeight: "bold"
                },
                singleChat: {
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent:"center",
                    marginLeft: wp("3%"),
                    marginRight: wp("3%"),
                },
                singleChatContainer: {
                    flex:1,
                    flexDirection: 'row',
                    alignItems:"center",
                    marginLeft: wp("3%"),
                    marginRight: wp("1%"),
                },
                userPhoto: {
                    width: wp("10%"),
                    height: wp("10%"),
                    borderRadius: wp("15%")
                },
                mainChatContainer:{
                    height:hp("20%")
                }
            })
        }

        if(this.state.loadingDone != false){
            if(this.state.chats.length != 0) {
                return (
                    <View>
                        <FlatList
                            data={this.state.chats}
                            renderItem={
                                ({item}) => (
                                    <Chat styles={styles} item={item} getTime={this.getTime} show={this._showDialog} setDialogIdToDelete={this.setDialogIdToDelete} nav={this.props.navigation} userName={this.state.username}/>
                                )
                            }
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                        />

                        <Portal>
                            <Dialog
                                visible={this.state.isDialogVisible}
                                onDismiss={this._hideDialog}>
                                <Dialog.Content>
                                    <Paragraph>Do you want to cancel this conversation?</Paragraph>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={this._hideDialog}>No</Button>
                                    <Button onPress={()=>{
                                        this._hideDialog()
                                        ConnectyCubeHandler.deleteConversation(this.state.dialogIdToDelete)
                                        this.setState(prevState => {
                                            console.log(prevState.chats)
                                            const newState = prevState.chats.filter(chat => {
                                                return chat.chatId !== this.state.dialogIdToDelete
                                            })

                                            return {chats: newState}
                                        })
                                    }}>
                                        Yes
                                    </Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                    </View>
                )
            } else {
                return(
                    <View style={styles.container}>
                        <Text style={styles.text}>You do not have any chat yet</Text>
                        <Button mode={"outlined"} onPress={()=>this.props.navigation.navigate("Search")}>To start chatting, look for a new buddy</Button>
                    </View>
                )
            }
        }else{
            return(<LoadingComponent/>)
        }
    }
}
