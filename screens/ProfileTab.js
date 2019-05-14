import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, TouchableWithoutFeedback} from 'react-native';
import firebase from "react-native-firebase"
import ImagePicker from 'react-native-image-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import LoadingComponent from "../components/LoadingComponent";
import { IconButton, Colors, Text, Surface } from 'react-native-paper';
import UserHandler from "../handler/UserHandler";
import StarRating from 'react-native-star-rating';

function Biography(props){

    modifyBiography = ()=>{
        props.nav.navigate("NewBiography", {"newBiography": props.newBiography})
    }

    /*<Text style={{fontWeight:"bold", fontSize:wp("5%"), textAlign:"center"}}>Biography</Text>*/

    return(
        <View style={styles.biographyContainer}>
            <View style={styles.biography}>
                <View style={{flexDirection:"row", flex: 1, justifyContent: 'flex-end',}}>
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
                console.log(source)
                firebase.storage().ref("/PhotosProfile/" + props.userId).putFile(source).then(()=>{
                    firebase.storage().ref("/PhotosProfile/" + props.userId).getDownloadURL().then(url=>{
                        UserHandler.setUrlPhoto(url)
                    })
                })
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
        <View style={{flexDirection:"row", margin:10}}>
            <Image
                style={styles.photoTravelerProfile}
                source={{uri: props.feedback.url}}/>
            <View style={{margin:5, flex:1}}>

                <View style={{flexDirection:"row", justifyContent:"space-between", flexWrap: "wrap" }}>
                    <Text style={{fontWeight:"bold",fontSize:wp("5%")}}>{props.feedback.name}</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        starSize={20}
                        rating={props.feedback.rating}
                        emptyStarColor={'#f1c40f'}
                        fullStarColor={'#f1c40f'}
                    />
                </View>

                <Text style={{fontSize:wp("4%")}}>{props.feedback.text}</Text>
            </View>
        </View>
    )
}

function Feedbacks(props){
    return(
        <View style={styles.feedbacksContainer}>
            <Text style={{fontWeight:"bold", fontSize:wp("6%"), marginLeft:wp("5%")}}>Feedbacks</Text>
            <Surface style={styles.feedbacks}>
                {
                    props.feedbacks != "" && props.feedbacks != undefined
                        ? props.feedbacks != null && props.feedbacks.map(
                            elem => <Feedback key={elem.opponentId} feedback={elem}/>
                        )
                        : <Text style={styles.biographyText}>
                            You do not have any feedback yet.
                        </Text>
                }
            </Surface>
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
        width: wp("95%"),
        margin: hp("1%"),
    },
    feedbacksContainer: {
        fontSize: hp("30%"),
        width: wp("95%"),
        margin: hp("1%"),
    },
    biography:{
        margin: wp("4%"),
    },
    biographyText:{
        textAlign: "center",
        fontSize:wp("4%"),
        flex: 1,
    },
    feedbacks:{
        margin: wp("2%"),
        borderRadius: 10,
        elevation:4
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
