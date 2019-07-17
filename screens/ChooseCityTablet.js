import React, {Component} from 'react';
import {StyleSheet, View, FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from "react-native-responsive-screen"
import { Searchbar, Text, TouchableRipple, Card, Title, IconButton, FAB, Snackbar } from 'react-native-paper';
import Geocoder from "react-native-geocoding";
import LoadingComponent from "../components/LoadingComponent";
import OrientationHandler from "../handler/OrientationHandler";
import NetInfoHandler from "../handler/NetInfoHandler";

export default class ChooseCityTablet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingDone: true,
            noCitiesAvailable: false,
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

    componentDidMount(){
        loc(this)
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
                            cities: cities
                        })
                    })
                }).catch(err => console.log(err))
            }
        } else {
            alert("You are not connected to the network. Check your connection and retry.")
        }
    }

    render() {
        var styles;
        if(OrientationHandler.orientation == "portrait") {
            styles = StyleSheet.create({
                container: {
                    flex: 1,
                    backgroundColor: 'white',
                },
                text: {
                    fontSize: 20,
                    margin: 10,
                    fontWeight: "bold"
                },
                searchBar: {
                    backgroundColor: "#2fa1ff",
                    height: hp("5%")
                },
                fab: {
                    backgroundColor: "#52c8ff",
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                },
                card: {
                    marginTop: hp("0.5%"),
                    marginBottom: hp("0.5%"),
                    marginRight: wp("1%"),
                    marginLeft: wp("1%")
                }
            })
        } else {
            styles = StyleSheet.create({
                container: {
                    flex: 1,
                    backgroundColor: 'white',
                },
                text: {
                    fontSize: 20,
                    margin: 10,
                    fontWeight: "bold"
                },
                searchBar: {
                    backgroundColor: "#2fa1ff",
                    height: hp("8%")
                },
                fab: {
                    backgroundColor: "#52c8ff",
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                },
                card: {
                    marginTop: hp("1%"),
                    marginBottom: hp("1%"),
                    marginRight: wp("1%"),
                    marginLeft: wp("1%")
                }
            })
        }

        if(this.state.loadingDone != false) {
            return (
                <View style={styles.container}>
                    <Searchbar
                        placeholderTextColor={'white'}
                        inputStyle={{color: "white", fontSize: 18, fontWeight: "bold"}}
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
                                    <TouchableRipple onPress={() => this.props.navigation.navigate('CityChosen', {
                                        cityId: item.cityId,
                                        cityName: item.name
                                    })}>
                                        <View style={{flexDirection: "row"}}>
                                            <IconButton icon={"location-on"}/><Text
                                            style={{flex: 1, flexWrap: 'wrap', ...styles.text}}>{item.name}</Text>
                                        </View>
                                    </TouchableRipple>
                                }
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                            />
                            :
                            <View style={{flex: 1}}>
                                <FlatList
                                    data={this.state.initialCities}
                                    renderItem={({item}) =>
                                        <Card onPress={() => this.props.navigation.navigate('CityChosen', {
                                            cityId: item.id,
                                            cityName: item.name
                                        })}
                                              elevation={10} style={styles.card}>
                                            <Card.Cover source={{uri: item.url}} style={{height: hp("25%")}}/>
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
                        onPress={() => {
                            if(NetInfoHandler.isConnected){
                                this.setState({loadingDone: false})
                                navigator.geolocation.getCurrentPosition(position => {
                                        Geocoder.init("AIzaSyBRfBut3xLOq-gimCV4mT2zalmchEppB6U");
                                        Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
                                            const city = json.results.filter(elem => elem.address_components[0].types.includes("locality"))

                                            if(city.length > 0){
                                                this.setState({loadingDone: true})
                                                this.props.navigation.navigate('CityChosen', {
                                                    cityId: city[0].place_id,
                                                    cityName: city[0].formatted_address
                                                })
                                            } else {
                                                this.setState({noCitiesAvailable: true, loadingDone: true})
                                            }

                                        }).catch(error => {
                                            this.setState({noCitiesAvailable: true, loadingDone: true})
                                            console.log("Error: ", error)
                                        });
                                    },
                                    error =>{
                                        console.log(error.message)
                                        this.setState({loadingDone: true})
                                    },
                                    {enableHighAccuracy: true, timeout: 20000}
                                )
                            } else {
                                alert("You are not connected to the network. Check your connection and retry.")
                            }
                        }}
                    />
                    <Snackbar
                        visible={this.state.noCitiesAvailable}
                        onDismiss={() => this.setState({ noCitiesAvailable: false })}
                        duration={4000}
                        action={{
                            label: 'Ok',
                            onPress: () => {
                                this.setState({ noCitiesAvailable: false })
                            },
                        }}
                    >
                        There aren't available buddies near to you
                    </Snackbar>
                </View>
            );
        } else {
            return(
                <View style={styles.container}>
                    <Searchbar
                        placeholderTextColor={'white'}
                        inputStyle={{color: "white", fontSize: 18, fontWeight: "bold"}}
                        placeholder="Search a city..."
                        onChangeText={query => {
                            this.getCities(query)
                            this.setState({query: query})
                        }}
                        iconColor={"white"}
                        style={styles.searchBar}
                        value={this.state.query}
                    />
                    <LoadingComponent/>
                </View>
            )
        }
    }
}