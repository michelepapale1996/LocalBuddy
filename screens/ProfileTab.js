import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, TouchableWithoutFeedback} from 'react-native';
import firebase from "react-native-firebase"
import ImagePicker from 'react-native-image-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import LoadingComponent from "../components/LoadingComponent";
import { IconButton, Colors, Text } from 'react-native-paper';
import UserHandler from "../handler/UserHandler";

function Biography(props){

    modifyBiography = ()=>{
        props.nav.navigate("NewBiography", {"newBiography": props.newBiography})
    }

    return(
        <View style={styles.biographyContainer}>
            <View style={styles.biography}>
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={{fontWeight:"bold",fontSize:wp("5%")}}>Biography</Text>
                    <Icon onPress={modifyBiography} name='pencil' type='evilicon' size={30}/>

                </View>
                {
                    props.bio != ""
                        ? <Text style={styles.biographyText}>{props.bio}</Text>
                        : <Text style={styles.biographyText}>You do not have any biography yet. Tap to modify!</Text>
                }
            </View>
        </View>
    )
}

function UserInfo(props) {
    const birthdate = new Date(props.userInfo.birthDate)
    const years = new Date().getFullYear() - birthdate.getFullYear()
    return(
        <View style={styles.infoUser}>
            <Text style={styles.nameAndSurnameText}>
                {props.userInfo.name} {props.userInfo.surname}
            </Text>
            <Text style={styles.infoUserText}>{years} years old</Text>
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
            <Image style={styles.avatar} source={{uri: props.photoPath}}/>
        </TouchableWithoutFeedback>
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
                    <Text style={{fontWeight:"bold",fontSize:wp("5%")}}>Viaggiatore: </Text>
                    <Text style={{fontSize:wp("4%")}}>{props.feedback.name}</Text>
                </Text>
                <Text>
                    <Text style={{fontWeight:"bold",fontSize:wp("5%")}}>Voto: </Text>
                    <Text style={{fontSize:wp("4%")}}>{props.feedback.rating}/5</Text>
                </Text>
                <Text style={{flexWrap: "wrap", }}>
                    <Text style={{fontWeight:"bold",fontSize:wp("5%")}}>Commento: </Text>
                    <Text style={{fontSize:wp("4%")}}>{props.feedback.text}</Text>
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
                            You do not have any feedback yet.
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
                loadingDone: true
            })
        })
    }

    newBiography = (text) => {
        this.setState(prevState => {
            let newState = prevState
            newState.user.bio = text
            return newState
        })
    }

    render() {
        if (this.state.loadingDone){
            return(
                <ScrollView contentContainerStyle={styles.container}>
                    <View>
                        <View style={styles.header}></View>
                        <IconButton
                            style={styles.settingsButton}
                            color={Colors.white}
                            icon="settings"
                            size={30}
                            onPress={() => this.props.navigation.navigate('Settings')}
                        />

                        <IconButton
                            icon="add-a-photo"
                            color={Colors.white}
                            style={styles.photoButton}
                            size={30}
                        />
                        <PhotoProfile photoPath={this.state.user.urlPhoto} userId={this.state.user.id}/>

                        <View style={styles.bodyContent}>
                            <UserInfo userInfo={this.state.user}/>
                            <Biography bio={this.state.user.bio} nav={this.props.navigation} newBiography={this.newBiography}/>
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
        fontSize:wp("4%"),
        flex: 1,
    },
    infoUser:{
        flex: 1,
        width: wp("80%"),
        fontWeight:'600',
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
        backgroundColor: "#2fa1ff",
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
