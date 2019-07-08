import React, {Component} from 'react';
import { StyleSheet, View, Image, ScrollView, FlatList } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import UserHandler from "../handler/UserHandler";
import SingleChatHandler from "../handler/SingleChatHandler";
import LoadingComponent from "../components/LoadingComponent";
import { FAB, Text, Surface, Button, Snackbar } from 'react-native-paper';
import firebase from "react-native-firebase";
import StarRating from 'react-native-star-rating';
import MeetingsHandler from "../handler/MeetingsHandler";
import NavigationService from "../handler/NavigationService";

function Biography(props){
    return(
        <View style={props.styles.biographyContainer}>
            <View style={props.styles.biography}>
                {
                    props.bio != ""
                        ? <Text style={props.styles.biographyText}>{props.bio}</Text>
                        : <Text style={props.styles.biographyText}>The buddy does not have any biography yet.</Text>
                }
            </View>
        </View>
    )
}


function UserInfo(props) {
    const birthdate = new Date(props.userInfo.birthDate)
    const years = new Date().getFullYear() - birthdate.getFullYear()
    return(
        <View>
            <Text style={props.styles.nameAndSurnameText}>
                {props.userInfo.name} {props.userInfo.surname}
            </Text>
            <Text style={props.styles.infoUserText}>{years} years old</Text>
        </View>
    )
}

function PhotoProfile(props) {
    return(
        <Image style={props.styles.avatar} source={{uri: props.photoPath}}/>
    )
}

function Feedback(props){
    return(
        <View style={{flexDirection:"row", margin:10}}>
            <Image style={props.styles.photoTravelerProfile} source={{uri: props.feedback.url}}/>
            <View style={{margin:5, flex:1}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", flexWrap: "wrap" }}>
                    <Text style={{fontWeight:"bold",fontSize:wp("2,5%")}}>{props.feedback.name}</Text>
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
        <View style={props.styles.feedbacksContainer}>
            <Text style={{fontWeight:"bold", fontSize:wp("3%"), marginLeft:wp("5%")}}>Feedbacks</Text>
            {
                props.feedbacks != "" && props.feedbacks != undefined && props.feedbacks != null
                    ? <FlatList
                        data={props.feedbacks}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => <Surface style={props.styles.feedbacks}>
                            <Feedback styles={props.styles} key={item.opponentId} feedback={item}/>
                        </Surface>
                        }/>
                    : <Text style={props.styles.biographyText}>
                        The buddy does not have any feedback yet.
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
            loadingDone: false,
            snackBarVisible: false
        }
    }

    async componentDidMount(){
        loc(this)
        const idBuddy = this.props.navigation.getParam('idUser', 'Error')
        const buddy = await UserHandler.getUserInfo(idBuddy)
        const connectyCubeChatId = await SingleChatHandler.getChatId(idBuddy)

        this.props.navigation.setParams({nameBuddy: buddy.name + " " + buddy.surname})
        this.setState({
            user: buddy,
            loadingDone: true,
            chatId: connectyCubeChatId

        })
    }

    componentWillUnmount(){
        rol(this)
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.nameBuddy,
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#2fa1ff'
            },
            headerTitleStyle: {
                color: 'white'
            }
        };
    };

    render() {
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
                fontSize: wp("2%")
            },
            feedbacks:{
                margin: wp("1%"),
                borderRadius: 5,
                elevation:2
            },
            nameAndSurnameText:{
                fontSize:wp("3%"),
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
                borderRadius: wp("30%"),
                borderWidth: 4,
                borderColor: "white",
                alignSelf:'flex-start',
                position: 'absolute',
                marginLeft: wp("7%"),
                marginTop:hp("3%"),
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
                marginTop:hp("15%"),
                marginLeft:wp("70%"),
                zIndex:10,
            },
            fab: {
                position: 'absolute',
                right: wp("3%"),
                top: hp("70%"),
                backgroundColor: "#52c8ff"
            },
        });


        if (this.state.loadingDone){
            return(
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.header}/>
                        <PhotoProfile styles={styles} photoPath={this.state.user.urlPhoto} chatId={this.state.chatId} userId={this.state.user.id}/>

                        <View style={{flex:1, marginTop: hp("15%"), flexDirection: "row", justifyContent:"space-between", ...styles.bodyContent}}>
                            <View style={{width: wp("30%"), flexDirection: "column"}}>
                                <UserInfo styles={styles} userInfo={this.state.user}/>
                                <Button
                                    mode={"outlined"}
                                    onPress={async () => {
                                        //check if the user has already a future meeting with the given opponent
                                        const futureMeetings = await MeetingsHandler.getFutureMeetings()
                                        const idOpponent = this.props.navigation.getParam('idUser', 'Error')
                                        if(futureMeetings.filter(elem => elem.idOpponent == idOpponent).length > 0){
                                            alert("You have already a future meeting with this user.")
                                        }else {
                                            const navOptions = {
                                                nameAndSurnameOpponent: this.state.user.name + " " + this.state.user.surname,
                                                opponentId: idOpponent
                                            }
                                            NavigationService.goToNewMeeting(navOptions)
                                        }
                                    }}>
                                    Propose a new meeting
                                </Button>
                                <Biography styles={styles} bio={this.state.user.bio} nav={this.props.navigation} newBiography={this.newBiography}/>
                            </View>
                            <Feedbacks styles={styles} feedbacks={this.state.user.feedbacks}/>
                        </View>
                    </ScrollView>
                    <FAB
                        style={styles.fab}
                        color={"white"}
                        icon="send"
                        onPress={() => this.props.navigation.navigate({
                            routeName: 'SingleChat',
                            key: this.state.chatId,
                            params: {
                                CCopponentUserId: this.state.user.ccUserId,
                                chatId: this.state.chatId,
                                opponentNameAndSurname: this.state.user.name + " " + this.state.user.surname,
                                urlPhotoOther: this.state.user.urlPhoto,
                                opponentUserId: this.props.navigation.getParam('idUser', 'Error')
                            }
                        })}
                    />
                </View>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}