import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, FlatList} from 'react-native';
import {Icon} from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default class ChooseCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: []
        };

        this.props.navigation.setParams({
            getCities: this.getCities
        })
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TextInput
                            placeholder="Type the name of the city"
                            placeholderTextColor= 'gray'
                            onChangeText={(input) => navigation.getParam("getCities", null)(input)}
                            style={{
                                borderBottomWidth: 1,
                                fontSize:20,
                                borderBottomColor: 'grey',
                                borderColor: 'white',
                                marginLeft: 20,
                                flex: 1
                            }}
                        />
                        <Icon name="search" size={40}/>
                    </View>
        }
    };

    getCities = (input) => {
        ApiKey = "AIzaSyBRfBut3xLOq-gimCV4mT2zalmchEppB6U"
        sessionToken = "1234567890"

        AppId = "nIjKA6dhmhmoMEAGvlaA"
        AppCode = "Ii8RBuVJB1l_RiJbtZcp-Q"

        if(input != null && input.length > 3){
            const queryGoogle = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="
                +input+"&key="+ApiKey+"&sessiontoken="+sessionToken+"&types=(cities)"
                +"&language=it"

            fetch(queryGoogle)
                .then(response => {
                    response.json().then(json => {
                        let cities = json.predictions.map(
                            prediction => {
                                console.log(prediction.description, prediction.place_id)
                                return {name : prediction.description, cityId: prediction.place_id}
                            }
                        )
                        this.setState({
                            cities: cities
                        })
                    })
                })
                .catch(
                    err => console.log(err)
                )

            /*const query = "http://autocomplete.geocoder.api.here.com/6.2/suggest.json?" +
                "query=" + input +
                "&app_id=" + AppId +
                "&app_code=" + AppCode +
                "&language=IT" +
                "&maxresults=10" +
                "&resultType=areas"

            fetch(query)
                .then(response => {
                    response.json().then(json => {
                        let cities = json.suggestions.filter(city => city.matchLevel == "city").map(
                            prediction => {
                                console.log(prediction)
                                return {name : prediction.label, cityId :  prediction.locationId}
                            }
                        )
                        this.setState({
                            cities: cities
                        })
                    })
                })
                .catch(
                    err => console.log(err)
                )*/
        }
    }

    render() {
        return (
            <FlatList
                data={this.state.cities}
                renderItem={({item}) =>
                    <Text
                        style={styles.text}
                        onPress={() => this.props.navigation.navigate('CityChosen', {cityId: item.cityId})}
                    >
                        {item.name}
                    </Text>}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
            />
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
