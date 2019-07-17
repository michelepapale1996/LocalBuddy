import React, {Component} from "react";
import { StyleSheet, View, TextInput } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import LoadingComponent from '../components/LoadingComponent'
import StarRating from 'react-native-star-rating';
import UserHandler from "../handler/UserHandler";
import { Text, Button } from 'react-native-paper';

export default class Feedback extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Feedback",
            headerRight: (
                <Button
                    mode={"outlined"}
                    onPress={()=>navigation.getParam("saveFeedback", null)()}
                    color={"white"}
                    style={{
                        marginLeft:0,
                        marginRight:0,
                        borderRadius: 5,
                        borderColor: "white"
                    }}
                >Save</Button>
            ),
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#2fa1ff'
            },
            headerTitleStyle: {
                color: 'white'
            }
        }
    }

    saveFeedback = () => {
        UserHandler.addFeedback(this.state.idOpponent, this.state.starCount, this.state.text).then(()=>{
            this.props.navigation.getParam("feedbackGiven", null)(this.state.idOpponent)
            this.props.navigation.goBack()
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            loadingDone: false,
            starCount: 3,
            text: '',
            idOpponent: null
        }
        this.props.navigation.setParams({
            saveFeedback: this.saveFeedback
        })
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    componentDidMount() {
        loc(this)
        const idOpponent = this.props.navigation.getParam("feedbackedIdUser", null)
        UserHandler.getNameAndSurname(idOpponent).then(username => {
            this.setState({
                loadingDone: true,
                idOpponent: idOpponent,
                username: username
            })
        })
    }

    componentWillUnmount(){
        rol(this)
    }

    render() {
        const styles = StyleSheet.create({
            container:{
                backgroundColor: 'white',
                flex:1,
                justifyContent: 'center',
                margin:hp("2%")
            },
            singleOptionContainer:{
                flex:1,
                margin: wp("3%"),
                height: hp("5%")
            },
            text: {
                fontSize: 20,
                fontWeight: "bold",
                textAlign:"center"
            },
            header:{
                fontSize: 20,
                color: "green",
                fontWeight:"bold"
            },
            userPhoto: {
                width: wp("15%"),
                height: wp("15%"),
                borderRadius: wp("15%")
            },
            userContainer: {
                flex: 1,
                flexDirection: 'row',
                margin: wp("3%"),
                height: hp("10%")
            },
            userInfoContainer: {
                flex:1,
                margin: wp("1%"),
                height: hp("10%")
            },
            button:{
                marginLeft:0,
                marginRight:0,
                borderRadius: 20,
                borderColor: "white"
            }
        });

        if (this.state.loadingDone != false) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>Rating {this.state.username}</Text>
                    <View style={{width:wp("90%"), marginTop:hp("2%"), marginBottom: hp("2%"), alignItems:"center"}}>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.starCount}
                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                            emptyStarColor={'#f1c40f'}
                            fullStarColor={'#f1c40f'}
                        />
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.text}>Please, give a feedback</Text>
                        <TextInput
                            multiline={true}
                            placeholder={"Give a feedback to " + this.state.username}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            style={{
                                fontSize: hp("2%")
                            }}
                            underlineColorAndroid={"#2fa1ff"}
                        />
                    </View>
                </View>
            )
        } else {
            return (<LoadingComponent/>)
        }
    }
}