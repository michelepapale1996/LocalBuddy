import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import firebase from 'react-native-firebase'
import LocalStateHandler from "../res/LocalStateHandler";

export default class SettingsTab extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Notifiche</Text>
                <Text>Modifica password</Text>
                <Text>Elimina account</Text>
                <Button
                    title="LogOut"
                    onPress={() => firebase.auth().signOut()
                        .then(() => {
                            LocalStateHandler.clearStorage()
                            this.props.navigation.navigate('Loading')
                        })
                        .catch(function(error) {
                            console.log(error)
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
