import {oConfig, RAFFLE_STATE, USER_GRADE} from './modules/config.js';
import oCommon from "./modules/common.js";
import {ACTION_CODE, CUSTOM_ACTION_CODE, oAfreeca} from "./modules/afreeca.js";

const oMain = (() => {
    'use strict';

    const RaffleListArray = [];
    const selectorMap = {
        mainDiv: '#main-div',
        raffleDetailInfoDiv: '#raffle-detail-info-div',
        raffleListTbody: '#raffle-list-tbody',
        raffleParticipationDiv: '#raffle-participation-div',
        raffleStateCheckbox: '#raffle-list-tbody .raffle-state-checkbox',
        raffleDetailViewBtn: '#raffle-list-tbody .raffle-detail-view-btn',
        raffleDetailInfoTable: '#raffle-detail-info-div #raffle-detail-info-table',
        raffleInputParticipationColumnDiv: '#raffle-participation-div #raffle-input-participation-column-div',
        raffleColumnInputDiv: '.raffle-column-input-div',
        raffleParticipationSuccessBtn: '#raffle-participation-success-btn',
    };

    let isLoading = false;
    let userInfo = {
        userId: 'ghtyru01', // : String 유저 아이디
        userNickname: '', // : String 유저 닉네임
        userStatus: {
            isBJ: false, // : Boolean BJ 여부
            isManager: false, // : Boolean 매니저 여부
            isGuest: false, // : Boolean 로그인 여부
            isTopFan: false, // : Boolean 열혈팬 여부
            isFemale: false, // : Boolean 여성 여부
            isHideSex: false, // : Boolean 성별 숨김 여부
            isFan: false, // : Boolean 팬 여부
            isFollower: false, // : Boolean 구독자 여부
            isSupporter: false, // : Boolean 서포터 여부
            hasAppliedQuickview: false, // : Boolean 퀵뷰 사용 여부
        },
    };


    const template = (() => {
        return {
            emptyRaffleList: () => {
                return `<tr><td colspan="5" class="text-center">추첨 리스트가 없습니다.</td></tr>`;
            },
            raffleList: () => {
                return RaffleListArray.map((row, index) => {
                    const raffleNo = index;
                    const {raffleName, status, isParticipants, headCount} = row;
                    let detailViewBtnHtml = '';

                    if (status === RAFFLE_STATE.ING) {
                        detailViewBtnHtml = `${isParticipants ? '신청완료' : '신청하기'}`;
                    } else if (status === RAFFLE_STATE.DEAD_LINE_COMPLETED) {
                        detailViewBtnHtml = `${isParticipants ? '신청완료' : '신청마감'}`;
                    } else if (status === RAFFLE_STATE.FINISH) {
                        detailViewBtnHtml = `추첨완료`;
                    }

                    return `<tr>
                                <td class="text-center">${raffleNo + 1}</td>
                                <td>${raffleName}</td>
                                <td class="text-center">${headCount ? headCount.toLocaleString('ko') : 0}</td>
                                <td class="text-center">
                                    ${status === RAFFLE_STATE.ING ? `<input class="form-check-input large-checkbox raffle-state-checkbox" type="checkbox" value="" checked>` :
                        status === RAFFLE_STATE.DEAD_LINE_COMPLETED || status === RAFFLE_STATE.FINISH ? template.finishingText() : ''}
                                </td>
                                <td class="text-center">
                                    <button class="btn btn-primary btn-sm raffle-detail-view-btn"
                                        data-raffle-no="${raffleNo}"
                                        ${status === RAFFLE_STATE.DEAD_LINE_COMPLETED ? 'disabled' : ''}>
                                        ${detailViewBtnHtml}
                                    </button>
                                </td>
                            </tr>`;
                }).join('');
            },
            finishingText: () => {
                return `<span>마감</span>`;
            },
            columnInputDiv: (column) => {
                return `<div class="input-group mb-3 raffle-column-input-div">
                            <span class="input-group-text">${column}</span>
                            <input type="text" class="form-control" placeholder="항목을 입력해주세요." name="raffle-column-input[]">
                        </div>`;
            },
        };
    })();

    const render = (() => {
        return {
            raffleList: () => {
                document.querySelector(selectorMap.mainDiv).style.display = '';
                if (RaffleListArray.length === 0) {
                    document.querySelector(selectorMap.raffleListTbody).innerHTML = template.emptyRaffleList();
                    return;
                }

                document.querySelector(selectorMap.raffleListTbody).innerHTML = template.raffleList();
            },
            raffleDetailViewShowProc: (raffleNo) => {
                const selectRaffleInfo = RaffleListArray[raffleNo];
                if (!selectRaffleInfo) {
                    alert('해당 추첨 정보가 없습니다.');
                    event.screenReset();
                    return;
                }
                const isParticipation = selectRaffleInfo.participantsInfo.some((participant) => {
                    return participant.userId === userInfo.userId;
                });

                if (selectRaffleInfo.status === RAFFLE_STATE.ING) {
                    document.querySelector(selectorMap.raffleParticipationDiv).style.display = '';
                    document.querySelector(selectorMap.mainDiv).style.display = 'none';
                    document.querySelector(`${selectorMap.raffleParticipationDiv} .custom-title`).innerHTML = `${selectRaffleInfo.raffleName}`;
                    document.querySelector(selectorMap.raffleParticipationSuccessBtn).dataset.raffleNo = raffleNo;
                    document.querySelector(selectorMap.raffleInputParticipationColumnDiv).innerHTML = selectRaffleInfo.raffleColumnList.map((column, index) => {
                        return template.columnInputDiv(column);
                    }).join('');

                    if (isParticipation) {
                        document.querySelectorAll(selectorMap.raffleColumnInputDiv).forEach((columnInputDiv, index) => {
                            columnInputDiv.querySelector('input').value = selectRaffleInfo.participantsInfo.find((participant) => {
                                return participant.userId === userInfo.userId;
                            }).customColumn[index];
                        });
                    }
                } else if (selectRaffleInfo.status === RAFFLE_STATE.DEAD_LINE_COMPLETED) {
                    return;
                } else if (selectRaffleInfo.status === RAFFLE_STATE.FINISH) {
                    document.querySelector(selectorMap.raffleDetailInfoDiv).style.display = '';
                    document.querySelector(selectorMap.mainDiv).style.display = 'none';
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} .custom-title`).innerHTML = `${selectRaffleInfo.raffleName}`;
                    document.querySelector(selectorMap.raffleDetailInfoTable).style.width = `100%`;
                }
            },
        };
    })();

    const event = (() => {
        return {
            init: () => {
                // close button event
                oCommon.addDelegateTarget(document, 'click', 'button.close', (e) => {
                    e.target.closest('.top-container').style.display = 'none';
                    document.querySelector(selectorMap.mainDiv).style.display = '';
                    event.raffleListDataUpdateAndListRender();
                });

                // 최초 로딩 시 추첨 리스트 요청 처리
                event.raffleListDataUpdateAndListRender();

                // 현황 체크박스 상태 변경 불가 처리
                oCommon.addDelegateTarget(document, 'click', selectorMap.raffleStateCheckbox, (e) => {
                    e.preventDefault();
                });

                // 추첨 상세보기 / 결과 보기 버튼 클릭 이벤트
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.raffleDetailViewBtn}`, (e) => {
                    const {raffleNo, isParticipation} = e.target.dataset;
                    render.raffleDetailViewShowProc(raffleNo);
                });

                // 추첨 참여 버튼 클릭 이벤트
                oCommon.addDelegateTarget(document, 'click', selectorMap.raffleParticipationSuccessBtn, (e) => {
                    const {raffleNo} = document.querySelector(selectorMap.raffleParticipationSuccessBtn).dataset;

                    if (!raffleNo) {
                        alert('해당 추첨 정보가 없습니다.');
                        event.screenReset();
                        return;
                    }
                    let validate = true;
                    document.querySelectorAll(`${selectorMap.raffleInputParticipationColumnDiv} input`).forEach((columnInputDiv) => {
                        if (columnInputDiv.value === '' && validate) {
                            validate = false;
                            columnInputDiv.focus();
                        }
                    });

                    if (!validate) {
                        alert('항목을 입력해주세요.');
                        return;
                    }

                    const participantsInfo = {
                        raffleNo,
                        userId: userInfo.userId,
                        nickName: userInfo.userNickname,
                        grade: userInfo.userStatus.isTopFan ? USER_GRADE.VIP : userInfo.userStatus.isFan ? USER_GRADE.FAN : USER_GRADE.NORMAL,
                        customColumn: Array.from(document.querySelectorAll(`${selectorMap.raffleInputParticipationColumnDiv} input`)).map((columnInputDiv) => {
                            return columnInputDiv.value;
                        }),
                    };

                    // 중복 참여 경우 정보 업데이트
                    if (RaffleListArray[raffleNo].participantsInfo.some((participant) => participant.userId === userInfo.userId)) {
                        RaffleListArray[raffleNo].participantsInfo = RaffleListArray[raffleNo].participantsInfo.map((participant) => {
                            if (participant.userId === userInfo.userId) {
                                return participantsInfo;
                            }
                            return participant;
                        });
                    } else {
                        RaffleListArray[raffleNo].participantsInfo.push(participantsInfo);
                    }

                    RaffleListArray[raffleNo].isParticipants = true;
                    api.addRaffleParticipant(participantsInfo);
                    document.querySelector(selectorMap.raffleParticipationDiv).style.display = 'none';
                    event.raffleListDataUpdateAndListRender();
                });
            },
            setRaffleInfo: (raffleInfo) => {
                const {settingIndex} = raffleInfo;
                if (RaffleListArray.hasOwnProperty(settingIndex)) {
                    RaffleListArray[settingIndex].raffleName = raffleInfo.raffleName;
                    RaffleListArray[settingIndex].raffleColumnList = raffleInfo.raffleColumnList;
                    RaffleListArray[settingIndex].status = raffleInfo.status;
                    RaffleListArray[settingIndex].headCount = raffleInfo.headCount;
                    if (raffleInfo.hasOwnProperty('winnerInfo')) {
                        RaffleListArray[settingIndex].winnersInfo = raffleInfo.winnersInfo;
                    }
                    if (raffleInfo.hasOwnProperty('isParticipants')) {
                        RaffleListArray[settingIndex].isParticipants = raffleInfo.isParticipants;
                    }
                } else {
                    RaffleListArray[settingIndex] = raffleInfo;
                }
            },
            screenReset: () => {
                document.querySelectorAll('.top-container').forEach((element) => {
                    element.style.display = 'none';
                });
                event.raffleListDataUpdateAndListRender();
            },
            raffleListDataUpdateAndListRender: () => {
                isLoading = true;
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO, null);

                if (oConfig.isDev()) {
                    render.raffleList();
                } else {
                    const interval = setInterval(() => {
                        if (!isLoading) {
                            clearInterval(interval);
                            render.raffleList();
                        }
                    }, 100);
                }
            },
        };
    })();

    const api = (() => {
        return {
            addRaffleParticipant: (sendObj) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.ADD_RAFFLE_PARTICIPANT, JSON.stringify(sendObj));
            },
        };
    })();

    const messageListener = (() => {
        return {
            init: () => {
                oAfreeca.api.broadcastListener((action, message, fromId) => {
                    if (action === CUSTOM_ACTION_CODE.CREATE_RAFFLE || action === CUSTOM_ACTION_CODE.CHANGE_RAFFLE_INFO) {
                        const messageObj = JSON.parse(message);
                        event.setRaffleInfo(messageObj);
                    } else if (action === CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO) {
                        const messageObj = JSON.parse(message);
                        event.setRaffleInfo(messageObj);
                        isLoading = false;
                    } else if (action === CUSTOM_ACTION_CODE.SEND_WINNER_ALIM) {
                        //TODO 당첨자 알림
                    }
                });

                oAfreeca.api.chatListen((action, message) => {
                    if (action === ACTION_CODE.IN) {
                        userInfo = message;
                    }
                });
            },
        };
    })();

    return {
        init: () => {
            //TODO 초기데이터 테스트 셋팅
            // RaffleListArray.push({
            //     raffleName: '테스트1',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디', 'test1', 'test2', 'test3', 'test4'],
            //     status: RAFFLE_STATE.ING,
            //     isParticipants: true,
            //     headCount: 10,
            //     participantsInfo: [],
            //     winnersInfo: [],
            // });
            // RaffleListArray.push({
            //     raffleName: '테스트2',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디'],
            //     status: RAFFLE_STATE.DEAD_LINE_COMPLETED,
            //     isParticipants: true,
            //     headCount: 3,
            //     participantsInfo: [],
            //     winnersInfo: [],
            // });
            // RaffleListArray.push({
            //     raffleName: '테스트3',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디', 'test1', 'test2', 'test3', 'test4'],
            //     status: RAFFLE_STATE.FINISH,
            //     isParticipants: false,
            //     headCount: 10,
            //     participantsInfo: [],
            //     winnersInfo: [],
            // });
            // RaffleListArray.push({
            //     raffleName: '참가자 없음',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디'],
            //     status: RAFFLE_STATE.ING,
            //     isParticipants: false,
            //     headCount: 0,
            //     participantsInfo: [],
            //     winnersInfo: [],
            // });
            event.init();
            messageListener.init();
        },
    };
})();

(() => {
    oConfig.init();
    oAfreeca.init();
    oMain.init();
})();
