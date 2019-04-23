import React, {Component} from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import CityHandler from "../res/CityHandler";
import LoadingComponent from "../components/LoadingComponent";
import { Text } from 'react-native-paper';

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
        CityHandler.getCity(this.cityId).then((response)=>{
            //response status is 200
            if(response != null){
                this.setState({
                    buddies: response.buddies,
                    loadingDone: true
                })
                //setting the title
                this.props.navigation.setParams({title: "Buddies a " + response.name})
            }else{
                this.setState({
                    loadingDone: true
                })
                //setting the title
                this.props.navigation.setParams({title: "Buddies" })
            }
        })

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
            return(<LoadingComponent/>)
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
