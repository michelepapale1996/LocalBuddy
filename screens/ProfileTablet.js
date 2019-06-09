import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, TouchableWithoutFeedback, FlatList} from 'react-native';
import firebase from "react-native-firebase"
import ImagePicker from 'react-native-image-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import LoadingComponent from "../components/LoadingComponent";
import { IconButton, Colors, Text, Surface, TouchableRipple, Avatar } from 'react-native-paper';
import UserHandler from "../handler/UserHandler";
import StarRating from 'react-native-star-rating';
import LocalStateHandler from "../handler/LocalStateHandler";

function Biography(props){

    modifyBiography = ()=>{
        props.nav.navigate("NewBiography", {"newBiography": props.newBiography, "oldText": props.bio})
    }

    return(
        <View style={styles.biographyContainer}>
            <TouchableRipple onPress={modifyBiography} rippleColor="rgba(0, 0, 0, .32)">
                <View style={styles.biography}>
                    <View style={{flexDirection:"row", flex: 1, justifyContent: 'flex-end'}}>
                        <Icon name='pencil' type='evilicon' size={30}/>
                    </View>

                    {
                        props.bio != ""
                            ? <Text style={styles.biographyText}>{props.bio}</Text>
                            : <Text style={styles.biographyText}>You do not have any biography yet. Tap to modify!</Text>
                    }
                </View>
            </TouchableRipple>
        </View>
    )
}

function UserInfo(props) {
    const birthdate = new Date(props.userInfo.birthDate)
    const years = new Date().getFullYear() - birthdate.getFullYear()
    return(
        <View>
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
                var source = response.uri
                firebase.storage().ref("/PhotosProfile/" + props.userId).putFile(source).then(()=>{
                    firebase.storage().ref("/PhotosProfile/" + props.userId).getDownloadURL().then(url=>{
                        UserHandler.setUrlPhoto(url)
                        props.updatePhoto(url)
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
            <Image style={styles.photoTravelerProfile} source={{uri: props.feedback.url}}/>
            <View style={{margin:5, flex:1}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", flexWrap: "wrap" }}>
                    <Text style={{fontWeight:"bold", fontSize:wp("2,5%")}}>{props.feedback.name}</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        starSize={20}
                        rating={props.feedback.rating}
                        emptyStarColor={'#f1c40f'}
                        fullStarColor={'#f1c40f'}
                    />
                </View>

                <Text style={{fontSize:wp("2%")}}>{props.feedback.text}</Text>
            </View>
        </View>
    )
}

function Feedbacks(props){
    return(
        <View style={styles.feedbacksContainer}>
            <Text style={{fontWeight:"bold", fontSize:wp("3%")}}>Feedbacks</Text>
            {
                props.feedbacks != "" && props.feedbacks != undefined && props.feedbacks != null
                    ?
                    <FlatList
                        data={props.feedbacks}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => <Surface style={styles.feedbacks}>
                            <Feedback key={item.opponentId} feedback={item}/>
                        </Surface>
                        }/>
                    : <Text style={styles.biographyText}>
                        You do not have any feedback yet.
                    </Text>
            }
        </View>
    )
}

export default class ProfileTablet extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: null,
            photoToUpload: null,
            loadingDone: false
        }
    }

    updateUserPhoto = (url) => {
        this.setState(prevState => {
            let newState = prevState
            newState.user.urlPhoto = url
            return newState
        })
    }

    async componentDidMount(){
        /*const id = firebase.auth().currentUser.uid
        UserHandler.getUserInfo(id).then(user => {
            this.setState({
                user: user,
                loadingDone: true
            })
        })*/
        const user = await LocalStateHandler.getUserInfo()
        this.setState({
            user: user,
            loadingDone: true
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
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.header}/>
                        <IconButton
                            style={styles.settingsButton}
                            color={Colors.white}
                            icon="settings"
                            size={30}
                            onPress={() => this.props.navigation.navigate('Settings')}
                        />
                        <PhotoProfile photoPath={this.state.user.urlPhoto} updatePhoto={this.updateUserPhoto} userId={this.state.user.id}/>

                        <View style={{flex:1, marginTop: hp("10%"), flexDirection: "row", justifyContent:"space-between", ...styles.bodyContent}}>
                            <View style={{width: wp("30%"), flexDirection: "column"}}>
                                <UserInfo userInfo={this.state.user}/>
                                <Biography bio={this.state.user.bio} nav={this.props.navigation} newBiography={this.newBiography}/>
                            </View>
                            <Feedbacks feedbacks={this.state.user.feedbacks}/>
                        </View>
                    </ScrollView>
                </View>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        flex:1,
        marginBottom:2,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    biographyContainer: {
        fontSize: wp("5%"),
        margin: hp("1%"),
    },
    feedbacksContainer: {
        textAlign: "center",
        width: wp("60%"),
    },
    biography:{
        margin: wp("4%")
    },
    biographyText:{
        textAlign: "center",
        fontSize:wp("2%"),
        flex: 1,
    },
    feedbacks:{
        margin: wp("1%"),
        borderRadius: 5,
        elevation:2
    },
    nameAndSurnameText:{
        fontSize:wp("3%"),
        flex: 1,
        fontWeight:'bold',
        textAlign:"center"
    },
    infoUserText:{
        fontSize:wp("2%"),
        textAlign:"center"
    },
    photoTravelerProfile:{
        width: wp("10%"),
        height: wp("10%"),
        borderRadius: wp("20%")
    },
    header:{
        backgroundColor: "#2fa1ff",
        height:hp("20%"),
    },
    bodyContent: {
        flex: 1,
        padding:hp("10%"),
        backgroundColor: "white"
    },
    avatar: {
        width: wp("25%"),
        height: wp("25%"),
        borderRadius: wp("40%"),
        borderWidth: 4,
        borderColor: "white",
        alignSelf:'flex-start',
        position: 'absolute',
        marginLeft: wp("7%"),
        marginTop:hp("2%"),
        zIndex:9
    },
    settingsButton:{
        position: 'absolute',
        marginTop:hp("5%"),
        marginLeft:wp("95%")
    },
    photoButton:{
        width: wp("10%"),
        height: wp("10%"),
        borderRadius: wp("10%"),
        position: 'absolute',
        marginTop:hp("15%"),
        marginLeft:wp("70%"),
        zIndex:10,
    }
});
