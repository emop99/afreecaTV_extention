import {LOADING_USER_DEFAULT_INFO, oConfig, RAFFLE_STATE, USER_GRADE, USER_GRADE_NAME, WEPL_RUNNING_MESSAGE} from './modules/config.js';
import oCommon from "./modules/common.js";
import {CUSTOM_ACTION_CODE, oAfreeca} from "./modules/afreeca.js";
import oModal from "./modules/modal.js";

const oMain = (() => {
    'use strict';

    const RaffleListArray = [];
    const selectorMap = {
        mainDiv: '#main-div',
        raffleDetailInfoDiv: '#raffle-detail-info-div',
        raffleDetailInfoTitleHeaderDiv: '#raffle-detail-info-div .header-title h2',
        raffleListTbody: '#raffle-list-tbody',
        raffleParticipationDiv: '#raffle-participation-div',
        raffleParticipationTitleHeaderDiv: '#raffle-participation-div .header-title h2',
        raffleStateCheckbox: '#raffle-list-tbody .raffle-state-checkbox',
        raffleDetailViewBtn: '#raffle-list-tbody .raffle-detail-view-btn',
        raffleDetailInfoTable: '#raffle-detail-info-div #raffle-detail-info-table',
        raffleDetailInfoTbody: '#raffle-detail-info-div #raffle-detail-info-tbody',
        raffleInputParticipationColumnDiv: '#raffle-participation-div #raffle-input-participation-column-div',
        raffleColumnInputFieldset: '.raffle-column-input-fieldset',
        raffleParticipationSuccessBtn: '#raffle-participation-success-btn',
        raffleFinishResultDiv: '#raffle-detail-info-div .lottery-result',
    };
    const userGradeClassMap = {
        1: 'badge-gray-1',
        2: 'badge-primary-2',
        3: 'badge-primary-1',
    };

    let userInfo = LOADING_USER_DEFAULT_INFO;


    const template = (() => {
        return {
            emptyRaffleList: () => {
                return `<tr><td colspan="5">추첨 리스트가 없습니다.</td></tr>`;
            },
            raffleList: () => {
                return RaffleListArray.map((row, index) => {
                    const raffleNo = index;
                    const {raffleName, status, isParticipants, headCount} = row;
                    let detailViewBtnHtml = '';
                    let detailViewBtnClass = '';

                    if (status === RAFFLE_STATE.ING) {
                        detailViewBtnHtml = `${isParticipants ? '신청완료' : '신청하기'}`;
                        detailViewBtnClass = `${isParticipants ? 'badge-gray-1' : 'badge-primary-1'}`;
                    } else if (status === RAFFLE_STATE.DEAD_LINE_COMPLETED) {
                        detailViewBtnHtml = `${isParticipants ? '신청완료' : '신청마감'}`;
                        detailViewBtnClass = `badge-gray-1`;
                    } else if (status === RAFFLE_STATE.FINISH) {
                        detailViewBtnHtml = `추첨완료`;
                        detailViewBtnClass = `badge-primary-2`;
                    }

                    return `<tr>
                                <td>${raffleNo + 1}</td>
                                <td>${raffleName}</td>
                                <td>${headCount.toLocaleString('ko-KR')}</td>
                                <td>
                                    ${status === RAFFLE_STATE.ING ? `<input class="form-check-input large-checkbox raffle-state-checkbox" type="checkbox" value="" checked>` :
                        status === RAFFLE_STATE.DEAD_LINE_COMPLETED || status === RAFFLE_STATE.FINISH ? template.finishingText() : ''}
                                </td>
                                <td>
                                    <a href="javascript:;" class="${detailViewBtnClass} raffle-detail-view-btn" data-raffle-no="${raffleNo}">
                                            ${detailViewBtnHtml}
                                    </a>
                                </td>
                            </tr>`;
                }).join('');
            },
            finishingText: () => {
                return `<span>마감</span>`;
            },
            columnInputDiv: (column, index) => {
                return `<fieldset class="raffle-column-input-fieldset" id="form-setting-${index}">
                            <legend>${column}</legend>
                            <label for="form-setting-${index}">
                                <input type="text" class="form-text-style" value="" placeholder="항목을 입력해주세요." name="raffle-column-input[]" maxlength="20">
                            </label>
                        </fieldset>`;
            },
            winnerList: (index, nickName, grade) => {
                return `<tr>
                            <td>${index}</td>
                            <td>${nickName}</td>
                            <td><p class="${userGradeClassMap[grade]}">${USER_GRADE_NAME[grade]}</p></td>
                        </tr>`;
            },
            winnerImageHtml: () => {
                return `<img src="./images/lottery-result-user-win.png" alt="lottery-result-win">`;
            },
            loserImageHtml: () => {
                return `<img src="./images/lottery-result-user-fail.png" alt="lottery-result-loser">`;
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
            raffleListRefresh: () => {
                if (RaffleListArray.length === 0) {
                    document.querySelector(selectorMap.raffleListTbody).innerHTML = template.emptyRaffleList();
                    return;
                }
                document.querySelector(selectorMap.raffleListTbody).innerHTML = template.raffleList();
            },
            raffleDetailViewShowProc: (raffleNo) => {
                const selectRaffleInfo = RaffleListArray[raffleNo];
                if (!selectRaffleInfo) {
                    oModal.errorModalShow('해당 추첨 정보가 없습니다.', () => {
                        event.screenResetAndDataCall();
                    });
                    return;
                }

                // BJ 커스텀 입력 항목 존재 여부 확인
                if (selectRaffleInfo.raffleColumnList.length === 0) {
                    // 미존재 시 데이터 불러오기
                    api.getRaffleDetailInfo(raffleNo);
                    oCommon.sleep(1000).then(() => {
                        if (selectRaffleInfo.raffleColumnList.length === 0) {
                            oModal.errorModalShow('데이터를 불러오지 못했습니다.', () => {
                                event.screenResetAndDataCall();
                            });
                            return;
                        }
                        render.raffleDetailViewShowProc(raffleNo);
                    });
                    return;
                }

                const isParticipation = selectRaffleInfo.participantsInfo ? selectRaffleInfo.participantsInfo.some((participant) => {
                    return participant.userId === userInfo.userId;
                }) : false;

                if (selectRaffleInfo.status === RAFFLE_STATE.ING) {
                    document.querySelector(selectorMap.raffleParticipationDiv).style.display = '';
                    document.querySelector(selectorMap.mainDiv).style.display = 'none';
                    document.querySelector(selectorMap.raffleParticipationTitleHeaderDiv).innerHTML = `${selectRaffleInfo.raffleName}`;
                    document.querySelector(selectorMap.raffleParticipationSuccessBtn).dataset.raffleNo = raffleNo;
                    document.querySelector(selectorMap.raffleInputParticipationColumnDiv).innerHTML = selectRaffleInfo.raffleColumnList.map((column, index) => {
                        return template.columnInputDiv(column, index);
                    }).join('');

                    if (isParticipation) {
                        event.loadInputData(selectRaffleInfo);
                    }
                } else if (selectRaffleInfo.status === RAFFLE_STATE.DEAD_LINE_COMPLETED) {
                    if (isParticipation) {
                        event.loadInputData(selectRaffleInfo);
                    } else {
                        oModal.errorModalShow('신청 마감된 추첨입니다.', () => {
                            event.screenResetAndDataCall();
                        });
                    }
                } else if (selectRaffleInfo.status === RAFFLE_STATE.FINISH) {
                    // 당첨자 정보 불러오기
                    api.getWInnersInfo(raffleNo);

                    oCommon.sleep(1000).then(() => {
                        if (selectRaffleInfo.winnersInfo.length === 0) {
                            oModal.errorModalShow('데이터를 불러오지 못했습니다.', () => {
                                event.screenResetAndDataCall();
                            });
                            return;
                        }

                        selectRaffleInfo.isWinner = selectRaffleInfo.winnersInfo.some((info) => info.userId === userInfo.userId) ? 1 : 0;

                        document.querySelector(selectorMap.raffleDetailInfoDiv).style.display = '';
                        document.querySelector(selectorMap.mainDiv).style.display = 'none';
                        document.querySelector(selectorMap.raffleDetailInfoTitleHeaderDiv).innerHTML = `${selectRaffleInfo.raffleName}`;
                        document.querySelector(selectorMap.raffleDetailInfoTable).style.width = `100%`;
                        document.querySelector(selectorMap.raffleDetailInfoTbody).innerHTML = selectRaffleInfo.winnersInfo.map((winner, index) => {
                            return template.winnerList(index + 1, winner.nickName, winner.grade);
                        }).join('');
                        if (selectRaffleInfo.hasOwnProperty('isWinner') && selectRaffleInfo.isWinner) {
                            document.querySelector(selectorMap.raffleFinishResultDiv).innerHTML = template.winnerImageHtml();
                        } else {
                            document.querySelector(selectorMap.raffleFinishResultDiv).innerHTML = template.loserImageHtml();
                        }
                    });
                }
            },
        };
    })();

    const event = (() => {
        return {
            init: () => {
                // close button event
                oCommon.addDelegateTarget(document, 'click', 'a.close', (e) => {
                    e.target.closest('.top-container').style.display = 'none';
                    document.querySelector(selectorMap.mainDiv).style.display = '';
                    event.screenResetAndDataCall();
                });

                // 최초 로딩 시 추첨 리스트 요청 처리
                event.screenResetAndDataCall();

                // 1초마다 추첨 리스트 갱신
                setInterval(() => {
                    if (RaffleListArray.length === 0) {
                        oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO, null);
                    }
                    render.raffleListRefresh();
                }, 1000);


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

                    if (!raffleNo || !RaffleListArray[raffleNo]) {
                        oModal.errorModalShow('해당 추첨 정보가 없습니다.', () => {
                            event.screenResetAndDataCall();
                        });
                        return;
                    }
                    if (RaffleListArray[raffleNo].status !== RAFFLE_STATE.ING) {
                        oModal.errorModalShow('신청 마감된 추첨입니다.', () => {
                            event.screenResetAndDataCall();
                        });
                        return;
                    }

                    let validate = true;
                    let focusTarget = null;
                    document.querySelectorAll(`${selectorMap.raffleInputParticipationColumnDiv} input`).forEach((columnInputDiv) => {
                        if (columnInputDiv.value === '' && validate) {
                            validate = false;
                            focusTarget = columnInputDiv;
                        }
                    });

                    if (!validate) {
                        oModal.errorModalShow('항목을 입력해주세요.', () => {
                            focusTarget.focus();
                        });
                        return;
                    }

                    const participantsInfo = {
                        raffleNo: Number(raffleNo),
                        userId: userInfo.userId,
                        nickName: userInfo.userNickname,
                        grade: userInfo.userStatus.isTopFan ? USER_GRADE.VIP : userInfo.userStatus.isFan ? USER_GRADE.FAN : USER_GRADE.NORMAL,
                        customColumn: Array.from(document.querySelectorAll(`${selectorMap.raffleInputParticipationColumnDiv} input`)).map((columnInputDiv) => {
                            return columnInputDiv.value;
                        }),
                    };

                    // 중복 참여 경우 정보 업데이트
                    if (RaffleListArray[raffleNo].participantsInfo && RaffleListArray[raffleNo].participantsInfo.some((participant) => participant.userId === userInfo.userId)) {
                        RaffleListArray[raffleNo].participantsInfo = RaffleListArray[raffleNo].participantsInfo.map((participant) => {
                            if (participant.userId === userInfo.userId) {
                                return participantsInfo;
                            }
                            return participant;
                        });
                    } else {
                        RaffleListArray[raffleNo].participantsInfo.push(participantsInfo);
                    }

                    RaffleListArray[raffleNo].isParticipants = 1;
                    api.addRaffleParticipant(participantsInfo);
                    document.querySelector(selectorMap.raffleParticipationDiv).style.display = 'none';
                    render.raffleList();
                });
            },
            setCreateRaffleInfo: (raffleInfo) => {
                if (raffleInfo === null) {
                    return;
                }
                const {raffleNo} = raffleInfo;
                RaffleListArray[raffleNo] = raffleInfo;
                RaffleListArray[raffleNo].participantsInfo = [];
                RaffleListArray[raffleNo].winnersInfo = [];
                RaffleListArray[raffleNo].headCount = 0;
                RaffleListArray[raffleNo].isParticipants = 0;
                RaffleListArray[raffleNo].isWinner = 0;
                if (document.querySelector(selectorMap.mainDiv).style.display === '') {
                    render.raffleList();
                }
            },
            setRaffleInfo: (raffleInfo) => {
                if (raffleInfo === null) {
                    return;
                }
                const {raffleNo} = raffleInfo;

                if (RaffleListArray.hasOwnProperty(raffleNo)) {
                    if (raffleInfo.hasOwnProperty('raffleName')) {
                        RaffleListArray[raffleNo].raffleName = raffleInfo.raffleName;
                    }
                    if (raffleInfo.hasOwnProperty('raffleColumnList')) {
                        RaffleListArray[raffleNo].raffleColumnList = raffleInfo.raffleColumnList;
                    }
                    if (raffleInfo.hasOwnProperty('headCount')) {
                        RaffleListArray[raffleNo].headCount = raffleInfo.headCount;
                    }
                    if (raffleInfo.hasOwnProperty('status')) {
                        if (raffleInfo.status !== RAFFLE_STATE.ING) {
                            RaffleListArray[raffleNo].status = raffleInfo.status;
                        }
                    }
                    if (raffleInfo.hasOwnProperty('winnersInfo')) {
                        RaffleListArray[raffleNo].winnersInfo = raffleInfo.winnersInfo;
                    }
                    if (raffleInfo.hasOwnProperty('isParticipants')) {
                        RaffleListArray[raffleNo].isParticipants = raffleInfo.isParticipants;
                    }
                    if (!raffleInfo.hasOwnProperty('isWinner')) {
                        RaffleListArray[raffleNo].isWinner = raffleInfo.isWinner;
                    }
                    if (raffleInfo.hasOwnProperty('participantsInfo')) {
                        RaffleListArray[raffleNo].participantsInfo = raffleInfo.participantsInfo;
                    }
                } else {
                    RaffleListArray[raffleNo] = raffleInfo;

                    if (!RaffleListArray[raffleNo].hasOwnProperty('raffleName')) {
                        RaffleListArray[raffleNo].raffleName = '';
                    }
                    if (!RaffleListArray[raffleNo].hasOwnProperty('raffleColumnList')) {
                        RaffleListArray[raffleNo].raffleColumnList = [];
                    }
                    if (!RaffleListArray[raffleNo].hasOwnProperty('headCount')) {
                        RaffleListArray[raffleNo].headCount = 0;
                    }
                    if (!RaffleListArray[raffleNo].hasOwnProperty('status')) {
                        RaffleListArray[raffleNo].status = RAFFLE_STATE.ING;
                    }
                    if (!RaffleListArray[raffleNo].hasOwnProperty('winnersInfo')) {
                        RaffleListArray[raffleNo].winnersInfo = [];
                    }
                    if (!RaffleListArray[raffleNo].hasOwnProperty('isParticipants')) {
                        RaffleListArray[raffleNo].isParticipants = 0;
                    }
                    if (!RaffleListArray[raffleNo].hasOwnProperty('isWinner')) {
                        RaffleListArray[raffleNo].isWinner = 0;
                    }
                    if (!RaffleListArray[raffleNo].hasOwnProperty('participantsInfo')) {
                        RaffleListArray[raffleNo].participantsInfo = [];
                    }
                }

                if (document.querySelector(selectorMap.mainDiv).style.display === '') {
                    render.raffleListRefresh();
                }
            },
            screenResetAndDataCall: () => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO, null);
                document.querySelectorAll('.top-container').forEach((element) => {
                    element.style.display = 'none';
                });
                render.raffleList();
            },
            loadInputData: (selectRaffleInfo) => {
                document.querySelectorAll(selectorMap.raffleColumnInputFieldset).forEach((columnInputDiv, index) => {
                    const value = selectRaffleInfo.participantsInfo.find((participant) => {
                        return participant.userId === userInfo.userId;
                    }).customColumn[index];
                    if (value) {
                        columnInputDiv.querySelector('input').value = value;
                    }
                });
            },
        };
    })();

    const api = (() => {
        return {
            /**
             * 추첨 참여 처리
             * @param participantsInfo {{customColumn: any[], nickName: string, grade: number, raffleNo: number, userId: string}}
             */
            addRaffleParticipant: (participantsInfo) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.ADD_RAFFLE_PARTICIPANT, JSON.stringify(participantsInfo));
            },
            /**
             * 추첨 상세 정보 요청하기
             * @param raffleNo {int}
             */
            getRaffleDetailInfo: (raffleNo) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.GET_DETAIL_RAFFLE_INFO, JSON.stringify({raffleNo}));
            },
            /**
             * 추첨 당첨자 정보 요청하기
             * @param raffleNo {int}
             */
            getWInnersInfo: (raffleNo) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.GET_WINNER_INFO, JSON.stringify({raffleNo}));
            },
        };
    })();

    const messageListener = (() => {
        return {
            init: () => {
                oAfreeca.api.broadcastListener((action, message, fromId) => {
                    if (oConfig.isDev()) {
                        console.log(`oAfreeca.api.broadcastListener`);
                        console.log(`action : ${action}`);
                        console.log(`message : ${message}`);
                        console.log(`fromId : ${fromId}`);
                        console.log(`====================================================`);
                    }
                    if (action === CUSTOM_ACTION_CODE.CREATE_RAFFLE) {
                        // 추첨 생성 메시지 수신
                        const messageObj = JSON.parse(message);
                        event.setCreateRaffleInfo(messageObj);
                    } else if (action === CUSTOM_ACTION_CODE.CHANGE_RAFFLE_INFO) {
                        // 추첨 정보 변경 메시지 수신
                        const messageObj = JSON.parse(message);
                        event.setRaffleInfo(messageObj);
                    } else if (action === CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO) {
                        // 유저 화면 로딩 시 전체 추첨 정보 메시지 수신
                        if (message === null) {
                            return;
                        }
                        const messageArray = JSON.parse(message);
                        messageArray.forEach((raffleInfo) => {
                            event.setRaffleInfo(raffleInfo);
                        });
                        render.raffleListRefresh();
                    } else if (action === CUSTOM_ACTION_CODE.SEND_WINNER_ALIM) {
                        // 추첨 당첨자 알림 메시지 수신
                        const messageObj = JSON.parse(message);
                        const {raffleNo} = messageObj;

                        if (RaffleListArray.hasOwnProperty(raffleNo)) {
                            RaffleListArray[raffleNo].isWinner = 1;
                            RaffleListArray[raffleNo].status = RAFFLE_STATE.FINISH;
                            document.querySelectorAll('.top-container').forEach((element) => {
                                element.style.display = 'none';
                            });
                            render.raffleListRefresh();
                            render.raffleDetailViewShowProc(raffleNo);
                        }
                    } else if (action === CUSTOM_ACTION_CODE.CHANGE_RAFFLE_HEAD_COUNT) {
                        // 추첨 신청 인원 변경 메시지 수신
                        const messageObj = JSON.parse(message);
                        event.setRaffleInfo(messageObj);
                    } else if (action === CUSTOM_ACTION_CODE.RAFFLE_ALL_RESET) {
                        // 추첨 정보 전체 초기화 메시지 수신
                        RaffleListArray.length = 0;
                        event.screenResetAndDataCall();
                    } else if (action === CUSTOM_ACTION_CODE.LOADING_USER_INFO) {
                        userInfo = JSON.parse(message);
                    }
                });

                oAfreeca.api.chatSend(WEPL_RUNNING_MESSAGE);
            },
        };
    })();

    return {
        init: () => {
            //TODO 초기데이터 테스트 셋팅
            // RaffleListArray.push({
            //     raffleName: '테스트1',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디', 'test1', 'test2'],
            //     status: RAFFLE_STATE.FINISH,
            //     isParticipants: 1,
            //     isWinner: 0,
            //     participantsInfo: [
            //         {
            //             userId: "emop",
            //             nickName: "멘탈1나노",
            //             grade: 1,
            //             customColumn: ["1", "2", "3", "4", "5"]
            //         }
            //     ],
            //     winnersInfo: [
            //         {
            //             userId: "test1",
            //             nickName: "testNick1",
            //             grade: 2,
            //             customColumn: ["1", "2", "3", "4", "5"]
            //         },
            //         {
            //             userId: "test2",
            //             nickName: "testNick2",
            //             grade: 3,
            //             customColumn: ["1", "2", "3", "4", "5"]
            //         },
            //         {
            //             userId: "test3",
            //             nickName: "testNick3",
            //             grade: 1,
            //             customColumn: ["1", "2", "3", "4", "5"]
            //         },
            //         {
            //             userId: "test4",
            //             nickName: "testNick4",
            //             grade: 2,
            //             customColumn: ["1", "2", "3", "4", "5"]
            //         }
            //     ],
            //     headCount: 50241,
            // });
            // RaffleListArray.push({
            //     raffleName: '테스트2',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디'],
            //     status: RAFFLE_STATE.DEAD_LINE_COMPLETED,
            //     isParticipants: 1,
            //     participantsInfo: [
            //         {
            //             raffleNo: "3",
            //             userId: "emop",
            //             nickName: "멘탈1나노",
            //             grade: 1,
            //             customColumn: ["1", "2", "3"]
            //         }
            //     ],
            //     winnersInfo: [],
            //     headCount: 3978,
            // });
            // RaffleListArray.push({
            //     raffleName: '테스트3',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디', 'test1', 'test2'],
            //     status: RAFFLE_STATE.FINISH,
            //     isParticipants: 1,
            //     isWinner: 1,
            //     participantsInfo: [
            //         {
            //             userId: "emop",
            //             nickName: "멘탈1나노",
            //             grade: 1,
            //             customColumn: ["1", "2", "3", "4", "5"]
            //         }
            //     ],
            //     winnersInfo: [
            //         {
            //             raffleNo: "3",
            //             userId: "emop",
            //             nickName: "멘탈1나노",
            //             grade: 1,
            //             customColumn: ["1", "2", "3"]
            //         },
            //         {
            //             userId: "test1",
            //             nickName: "testNick1",
            //             grade: 2,
            //             customColumn: ["1", "2", "3", "4", "5"]
            //         },
            //         {
            //             userId: "test2",
            //             nickName: "testNick2",
            //             grade: 3,
            //             customColumn: ["1", "2", "3", "4", "5"]
            //         },
            //         {
            //             userId: "test3",
            //             nickName: "testNick3",
            //             grade: 1,
            //             customColumn: ["1", "2", "3", "4", "5"]
            //         },
            //         {
            //             userId: "test4",
            //             nickName: "testNick4",
            //             grade: 2,
            //             customColumn: ["1", "2", "3", "4", "5"]
            //         }
            //     ],
            //     headCount: 1042,
            // });
            // RaffleListArray.push({
            //     raffleName: '참가자 없음',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디'],
            //     status: RAFFLE_STATE.ING,
            //     isParticipants: 0,
            //     participantsInfo: [],
            //     winnersInfo: [],
            //     headCount: 0,
            // });
            // RaffleListArray.push({
            //     raffleName: '참가자 없음',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디'],
            //     status: RAFFLE_STATE.DEAD_LINE_COMPLETED,
            //     isParticipants: 0,
            //     participantsInfo: [],
            //     winnersInfo: [],
            //     headCount: 0,
            // });
            event.init();
            messageListener.init();
        },
    };
})();

(() => {
    oConfig.init();
    oAfreeca.init();
    oModal.init();
    oMain.init();
})();
