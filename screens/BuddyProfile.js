import React, {Component} from 'react';
import { StyleSheet, View, Image, ScrollView, FlatList } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import UserHandler from "../handler/UserHandler";
import SingleChatHandler from "../handler/SingleChatHandler";
import LoadingComponent from "../components/LoadingComponent";
import { FAB, Text, Surface, Button, IconButton } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import MeetingsHandler from "../handler/MeetingsHandler";
import NavigationService from "../handler/NavigationService";

function Biography(props){
    return(
        <View style={styles.biographyContainer}>
            <View style={styles.biography}>
                {
                    props.bio != ""
                        ? <Text style={styles.biographyText}>{props.bio}</Text>
                        : <Text style={styles.biographyText}>The buddy does not have any biography yet.</Text>
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
            {props.userInfo.numberOfFeedbacks > 0 && <View style={{flexDirection:"row", flex:1, marginTop:hp("1%"), justifyContent:"center", alignItems:"center"}}>
                <StarRating
                    disabled={true}
                    maxStars={5}
                    starSize={20}
                    rating={props.userInfo.rating}
                    emptyStarColor={'#f1c40f'}
                    fullStarColor={'#f1c40f'}
                />
                <Text style={{marginLeft:wp("1%"), ...styles.text}}>{props.userInfo.numberOfFeedbacks}</Text>
            </View>}
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
                {
                    props.feedbacks != "" && props.feedbacks != undefined && props.feedbacks != null
                        ? <FlatList
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
        const idBuddy = this.props.navigation.getParam('idUser', 'Error')
        var buddy = await UserHandler.getUserInfo(idBuddy)

        const citiesWhereIsBuddy = await UserHandler.getCitiesOfTheBuddy(idBuddy)
        //var user = await LocalStateHandler.getUserInfo()
        var total = 0
        buddy.feedbacks.forEach(elem => total += elem.rating)
        buddy.rating = total / buddy.feedbacks.length
        buddy.numberOfFeedbacks = buddy.feedbacks.length

        var connectyCubeChatId
        try{
            connectyCubeChatId = await SingleChatHandler.getChatId(idBuddy)
        } catch {}

        this.props.navigation.setParams({nameBuddy: buddy.name + " " + buddy.surname})
        this.setState({
            user: buddy,
            loadingDone: true,
            chatId: connectyCubeChatId,
            citiesWhereIsBuddy: citiesWhereIsBuddy,
        })
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
        if (this.state.loadingDone){
            return(
                <View>
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.header}></View>
                        <PhotoProfile photoPath={this.state.user.urlPhoto} chatId={this.state.chatId} userId={this.state.user.id}/>

                        <View style={styles.bodyContent}>
                            <UserInfo
                                chatId={this.state.chatId}
                                nav={this.props.navigation}
                                userInfo={this.state.user}
                            />
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
                            <Biography bio={this.state.user.bio} nav={this.props.navigation}/>

                            {
                                this.state.citiesWhereIsBuddy != undefined && this.state.citiesWhereIsBuddy.length > 0 ?
                                    <View style={styles.feedbacksContainer}>
                                        <Text style={{fontWeight:"bold", fontSize:wp("6%"), marginLeft:wp("5%")}}>Cities</Text>
                                        <Surface style={styles.feedbacks}>
                                            <FlatList
                                                data={this.state.citiesWhereIsBuddy}
                                                renderItem={({item}) =>
                                                    <View style={{flexDirection: "row", alignItems:"center"}}>
                                                        <IconButton icon={"location-on"}/>
                                                        <Text style={{fontSize:wp("4%"), marginLeft:wp("2%")}}>{item.cityName}</Text>
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

                            <Feedbacks feedbacks={this.state.user.feedbacks}/>
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
    feedbacks:{
        margin: wp("1%"),
        borderRadius: 5,
        elevation:2
    },
    biographyText:{
        textAlign: "center",
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
    },
    fab: {
        position: 'absolute',
        right: wp("3%"),
        top: hp("70%"),
        backgroundColor: "#52c8ff"
    },
});
