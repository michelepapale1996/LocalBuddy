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
import NewMeeting from "./screens/NewMeeting"
import Feedback from "./screens/Feedback"
import NewBiography from "./screens/NewBiography";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import MeetingsNotificationsHandler from "./handler/MeetingsNotificationsHandler";
import MessagesNotificationsHandler from "./handler/MessagesNotificationsHandler";

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

const MeetingsTab = createMaterialTopTabNavigator({
    FutureMeetings:{
        screen: FutureMeetings,
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

const ProfileTabNavigator = createStackNavigator({
    Profile:{
        screen: ProfileTab,
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
    WhoCanFindMe:{
        screen: WhoCanFindMe
    },
    CitiesOfBuddy:{
        screen: CitiesOfBuddy
    },
    NewBiography: {
        screen: NewBiography
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
    MyMeetings: {
    screen: FutureMeetingsTabNavigator,
        navigationOptions:{
            tabBarIcon:<Icon name="organization" type='octicon' size={26}/>
        }
    },
    Profile: {
        screen: ProfileTabNavigator,
        navigationOptions:{
            tabBarIcon:<Icon name="user" type='feather' size={26}/>
        }
    }
},{
    tabBarOptions: {
        style: {
            height: hp("8%"),
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

const AppContainer = createAppContainer(App)
const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3498db',
        accent: '#f1c40f',
    }
};
class Application extends React.Component {
    // gets the current screen from navigation state
    getActiveRouteName = (navigationState)=> {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];
        // dive into nested navigators
        if (route.routes) {
            return this.getActiveRouteName(route);
        }
        return route.routeName;
    }

    render() {
        return (
            <PaperProvider theme={theme}>
                <AppContainer onNavigationStateChange={(prevState, currentState) => {
                    var currentScreen = this.getActiveRouteName(currentState)
                    MeetingsNotificationsHandler.setScreen(currentState)
                    MessagesNotificationsHandler.setScreen(currentScreen)
                }}/>
            </PaperProvider>
        );
    }
}

export default Application;