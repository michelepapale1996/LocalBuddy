import React, {Component} from "react";
import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import LoadingComponent from '../components/LoadingComponent'
import { Button } from 'react-native-elements'

export default class Feedback extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Feedback",
            headerRight: (
                <Button
                    onPress={()=>navigation.getParam("saveFeedback", null)()}
                    buttonStyle={styles.button}
                    title="Save"
                    color="#fff"
                />
            ),
        };
    };

    saveFeedback = () => {
        console.log("TODO")
    }

    constructor(props) {
        super(props)
        this.state = {
            loadingDone: false
        }
        this.props.navigation.setParams({
            saveFeedback: this.saveFeedback
        })
    }

    componentDidMount() {

    }

    render() {
        if (this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        <Text style={styles.text}>Who do you want to meet?</Text>
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
        backgroundColor: '#F5FCFF',
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
        borderRadius: 25
    }
});