const RAFFLE_STATE = {
    ING: 1, // 추첨 참여 진행 중
    DEAD_LINE_COMPLETED: 2, // 마감 완료
    FINISH: 3, // 추첨 완료
};

const USER_GRADE = {
    NORMAL: 1,
    FAN: 2,
    VIP: 3,
};

const USER_GRADE_NAME = {
    1: '일반',
    2: '팬',
    3: '열혈',
};

const RAFFLE_INFO_DEFAULT_DATA_SET = {
    raffleNo: 0, // 추첨 번호
    raffleName: '', // 추첨명
    status: '', // 추첨 상태 값 (RAFFLE_STATE)
    raffleColumnList: [], // 입력 항목 리스트
    participantsInfo: [], // 참여자 정보 리스트 (RAFFLE_PARTICIPANTS_INFO_DEFAULT_DATA_SET)
    winnersInfo: [], // 당첨자 정보 리스트 (RAFFLE_WINNERS_INFO_DEFAULT_DATA_SET)
    headCount: 0, // 추첨 신청 총 인원
    isParticipants: 0, // 추첨 신청 여부
    isWinner: 0, // 추첨 당첨 여부
};

const RAFFLE_PARTICIPANTS_INFO_DEFAULT_DATA_SET = {
    userId: '', // 유저 아이디
    nickName: '', // 유저 닉네임
    grade: 1, // 유저 등급 (USER_GRADE)
    customColumn: [], // BJ 설정 항목 유저 입력 리스트
};

const RAFFLE_WINNERS_INFO_DEFAULT_DATA_SET = {
    userId: '', // 유저 아이디
    nickName: '', // 유저 닉네임
    grade: 1, // 유저 등급 (USER_GRADE)
    customColumn: [], // BJ 설정 항목 유저 입력 리스트 (USER 데이터에서는 제외)
};

const LOADING_USER_DEFAULT_INFO = {
    isLogin: 0, // 로그인 여부
    userId: '', // 유저 아이디
    userNickname: '', // 유저 닉네임
    userStatus: {
        isBJ: 0, // BJ 여부
        isManager: 0, // 매니저 여부
        isGuest: 0, // 로그인 여부
        isTopFan: 0, // 열혈팬 여부
        isFemale: 0, // 여성 여부
        isHideSex: 0, // 성별 숨김 여부
        isFan: 0, // 팬 여부
        isFollower: 0, // 구독자 여부
        isSupporter: 0, // 서포터 여부
        hasAppliedQuickview: 0, // 퀵뷰 사용 여부
    },
};

const WEPL_RUNNING_MESSAGE = `WEPL 실행합니다!`;

const oConfig = (() => {
    'use strict';

    let isDev = false;

    return {
        init: () => {
            isDev = (window.location.hostname === 'localhost' || window.location.hostname === 'extensiont.afreecatv.com');
        },
        isDev: () => {
            return isDev;
        },
    };
})();

export {
    oConfig,
    RAFFLE_STATE,
    USER_GRADE,
    USER_GRADE_NAME,
    RAFFLE_INFO_DEFAULT_DATA_SET,
    RAFFLE_PARTICIPANTS_INFO_DEFAULT_DATA_SET,
    RAFFLE_WINNERS_INFO_DEFAULT_DATA_SET,
    WEPL_RUNNING_MESSAGE,
    LOADING_USER_DEFAULT_INFO
};
