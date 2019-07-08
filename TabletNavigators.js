import { createBottomTabNavigator, createSwitchNavigator, createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'
import React from 'react'
import {Icon} from 'react-native-elements'
import Settings from "./screens/Settings";
import ChangePassword from "./screens/ChangePassword";
import CitiesOfBuddy from "./screens/CitiesOfBuddy";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import ListView from "./screens/ListView";
import Feedback from "./screens/Feedback";
import ChooseCity from "./screens/ChooseCity";
import Loading from "./screens/Loading";
import SignUp from "./screens/SignUp";
import BuddyProfileTablet from "./screens/BuddyProfileTablet";
import ProfileTablet from "./screens/ProfileTablet";
import Login from "./screens/Login";
import NewMeeting from "./screens/NewMeeting";
import CityChosen from "./screens/CityChosen";
import NewBiography from "./screens/NewBiography";
import ChatTablet from "./screens/ChatTablet"
import CalendarView from "./screens/CalendarView";
import MeetingInfo from "./screens/MeetingInfo";

const SearchTab = createStackNavigator({
    Home: {
        screen: ChooseCity,
    },
    CityChosen: {
        screen: CityChosen,
    },
    BuddyProfile: {
        screen: BuddyProfileTablet
    },
});

const ChatTab = createStackNavigator({
    Chat: ChatTablet,
    BuddyProfile: BuddyProfileTablet
});

const MeetingsTab = createMaterialTopTabNavigator({
    CalendarView:{
        screen: CalendarView
    },
    ListView:{
        screen: ListView
    },
},{
    tabBarOptions: {
        indicatorStyle:{
            backgroundColor:'white'
        },
    },
    initialRouteName: 'CalendarView',
    animationEnabled: false
})

const FutureMeetingsTabNavigator = createStackNavigator({
    FutureMeetingsTab:{
        screen: MeetingsTab,
        navigationOptions: {
            header: null
        }
    },
    MeetingInfo:{
        screen: MeetingInfo
    },
    BuddyProfile: {
        screen: BuddyProfileTablet
    },
    NewMeeting:{
        screen: NewMeeting
    },
    Feedback:{
        screen: Feedback
    }
})

const ProfileTabNavigator = createStackNavigator({
    Profile:{
        screen: ProfileTablet,
        navigationOptions: {
            header: null
        }
    },
    Settings:{
        screen: Settings
    },
    ChangePassword:{
        screen: ChangePassword
    },
    CitiesOfBuddy:{
        screen: CitiesOfBuddy
    },
    NewBiography: {
        screen: NewBiography
    }
})


const TabNavigator = createBottomTabNavigator({
    Chat: {
        screen: ChatTab,
        navigationOptions:{
            tabBarIcon: ({tintColor}) =>  <Icon name="chat" size={35} color={tintColor}/>
        }
    },
    MyMeetings: {
        screen: FutureMeetingsTabNavigator,
        navigationOptions:{
            tabBarIcon: ({tintColor}) => <Icon name="account-multiple" type="material-community" size={35} color={tintColor}/>
        }
    },
    Search: {
        screen: SearchTab,
        navigationOptions:{
            tabBarIcon: ({tintColor}) => <Icon name="search" size={35} color={tintColor}/>
        }
    },
    Profile: {
        screen: ProfileTabNavigator,
        navigationOptions:{
            tabBarIcon: ({tintColor}) => <Icon name="person" size={35} color={tintColor}/>
        }
    }
},{
    tabBarOptions: {
        labelStyle: {
            fontSize: hp("2%"),
        },
        activeTintColor:'#3498db',
        inactiveTintColor: "#343a40",
        style: {
            height: hp("9%"),
        }
    }
})

const TabletApp = createSwitchNavigator(
    {
        Loading,
        SignUp,
        Login,
        TabNavigator
    },
    {
        initialRouteName: 'Loading'
    }
)

export default TabletApp