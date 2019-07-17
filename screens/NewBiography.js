import React, {Component} from "react";
import { StyleSheet, View, TextInput } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import LoadingComponent from '../components/LoadingComponent'
import { Text, Button } from 'react-native-paper';
import UserHandler from "../handler/UserHandler";
import LocalUserHandler from "../LocalHandler/LocalUserHandler";
import NetInfoHandler from "../handler/NetInfoHandler";

export default class NewBiography extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Edit Biography",
            headerRight: (
                <Button
                    onPress={()=>navigation.getParam("saveBiography", null)()}
                    style={{
                        marginLeft:0,
                        marginRight:0,
                        borderRadius: 5,
                        borderColor: "white"
                    }}
                    mode={"outlined"}
                    color={"white"}
                >
                    Save
                </Button>
            ),
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#2fa1ff'
            },
            headerTitleStyle: {
                color: 'white'
            }
        }
    }

    saveBiography = async () => {
        if(NetInfoHandler.isConnected){
            await UserHandler.saveBiography(this.state.text)
            LocalUserHandler.updateBio(this.state.text)
            this.props.navigation.getParam("newBiography", null)(this.state.text)
            this.props.navigation.goBack()
        }else{
            alert("You are not connected to the network. Check your connection and retry.")
        }

    }

    constructor(props) {
        super(props)
        this.state = {
            text: this.props.navigation.getParam("oldText", null),
            loadingDone: false
        }
        this.props.navigation.setParams({
            saveBiography: this.saveBiography
        })
    }

    componentDidMount() {
        loc(this)
        this.setState({
            loadingDone:true
        })
    }

    componentWillUnmount(){
        rol(this)
    }

    render() {
        const styles = StyleSheet.create({
            container:{
                flex: 1,
                backgroundColor: 'white',
                margin:hp("2%"),
                alignItems:"center"
            },
            singleOptionContainer:{
                flex:1,
                margin: wp("3%"),
                height: hp("5%")
            },
            text: {
                fontSize: 25,
                fontWeight: "bold",
                textAlign:"center"
            },
            textInput: {
                width: wp('90%'),
                marginTop: 8,
                fontSize: 20
            },
            header:{
                fontSize: 20,
                color: "green",
                fontWeight:"bold"
            },
            userPhoto: {
                width: wp("15%"),
                height: wp("15%"),
                borderRadius: wp("15%")
            },
            userContainer: {
                flex: 1,
                flexDirection: 'row',
                margin: wp("3%"),
                height: hp("10%")
            },
            userInfoContainer: {
                flex:1,
                margin: wp("1%"),
                height: hp("10%")
            },
            button:{
                marginLeft:0,
                marginRight:0,
                borderRadius: 20,
                borderColor: "white"
            }
        })

        if (this.state.loadingDone != false) {
            return (
                <View style={styles.container}>
                    <TextInput
                        multiline={true}
                        onChangeText={(text) => this.setState({text})}
                        style={styles.textInput}
                        placeholder={"Insert a biography..."}
                        value={this.state.text}
                        underlineColorAndroid={"#2fa1ff"}
                    />
                </View>
            )
        } else {
            return (<LoadingComponent/>)
        }
    }
}