import React, {Component} from 'react';
import { StyleSheet, View} from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export default class LoadingComponent extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.text}>Loading</Text>
                <ActivityIndicator animating={true} size="large" color={"#2fa1ff"}/>
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
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign:"center"
    },
})