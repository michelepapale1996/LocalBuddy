import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Image, ScrollView, TouchableWithoutFeedback, ActivityIndicator, FlatList} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import UserHandler from "../res/UserHandler";
import SingleChatHandler from "../res/SingleChatHandler";

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

function NameAndSurname(props) {
    return(
        <View style={styles.nameAndSurname}>
            <Text style={styles.infoUser}>{props.name} {props.surname}</Text>
            <Button
                title="Invia un messaggio"
                onPress={() => props.nav.navigate('SingleChat',
                    {
                        CCopponentUserId: props.ccUserId,
                        chatId: props.chatId,
                        nameAndSurname: props.name + " " + props.surname,
                        urlPhotoOther: props.photoPath
                    })}/>
        </View>
    )
}

function PhotoProfile(props) {
    return(
        <Image
            style={styles.photoProfile}
            source={{uri: props.photoPath}}/>
    )
}

function Feedback(props){
    return(
        <View>
            <Text>________________________</Text>
            <Image
                style={styles.photoTravelerProfile}
                source={{uri: props.feedback.url}}/>
            <Text>Viaggiatore: {props.feedback.name}</Text>
            <Text>Voto: {props.feedback.rating}/5</Text>
            <Text style={{fontWeight:"bold"}}>Commento:</Text>
            <Text>{props.feedback.text}</Text>
        </View>
    )
}

function FeedbacksOverview(props) {
    return(
        <View>
            {props.feedbacks != null && props.feedbacks.map(
                elem => <Feedback key={elem.travelerId} feedback={elem}/>
            )}
        </View>
    )
}

function Feedbacks(props){
    return(
        <View style={styles.biographyContainer}>
            <View style={styles.biography}>
                <Text style={{fontWeight:"bold"}}>Feedbacks</Text>
                {
                    props.feedbacks != null
                        ? <FeedbacksOverview feedbacks={props.feedbacks}/>
                        : <Text>Non ha ancora alcun feedback!</Text>
                }
            </View>
        </View>
    )
}

function Loading(){
    return(
        <View style={styles.container}>
            <Text>Loading</Text>
            <ActivityIndicator size="large"/>
        </View>
    )
}

export default class ProfileTab extends Component {
    constructor(props){
        super(props);

        this.state = {
            bio: null,
            feedbacks: null,
            name: null,
            surname: null,
            photoPath: null,
            photoToUpload: null,
            loadingDone: false,
            chatId: null
        }
    }

    getFeedbacksToDisplay = (feedbacks) => {
        let promises = feedbacks.map((feedback) => {
            const travelerId = feedback.travelerId
            return UserHandler.getUserInfo(travelerId)
        })

        return Promise.all(promises).then(results => {
            return results.map((res,index)=> {
                return({
                    name: res.name + " " + res.surname,
                    url: res.photoPath,
                    text: feedbacks[index].text
                })
            })
        })
    }

    componentDidMount(){
        const idBuddy = this.props.navigation.getParam('idUser', 'Error')
        UserHandler.getUserInfo(idBuddy).then(buddy => {

            //check if it exists already a chat between the logged user and the buddy
            SingleChatHandler.getChatId(idBuddy).then( connectyCubeChatId => {
                this.setState(
                    {
                        name: buddy.name,
                        surname: buddy.surname,
                        bio: buddy.bio,
                        photoPath: buddy.photoPath,
                        chatId: connectyCubeChatId,
                        ccUserId: buddy.ccUserId
                    }
                )
                this.props.navigation.setParams({nameBuddy: buddy.name + " " + buddy.surname})
                const feedbacks = buddy.feedbacks

                if (feedbacks != null && feedbacks != "") {
                    this.getFeedbacksToDisplay(feedbacks).then(toDisplay => {
                        this.setState({
                            feedbacks: toDisplay,
                            loadingDone: true
                        })
                    })
                }else{
                    this.setState({
                        loadingDone: true
                    })
                }
            })
        })
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.nameBuddy,
        };
    };

    render() {
        const id = this.props.navigation.getParam('idUser', 'Error')

        if(this.state.loadingDone){
            return(
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.viewContainer}>
                        <View style={styles.userTop}>
                            <PhotoProfile photoPath={this.state.photoPath} userId={id}/>
                            <NameAndSurname
                                name={this.state.name}
                                surname={this.state.surname}
                                photoPath={this.state.photoPath}
                                chatId={this.state.chatId}
                                ccUserId={this.state.ccUserId}
                                nav={this.props.navigation}
                                userId={id}/>
                        </View>
                        <Biography bio={this.state.bio}/>
                        <Feedbacks feedbacks={this.state.feedbacks}/>
                    </View>
                </ScrollView>
            )
        }else{
            return(<Loading/>)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        alignItems: 'center'
    },
    viewContainer:{
        flex:1
    },
    biographyContainer: {
        fontSize: hp("30%"),
        textAlign: 'center',
        borderColor: 'black',
        borderRadius: 7,
        borderWidth: 0.5,
        width: wp("95%"),
        margin: hp("1%")
    },
    biography:{
        margin: wp("3%")
    },
    infoUser:{
        fontSize:wp("7%"),
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 20
    },
    userTop:{
        flexDirection: 'row',
        margin: 20,
        marginTop: 30
    },
    nameAndSurname:{
        flex:1,
        margin:hp("3%")
    },
    photoProfile:{
        width: wp("40%"),
        height: wp("40%"),
        borderRadius: wp("40%")
    },
    photoTravelerProfile:{
        width: wp("20%"),
        height: wp("20%"),
        borderRadius: wp("20%")
    }
});
