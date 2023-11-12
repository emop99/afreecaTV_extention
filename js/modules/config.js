const RAFFLE_STATE = {
    ING: 'ING', // 추첨 참여 진행 중
    DEAD_LINE_COMPLETED: 'DEAD_LINE_COMPLETED', // 마감 완료
    FINISH: 'FINISH', // 추첨 완료
};

const USER_GRADE = {
    NORMAL: 'NORMAL',
    FAN: 'FAN',
    VIP: 'VIP',
};

const USER_GRADE_NAME = {
    NORMAL: '일반',
    FAN: '팬',
    VIP: '열혈',
};

const oConfig = (() => {
    'use strict';

    return {
        init: () => {
        },
    };
})();

export {oConfig, RAFFLE_STATE, USER_GRADE, USER_GRADE_NAME};
