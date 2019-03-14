import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, ScrollView, TouchableWithoutFeedback, AsyncStorage,ActivityIndicator} from 'react-native';
import firebase from "react-native-firebase"
import ImagePicker from 'react-native-image-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import LocalStateHandler from "../res/LocalStateHandler";
import LoadingComponent from "../components/LoadingComponent";

function Biography(props){

    modifyBiography = ()=>{
        alert("Da fare")
    }

    return(
        <View style={styles.biographyContainer}>
            <View style={styles.biography}>
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={{fontWeight:"bold"}}>Biografia</Text>
                    <Icon onPress={modifyBiography} name='pencil' type='evilicon' size={30}/>

                </View>
                {
                    props.bio != ""
                        ? <Text>{props.bio}</Text>
                        : <Text>Non hai ancora una biografia!</Text>
                }
            </View>
        </View>
    )
}

function NameAndSurname(props) {
    return(
        <View style={styles.nameAndSurname}>
            <Text style={styles.infoUser}>{props.name} {props.surname}</Text>
        </View>
    )
}

function PhotoProfile(props) {
    uploadImg = () => {
        ImagePicker.showImagePicker((response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = response.uri
                firebase.storage().ref("/PhotosProfile/" + props.userId).putFile(source)
            }
        })
    }

    return(
        <TouchableWithoutFeedback onPress={uploadImg}>
            <Image
                style={styles.photoProfile}
                source={{uri: props.photoPath}}/>
        </TouchableWithoutFeedback>
    )
}

function Feedback(props){
    return(
        <View style={{borderBottomWidth:1, flexDirection:"row", margin:10}}>
            <Image
                style={styles.photoTravelerProfile}
                source={{uri: props.feedback.url}}/>
            <View style={{margin:5, flex:1}}>
                <Text>
                    <Text style={{fontWeight:"bold"}}>Viaggiatore:</Text>
                    {props.feedback.name}
                </Text>
                <Text>
                    <Text style={{fontWeight:"bold"}}>Voto:</Text>
                    {props.feedback.rating}/5
                </Text>
                <Text style={{flexWrap: "wrap", }}>
                    <Text style={{fontWeight:"bold"}}>Commento:</Text>
                    {props.feedback.text}
                </Text>
            </View>
        </View>
    )
}

function FeedbacksOverview(props) {
    getNumber = (rating) => {
        return props.feedbacks.filter(
            elem => elem.rating == rating
        ).length
    }

    return(
        <View>
            {props.feedbacks != null && props.feedbacks.map(
                elem => <Feedback key={elem.travelerId} feedback={elem}/>
            )}
        </View>
    )
}

function Feedbacks(props){
    return(
        <View style={styles.biographyContainer}>
            <View style={styles.biography}>
                <Text style={{fontWeight:"bold"}}>Feedbacks</Text>
                {
                    props.feedbacks != ""
                        ? <FeedbacksOverview feedbacks={props.feedbacks}/>
                        : <Text>Non hai ancora alcun feedback!</Text>
                }
            </View>
        </View>
    )
}

export default class ProfileTab extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: null,
            photoToUpload: null,
            loadingDone: false
        }
    }

    componentDidMount(){
        LocalStateHandler.retrieveUserInfo().then(
            user => {
                this.setState({
                    user: user,
                    loadingDone: true
                })
            }
        )
    }

    render() {
        if (this.state.loadingDone){
            return(
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.viewContainer}>
                        <View style={styles.userTop}>
                            <PhotoProfile photoPath={this.state.user.photoPath} userId={this.state.user.id}/>
                            <NameAndSurname name={this.state.user.name} surname={this.state.user.surname}/>
                        </View>
                        <Biography bio={this.state.user.bio}/>
                        <Feedbacks feedbacks={this.state.user.feedbacks}/>
                    </View>
                </ScrollView>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        alignItems: 'center'
    },
    viewContainer:{
        flex:1
    },
    biographyContainer: {
        fontSize: hp("30%"),
        textAlign: 'center',
        borderColor: 'black',
        borderRadius: 7,
        borderWidth: 0.5,
        width: wp("95%"),
        margin: hp("1%")
    },
    biography:{
        margin: wp("3%")
    },
    infoUser:{
        fontSize:wp("7%"),
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 20
    },
    userTop:{
        flexDirection: 'row',
        margin: 20,
        marginTop: 30
    },
    nameAndSurname:{
        flex:1,
        margin:hp("3%")
    },
    photoProfile:{
        width: wp("40%"),
        height: wp("40%"),
        borderRadius: wp("40%")
    },
    photoTravelerProfile:{
        width: wp("20%"),
        height: wp("20%"),
        borderRadius: wp("20%")
    }
});
