import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native';
import firebase from 'react-native-firebase'

function Loading(){
    return(
        <View style={styles.container}>
            <Text>Loading</Text>
            <ActivityIndicator size="large"/>
        </View>
    )
}


export default class CityChosen extends Component {
    cityId = this.props.navigation.getParam('cityId', 'Error');
    constructor(props){
        super(props)

        this.state = {
            cityName: null,
            buddies: null,
            loadingDone: false
        }
    }

    componentDidMount(){
        firebase.database().ref("/Citta/" + this.cityId).once('value').then(
            (snap) =>{
                //we have to check if the city exists in the db
                if (snap.val() != null){
                    let promises = []
                    snap.val().buddies.map(
                        buddy => {
                            promises.push(firebase.database().ref("/users/" + buddy).once("value"))
                        }
                    )

                    let buddies = []
                    Promise.all(promises).then(values => {
                        values.map(
                            v => {
                                buddies.push({
                                    name: v.val().name,
                                    surname: v.val().surname,
                                    id: v.key
                                })
                            }
                        )
                        this.setState({
                            buddies: buddies,
                            loadingDone: true
                        })
                    })
                    this.props.navigation.setParams({title: "Buddies a " + snap.val().name})
                }else{
                    this.setState({
                        loadingDone: true
                    })
                }
            }
        )


    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.title,
        };
    };

    render(){
        if(this.state.loadingDone != false) {
            if (this.state.buddies != null) {
                return (
                    <View style={styles.container}>
                        <FlatList
                            data={this.state.buddies}
                            renderItem={({item}) =>
                                <Text
                                    style={styles.text}
                                    onPress={() => this.props.navigation.navigate('BuddyProfile', {idUser: item.id})}
                                >
                                    {item.name} {item.surname}
                                </Text>}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                )
            } else {
                return (
                    <View style={styles.container}>
                        <Text>La città che hai scelto purtroppo non ha buddy!</Text>
                    </View>
                )
            }
        }else{
            return(<Loading/>)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});
