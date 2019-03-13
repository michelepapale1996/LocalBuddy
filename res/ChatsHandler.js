import SingleChatHandler from "./SingleChatHandler";
import ConnectyCubeHandler from "./ConnectyCubeHandler";
import UserHandler from "./UserHandler";

class ChatsHandler {

    //from ConnectyCube
    static getUserId(id){
        return new Promise((resolve,reject) => {
            var searchParams = {filter: { field: 'id', param: 'in', value: id }};

            ConnectyCubeHandler.getInstance().users.get(searchParams, function(error, res){
                if(error !== null) reject(error);
                else resolve(res.items[0].user.custom_data)
            })
        })
    }

    static getInfoChatWith(id, chat){
        return ChatsHandler.getUserId(id).then(userId => {
            var state = ({
                chatId: chat._id,
                CCopponentUserId: id,
                ccUserId: chat.user_id,
                lastMessageText: chat.last_message,
                createdAt: chat.last_message_date_sent
            })

            const promises = [UserHandler.getNameAndSurname(userId), UserHandler.getUrlPhoto(userId)]
            return Promise.all(promises).then(
                (res) => {
                    state.nameAndSurname = res[0]
                    state.urlPhotoOther = res[1]
                    return state
                }
            )
        }).catch( err => console.log("Errore: ", err))
    }

    static getChatsAsync(){
        return new Promise((resolve, reject) => {
            ConnectyCubeHandler.getInstance().chat.dialog.list({}, function(error, dialogs) {
                if (error!==null) reject(error)

                resolve(dialogs.items)
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
