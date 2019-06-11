import React, {Component} from 'react';
import {StyleSheet, View, FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { Searchbar, Text, TouchableRipple, Card, Title, IconButton, FAB } from 'react-native-paper';
import Geocoder from "react-native-geocoding";

export default class ChooseCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialCities:[
                {
                    name: "London",
                    url: "https://d13k13wj6adfdf.cloudfront.net/urban_areas/london_web-e8502ca139.jpg",
                    id: "ChIJdd4hrwug2EcRmSrV3Vo6llI"
                },
                {
                    name: "New York",
                    url: "https://d13k13wj6adfdf.cloudfront.net/urban_areas/new-york_web-99d9bb0809.jpg",
                    id: "ChIJOwg_06VPwokRYv534QaPC8g"
                },
                {
                    name: "Tokyo",
                    url: "https://d13k13wj6adfdf.cloudfront.net/urban_areas/tokyo_web-7a20b5733f.jpg",
                    id: "ChIJXSModoWLGGARILWiCfeu2M0"
                },
                {
                    name: "Dubai",
                    url: "https://d13k13wj6adfdf.cloudfront.net/urban_areas/dubai_web-e211678fd9.jpg",
                    id: "ChIJRcbZaklDXz4RYlEphFBu5r0"
                },
                {
                    name: "San Francisco",
                    url: "https://d13k13wj6adfdf.cloudfront.net/urban_areas/san-francisco-bay-area_web-f17b1f60e6.jpg",
                    id: "ChIJIQBpAG2ahYAR_6128GcTUEo"
                },
                {
                    name: "Los Angeles",
                    url: "https://d13k13wj6adfdf.cloudfront.net/urban_areas/los-angeles-f5b60deb04.jpg",
                    id: "ChIJE9on3F3HwoAR9AhGJW_fL-I"
                }
            ],
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
                    this.state.query.length > 3 ?
                        <FlatList
                            data={this.state.cities}
                            renderItem={({item}) =>
                                <TouchableRipple onPress={() => this.props.navigation.navigate('CityChosen', {cityId: item.cityId, cityName: item.name})}>
                                    <View style={{flexDirection:"row"}}>
                                        <IconButton icon={"location-on"}/><Text style={styles.text}>{item.name}</Text>
                                    </View>
                                </TouchableRipple>
                            }
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                        />
                        :
                        <View style={{flex:1}}>
                            <FlatList
                                data={this.state.initialCities}
                                renderItem={({item}) =>
                                    <Card onPress={()=> this.props.navigation.navigate('CityChosen', {cityId: item.id, cityName: item.name})}
                                          elevation={10} style={{marginTop:hp("0.5%"), marginBottom: hp("0.5%"), marginRight:wp("1%"), marginLeft:wp("1%")}}>
                                        <Card.Cover source={{ uri: item.url }} style={{height:hp("20%")}} />
                                        <Card.Content>
                                            <Title>{item.name}</Title>
                                        </Card.Content>
                                    </Card>
                                }
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                }
                <FAB
                    color={"white"}
                    icon={"gps-fixed"}
                    style={styles.fab}
                    onPress={()=>{
                        navigator.geolocation.getCurrentPosition(position => {
                                Geocoder.init("AIzaSyBRfBut3xLOq-gimCV4mT2zalmchEppB6U");
                                Geocoder.from(position.coords.longitude, position.coords.latitude).then(json => {
                                    const city = json.results.filter(elem => elem.address_components[0].types.includes("locality"))
                                    console.log(city)
                                    this.props.navigation.navigate('CityChosen', {cityId: city[0].place_id, cityName: city[0].formatted_address})
                                }).catch(error => console.warn(error));
                            },
                            error => console.log(error.message),
                            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                        );
                    }}
                />
            </View>
        );
    }
}

/*
<View style={styles.container}>
                            <Text style={styles.text}>To start, search a city where you want to find a buddy!</Text>
                        </View>
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    text: {
        fontSize: 20,
        margin: 10,
        fontWeight: "bold"
    },
    searchBar:{
        backgroundColor:"#2fa1ff",
        height:hp("8%")
    },
    fab: {
        backgroundColor: "#52c8ff",
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
})
