const CUSTOM_ACTION_CODE = {
    CREATE_RAFFLE: 'CREATE_RAFFLE',
    ADD_RAFFLE_PARTICIPANT: 'ADD_RAFFLE_PARTICIPANT',
    CHANGE_RAFFLE_INFO: 'CHANGE_RAFFLE_INFO',
    SEND_WINNER_ALIM: 'SEND_WINNER_ALIM',
    LOADING_USER_RAFFLE_INFO: 'LOADING_USER_RAFFLE_INFO',
};
const ACTION_CODE = {
    JOIN: 'JOIN',
    QUIT: 'QUIT',
    IN: 'IN',
    OUT: 'OUT',
    USERSTATUS_CHANGED: 'USERSTATUS_CHANGED',
    MESSAGE: 'MESSAGE',
    BALLOON_GIFTED: 'BALLOON_GIFTED',
    ADBALLOON_GIFTED: 'ADBALLOON_GIFTED',
    VIDEOBALLOON_GIFTED: 'VIDEOBALLOON_GIFTED',
    FANLETTER_GIFTED: 'FANLETTER_GIFTED',
    QUICKVIEW_GIFTED: 'QUICKVIEW_GIFTED',
    OGQ_EMOTICON_GIFTED: 'OGQ_EMOTICON_GIFTED',
    SUBSCRIPTION_GIFTED: 'SUBSCRIPTION_GIFTED',
    SUBSCRIBED: 'SUBSCRIBED',
    KEEP_SUBSCRIBED: 'KEEP_SUBSCRIBED',
    BATTLE_MISSION_GIFTED: 'BATTLE_MISSION_GIFTED',
    BATTLE_MISSION_FINISHED: 'BATTLE_MISSION_FINISHED',
    BATTLE_MISSION_SETTLED: 'BATTLE_MISSION_SETTLED',
    CHALLENGE_MISSION_GIFTED: 'CHALLENGE_MISSION_GIFTED',
    CHALLENGE_MISSION_FINISHED: 'CHALLENGE_MISSION_FINISHED',
    CHALLENGE_MISSION_SETTLED: 'CHALLENGE_MISSION_SETTLED',
    DROPS_NOTIFICATION: 'DROPS_NOTIFICATION',
    GEM_ITEM_SENDED: 'GEM_ITEM_SENDED',
    BJ_NOTICE: 'BJ_NOTICE',
    POLL_NOTIFICATION: 'POLL_NOTIFICATION',
    BREAK_TIME_NOTIFICATION: 'BREAK_TIME_NOTIFICATION',
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
                alert('확장 프로그램을 불러오는 중 문제가 발생하였습니다.');
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
            /**
             * 채팅 채널의 특정 서비스 메세지를 수신합니다.
             * 서비스 코드에 대한 정보는 이곳을 참고하세요. (https://developers.afreecatv.com/?szWork=extension&sub=api&part=specification)
             * @param callback (action : String 채팅 서비스 코드, message : String, Object)
             */
            chatListen: (callback) => {
                extensionSDK.chat.listen(callback);
            },
        },
    };
})();

export {oAfreeca, CUSTOM_ACTION_CODE, ACTION_CODE};
