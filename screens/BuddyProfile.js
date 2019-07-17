import React, {Component} from 'react';
import { StyleSheet, View, Image, ScrollView, FlatList } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import UserHandler from "../handler/UserHandler";
import SingleChatHandler from "../handler/SingleChatHandler";
import LoadingComponent from "../components/LoadingComponent";
import { FAB, Text, Surface, Button, IconButton } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import MeetingsHandler from "../handler/MeetingsHandler";
import NavigationService from "../handler/NavigationService";
import OrientationHandler from "../handler/OrientationHandler";

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
        <View style={props.styles.infoUser}>
            <Text style={props.styles.nameAndSurnameText}>
                {props.userInfo.name} {props.userInfo.surname}
            </Text>
            <Text style={props.styles.infoUserText}>{years} years old</Text>
            {props.userInfo.numberOfFeedbacks > 0 && <View style={{flexDirection:"row", flex:1, marginTop:hp("1%"), justifyContent:"center", alignItems:"center"}}>
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

function Feedback(props){
    return(
        <View style={{flexDirection:"row", margin:10}}>
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

                <Text style={props.styles.feedbackText}>{props.feedback.text.length > 0 ? props.feedback.text : "This user has not provided a textual feedback"}</Text>
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
                        ? <FlatList
                            data={props.feedbacks}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => <Surface style={props.styles.feedbacks}>
                                    <Feedback key={item.opponentId} feedback={item} styles={props.styles}/>
                                </Surface>
                            }/>
                        : <Text style={props.styles.biographyText}>
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
        loc(this)
        const idBuddy = this.props.navigation.getParam('idUser', 'Error')
        var buddy = await UserHandler.getUserInfo(idBuddy)

        const citiesWhereIsBuddy = await UserHandler.getCitiesOfTheBuddy(idBuddy)
        //var user = await LocalUserHandler.getUserInfo()
        if(buddy.feedbacks != null) {
            var total = 0
            buddy.feedbacks.forEach(elem => total += elem.rating)
            buddy.rating = total / buddy.feedbacks.length
            buddy.numberOfFeedbacks = buddy.feedbacks.length
        }

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
        var styles;
        if(OrientationHandler.orientation == "portrait") {
            styles = StyleSheet.create({
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
                biography: {
                    margin: wp("4%"),
                },
                feedbacks: {
                    margin: wp("1%"),
                    borderRadius: 5,
                    elevation: 2
                },
                biographyText: {
                    textAlign: "center",
                    fontSize: wp("4%"),
                    flex: 1,
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
                    backgroundColor: "#52c8ff",
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
                photoButton: {
                    width: wp("10%"),
                    height: wp("10%"),
                    borderRadius: wp("10%"),
                    position: 'absolute',
                    marginTop: hp("20%"),
                    marginLeft: wp("65%"),
                    zIndex: 10,
                    backgroundColor: "dodgerblue"
                },
                fab: {
                    position: 'absolute',
                    right: wp("3%"),
                    top: hp("70%"),
                    backgroundColor: "#52c8ff"
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
            });
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
                    backgroundColor: "#52c8ff",
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
                <View>
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.header}></View>
                        <Image style={styles.avatar} source={{uri: this.state.user.urlPhoto}}/>

                        <View style={styles.bodyContent}>
                            <UserInfo
                                chatId={this.state.chatId}
                                nav={this.props.navigation}
                                userInfo={this.state.user}
                                styles={styles}
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
                            <Biography styles={styles} bio={this.state.user.bio} nav={this.props.navigation}/>

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
