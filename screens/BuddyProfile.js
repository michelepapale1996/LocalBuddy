import React, {Component} from 'react';
import {StyleSheet, View, Button, Image, ScrollView, TouchableWithoutFeedback, ActivityIndicator, FlatList} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import UserHandler from "../res/UserHandler";
import SingleChatHandler from "../res/SingleChatHandler";
import LoadingComponent from "../components/LoadingComponent";
import { IconButton, Text, Colors } from 'react-native-paper';
import firebase from "react-native-firebase";

function Biography(props){
    return(
        <View style={styles.biographyContainer}>
            <View style={styles.biography}>
                <Text style={{fontWeight:"bold"}}>Biografia</Text>
                {
                    props.bio != ""
                        ? <Text>{props.bio}</Text>
                        : <Text>Non ha ancora una biografia!</Text>
                }
            </View>
        </View>
    )
}


function UserInfo(props) {
    const years = 22
    return(
        <View style={styles.infoUser}>
            <Text style={styles.nameAndSurnameText}>
                {props.userInfo.name} {props.userInfo.surname}
            </Text>
            <Text style={styles.infoUserText}>{years} years old</Text>
            <Button
                title="Send a message"
                onPress={() => props.nav.navigate('SingleChat',
                    {
                        CCopponentUserId: props.userInfo.ccUserId,
                        chatId: props.chatId,
                        opponentNameAndSurname: props.userInfo.name + " " + props.userInfo.surname,
                        urlPhotoOther: props.userInfo.urlPhoto
                    })}/>
        </View>
    )
}

function PhotoProfile(props) {
    return(
        <Image
            style={styles.avatar}
            source={{uri: props.photoPath}}/>
    )
}

function Feedback(props){
    return(
        <View style={{borderBottomWidth:1, flexDirection:"row", margin:10}}>
            <Image
                style={styles.photoTravelerProfile}
                source={{uri: props.feedback.url}}/>
            <View style={{margin:5, flex:1}}>
                <Text>
                    <Text style={{fontWeight:"bold"}}>Viaggiatore: </Text>
                    {props.feedback.name}
                </Text>
                <Text>
                    <Text style={{fontWeight:"bold"}}>Voto: </Text>
                    {props.feedback.rating}/5
                </Text>
                <Text style={{flexWrap: "wrap", }}>
                    <Text style={{fontWeight:"bold"}}>Commento: </Text>
                    {props.feedback.text}
                </Text>
            </View>
        </View>
    )
}

function FeedbacksOverview(props) {
    getNumber = (rating) => {
        return props.feedbacks.filter(
            elem => elem.rating == rating
        ).length
    }

    return(
        <View>
            {props.feedbacks != null && props.feedbacks.map(
                elem => <Feedback key={elem.opponentId} feedback={elem}/>
            )}
        </View>
    )
}

function Feedbacks(props){
    return(
        <View style={styles.biographyContainer}>
            <View style={styles.biography}>
                <Text style={{
                    fontWeight:"bold",
                    fontSize:wp("6%")
                }}>
                    Feedbacks
                </Text>
                {
                    props.feedbacks != "" && props.feedbacks != undefined
                        ? <FeedbacksOverview feedbacks={props.feedbacks}/>
                        : <Text style={styles.biographyText}>
                            He has not any feedback yet.
                        </Text>
                }
            </View>
        </View>
    )
}

export default class ProfileTab extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: null,
            photoToUpload: null,
            loadingDone: false
        }
    }

    componentDidMount(){
        const id = firebase.auth().currentUser.uid
        UserHandler.getUserInfo(id).then(user => {
            this.setState({
                user: user,
                chatId: null,
                loadingDone: true
            })
        })
    }

    componentDidMount(){
        const idBuddy = this.props.navigation.getParam('idUser', 'Error')
        UserHandler.getUserInfo(idBuddy).then(buddy => {
            //check if it exists already a chat between the logged user and the buddy
            SingleChatHandler.getChatId(idBuddy).then( connectyCubeChatId => {
                this.props.navigation.setParams({nameBuddy: buddy.name + " " + buddy.surname})
                this.setState({
                    user: buddy,
                    loadingDone: true,
                    chatId: connectyCubeChatId
                })
            })
        })
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.nameBuddy,
        };
    };

    render() {
        if (this.state.loadingDone){
            return(
                <ScrollView contentContainerStyle={styles.container}>
                    <View>
                        <View style={styles.header}></View>
                        <PhotoProfile photoPath={this.state.user.urlPhoto} chatId={this.state.chatId} userId={this.state.user.id}/>

                        <View style={styles.bodyContent}>
                            <UserInfo
                                chatId={this.state.chatId}
                                nav={this.props.navigation}
                                userInfo={this.state.user}
                            />
                            <Biography bio={this.state.user.bio} nav={this.props.navigation}/>
                            <Feedbacks feedbacks={this.state.user.feedbacks}/>
                        </View>
                    </View>
                </ScrollView>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}

const styles = StyleSheet.create({
    biographyContainer: {
        fontSize: hp("30%"),
        textAlign: 'center',
        borderColor: 'black',
        borderRadius: 7,
        borderWidth: 0.5,
        width: wp("95%"),
        margin: hp("1%"),
    },
    biography:{
        margin: wp("4%"),
    },
    biographyText:{
        fontSize:wp("5%"),
        flex: 1,
    },
    infoUser:{
        flex: 1,
        width: wp("80%"),
        fontWeight:'600',
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 7,
        marginTop: hp("5%"),
    },
    nameAndSurnameText:{
        fontSize:wp("7%"),
        flex: 1,
        fontWeight:'600',
        textAlign:"center"
    },
    infoUserText:{
        fontSize:wp("5%"),
        flex: 1,
        fontWeight:'300',
        marginLeft: 0,
        textAlign:"center"
    },
    nameAndSurname:{
        flex:1
    },
    photoTravelerProfile:{
        width: wp("20%"),
        height: wp("20%"),
        borderRadius: wp("20%")
    },
    header:{
        backgroundColor: "#52c8ff",
        height:hp("30%"),
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:hp("10%"),
        backgroundColor: "white"
    },
    avatar: {
        width: wp("50%"),
        height: wp("50%"),
        borderRadius: wp("40%"),
        borderWidth: 4,
        borderColor: "white",
        alignSelf:'center',
        position: 'absolute',
        marginTop:wp("20%"),
        zIndex:9
    },
    settingsButton:{
        position: 'absolute',
        marginTop:hp("5%"),
        marginLeft:wp("85%")
    },
    photoButton:{
        width: wp("10%"),
        height: wp("10%"),
        borderRadius: wp("10%"),
        position: 'absolute',
        marginTop:hp("20%"),
        marginLeft:wp("65%"),
        zIndex:10,
        backgroundColor:"dodgerblue"
    }
});
