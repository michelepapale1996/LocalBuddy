import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';


export default class LoadingComponent extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Loading</Text>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    }
})