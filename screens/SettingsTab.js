import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import firebase from 'react-native-firebase'

export default class SettingsTab extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Button
                    title="LogOut"
                    onPress={() => firebase.auth().signOut()
                        .then(function() {
                            this.props.navigation.navigate('Loading')
                        })
                        .catch(function(error) {
                            console.log("Error")
                        })}
                />
            </View>
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
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});
