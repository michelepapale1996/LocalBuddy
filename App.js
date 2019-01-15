import React from 'react';
import { createBottomTabNavigator, createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import {Icon} from 'react-native-elements';

import FeedbacksTab from "./screens/FeedbacksTab";
import ChatTab from "./screens/ChatTab";
import ProfileTab from "./screens/ProfileTab";
import SettingsTab from "./screens/SettingsTab";
import CityChosen from "./screens/CityChosen";
import ChooseCity from "./screens/ChooseCity";
import Loading from "./screens/Loading";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";

const SearchTab = createStackNavigator({
    Home: {
        screen: ChooseCity,
    },
    CityChosen: {
        screen: CityChosen,
    }
});

const TabNavigator = createBottomTabNavigator({
    Search: {
        screen: SearchTab,
        navigationOptions:{
            tabBarIcon:<Icon name="search" size={26}/>
        }
    },
    Feedbacks: {
        screen: FeedbacksTab,
        navigationOptions:{
            tabBarIcon:<Icon name="feedback" size={26}/>
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
            tabBarIcon:<Icon name="group" size={26}/>
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