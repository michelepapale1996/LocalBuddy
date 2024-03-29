import React from 'react'
import { createAppContainer} from 'react-navigation'
import { Dimensions } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import MeetingsNotificationsHandler from "./handler/MeetingsNotificationsHandler";
import MessagesNotificationsHandler from "./handler/MessagesNotificationsHandler";
import NavigationService from "./handler/NavigationService"
import PhoneApp from "./PhoneNavigators"
import TabletApp from "./TabletNavigators"
import OrientationHandler from "./handler/OrientationHandler";

var AppContainer
const size = Math.min(Dimensions.get('window').width, Dimensions.get('window').height)
if(size < 600){
    AppContainer = createAppContainer(PhoneApp)
}else{
    AppContainer = createAppContainer(TabletApp)
}
console.disableYellowBox = true;
const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        text: "#2c3e50",
        primary: '#3498db',
        accent: '#2980b9',
    }
};
class Application extends React.Component {
    componentDidMount(){
        OrientationHandler.getOrientation()
        Dimensions.addEventListener("change", () => OrientationHandler.getOrientation())
    }

    componentWillUnmount(){
        Dimensions.removeEventListener("change");
    }

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
        return route;
    }

    render() {
        return (
            <PaperProvider theme={theme}>
                <AppContainer
                    onNavigationStateChange={(prevState, currentState) => {
                        var currentScreen = this.getActiveRouteName(currentState)
                        MeetingsNotificationsHandler.setScreen(currentState)
                        MessagesNotificationsHandler.setScreen(currentScreen)
                        }}

                    ref={ navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            </PaperProvider>
        );
    }
}

export default Application;