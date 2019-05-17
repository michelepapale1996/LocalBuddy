import React, {Component} from "react";
import {StyleSheet, View } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import LoadingComponent from '../components/LoadingComponent'
import { TextInput, Text, Button } from 'react-native-paper';
import UserHandler from "../handler/UserHandler";

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

    saveBiography = () => {
        UserHandler.saveBiography(this.state.text).then(()=>{
            this.props.navigation.getParam("newBiography", null)(this.state.text)
            this.props.navigation.goBack()
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            text:null,
            loadingDone: false
        }
        this.props.navigation.setParams({
            saveBiography: this.saveBiography
        })
    }

    componentDidMount() {
        this.setState({
            text: "",
            loadingDone:true
        })
    }

    render() {
        if (this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        <Text style={styles.text}>Insert the biography</Text>
                        <TextInput
                            mode={"outlined"}
                            multiline={true}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            selectionColor={"black"}
                            underlineColor={"black"}
                        />
                    </View>
                </View>
            )
        } else {
            return (<LoadingComponent/>)
        }
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        margin: hp("0%"),
        flex: 1,
        backgroundColor: 'white',
    },
    container:{
        justifyContent: 'center',
        margin:hp("2%"),
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
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