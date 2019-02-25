import React from 'react';
import { createBottomTabNavigator, createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import {Icon} from 'react-native-elements';

import FeedbacksTab from "./screens/FeedbacksTab";
import ProfileTab from "./screens/ProfileTab";
import SettingsTab from "./screens/SettingsTab";
import CityChosen from "./screens/CityChosen";
import ChooseCity from "./screens/ChooseCity";
import Loading from "./screens/Loading";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import BuddyProfile from "./screens/BuddyProfile"
import AllChats from "./screens/AllChats"
import SingleChat from "./screens/SingleChat"

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

const TabNavigator = createBottomTabNavigator({
    Search: {
        screen: SearchTab,
        navigationOptions:{
            tabBarIcon:<Icon name="search" size={26}/>
        }
    },
    MyBuddies: {
        screen: FeedbacksTab,
        navigationOptions:{
            tabBarIcon:<Icon name="group" size={26}/>
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