import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Image, ScrollView, TouchableWithoutFeedback, ActivityIndicator, FlatList} from 'react-native';
import firebase from "react-native-firebase"
import ImagePicker from 'react-native-image-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Db from "../res/Db";

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
                        otherUserId: props.userId,
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
    getNumber = (rating) => {
        return props.feedbacks.filter(
            elem => elem.rating == rating
        ).length
    }

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

    getUrlPhoto = (userId) => {
        return new Promise(
            resolve => {
                firebase.storage().ref("/PhotosProfile/" + userId).getDownloadURL().then(
                    (url) => {
                        resolve(url)
                    }
                ).catch(
                    ()=> {
                        firebase.storage().ref("/PhotosProfile/blank.png").getDownloadURL().then(
                            (url) => {
                                resolve(url)
                            }
                        )
                    }
                )
            }
        )
    }

    componentDidMount(){
        const id = this.props.navigation.getParam('idUser', 'Error')
        const idLoggedUser = firebase.auth().currentUser.uid
        let promises = []

        promises.push(firebase.database().ref("/users/" + id ).once("value"))
        promises.push(this.getUrlPhoto(id))
        promises.push(Db.getChatIdFromUsersIds(idLoggedUser, id))
        promises.push(firebase.database().ref("/users/" + id + "/feedbacks").once("value"))

        Promise.all(promises).then(
            results => {
                this.setState(
                    {
                        name: results[0].val().name,
                        surname: results[0].val().surname,
                        bio: results[0].val().biography,
                        photoPath: results[1],
                        chatId: results[2]
                    }
                )
                this.props.navigation.setParams({nameBuddy: results[0].val().name + " " + results[0].val().surname})

                const feedbacks = results[3].val()
                if (feedbacks != null && feedbacks != "") {
                    //for each traveler get the name and surname
                    let names = feedbacks.map(
                        feedback => {
                            return firebase.database().ref("/users/" + feedback.travelerId).once("value")
                        }
                    )
                    Promise.all(names).then((result) => {
                        result.map(
                            (user, index) => {
                                feedbacks[index].name = user.val().name + " " + user.val().surname
                            }
                        )
                    }).then(
                        ()=>{
                            urlPhotos = feedbacks.map(
                                feedback => {
                                    return this.getUrlPhoto(feedback.travelerId)
                                }
                            )
                            Promise.all(urlPhotos).then(result => {
                                result.map((url, index) => {
                                    feedbacks[index].url = url
                                })
                            }).then(
                                () => {
                                    this.setState({
                                        feedbacks: feedbacks,
                                        loadingDone: true
                                    })
                                }
                            )
                        }
                    )
                }else{
                    this.setState({
                        loadingDone: true
                    })
                }
            }
        )
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.nameBuddy,
        };
    };

    render() {
        const id = this.props.navigation.getParam('idUser', 'Error')

        if(this.state.loadingDone != false){
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
