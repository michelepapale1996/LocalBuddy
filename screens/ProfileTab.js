import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, TouchableWithoutFeedback, FlatList} from 'react-native';
import firebase from "react-native-firebase"
import ImagePicker from 'react-native-image-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import LoadingComponent from "../components/LoadingComponent";
import { IconButton, Colors, Text, Surface, TouchableRipple } from 'react-native-paper';
import UserHandler from "../handler/UserHandler";
import StarRating from 'react-native-star-rating';
import LocalUserHandler from "../LocalHandler/LocalUserHandler";
import OrientationHandler from "../handler/OrientationHandler";
import Loading from "./Loading";
import Updater from "../updater/Updater";
import NetInfoHandler from "../handler/NetInfoHandler";

function Biography(props){
    modifyBiography = ()=>{
        props.nav.navigate("NewBiography", {"newBiography": props.newBiography, "oldText": props.bio})
    }

    return(
        <View style={props.styles.biographyContainer}>
            <TouchableRipple onPress={modifyBiography} rippleColor="rgba(0, 0, 0, .32)">
                <View style={props.styles.biography}>
                    <View style={{flexDirection:"row", flex: 1, justifyContent: 'flex-end'}}>
                        <Icon name='pencil' type='evilicon' size={30}/>

                    </View>

                    {
                        props.bio != ""
                            ? <Text style={props.styles.biographyText}>{props.bio}</Text>
                            : <Text style={props.styles.biographyText}>You do not have any biography yet. Tap to modify!</Text>
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
        <View style={props.styles.infoUser}>
            <Text style={props.styles.nameAndSurnameText}>
                {props.userInfo.name} {props.userInfo.surname}
            </Text>
            <Text style={props.styles.infoUserText}>{years} years old</Text>
            {props.userInfo.numberOfFeedbacks > 0 && <View style={{flexDirection:"row", flex:1, justifyContent:"center", marginTop:hp("1%"), alignItems:"center"}}>
                <StarRating
                    disabled={true}
                    maxStars={5}
                    starSize={20}
                    rating={props.userInfo.rating}
                    emptyStarColor={'#f1c40f'}
                    fullStarColor={'#f1c40f'}
                />
                <Text style={{marginLeft:wp("1%"), ...props.styles.text}}>{props.userInfo.numberOfFeedbacks}</Text>
            </View>}
        </View>
    )
}

function PhotoProfile(props) {
    uploadImg = () => {
        if(NetInfoHandler.isConnected){
            ImagePicker.showImagePicker((response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    props.isUploading(true)
                    var source = response.uri
                    firebase.storage().ref("/PhotosProfile/" + props.userId).putFile(source).then(()=>{
                        firebase.storage().ref("/PhotosProfile/" + props.userId).getDownloadURL().then(url=>{
                            LocalUserHandler.updateUserPhoto(url)
                            UserHandler.setUrlPhoto(url)
                            props.updatePhoto(url)
                        })
                    })
                }
            })
        } else {
            alert("You are not connected to the network. Check your connection and retry.")
        }
    }

    if(!props.isUploadingFlag){
        return(
            <TouchableWithoutFeedback onPress={uploadImg}>
                <Image style={props.styles.avatar} source={{uri: props.photoPath}}/>
            </TouchableWithoutFeedback>
        )
    }else{
        return(
            <LoadingComponent/>
        )
    }
}

function Feedback(props){
    return(
        <View style={{flexDirection:"row", margin:10, alignItems:"center"}}>
            <Image
                style={props.styles.photoTravelerProfile}
                source={{uri: props.feedback.url}}/>
            <View style={{marginLeft:wp("2%"), flex:1}}>

                <View style={{flexDirection:"row", justifyContent:"space-between", flexWrap: "wrap" }}>
                    <Text style={props.styles.opponentNameText}>{props.feedback.name}</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        starSize={20}
                        rating={props.feedback.rating}
                        emptyStarColor={'#f1c40f'}
                        fullStarColor={'#f1c40f'}
                    />
                </View>

                <Text style={props.styles.feedbackText}>{props.feedback.text.length > 0 ? props.feedback.text : "This user has not provided a textual feedback"}}</Text>
            </View>
        </View>
    )
}

