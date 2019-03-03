import ConnectyCubeHandler from "./ConnectyCubeHandler";
import UserHandler from "./UserHandler";

class SingleChatHandler{
    static createConversation(otherUser){
        var params = {
            type: 3,
            occupants_ids: [otherUser]
        };

        ConnectyCubeHandler.getInstance().chat.dialog.create(params, function(error, conversation) {});
    }

    static retrieveChatHistory(dialogId, limit, urlPhotoUser, urlPhotoOther){
        var filter = { chat_dialog_id: dialogId, sort_desc: 'date_sent', limit: limit, skip: 0 };
        const ccUserId = ConnectyCubeHandler.getCCUserId()
        return new Promise((resolve, reject) => {
            ConnectyCubeHandler.getInstance().chat.message.list(filter, function(error, messages) {
                if (error !== null) reject(error)

                var msges = messages.items.map( msg => {
                    var value = ""
                    var photo = ""
                    if(ccUserId == msg.sender_id){
                        value = 1
                        photo = urlPhotoUser
                    }else{
                        value = 2
                        photo = urlPhotoOther
                    }
                    return ({
                        _id: msg._id,
                        text: msg.message,
                        createdAt: msg.date_sent,
                        user: {
                            _id: value,
                            avatar: photo
                        }
                    })
                })
                resolve(msges)
            })
        })
    }

    static sendMessage(messageBody, dialogId, opponentId, opponentName){
        var message = {
            type: 'chat',
            body: messageBody,
            extension: {
                save_to_history: 1,
                dialog_id: dialogId
            },
            markable: 1
        };

        ConnectyCubeHandler.getInstance().chat.send(opponentId, message);

        var payload = JSON.stringify({
            message: messageBody,
            opponentName: opponentName
        });

        var pushParameters = {
            notification_type: 'push',
            user: {ids: [opponentId]}, // recipients.
            environment: 'development', // environment, can be 'production'.
            message: ConnectyCubeHandler.getInstance().pushnotifications.base64Encode(payload)
        };

        ConnectyCubeHandler.getInstance().pushnotifications.events.create(pushParameters, function(error, result) {
        });
    }

    static disconnectToChat(){
        ConnectyCubeHandler.getInstance().chat.disconnect();
    }

    static connectToChat(userId, pwd){
        var userCredentials = {
            userId: userId,
            password: pwd
        };

        ConnectyCubeHandler.getInstance().chat.connect(userCredentials,
            function(error, contactList) {}
        );
    }
}
SingleChatHandler.shared = new SingleChatHandler()
export default SingleChatHandler