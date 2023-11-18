import {oConfig} from './config.js';

const CUSTOM_ACTION_CODE = {
    CREATE_RAFFLE: 'CREATE_RAFFLE', // 신규 추첨 생성
    ADD_RAFFLE_PARTICIPANT: 'ADD_RAFFLE_PARTICIPANT', // 추첨 참여자 추가
    CHANGE_RAFFLE_INFO: 'CHANGE_RAFFLE_INFO', // 추첨 정보 변경
    SEND_WINNER_ALIM: 'SEND_WINNER_ALIM', // 추첨 당첨자 알림
    LOADING_USER_RAFFLE_INFO: 'LOADING_USER_RAFFLE_INFO', // 유저 화면 로딩 시 추첨 정보 가져오기
    SEND_WINNER_INFO: 'SEND_WINNER_INFO', // 추첨 당첨자 정보 전송
    CHANGE_RAFFLE_HEAD_COUNT: 'CHANGE_RAFFLE_HEAD_COUNT', // 추첨 신청 인원 변경
    RAFFLE_ALL_RESET: 'RAFFLE_ALL_RESET', // 추첨 정보 전체 초기화
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
    'use strict';

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
                if (oConfig.isDev()) {
                    console.log('broadcastSend');
                    console.log(`action : ${action}`);
                    console.log(`message : ${message}`);
                    console.log(`=============================================`);
                }
                extensionSDK.broadcast.send(action, message);
            },
            /**
             * 방송 내 특정 주제에 대해 특정 회원에게 메세지를 발신합니다.
             * @param userId String
             * @param action String 최대 50Byte
             * @param message String, Object 최대 500Byte
             */
            broadcastWhisper: (userId, action, message) => {
                if (oConfig.isDev()) {
                    console.log('broadcastWhisper');
                    console.log(`userId : ${userId}`);
                    console.log(`action : ${action}`);
                    console.log(`message : ${message}`);
                    console.log(`=============================================`);
                }
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