function Feedbacks(props){
    return(
        <View style={props.styles.feedbacksContainer}>
            <Text style={props.styles.feedbacksLabelText}>Feedbacks</Text>
                {
                    props.feedbacks != "" && props.feedbacks != undefined && props.feedbacks != null
                        ?
                            <FlatList
                                data={props.feedbacks}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item}) => <Surface style={props.styles.feedbacks}>
                                    <Feedback key={item.opponentId} styles={props.styles} feedback={item}/>
                                </Surface>
                            }/>
                        : <Text style={props.styles.biographyText}>
                            You do not have any feedback yet
                        </Text>
                }
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

    updateUserPhoto = (url) => {
        this.setState(prevState => {
            let newState = prevState
            newState.user.urlPhoto = url
            newState.isUploadingPhoto = false
            return newState
        })
    }

    async componentDidMount(){
        loc(this)
        //const id = firebase.auth().currentUser.uid
        //var user = await UserHandler.getUserInfo(id)
        //const citiesWhereIsBuddy = await UserHandler.getCitiesOfTheBuddy(id)
        Updater.addListener(this.updateUserInfo)
        this.updateUserInfo()
    }

    componentWillUnmount(){
        rol(this)
        Updater.removeListener(this.updateUserInfo)
    }

    updateUserInfo = async () => {
        const citiesWhereIsBuddy = await LocalUserHandler.getCitiesOfTheBuddy()
        var user = await LocalUserHandler.getUserInfo()
        if(user.feedbacks != null){
            var total = 0
            user.feedbacks.forEach(elem => total += elem.rating)
            user.rating = total / user.feedbacks.length
            user.numberOfFeedbacks = user.feedbacks.length
        }

        this.setState({
            user: user,
            citiesWhereIsBuddy: citiesWhereIsBuddy,
            loadingDone: true,
            isUploadingPhoto: false
        })
    }

    newBiography = (text) => {
        this.setState(prevState => {
            let newState = prevState
            newState.user.bio = text
            return newState
        })
    }

    isUploading = (isUploading) => {
        this.setState({isUploadingPhoto: isUploading})
    }

    render() {
        var styles;
        if(OrientationHandler.orientation == "portrait") {
            styles = StyleSheet.create({
                container: {
                    backgroundColor: 'white',
                    marginBottom: 2,
                    shadowColor: "#000000",
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    shadowOffset: {
                        height: 1,
                        width: 1
                    }
                },
                biographyContainer: {
                    width: wp("95%"),
                    margin: hp("1%"),
                },
                feedbacksContainer: {
                    width: wp("95%"),
                    margin: hp("1%"),
                },
                biography: {
                    margin: wp("4%")
                },
                biographyText: {
                    textAlign: "center",
                    fontSize: wp("4%"),
                    flex: 1,
                },
                feedbacks: {
                    margin: wp("1%"),
                    borderRadius: 5,
                    elevation: 2
                },
                infoUser: {
                    flex: 1,
                    width: wp("80%"),
                    fontWeight: '600',
                    marginTop: hp("5%"),
                },
                nameAndSurnameText: {
                    fontSize: wp("7%"),
                    flex: 1,
                    fontWeight: '600',
                    textAlign: "center"
                },
                infoUserText: {
                    fontSize: wp("5%"),
                    flex: 1,
                    fontWeight: '300',
                    marginLeft: 0,
                    textAlign: "center"
                },
                nameAndSurname: {
                    flex: 1
                },
                photoTravelerProfile: {
                    width: wp("20%"),
                    height: wp("20%"),
                    borderRadius: wp("20%")
                },
                header: {
                    backgroundColor: "#2fa1ff",
                    height: hp("30%"),
                },
                bodyContent: {
                    flex: 1,
                    alignItems: 'center',
                    padding: hp("10%"),
                    backgroundColor: "white"
                },
                avatar: {
                    width: wp("50%"),
                    height: wp("50%"),
                    borderRadius: wp("40%"),
                    borderWidth: 4,
                    borderColor: "white",
                    alignSelf: 'center',
                    position: 'absolute',
                    marginTop: wp("20%"),
                    zIndex: 9
                },
                settingsButton: {
                    position: 'absolute',
                    marginTop: hp("5%"),
                    marginLeft: wp("85%")
                },
                citiesLabelText: {
                    fontWeight:"bold",
                    fontSize:wp("6%"),
                    marginLeft:wp("5%")
                },
                nameCityText: {
                    fontSize:wp("4%"),
                    marginLeft:wp("2%")
                },
                feedbacksLabelText: {
                    fontWeight:"bold",
                    fontSize:wp("6%"),
                    marginLeft:wp("5%")
                },
                opponentNameText: {
                    fontWeight:"bold",
                    fontSize:wp("5%")
                },
                feedbackText: {
                    fontSize:wp("4%")
                }
            })
        } else {
            styles = StyleSheet.create({
                container: {
                    backgroundColor: 'white',
                    marginBottom: 2,
                    shadowColor: "#000000",
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    shadowOffset: {
                        height: 1,
                        width: 1
                    }
                },
                biographyContainer: {
                    width: wp("95%"),
                    margin: hp("1%"),
                },
                feedbacksContainer: {
                    width: wp("95%"),
                    margin: hp("1%"),
                },
                biography: {
                    margin: wp("4%")
                },
                biographyText: {
                    textAlign: "center",
                    fontSize: 20,
                    flex: 1,
                },
                feedbacks: {
                    margin: wp("1%"),
                    borderRadius: 5,
                    elevation: 2
                },
                infoUser: {
                    flex: 1,
                    width: wp("80%"),
                    fontWeight: '600',
                    marginTop: hp("5%"),
                },
                nameAndSurnameText: {
                    fontSize: 30,
                    flex: 1,
                    fontWeight: '600',
                    textAlign: "center"
                },
                infoUserText: {
                    fontSize: 20,
                    flex: 1,
                    fontWeight: '300',
                    marginLeft: 0,
                    textAlign: "center"
                },
                nameAndSurname: {
                    flex: 1
                },
                photoTravelerProfile: {
                    width: wp("10%"),
                    height: wp("10%"),
                    borderRadius: wp("20%")
                },
                header: {
                    backgroundColor: "#2fa1ff",
                    height: hp("40%"),
                },
                bodyContent: {
                    flex: 1,
                    alignItems: 'center',
                    padding: hp("10%"),
                    backgroundColor: "white"
                },
                avatar: {
                    width: wp("30%"),
                    height: wp("30%"),
                    borderRadius: wp("40%"),
                    borderWidth: 4,
                    borderColor: "white",
                    alignSelf: 'center',
                    position: 'absolute',
                    marginTop: hp("5%"),
                    zIndex: 9
                },
                settingsButton: {
                    position: 'absolute',
                    marginTop: hp("5%"),
                    marginLeft: wp("90%")
                },
                citiesLabelText: {
                    fontWeight:"bold",
                    fontSize:25,
                    marginLeft:wp("5%")
                },
                nameCityText: {
                    fontSize:18,
                    marginLeft:wp("2%")
                },
                feedbacksLabelText: {
                    fontWeight:"bold",
                    fontSize: 25,
                    marginLeft:wp("5%")
                },
                opponentNameText: {
                    fontWeight:"bold",
                    fontSize: 25
                },
                feedbackText: {
                    fontSize:20
                }
            })
        }

        if (this.state.loadingDone){
            return(
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.header}></View>
                        <IconButton
                            style={styles.settingsButton}
                            color={Colors.white}
                            icon="settings"
                            size={30}
                            onPress={() => this.props.navigation.navigate('Settings')}
                        />
                        <PhotoProfile styles={styles} isUploading={this.isUploading} isUploadingFlag={this.state.isUploadingPhoto} photoPath={this.state.user.urlPhoto} updatePhoto={this.updateUserPhoto} userId={this.state.user.id}/>

                        <View style={styles.bodyContent}>
                            <UserInfo styles={styles} userInfo={this.state.user}/>
                            <Biography styles={styles} bio={this.state.user.bio} nav={this.props.navigation} newBiography={this.newBiography}/>

                            {
                                this.state.citiesWhereIsBuddy != undefined && this.state.citiesWhereIsBuddy.length > 0 ?
                                <View style={styles.feedbacksContainer}>
                                    <Text style={styles.citiesLabelText}>Cities</Text>
                                    <Surface style={styles.feedbacks}>
                                    <FlatList
                                        data={this.state.citiesWhereIsBuddy}
                                        renderItem={({item}) =>
                                            <View style={{flexDirection: "row", alignItems:"center"}}>
                                            <IconButton icon={"location-on"}/>
                                            <Text style={styles.nameCityText}>{item.cityName}</Text>
                                            </View>
                                        }
                                        keyExtractor={(item, index) => index.toString()}
                                        extraData={this.state.cities}
                                        showsVerticalScrollIndicator={false}
                                    />
                                    </Surface>
                                </View>
                                :
                                <View/>
                            }

                            <Feedbacks styles={styles} feedbacks={this.state.user.feedbacks}/>

                        </View>
                    </ScrollView>
                </View>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}
