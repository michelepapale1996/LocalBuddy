import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, FlatList} from 'react-native';
import {Icon} from 'react-native-elements';
import firebase from 'react-native-firebase'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default class ChooseCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: []
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TextInput
                            placeholder="Inserisci il nome della città"
                            placeholderTextColor= 'gray'
                            onChangeText={(input) => navigation.setParams({input: input})}
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
        if(input != null && input.length > 3){
            const query = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="
                +input+"&key="+ApiKey+"&sessiontoken="+sessionToken+"&types=(cities)"
                +"&language=it"
            fetch(query)
                .then(response => {
                    response.json().then(json => {
                        let cities = json.predictions.map(
                            prediction => {
                                return {name : prediction.description, cityId :  prediction.place_id}
                            }
                        )
                        this.setState({
                            cities: cities
                        })
                    })
                })
                .catch(err => console.log(err))
        }
    }

    render() {
        this.getCities(this.props.navigation.getParam("input", null))

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
