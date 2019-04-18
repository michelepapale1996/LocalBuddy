import React from 'react'
import { createBottomTabNavigator, createAppContainer, createSwitchNavigator, createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'
import {Icon} from 'react-native-elements'
import ProfileTab from "./screens/ProfileTab"
import Settings from "./screens/Settings"
import CityChosen from "./screens/CityChosen"
import ChooseCity from "./screens/ChooseCity"
import Loading from "./screens/Loading"
import Login from "./screens/Login"
import SignUp from "./screens/SignUp"
import BuddyProfile from "./screens/BuddyProfile"
import AllChats from "./screens/AllChats"
import SingleChat from "./screens/SingleChat"
import ChangePassword from "./screens/ChangePassword"
import WhoCanFindMe from "./screens/WhoCanFindMe"
import CitiesOfBuddy from "./screens/CitiesOfBuddy"
import FutureMeetings from "./screens/FutureMeetings"
import PastMeetings from "./screens/PastMeetings"
import NewMeeting from "./screens/NewMeeting";
import Feedback from "./screens/Feedback";

const SearchTab = createStackNavigator({
    Home: {
        screen: ChooseCity,
    },
    CityChosen: {
        screen: CityChosen,
    },
    BuddyProfile: {
        screen: BuddyProfile
    },
    SingleChat: {
        screen: SingleChat
    }
});

const ChatTab = createStackNavigator({
    AllChats: {
        screen: AllChats,
    },
    SingleChat: {
        screen: SingleChat,
    },
    BuddyProfile: {
        screen: BuddyProfile
    }
});

const SettingsTab = createStackNavigator({
    Settings:{
        screen: Settings
    },
    ChangePassword:{
        screen: ChangePassword
    },
    WhoCanFindMe:{
        screen: WhoCanFindMe
    },
    CitiesOfBuddy:{
        screen: CitiesOfBuddy
    }
})

const MeetingsTab = createMaterialTopTabNavigator({
    FutureMeetings:{
        screen: FutureMeetings
    },
    PastMeetings:{
        screen: PastMeetings
    }
})

const FutureMeetingsTabNavigator = createStackNavigator({
    FutureMeetingsTab:{
        screen: MeetingsTab,
        navigationOptions: {
            header: null
        }
    },
    NewMeeting:{
        screen: NewMeeting
    },
    Feedback:{
        screen: Feedback
    }
})

const TabNavigator = createBottomTabNavigator({
    Search: {
        screen: SearchTab,
        navigationOptions:{
            tabBarIcon:<Icon name="search" size={26}/>
        }
    },
    Chat: {
        screen: ChatTab,
        navigationOptions:{
            tabBarIcon:<Icon name="chat" size={26}/>
        }
    },
    Profile: {
        screen: ProfileTab,
        navigationOptions:{
            tabBarIcon:<Icon name="user" type='feather' size={26}/>
        }
    },
    MyMeetings: {
        screen: FutureMeetingsTabNavigator,
        navigationOptions:{
            tabBarIcon:<Icon name="organization" type='octicon' size={26}/>
        }
    },
    Settings: {
        screen: SettingsTab,
        navigationOptions:{
            tabBarIcon:<Icon name="settings" size={26}/>
        }
    }
});

const App = createSwitchNavigator(
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

export default createAppContainer(App);