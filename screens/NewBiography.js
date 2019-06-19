import React, {Component} from "react";
import { StyleSheet, View } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import LoadingComponent from '../components/LoadingComponent'
import { TextInput, Text, Button } from 'react-native-paper';
import UserHandler from "../handler/UserHandler";
import LocalStateHandler from "../handler/LocalStateHandler";

export default class NewBiography extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Edit Biography",
            headerRight: (
                <Button
                    onPress={()=>navigation.getParam("saveBiography", null)()}
                    style={styles.button}
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
        await UserHandler.saveBiography(this.state.text)
        LocalStateHandler.updateBio(this.state.text)
        this.props.navigation.getParam("newBiography", null)(this.state.text)
        this.props.navigation.goBack()
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
        rol()
    }

    render() {
        const styles = StyleSheet.create({
            container:{
                flex: 1,
                backgroundColor: 'white',
                margin:hp("2%"),
            },
            singleOptionContainer:{
                flex:1,
                margin: wp("3%"),
                height: hp("5%")
            },
            text: {
                fontSize: 20,
                fontWeight: "bold",
                textAlign:"center"
            },
            textInput: {
                width: wp('90%'),
                marginTop: 8
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
                    <Text style={styles.text}>Insert the biography</Text>
                    <TextInput
                        multiline={true}
                        onChangeText={(text) => this.setState({text})}
                        style={styles.textInput}
                        value={this.state.text}
                        selectionColor={"white"}
                        underlineColor={"white"}
                    />
                </View>
            )
        } else {
            return (<LoadingComponent/>)
        }
    }
}