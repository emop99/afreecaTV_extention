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

const oConfig = (() => {
    'use strict';
    
    let isDev = false;

    return {
        init: () => {
            isDev = (window.location.hostname === 'localhost');
        },
        isDev: () => {
            return isDev;
        },
    };
})();

export {oConfig, RAFFLE_STATE, USER_GRADE, USER_GRADE_NAME};
