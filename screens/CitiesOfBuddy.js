import {StyleSheet, View, FlatList, ScrollView} from "react-native"
import React, {Component} from "react";
import LoadingComponent from "./../components/LoadingComponent"
import UserHandler from "../handler/UserHandler";
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import { Text, TextInput, IconButton, Searchbar, Snackbar } from 'react-native-paper';
import LocalUserHandler from "../LocalHandler/LocalUserHandler";
import NetInfoHandler from "../handler/NetInfoHandler";

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
            cities: [],
            newCityDialogVisible: false,
            removeCityDialogVisible: false,
            removedCityName: null,
            addedCityName: null,
            cityToSearch: null
        }
    }

    async componentDidMount(){
        loc(this)
        //const idUser = firebase.auth().currentUser.uid
        //const cities = await UserHandler.getCitiesOfTheBuddy(idUser)
        const cities = await LocalUserHandler.getCitiesOfTheBuddy()
        if(cities != null){
            this.setState({
                cities: cities,
                loadingDone: true
            })
        }else this.setState({loadingDone: true})
    }

    componentWillUnmount(){
        rol(this)
    }

    getCities = (input) => {
        if(NetInfoHandler.isConnected){
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
            }
            if(input.length <= 3){
                this.setState({
                    foundCities: []
                })
            }
        } else {
            alert("You are not connected to the network. Check your connection and retry.")
        }
    }

    addCity = (cityId, cityName) => {
        if(NetInfoHandler.isConnected){
            this.setState((prevState) => {
                //city is the first one -> initialize the array
                if (prevState.cities == undefined) {
                    return {cities: [{cityName: cityName, cityId: cityId}], newCityDialogVisible: true, foundCities: [], addedCityName: cityName}
                } else {
                    //check if the user is already a buddy in that city
                    const toCheck = prevState.cities.filter(elem => elem.cityId == cityId)
                    if(toCheck.length == 0){
                        const cities = [...prevState.cities, {cityName: cityName, cityId: cityId}]
                        return {cities: cities, newCityDialogVisible: true, foundCities: [], addedCityName: cityName}
                    }else{
                        return {clickedOnCityWhereIsAlreadyBuddy: true, addedCityName: cityName}
                    }
                }
            })
            LocalUserHandler.addCityWhereIsBuddy(cityId, cityName)
            UserHandler.addCity(cityId, cityName)
        } else {
            alert("You are not connected to the network. Check your connection and retry.")
        }
    }

    deleteCity = (cityId, cityName) => {
        if(NetInfoHandler.isConnected){
            UserHandler.deleteCity(cityId)
            LocalUserHandler.deleteCity(cityId)
            this.setState((prevState) => {
                if(prevState.cities.length == 1){
                    return {cities: undefined, removeCityDialogVisible: true, removedCityName: cityName}
                }else{
                    let cities = prevState.cities.filter(val => val.cityName !== cityName)
                    return {cities: cities, removeCityDialogVisible: true, removedCityName: cityName}
                }
            })
        } else {
            alert("You are not connected to the network. Check your connection and retry.")
        }
    }

    render() {
        const styles = StyleSheet.create({
            container: {
                alignItems: 'center',
                flex:1,
                backgroundColor: 'white',
            },
            text: {
                fontSize: 20,
                flexWrap: "wrap",
            },
            textInput: {
                height: 40,
                width: wp('90%'),
                borderColor: 'gray',
                borderWidth: 1,
                marginTop: 8
            },
            alreadyBuddyContainer: {
                flex:1,
                width: wp("95%"),
                marginLeft:wp("1%"),
                marginRight:wp("1%"),
                marginBottom:hp("1%"),
                marginTop:hp("1%")
            },
            newCitiesContainer:{
                borderColor: 'black',
                borderRadius: 7,
                borderWidth: 0.5,
                width: wp("95%"),
                margin: hp("1%")
            },
            citiesContainer:{
                alignItems: 'center',
                justifyContent:"center",
                flex:1,
            }
        })


        if(this.state.loadingDone != false) {
            //show the cities in which the user is already a buddy
            let citiesWhereIsAlreadyBuddy = <View style={styles.citiesContainer}>
                <Text style={styles.text}>You do not have any city yet</Text>
            </View>

            if(this.state.cities != undefined && this.state.cities.length > 0){
                citiesWhereIsAlreadyBuddy =
                    <View>
                        <FlatList
                            data={this.state.cities}
                            renderItem={({item}) =>
                                <View  style={{flexDirection: 'row', alignItems:"center", marginLeft:wp("1%"), marginRight:wp("2%"), marginBottom:hp("1%"), marginTop:hp("1%")}}>
                                    <IconButton icon={"location-on"}/>
                                    <View style={{flex:1}}>
                                        <Text style={{width: wp("70%"), ...styles.text}}>{item.cityName}</Text>
                                    </View>
                                    <IconButton icon="delete" onPress={() => this.deleteCity(item.cityId, item.cityName)}/>
                                </View>
                            }
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state.cities}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
            }

            var foundCities = <FlatList
                data={this.state.foundCities}
                renderItem={({item}) =>
                    <View  style={{flexDirection: 'row', alignItems:"center", marginLeft:wp("1%"), marginRight:wp("2%"), marginBottom:hp("1%"), marginTop:hp("1%")}}>
                        <IconButton icon={"location-on"}/>
                        <View style={{flex:1}}>
                            <Text style={{width: wp("70%"), ...styles.text}}>{item.name}</Text>
                        </View>
                        <IconButton icon="add" onPress={() => {this.addCity(item.cityId, item.name)}}/>
                    </View>}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state.foundCities}
                showsVerticalScrollIndicator={false}
            />
            return(
                <View style={{flex: 1, flexDirection: "column", justifyContent:"space-between", ...styles.viewContainer}}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.alreadyBuddyContainer}>
                            <Searchbar
                                placeholder="Search a city to start being buddy"
                                onChangeText={(input) =>{
                                    this.setState({cityToSearch: input})
                                    this.getCities(input)}
                                }
                                value={this.state.cityToSearch}
                            />
                            {this.state.foundCities.length > 0 ? foundCities : citiesWhereIsAlreadyBuddy}

                        </View>
                    </ScrollView>

                    <Snackbar
                        visible={this.state.newCityDialogVisible}
                        onDismiss={() => this.setState({ newCityDialogVisible: false })}
                        duration={4000}
                        action={{
                            label: 'Ok',
                            onPress: () => {
                                this.setState({ newCityDialogVisible: false })
                            },
                        }}
                    >
                        Now you are buddy in {this.state.addedCityName}
                    </Snackbar>

                    <Snackbar
                        visible={this.state.removeCityDialogVisible}
                        onDismiss={() => this.setState({ removeCityDialogVisible: false })}
                        duration={4000}
                        action={{
                            label: 'Ok',
                            onPress: () => {
                                this.setState({ removeCityDialogVisible: false })
                            },
                        }}
                    >
                        From now on you are not a buddy in {this.state.removedCityName}
                    </Snackbar>

                    <Snackbar
                        visible={this.state.clickedOnCityWhereIsAlreadyBuddy}
                        onDismiss={() => this.setState({ clickedOnCityWhereIsAlreadyBuddy: false })}
                        duration={4000}
                        action={{
                            label: 'Ok',
                            onPress: () => {
                                this.setState({ clickedOnCityWhereIsAlreadyBuddy: false })
                            },
                        }}
                    >
                        You are already a buddy in {this.state.addedCityName}
                    </Snackbar>
                </View>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}