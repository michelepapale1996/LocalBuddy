import { StyleSheet, View } from "react-native"
import React, {Component} from "react";
import LoadingComponent from "./../components/LoadingComponent"
import UserHandler from "../handler/UserHandler";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from "react-native-firebase";
import MultiSlider from "@ptomasroos/react-native-multi-slider/MultiSlider";
import { Text, Switch, Button } from 'react-native-paper';

export default class Settings extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "Who can find me",
            headerRight: (
                <Button
                    mode={"outlined"}
                    onPress={()=>navigation.getParam("saveSettings", null)()}
                    style={styles.button}
                    color={"white"}
                >
                    Save
                </Button>
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

    constructor(props){
        super(props)
        this.state = {
            loadingDone: false,
            lowerRangeTouristAge: 0,
            upperRangeTouristAge: 100,
            onlySameSex: 0
        }

        this.props.navigation.setParams({
            saveSettings: this.saveSettings
        })
    }

    saveSettings = () => {
        UserHandler.savePreferences(this.state.lowerRangeTouristAge, this.state.upperRangeTouristAge, this.state.onlySameSex).then(()=>{
            this.props.navigation.goBack()
        })
    }

    componentDidMount(){
        const idUser = firebase.auth().currentUser.uid
        UserHandler.getPreferences(idUser).then(preferences => {
            this.setState({
                lowerRangeTouristAge: preferences.lowerRangeTouristAge,
                upperRangeTouristAge: preferences.upperRangeTouristAge,
                onlySameSex: preferences.onlySameSex,
                loadingDone: true
            })
        })
    }

    multiSliderValuesChange = values => {
        this.setState({
            lowerRangeTouristAge: values[0],
            upperRangeTouristAge: values[1]
        });
    };

    render() {
        if(this.state.loadingDone != false) {
            return(
                <View style={styles.viewContainer}>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={styles.text}>Only from same-sex people</Text>
                    <Switch
                        value={this.state.onlySameSex}
                        onValueChange={() => {
                            this.setState({ onlySameSex: !this.state.onlySameSex });
                        }}
                    />
                    </View>

                    <Text style={styles.text}>Range of age</Text>
                    <MultiSlider
                        values={[
                            this.state.lowerRangeTouristAge,
                            this.state.upperRangeTouristAge,
                        ]}
                        sliderLength={280}
                        onValuesChange={this.multiSliderValuesChange}
                        min={0}
                        max={100}
                        step={1}
                        allowOverlap
                        snapped
                    />
                    <Text>Age between {this.state.lowerRangeTouristAge} and {this.state.upperRangeTouristAge}</Text>
                </View>)
        }else{
            return(<LoadingComponent/>)
        }
    }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
    },
    viewContainer:{
        flex:1,
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    },
    alreadyBuddyContainer: {
        borderColor: 'black',
        borderRadius: 7,
        borderWidth: 0.5,
        width: wp("95%"),
        margin: hp("1%")
    },
    newCitiesContainer:{
        borderColor: 'black',
        borderRadius: 7,
        borderWidth: 0.5,
        width: wp("95%"),
        margin: hp("1%")
    },
    button:{
        marginLeft:0,
        marginRight:0,
        borderRadius: 20,
        borderColor: "white"
    }
})