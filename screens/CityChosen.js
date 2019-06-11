import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Image} from 'react-native';
import CityHandler from "../handler/CityHandler";
import LoadingComponent from "../components/LoadingComponent";
import { Text, TouchableRipple, Surface } from 'react-native-paper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen"
import StarRating from 'react-native-star-rating';

function Buddy(props){
    return(
        <TouchableRipple onPress={() => props.nav.navigate('BuddyProfile', {idUser: props.item.id})}>
            <View style={styles.singleBuddyContainer}>
                <Image
                    style={styles.userPhoto}
                    source={{uri: props.item.urlPhoto}}/>
                <View style={styles.singleBuddy}>
                    <Text style={styles.text}>
                        {props.item.name} {props.item.surname}
                    </Text>

                    <View style={{width:wp("10%"), alignItems:"center"}}>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            starSize={20}
                            rating={props.item.rating}
                            emptyStarColor={'#f1c40f'}
                            fullStarColor={'#f1c40f'}
                        />
                    </View>
                </View>
            </View>
        </TouchableRipple>
    )
}

export default class CityChosen extends Component {
    cityId = this.props.navigation.getParam('cityId', 'Error');
    cityName = this.props.navigation.getParam('cityName', 'Error');
    constructor(props){
        super(props)

        this.state = {
            cityName: this.cityName,
            buddies: null,
            loadingDone: false
        }
        this.props.navigation.setParams({title: "Buddies in " + this.cityName})
    }

    componentDidMount(){
        CityHandler.getFilteredCity(this.cityId).then(response => {
            //response status is 200
            if(response != null){
                this.setState({
                    buddies: response.buddies,
                    loadingDone: true
                })
            }else{
                this.setState({loadingDone: true})
            }
        })

    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.title,
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#2fa1ff'
            },
            headerTitleStyle: {
                color: 'white'
            }
        };
    };

    render(){
        if(this.state.loadingDone != false) {
            if (this.state.buddies != null) {
                return (
                    <FlatList
                        data={this.state.buddies}
                        renderItem={({item}) =>
                            <Surface style={styles.bud}>
                                <Buddy nav={this.props.navigation} item={item}/>
                            </Surface>
                        }
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                )
            } else {
                return (
                    <View style={styles.container}>
                        <Text style={styles.text}>The city you have chosen does not have any buddy yet!</Text>
                    </View>
                )
            }
        }else{
            return(<LoadingComponent/>)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"center",
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: "bold"
    },
    singleBuddyContainer: {
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        flexDirection: 'row',
        marginTop: hp('1%'),
        marginBottom: hp('1%'),
        marginLeft: wp("4%"),
        marginRight: wp('5%'),
        height: hp("13%")
    },
    userPhoto: {
        width: wp("20%"),
        height: wp("20%"),
        borderRadius: wp("20%")
    },
    singleBuddy: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: wp("3%"),
        alignItems:"center"
    },
    bud:{
        margin: wp("2%"),
        borderRadius: 10,
        elevation:4
    },
});
