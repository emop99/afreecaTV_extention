const ACTION_CODE = {
    CREATE_RAFFLE: 'CREATE_RAFFLE',
    ADD_RAFFLE_PARTICIPANT: 'ADD_RAFFLE_PARTICIPANT',
    CHANGE_RAFFLE_INFO: 'CHANGE_RAFFLE_INFO',
    SEND_WINNER_ALIM: 'SEND_WINNER_ALIM',
};
const oAfreeca = (() => {
    let extensionSDK = null;

    return {
        init: () => {
            const SDK = window.AFREECA.ext;
            extensionSDK = SDK();

            extensionSDK.handleError((error) => {
                // 확장 프로그램을 불러오는 중 문제가 발생
                console.log(error);
            });
        },
        /**
         * https://developers.afreecatv.com/?szWork=extension&sub=api
         */
        api: {
            /**
             * 방송 내 커스텀 메세지를 수신합니다.
             * @param callback (action: String 최대 50Byte, message: String Object 최대 500Byte, fromId: String)
             */
            broadcastListener: (callback) => {
                extensionSDK.broadcast.listen(callback);
            },
            /**
             * 방송 내 특정 주제의 메세지를 발신합니다.
             * @param action String 최대 50Byte
             * @param message String, Object 최대 500Byte
             */
            broadcastSend: (action, message) => {
                extensionSDK.broadcast.send(action, message);
            },
            /**
             * 방송 내 특정 주제에 대해 특정 회원에게 메세지를 발신합니다.
             * @param userId String
             * @param action String 최대 50Byte
             * @param message String, Object 최대 500Byte
             */
            broadcastWhisper: (userId, action, message) => {
                extensionSDK.broadcast.whisper(userId, action, message);
            },
        },
    };
})();

export {oAfreeca, ACTION_CODE};
