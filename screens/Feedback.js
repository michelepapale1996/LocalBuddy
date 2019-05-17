import React, {Component} from "react";
import { StyleSheet, View } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import LoadingComponent from '../components/LoadingComponent'
import StarRating from 'react-native-star-rating';
import UserHandler from "../handler/UserHandler";
import { Text, TextInput, Button } from 'react-native-paper';

export default class Feedback extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Feedback",
            headerRight: (
                <Button
                    mode={"outlined"}
                    onPress={()=>navigation.getParam("saveFeedback", null)()}
                    color={"white"}
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
        const idOpponent = this.props.navigation.getParam("feedbackedIdUser", null)
        UserHandler.getNameAndSurname(idOpponent).then(username => {
            this.setState({
                loadingDone: true,
                idOpponent: idOpponent,
                username: username
            })
        })
    }

    render() {
        if (this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        <Text style={styles.text}>Please, rate {this.state.username}</Text>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.starCount}
                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                            fullStarColor={'red'}
                        />
                        <Text>Your rating is {this.state.starCount}</Text>
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.text}>Please, give a feedback(optional)</Text>
                        <TextInput
                            mode={"outlined"}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                        />
                    </View>
                </View>
            )
        } else {
            return (<LoadingComponent/>)
        }
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        margin: hp("0%"),
        flex: 1,
        backgroundColor: 'white',
    },
    container:{
        justifyContent: 'center',
        margin:hp("2%"),
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
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