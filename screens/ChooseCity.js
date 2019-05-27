import React, {Component} from 'react';
import {StyleSheet, View, FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { Searchbar, Text, TouchableRipple } from 'react-native-paper';

export default class ChooseCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            query: ""
        };
    }

    static navigationOptions = () => {
        return {
            header: null
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

            fetch(queryGoogle).then(response => {
                response.json().then(json => {
                    let cities = json.predictions.map(
                        prediction => {
                            return {name : prediction.description, cityId: prediction.place_id}
                        }
                    )
                    this.setState({
                        cities: cities
                    })
                })
            }).catch(err => console.log(err))
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Searchbar
                    placeholderTextColor={'white'}
                    inputStyle={{color:"white", fontSize:18, fontWeight: "bold"}}
                    placeholder="Search a city..."
                    onChangeText={query => {
                        this.getCities(query)
                        this.setState({query: query})
                    }}
                    iconColor={"white"}
                    style={styles.searchBar}
                    value={this.state.query}
                />
                {
                    this.state.cities.length != 0 ?
                        <FlatList
                            data={this.state.cities}
                            renderItem={({item}) =>
                                <TouchableRipple onPress={() => this.props.navigation.navigate('CityChosen', {cityId: item.cityId})}>
                                    <Text style={styles.text}>
                                        {item.name}
                                    </Text>
                                </TouchableRipple>
                            }
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                        /> :
                        <View style={styles.container}>
                            <Text style={styles.text}>To start, search a city where you want to find a buddy!</Text>
                        </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        fontWeight: "bold"
    },
    searchBar:{
        backgroundColor:"#2fa1ff",
        height:hp("8%")
    }
})
