import {StyleSheet, Text, View, TextInput, FlatList, ScrollView} from "react-native"
import React, {Component} from "react";
import LoadingComponent from "./../components/LoadingComponent"
import UserHandler from "../res/UserHandler";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from "react-native-firebase";
import RangeSlider from 'react-native-range-slider'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import MultiSlider from "@ptomasroos/react-native-multi-slider/MultiSlider";

var radio_props = [
    {label: 'onlySameSex', value: 1 },
    {label: 'all', value: 0 }
];

export default class Settings extends Component {
    static navigationOptions = () => {
        return {
            title: "Who can find me"
        };
    };

    constructor(props){
        super(props)
        this.state = {
            loadingDone: false,
            lowerRangeTouristAge: 0,
            upperRangeTouristAge: 100,
            onlySameSex: 0
        }
    }

    componentDidMount(){
        const idUser = firebase.auth().currentUser.uid
        UserHandler.getPreferences(idUser).then(preferences => {
            console.log(preferences)
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
                    <Text style={styles.text}>Do you want to be found by your same-sex people only?</Text>
                    <RadioForm
                        radio_props={radio_props}
                        initial={this.state.onlySameSex}
                        onPress={(value) => {this.setState({onlySameSex:value})}}
                        formHorizontal={true}
                    />

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
        alignItems: 'center'
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
    }
})