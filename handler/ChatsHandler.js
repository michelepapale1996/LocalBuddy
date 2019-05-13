import SingleChatHandler from "./SingleChatHandler";
import ConnectyCubeHandler from "./ConnectyCubeHandler";
import UserHandler from "./UserHandler";
import AccountHandler from "./AccountHandler";

class ChatsHandler {
    static getInfoChatWith(ccUserid, chat){
        var state = ({
            chatId: chat._id,
            CCopponentUserId: ccUserid,
            //ccUserId: chat.user_id,
            lastMessageText: chat.last_message,
            createdAt: chat.last_message_date_sent
        })

        return AccountHandler.getUserId(ccUserid).then(userId => {
            const promises = [UserHandler.getNameAndSurname(userId), UserHandler.getUrlPhoto(userId)]
            return Promise.all(promises).then((res) => {
                state.nameAndSurname = res[0]
                state.urlPhotoOther = res[1]
                return state
            })
        }).catch(()=>{
            //if enter here, the account of the opponent does not exists anymore
            state.nameAndSurname = "Account Deleted"
            state.urlPhotoOther = "https://firebasestorage.googleapis.com/v0/b/localbuddy-ddb9d.appspot.com/o/PhotosProfile%2Fblank.png?alt=media&token=52be29ae-6820-4f62-8d34-cf380ca4bf79"
            return state
        })
    }

    //retrieve the list of the chats of the user
    static getChatsAsync(){
        return new Promise((resolve, reject) => {
            ConnectyCubeHandler.getInstance().chat.dialog.list({}, function(error, dialogs) {
                if (error!==null) reject(error)
                resolve(dialogs.items)
            })
        })
    }

    static deleteChats(){
        return ChatsHandler.getChatsAsync().then(chats=>{
            chats.forEach(elem => {
                ConnectyCubeHandler.getInstance().chat.dialog.delete([elem._id], function(error) {})
            })
        })
    }

    static getChats(){
        return ChatsHandler.getChatsAsync().then(chats => {
            var promises = chats.map(chat => {
                const partecipantIds = chat.occupants_ids
                const opponentId = partecipantIds.filter((id) => id != ConnectyCubeHandler.getCCUserId())

                var time = new Date(0); // The 0 there is the key, which sets the date to the epoch
                time.setUTCSeconds(chat.last_message_date_sent);
                chat.last_message_date_sent = time.toUTCString()

                return ChatsHandler.getInfoChatWith(opponentId[0], chat)
            })
            return Promise.all(promises).then(state => state)
        })

    }
}

ChatsHandler.shared = new ChatsHandler();
export default ChatsHandler;
