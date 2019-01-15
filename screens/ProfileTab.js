import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Image, ScrollView, TouchableWithoutFeedback, ActivityIndicator, FlatList} from 'react-native';
import firebase from "react-native-firebase"
import ImagePicker from 'react-native-image-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function Biography(props){
    return(
        <View style={styles.biographyContainer}>
            <View style={styles.biography}>
                <Text style={{fontWeight:"bold"}}>Biografia</Text>
                {
                    props.bio != ""
                        ? <Text>{props.bio}</Text>
                        : <Text>Non hai ancora una biografia!</Text>
                }
            </View>
        </View>
    )
}

function NameAndSurname(props) {
    return(
        <View style={styles.nameAndSurname}>
            <Text style={styles.infoUser}>{props.name} {props.surname}</Text>
        </View>
    )
}

function PhotoProfile(props) {
    uploadImg = () => {
        ImagePicker.showImagePicker((response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = response.uri
                firebase.storage().ref("/PhotosProfile/" + props.userId).putFile(source)
            }
        })
    }

    return(
        <TouchableWithoutFeedback onPress={uploadImg}>
            <Image
                style={styles.photoProfile}
                source={{uri: props.photoPath}}/>
        </TouchableWithoutFeedback>
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
                    props.feedbacks != ""
                        ? <FeedbacksOverview feedbacks={props.feedbacks}/>
                        : <Text>Non hai ancora alcun feedback!</Text>
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
            photoToUpload: null
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
        const user = firebase.auth().currentUser;
        //get name and surname
        firebase.database().ref("/users/" + user.uid ).once("value").then(
            (snap) =>{
                this.setState(
                    {
                        name: snap.val().name,
                        surname: snap.val().surname,
                        bio: snap.val().biography
                    }
                )
            }
        );

        this.getUrlPhoto(user.uid).then(
            (url) => this.setState({photoPath: url})
        )


        //get feedbacks
        firebase.database().ref("/users/" + user.uid + "/feedbacks").once("value").then(
            (snap) => {
                const feedbacks = snap.val()
                //for each traveler get the name and surname
                feedbacks.map(
                    feedback => {
                        firebase.database().ref("/users/" + feedback.travelerId).once("value").then(
                            snap => {
                                feedback.name = snap.val().name
                            }
                        )

                        this.getUrlPhoto(feedback.travelerId).then(
                            (url)=> feedback.url = url
                        ).finally(
                            ()=>this.setState({feedbacks: feedbacks})
                        )
                    }
                )
            }
        )
    }

    render() {
        if(this.state.photoPath != null){
            return(
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.viewContainer}>
                        <View style={styles.userTop}>
                            <PhotoProfile photoPath={this.state.photoPath} userId={firebase.auth().currentUser.uid}/>
                            <NameAndSurname name={this.state.name} surname={this.state.surname}/>
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
        marginTop: 50
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
