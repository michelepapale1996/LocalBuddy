import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function notificationOpened(notification) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName: 'AllChats'
        }))
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName:'SingleChat',
            key: notification.chatId,
            params: {
                chatId: notification.chatId,
                opponentNameAndSurname: notification.opponentName,
                urlPhotoOther: notification.urlPhotoOther,
                CCopponentUserId: notification.CCopponentUserId,
                opponentUserId: notification.opponentId
            }
        }),
    );
}

function goToNewMeeting(navOptions){
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName: 'NewMeeting',
            params: {...navOptions}
        })
    )
}

// add other navigation functions that you need and export them

export default {
    notificationOpened,
    setTopLevelNavigator,
    goToNewMeeting
};