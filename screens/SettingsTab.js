import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import firebase from 'react-native-firebase'
import LocalStateHandler from "../res/LocalStateHandler";
import UserHandler from "../res/UserHandler";

function BuddyComponent(props){
    if(props.isBuddy == 1){
        return(
            <Button
                title="Smetti di essere un Buddy"
                onPress={()=>{alert("todo")}}
            />
        )
    }else{
        return(
            <Button
                title="Diventa un buddy"
                onPress={()=>{alert("todo")}}
            />
        )
    }
}

export default class SettingsTab extends Component {
    constructor(props){
        super(props)

        this.state = {
            isBuddy:0
        }
    }

    componentDidMount(){
        const userId = firebase.auth().currentUser.uid;
        UserHandler.isBuddy(userId).then(response => {
            console.log(response)
            this.setState({isBuddy: response})
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Button
                    title="Chi può trovarmi"
                    onPress={()=>alert("todo")}
                />
                <Button
                    title="Modifica password"
                    onPress={()=>alert("todo")}
                />
                <BuddyComponent isBuddy={this.state.isBuddy}/>
                <Button
                    title="Elimina account"
                    onPress={()=>alert("todo")}
                />
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
