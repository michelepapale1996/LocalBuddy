import {StyleSheet, View, FlatList, ScrollView} from "react-native"
import React, {Component} from "react";
import LoadingComponent from "./../components/LoadingComponent"
import UserHandler from "../handler/UserHandler";
import {Icon} from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from "react-native-firebase";
import { Text, TextInput } from 'react-native-paper';

export default class CitiesOfBuddy extends Component {
    static navigationOptions = () => {
        return {
            title: "Your cities",
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#2fa1ff'
            },
            headerTitleStyle: {
                color: 'white'
            }
        };
    };

    constructor(props){
        super(props)
        //foundCities are the cities found by google on user input
        this.state = {
            loadingDone: false,
            foundCities: [],
            cities: []
        }
    }

    componentDidMount(){
        const idUser = firebase.auth().currentUser.uid
        UserHandler.getCitiesOfTheBuddy(idUser).then(cities => {
            if(cities != null){
                this.setState({
                    cities: cities,
                    loadingDone: true
                })
            }else{
                this.setState({loadingDone: true})
            }
        })
    }

    getCities = (input) => {
        const ApiKey = "AIzaSyBRfBut3xLOq-gimCV4mT2zalmchEppB6U"
        const sessionToken = "1234567890"

        const AppId = "nIjKA6dhmhmoMEAGvlaA"
        const AppCode = "Ii8RBuVJB1l_RiJbtZcp-Q"

        if(input != null && input.length > 3){
            const queryGoogle = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="
                +input+"&key="+ApiKey+"&sessiontoken="+sessionToken+"&types=(cities)"
                +"&language=it"

            fetch(queryGoogle).then(response => {
                response.json().then(json => {
                    let cities = json.predictions.map(
                        prediction => {
                            return {name : prediction.description, cityId: prediction.place_id}
                        }
                    )
                    this.setState({
                        foundCities: cities
                    })
                })
            }).catch(
                err => console.log(err)
            )
        }else{
            this.setState({
                foundCities: undefined
            })
        }
    }

    addCity = (cityId, cityName) => {
        this.setState((prevState) => {
            //city is the first one -> initialize the array
            if (prevState.cities == undefined) {
                UserHandler.addCity(cityId, cityName)
                return {cities: [{cityName: cityName, cityId: cityId}]}
            } else {
                const toCheck = prevState.cities.filter(elem=>elem.cityName == cityName)
                if(toCheck.length == 0){
                    UserHandler.addCity(cityId, cityName)
                    const cities = [...prevState.cities, {cityName: cityName, cityId: cityId}]
                    return {cities: cities}
                }
            }
        })
    }

    deleteCity = (cityId, cityName) => {
        UserHandler.deleteCity(cityId)
        this.setState((prevState) => {
            if(prevState.cities.length == 1){
                return {cities: undefined}
            }else{
                let cities = prevState.cities.filter(val => val.cityName !== cityName)
                console.log(cities)
                return {cities: cities}
            }
        })
    }

    render() {
        if(this.state.loadingDone != false) {
            //show the cities in which the user is already a buddy
            let citiesWhereIsAlreadyBuddy
            if(this.state.cities != undefined && this.state.cities.length > 0){
                citiesWhereIsAlreadyBuddy =
                    <View style={styles.viewContainer}>
                        <Text style={styles.text}>Your current cities:</Text>
                        <FlatList
                            data={this.state.cities}
                            renderItem={({item}) =>
                                <View  style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={styles.text}>
                                        {item.cityName}
                                    </Text>
                                    <Icon name="close"
                                          onPress={() => this.deleteCity(item.cityId, item.cityName)}/>
                                </View>}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state.cities}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
            }else{
                citiesWhereIsAlreadyBuddy = <View style={styles.text}>
                    <Text style={styles.text}>You do not have any city yet.</Text>
                </View>
            }
            return(
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.viewContainer}>
                        <View style={styles.alreadyBuddyContainer}>
                            {citiesWhereIsAlreadyBuddy}
                        </View>

                        <View style={styles.newCitiesContainer}>
                            <Text style={styles.text}>Search a city to start being buddy there!</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <TextInput
                                    label="Insert the city name"
                                    onChangeText={(input) => this.getCities(input)}
                                    style={{
                                        borderBottomWidth: 1,
                                        fontSize:20,
                                        borderColor: 'white',
                                        marginLeft: 20,
                                        marginRight:20,
                                        flex: 1
                                    }}
                                />
                            </View>
                            <FlatList
                                data={this.state.foundCities}
                                renderItem={({item}) =>
                                    <Text style={styles.text} onPress={() => this.addCity(item.cityId, item.name)}>
                                        {item.name}
                                    </Text>}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state.foundCities}
                                showsVerticalScrollIndicator={false}
                            />
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
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
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