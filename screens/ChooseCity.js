import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, FlatList} from 'react-native';
import {Icon} from 'react-native-elements';
import firebase from 'react-native-firebase'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

//array of cities
const cities = [
        {"city": "Milano",
            "numberOfBuddies": 40},
        {"city": "Padova",
            "numberOfBuddies": 2},
        {"city": "Genova",
            "numberOfBuddies": 10},
        {"city": "Roma",
            "numberOfBuddies": 50},
        {"city": "Napoli",
            "numberOfBuddies": 20},
        {"city": "Verona",
            "numberOfBuddies": 40},
        {"city": "Bari",
            "numberOfBuddies": 2},
        {"city": "Tricase",
            "numberOfBuddies": 10},
        {"city": "Bergamo",
            "numberOfBuddies": 50},
        {"city": "Fondi",
            "numberOfBuddies": 20},
        {"city": "Milano",
            "numberOfBuddies": 40},
        {"city": "Padova",
            "numberOfBuddies": 2},
        {"city": "Genova",
            "numberOfBuddies": 10},
        {"city": "Roma",
            "numberOfBuddies": 50},
        {"city": "NapoliCentro",
            "numberOfBuddies": 20},
        {"city": "Verona",
            "numberOfBuddies": 40},
        {"city": "Bari",
            "numberOfBuddies": 2},
        {"city": "Tricase",
            "numberOfBuddies": 10},
        {"city": "Bergamo",
            "numberOfBuddies": 50},
        {"city": "Fondi",
            "numberOfBuddies": 20}
    ];

const GooglePlacesInput = (props) => {
    return (
        <GooglePlacesAutocomplete
            placeholder='Enter Location'
            minLength={2}
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            enablePoweredByContainer={false}
            query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyBRfBut3xLOq-gimCV4mT2zalmchEppB6U',
                language: 'it', // language of the results
                types: '(cities)' // default: 'geocode'
            }}
            onPress={(input) => props.nav.setParams({input: input})}
            styles={{
                textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth:0
                },
                textInput: {
                    marginLeft: 10,
                    marginRight: 0,
                    height: 38,
                    color: '#5d5d5d',
                    fontSize: 16,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth:1,
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                },
            }}
            currentLocation={false}
        />
    );
}

export default class ChooseCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: cities
        };
    }

    retrieveCities = (name)=>{
        let cities = [];
        let prova = "";
        firebase.database().ref('Citta').once("value", function(snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                console.log(childData.city);
                cities.push(childData.city);
                prova = childData.city;
            })}
        );
        console.log(prova);
        return cities;
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <GooglePlacesInput nav={navigation}/>
                        <Icon name="search" size={40}/>
                    </View>
        }
    };

    render() {
        let input = this.props.navigation.getParam('input', 'undefined');
        if(input != 'undefined'){
            //update cities to show
            const place_id = input.place_id;
            firebase.database().ref("/Citta/" + place_id).once("value").then(
                (snap) =>{
                    this.props.navigation.navigate('CityChosen', {cityName: snap.val().name})
                }
            ).catch(
                //there no exists that city
                (error)=> console.log(error)
            )
        }

        return (
            <View style={styles.container}>
                <Text>Scegli una città</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});
