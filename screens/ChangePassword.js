import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import AccountHandler from "../handler/AccountHandler"
import { Text, Button, IconButton, Snackbar } from 'react-native-paper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from "react-native-responsive-screen"

export default class ChangePassword extends React.Component {
    state = { oldPassword: '', newPassword: '', errorMessage: null , repeatNewPassword: "", isPresentError: false}

    componentDidMount(){
        loc(this)
    }

    componentWillUnmount(){
        rol(this)
    }

    static navigationOptions = () => {
        return {
            title: "Change password",
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#2fa1ff'
            },
            headerTitleStyle: {
                color: 'white'
            }
        };
    };

    handleChangePassword = () => {
        AccountHandler.changePassword(this.state.oldPassword, this.state.newPassword, this.state.repeatNewPassword).then(response=>{
            alert("Password changed!")
        }).catch(error => this.setState({ isPresentError: true, errorMessage: error }))
    }

    render() {
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
            },
            textInput: {
                width: wp('80%'),
                backgroundColor:"transparent",
                borderBottomWidth: 1,
                borderColor: "grey",
                color:"white"
            },
        })

        return (
            <View style={styles.container}>
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}

                <View style={{marginBottom:hp("20%")}}>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <IconButton icon={"lock-outline"} disabled color={"black"}/>
                        <TextInput
                            secureTextEntry
                            placeholder="Password"
                            autoCapitalize="none"
                            style={styles.textInput}
                            onChangeText={oldPassword => this.setState({ oldPassword })}
                            value={this.state.oldPassword}
                        />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <IconButton icon={"lock-outline"} disabled color={"black"}/>
                        <TextInput
                            secureTextEntry
                            placeholder="New password"
                            autoCapitalize="none"
                            style={styles.textInput}
                            onChangeText={newPassword => this.setState({ newPassword })}
                            value={this.state.newPassword}
                        />
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <IconButton icon={"lock-outline"} disabled color={"black"}/>
                        <TextInput
                            secureTextEntry
                            placeholder="Repeat new password"
                            autoCapitalize="none"
                            style={styles.textInput}
                            onChangeText={repeatNewPassword => this.setState({ repeatNewPassword })}
                            value={this.state.repeatNewPassword}
                        />
                    </View>
                </View>
                <Button onPress={this.handleChangePassword}>Change password</Button>
                <Snackbar
                    visible={this.state.isPresentError}
                    onDismiss={() => this.setState({ isPresentError: false })}
                    action={{
                        label: 'Ok',
                        onPress: () => {
                            this.setState({ isPresentError: false })
                        },
                    }}
                >
                    {this.state.errorMessage}
                </Snackbar>
            </View>
        )
    }
}
