import React, {Component} from 'react';
import {StyleSheet, View, Alert, ScrollView } from 'react-native';
import UserHandler from "../handler/UserHandler";
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import LoadingComponent from '../components/LoadingComponent'
import CitiesOfBuddy from "./CitiesOfBuddy";
import { Text, TouchableRipple, Portal, Dialog, Paragraph, Button, Switch, Surface, IconButton } from 'react-native-paper';
import AccountHandler from "../handler/AccountHandler";
import MultiSlider from "@ptomasroos/react-native-multi-slider/MultiSlider";
import LocalUserHandler from "../LocalHandler/LocalUserHandler";
import OrientationHandler from "../handler/OrientationHandler";

function BuddyComponent(props){
    stopToBeBuddy = () => {
        UserHandler.stopToBeBuddy()
        LocalUserHandler.isBuddy(0)
        props.isBuddyUpdater(0)
    }

    becomeBuddy = () => {
        UserHandler.becomeBuddy()
        LocalUserHandler.isBuddy(1)
        props.isBuddyUpdater(1)
    }

    if(props.isBuddy == 1){
        return(
            <View>
                <View>
                    <Surface style={props.styles.surfaceContainer}>
                        <View style={{justifyContent:"center", ...props.styles.settingContainer}}>
                            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                                <Text style={props.styles.text}>Only same-sex people</Text>
                                <Switch value={props.state.onlySameSex} onValueChange={props.onlySameSexChange}/>
                            </View>
                            <Text style={{fontSize: 15, flexWrap: 'wrap'}}>Change the sex of the travelers that can find you</Text>
                        </View>
                    </Surface>

                    <Surface style={props.styles.surfaceContainer}>
                        <View style={{justifyContent:"center", ...props.styles.settingContainer}}>
                            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                <Text style={props.styles.text}>Age range</Text>
                                <Text >{props.state.lowerRangeTouristAge} - {props.state.upperRangeTouristAge}</Text>
                            </View>
                            <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                                <MultiSlider
                                    values={[
                                        props.state.lowerRangeTouristAge,
                                        props.state.upperRangeTouristAge,
                                    ]}
                                    sliderLength={props.styles.sliderLength}
                                    onValuesChange={props.multiSliderValuesChange}
                                    selectedStyle={{backgroundColor:"#2fa1ff"}}
                                    unselectedStyle={{backgroundColor:"#2fa1ff"}}
                                    markerStyle={{backgroundColor:"#2fa1ff"}}
                                    min={0}
                                    max={100}
                                    step={1}
                                    allowOverlap
                                    snapped
                                />
                            </View>
                            <Text style={{fontSize: 15, flexWrap: 'wrap'}}>Choose the age of the travelers that can find you</Text>
                        </View>
                    </Surface>

                    <Surface style={props.styles.surfaceContainer}>
                        <TouchableRipple onPress={() => props.nav.navigate('CitiesOfBuddy')}>
                            <View style={{justifyContent:"center", ...props.styles.settingContainer}}>
                                <View style={{flex: 1, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                                    <View style={{flex:1}}>
                                        <Text style={props.styles.text}>Your cities</Text>
                                        <Text style={{fontSize: 15, flexWrap: 'wrap'}}>Change the cities in which you want to be a buddy</Text>
                                    </View>
                                    <IconButton icon={"chevron-right"}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Surface>

                    <Surface style={props.styles.surfaceContainer}>
                        <TouchableRipple onPress={this.stopToBeBuddy}>
                            <View style={{justifyContent:"center", ...props.styles.settingContainer}}>
                                <View style={{flex: 1, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                                    <View style={{flex:1}}>
                                        <Text style={props.styles.text}>Stop to be buddy</Text>
                                        <Text style={{fontSize: 15, flexWrap: 'wrap'}}>Other users will not find you in the cities where you are a buddy</Text>
                                    </View>
                                    <IconButton icon={"chevron-right"}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Surface>
                </View>
            </View>
        )
    }else{
        return(
            <Surface style={props.styles.surfaceContainer}>
                <TouchableRipple onPress={this.becomeBuddy}>
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", ...props.styles.settingContainer}}>
                        <Text style={props.styles.text}>Become buddy</Text>
                        <IconButton icon={"chevron-right"}/>
                    </View>
                </TouchableRipple>
            </Surface>
        )
    }
}

function ChangePassword(props) {
    return(
        <Surface style={props.styles.surfaceContainer}>
            <TouchableRipple onPress={()=>props.nav.navigate("ChangePassword")}>
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", ...props.styles.settingContainer}}>
                    <Text style={props.styles.text}>Change password</Text>
                    <IconButton icon={"chevron-right"}/>
                </View>
            </TouchableRipple>
        </Surface>
    )
}

function DeleteAccount(props) {
    return(
        <Surface style={props.styles.surfaceContainer}>
            <TouchableRipple onPress={props.deleteAlert}>
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", ...props.styles.settingContainer}}>
                    <Text style={props.styles.text}>Delete account</Text>
                    <IconButton icon={"chevron-right"}/>
                </View>
            </TouchableRipple>
        </Surface>
    )
}

export default class Settings extends Component {
    static navigationOptions = {
        title: "Settings",
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#2fa1ff'
        },
        headerTitleStyle: {
            color: 'white'
        }
    };

    constructor(props){
        super(props)
        this.state = {
            loadingDone: false,
            userIsNoMoreABuddyToggle: false,
            userIsABuddyToggle: false,
            deleteUserToggle: false,
        }
    }

    async componentDidMount(){
        loc(this)
        var user = await LocalUserHandler.getUserInfo()
        //const userId = firebase.auth().currentUser.uid;
        //const isBuddy = await UserHandler.isBuddy(userId)
        //const preferences = await UserHandler.getPreferences(userId)
        this.setState({
            isBuddy: user.isBuddy,
            loadingDone: true,
            lowerRangeTouristAge: user.preferences.lowerRangeTouristAge,
            upperRangeTouristAge: user.preferences.upperRangeTouristAge,
            onlySameSex: user.preferences.onlySameSex,
        })
    }

    componentWillUnmount(){
        rol(this)
    }

    //function to change the state of this component from other components
    isBuddyUpdater = (itIs) => {
        if(!itIs) this.setState({ userIsNoMoreABuddyToggle: true });
        if(itIs) this.setState({ userIsABuddyToggle: true })
        this.setState({
            isBuddy: itIs
        })
    }

    deleteAlert = () => {
        this.setState({ deleteUserToggle: true })
    }

    multiSliderValuesChange = values => {
        this.setState({
            lowerRangeTouristAge: values[0],
            upperRangeTouristAge: values[1]
        });
        UserHandler.savePreferences(values[0], values[1], this.state.onlySameSex)
    };

    onlySameSexChange = () => {
        UserHandler.savePreferences(this.state.lowerRangeTouristAge, this.state.upperRangeTouristAge, !this.state.onlySameSex)
        LocalUserHandler.savePreferences(this.state.lowerRangeTouristAge, this.state.upperRangeTouristAge, !this.state.onlySameSex)
        this.setState({ onlySameSex: !this.state.onlySameSex });
    }

    render() {
        var styles;
        if(OrientationHandler.orientation == "portrait") {
            styles = StyleSheet.create({
                mainContainer: {
                    flex: 1,
                    backgroundColor: 'white',
                },
                container: {
                    flex: 1,
                    margin: hp("2%"),
                },
                settingContainer: {
                    marginBottom: hp("2%"),
                    marginTop: hp("2%"),
                    marginLeft: wp("4%"),
                    marginRight: wp("4%")
                },
                text: {
                    fontSize: 20
                },
                header: {
                    height: hp("5%"),
                    fontSize: 20,
                    fontWeight: "bold"
                },
                surfaceContainer: {
                    elevation: 4,
                    marginBottom: hp("2%"),
                    borderRadius: 5
                },
                sliderLength: wp("80%")

            })
        } else {
            styles = StyleSheet.create({
                mainContainer: {
                    flex: 1,
                    backgroundColor: 'white',
                },
                container:{
                    flex:1,
                    margin:hp("2%"),
                },
                settingContainer:{
                    marginBottom: hp("2%"),
                    marginTop: hp("2%"),
                    marginLeft: wp("4%"),
                    marginRight:wp("4%")
                },
                text:{
                    fontSize: 20
                },
                header:{
                    height: hp("7%"),
                    fontSize: 20,
                    fontWeight:"bold",
                },
                surfaceContainer: {
                    elevation: 4,
                    marginBottom: hp("2%"),
                    borderRadius: 5
                }
            })
        }

        if(this.state.loadingDone != false) {
            return (
                <View style={styles.mainContainer}>
                    <ScrollView>
                        <View style={styles.container}>
                            <Text style={styles.header}>Preferences</Text>
                            <BuddyComponent styles={styles} isBuddy={this.state.isBuddy} state={this.state} onlySameSexChange={this.onlySameSexChange} multiSliderValuesChange={this.multiSliderValuesChange} isBuddyUpdater={this.isBuddyUpdater} nav={this.props.navigation}/>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.header}>Account</Text>
                            <ChangePassword styles={styles}nav={this.props.navigation}/>
                            <DeleteAccount styles={styles}nav={this.props.navigation} deleteAlert={this.deleteAlert}/>

                            <Surface style={styles.surfaceContainer}>
                                <TouchableRipple onPress={() =>{
                                    this.setState({loadingDone: false})
                                    AccountHandler.logOut().then(() => {
                                        this.props.navigation.navigate('Loading')
                                    })
                                }}>
                                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", ...styles.settingContainer}}>
                                        <Text style={styles.text}>Log out</Text>
                                        <IconButton icon={"chevron-right"}/>
                                    </View>
                                </TouchableRipple>
                            </Surface>
                        </View>
                    </ScrollView>

                    <Portal>
                        <Dialog
                            visible={this.state.userIsNoMoreABuddyToggle}
                            onDismiss={() => this.setState({userIsNoMoreABuddyToggle: false})}>
                            <Dialog.Title>You are no more a buddy</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>From this moment on the other travelers can't find you</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.setState({userIsNoMoreABuddyToggle: false})}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Portal>
                        <Dialog
                            visible={this.state.userIsABuddyToggle}
                            onDismiss={() => this.setState({userIsABuddyToggle: false})}>
                            <Dialog.Title>Now you are a buddy</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>From this moment on the other travelers can find you</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.setState({userIsABuddyToggle: false})}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Portal>
                        <Dialog
                            visible={this.state.deleteUserToggle}
                            onDismiss={() => this.setState({deleteUserToggle: false})}>
                            <Dialog.Title>Delete account</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Are you sure you want to delete your account? The action will not be reversible</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.setState({deleteUserToggle: false})}>No</Button>
                                <Button onPress={() => {
                                    AccountHandler.deleteAccount().then(()=>{
                                        this.setState({deleteUserToggle: false})
                                        this.props.navigation.navigate('Loading')
                                    })
                                }}>Yes</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}
