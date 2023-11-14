import {oConfig, RAFFLE_STATE, USER_GRADE, USER_GRADE_NAME} from './modules/config.js';
import oCommon from "./modules/common.js";
import {oAfreeca, CUSTOM_ACTION_CODE} from "./modules/afreeca.js";
import oModal from "./modules/modal.js";

const oMain = (() => {
    'use strict';

    const RaffleListArray = [];
    const selectorMap = {
        mainDiv: '#main-div',
        systemSetting: '.system-setting',
        raffleAddDiv: '#raffle-add-div',
        raffleDetailInfoDiv: '#raffle-detail-info-div',
        raffleListTbody: '#raffle-list-tbody',
        raffleAddShowBtn: '#raffle-add-show-btn',
        raffleAddColumnInputDiv: '.add-column-input-div',
        raffleAddColumnDiv: '.raffle-add-column-div',
        raffleAddSubjectInput: '#raffle-add-div [name="add-raffle-name"]',
        raffleAddColumnInput: '#raffle-add-div [name="add-raffle-column[]"]',
        raffleAddBtn: '#raffle-add-btn',
        raffleFinishingBtn: '#raffle-list-tbody .raffle-finishing-btn',
        columnDeleteBtn: '.raffle-add-column-div .remove-form-btn',
        columnAddBtn: '.raffle-add-column-div .column-add-btn',
        raffleDetailViewBtn: '#raffle-list-tbody .raffle-detail-view-btn',
        raffleDetailInfoTable: '#raffle-detail-info-div #raffle-detail-info-table',
        raffleDetailInfoThead: '#raffle-detail-info-div #raffle-detail-info-thead',
        raffleDetailInfoTbody: '#raffle-detail-info-div #raffle-detail-info-tbody',
        raffleSearchInput: '#raffle-detail-info-div #raffle-search-input',
        raffleParticipantsAllCheck: '#raffle-detail-info-div .participants-all-check',
        raffleParticipantsCheck: '#raffle-detail-info-div .participants-check',
        raffleStartBtn: '#raffle-detail-info-div .raffle-start-btn',
        raffleReStartBtn: '#raffle-detail-info-div .raffle-restart-btn',
        raffleInputCount: '#raffle-detail-info-div .raffle-input-count',
    };

    const template = (() => {
        return {
            emptyRaffleList: () => {
                return `<tr><td colspan="5" class="text-center">추첨 리스트가 없습니다.</td></tr>`;
            },
            raffleList: () => {
                return RaffleListArray.map((row, index) => {
                    const raffleNo = index;
                    return `<tr>
                                <td class="text-center">${raffleNo + 1}</td>
                                <td>${row.raffleName}</td>
                                <td class="text-center">${row.participantsInfo.length.toLocaleString('ko')}</td>
                                <td class="text-center">
                                    ${row.status === RAFFLE_STATE.ING ? `<a href="javascript:;" class="list-close-btn raffle-finishing-btn" data-raffle-no="${raffleNo}"><img src="./images/icon-minus-box-fill.svg" alt="icon-minus-box" data-raffle-no="${raffleNo}"></a>` :
                        row.status === RAFFLE_STATE.DEAD_LINE_COMPLETED || row.status === RAFFLE_STATE.FINISH ? template.finishingText() : ''}
                                </td>
                                <td class="text-center">
                                    ${row.status === RAFFLE_STATE.ING || row.status === RAFFLE_STATE.DEAD_LINE_COMPLETED ?
                        `<a href="javascript:;" class="badge-primary-1 raffle-detail-view-btn" data-raffle-no="${raffleNo}">상세보기</a>` :
                        row.status === RAFFLE_STATE.FINISH ? `<a href="javascript:;" class="badge-primary-2 raffle-detail-view-btn" data-raffle-no="${raffleNo}">추첨완료</a>` :
                            ''}
                                </td>
                            </tr>`;
                }).join('');
            },
            columnInputDiv: () => {
                return `<label for="form-setting" class="add-column-input-div">
                            <button class="remove-form-btn" type="button"><img src="./images/icon-remove.svg" alt="icon-remove"></button>
                            <input type="text" class="form-text-style" value="" placeholder="항목을 입력해주세요." name="add-raffle-column[]">
                        </label>`;
            },
            finishingText: () => {
                return `<span>마감</span>`;
            },
            raffleNotFinishDetailInfoThead: (raffleInfo) => {
                const {raffleColumnList} = raffleInfo;
                return `<tr class="table-head">
                            <th class="fix-column"><input class="form-check-input large-checkbox participants-all-check" type="checkbox" value=""></th>
                            <th class="">No.</th>
                            <th class="">닉네임</th>
                            <th class="">등급</th>
                            ${raffleColumnList.map((column) => `<th class="text-center">${column}</th>`).join('')}
                        </tr>`;
            },
            raffleNotFinishDetailInfoTbody: (raffleInfo) => {
                const {participantsInfo, raffleColumnList} = raffleInfo;

                if (participantsInfo.length === 0) {
                    return `<tr><td colspan="${raffleColumnList.length + 4}" class="text-center">참가자가 없습니다.</td></tr>`;
                }

                return `${participantsInfo.map((info, index) => `
                        <tr>
                            <td class="fix-column"><input class="form-check-input large-checkbox participants-check" type="checkbox" value="${index}"></td>
                            <td class="">${index + 1}</td>
                            <td class="">${info.nickName}</td>
                            <td class="">${USER_GRADE_NAME[info.grade]}</td>
                            ${info.customColumn.map((column) => `<td class="">${column}</td>`).join('')}
                        </tr>`).join('')}`;
            },
            raffleFinishDetailInfoThead: (raffleInfo) => {
                const {raffleColumnList} = raffleInfo;
                return `<tr class="table-head">
                            <th class="fix-column">No.</th>
                            <th class="">닉네임</th>
                            <th class="">등급</th>
                            ${raffleColumnList.map((column) => `<th class="">${column}</th>`).join('')}
                        </tr>`;
            },
            raffleFinishDetailInfoTbody: (raffleInfo) => {
                return raffleInfo.winnersInfo.map((info, index) => `
                        <tr>
                            <td class="">${index + 1}</td>
                            <td class="">${info.nickName}</td>
                            <td class="">${USER_GRADE_NAME[info.grade]}</td>
                            ${info.customColumn.map((column) => `<td class="">${column}</td>`).join('')}
                        </tr>`).join('')
            },
            raffleStartBtn: (raffleNo) => {
                return `<a href="javascript:;" class="raffle-start-btn" data-raffle-no="${raffleNo}">추첨 시작</a>`;
            },
            raffleReStartBtn: (raffleNo) => {
                return `<a href="javascript:;" class="raffle-restart-btn" data-raffle-no="${raffleNo}">재추첨</a>`;
            },
        };
    })();

    const render = (() => {
        return {
            raffleList: () => {
                document.querySelector(selectorMap.raffleAddDiv).style.display = 'none';
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
            raffleAddShowProc: () => {
                document.querySelector(selectorMap.raffleAddDiv).style.display = '';
                document.querySelector(selectorMap.mainDiv).style.display = 'none';
                document.querySelector(selectorMap.raffleAddSubjectInput).value = '';
                document.querySelector(selectorMap.raffleAddColumnDiv).insertAdjacentHTML('beforeend', template.columnInputDiv());
            },
            raffleDetailViewShowProc: (raffleNo) => {
                const selectRaffleInfo = RaffleListArray[raffleNo];
                if (!selectRaffleInfo) {
                    oModal.errorModalShow('해당 추첨 정보가 없습니다.', (e) => {
                        event.screenReset();
                    });
                    return;
                }
                document.querySelector(selectorMap.raffleDetailInfoDiv).style.display = '';
                document.querySelector(selectorMap.mainDiv).style.display = 'none';
                document.querySelector(`${selectorMap.raffleDetailInfoDiv} .header-title h2`).innerHTML = `${selectRaffleInfo.raffleName}`;
                document.querySelector(selectorMap.raffleSearchInput).value = '';
                document.querySelector(selectorMap.raffleDetailInfoTable).style.width = (selectRaffleInfo.raffleColumnList.length + 4) * 130 >= 500 ? `${(selectRaffleInfo.raffleColumnList.length + 3) * 130}px` : `100%`;

                if (selectRaffleInfo.status === RAFFLE_STATE.ING || selectRaffleInfo.status === RAFFLE_STATE.DEAD_LINE_COMPLETED) {
                    document.querySelector(selectorMap.raffleDetailInfoThead).innerHTML = template.raffleNotFinishDetailInfoThead(selectRaffleInfo);
                    document.querySelector(selectorMap.raffleDetailInfoTbody).innerHTML = template.raffleNotFinishDetailInfoTbody(selectRaffleInfo);
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} .common-footer .result-btn`).innerHTML = template.raffleStartBtn(raffleNo);
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} .common-footer .lottery-number-from`).style.display = '';
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} div`).classList.add('application-list-bj');
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} div`).classList.remove('random-lottery-bj');
                    document.querySelector(selectorMap.raffleParticipantsAllCheck).checked = true;
                    event.raffleParticipantsCheckProc(true);
                } else if (selectRaffleInfo.status === RAFFLE_STATE.FINISH) {
                    document.querySelector(selectorMap.raffleDetailInfoThead).innerHTML = template.raffleFinishDetailInfoThead(selectRaffleInfo);
                    document.querySelector(selectorMap.raffleDetailInfoTbody).innerHTML = template.raffleFinishDetailInfoTbody(selectRaffleInfo);

                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} .common-footer .lottery-number-from`).style.display = 'none';
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} div`).classList.remove('application-list-bj');
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} div`).classList.add('random-lottery-bj');
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} .common-footer .result-btn`).innerHTML = template.raffleReStartBtn(raffleNo);
                }
            },
        };
    })();

    const event = (() => {
        return {
            init: () => {
                // 추첨 추가하기 버튼 클릭 이벤트
                document.querySelector(selectorMap.raffleAddShowBtn).addEventListener('click', () => {
                    if (RaffleListArray.length >= 5) {
                        oModal.errorModalShow('추첨은 최대 5개까지만 생성 가능합니다.', (e) => {});
                        return;
                    }
                    render.raffleAddShowProc();
                });

                // 추첨 추가하기 완료 버튼 클릭 이벤트
                document.querySelector(selectorMap.raffleAddBtn).addEventListener('click', () => {
                    const raffleName = document.querySelector(selectorMap.raffleAddSubjectInput).value.trim();
                    const raffleColumnList = [...document.querySelectorAll(selectorMap.raffleAddColumnInput)].map((input) => input.value.trim());
                    let validate = true;

                    if (raffleName === '') {
                        oModal.errorModalShow('추첨명을 입력해주세요.', (e) => {
                            document.querySelector(selectorMap.raffleAddSubjectInput).focus();
                        });
                        return;
                    }

                    raffleColumnList.forEach((value, index) => {
                        if (value === '' && validate) {
                            validate = false;
                            oModal.errorModalShow('항목을 입력해주세요.', (e) => {
                                document.querySelectorAll(selectorMap.raffleAddColumnInput)[index].focus();
                            });
                        }
                    });

                    if (!validate) return;

                    RaffleListArray.push({
                        raffleName: raffleName,
                        raffleColumnList: raffleColumnList,
                        status: RAFFLE_STATE.ING,
                        participantsInfo: [],
                        winnersInfo: [],
                    });

                    render.raffleList();

                    api.raffleCreate(RaffleListArray.length - 1, RaffleListArray[RaffleListArray.length - 1]);
                });

                // close button event
                oCommon.addDelegateTarget(document, 'click', 'a.close', (event) => {
                    event.target.closest('.top-container').style.display = 'none';
                    document.querySelector(selectorMap.mainDiv).style.display = '';
                    render.raffleList();
                });

                oCommon.addDelegateTarget(document, 'click', `${selectorMap.systemSetting} .delete-all`, (event) => {
                    if (!confirm('추첨 리스트 전체를 삭제하시겠습니까?')) {
                        return false;
                    }

                    document.querySelector(selectorMap.systemSetting).style.display = 'none';
                    RaffleListArray.length = 0;
                    render.raffleList();
                });

                // 1초마다 추첨 리스트 갱신
                setInterval(() => {
                    render.raffleListRefresh();
                }, 1000);

                // 추첨 신청 열 제거
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.columnDeleteBtn}`, (event) => {
                    if (document.querySelectorAll(selectorMap.raffleAddColumnInputDiv).length === 1) {
                        oModal.errorModalShow('최소 1개 이상의 항목은 필요합니다.', (e) => {});
                        return;
                    }
                    event.target.closest(selectorMap.raffleAddColumnInputDiv).remove();
                });

                // 추첨 신청 열 추가
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.columnAddBtn}`, (event) => {
                    if (document.querySelectorAll(selectorMap.raffleAddColumnInputDiv).length === 5) {
                        oModal.errorModalShow('최대 5개까지만 추가 가능합니다.', (e) => {});
                        return;
                    }
                    event.target.closest(selectorMap.raffleAddColumnDiv).insertAdjacentHTML('beforeend', template.columnInputDiv());
                });

                // 추첨 마감 처리 이벤트
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.raffleFinishingBtn}`, (event) => {
                    const {raffleNo} = event.target.dataset;

                    RaffleListArray[raffleNo].status = RAFFLE_STATE.DEAD_LINE_COMPLETED;

                    event.target.closest('td').innerHTML = template.finishingText();

                    api.raffleStateChange(raffleNo, RaffleListArray[raffleNo]);
                });

                // 추첨 상세보기 / 추첨완료 버튼 이벤트
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.raffleDetailViewBtn}`, (event) => {
                    const {raffleNo} = event.target.dataset;
                    render.raffleDetailViewShowProc(raffleNo);
                });

                // 추첨 상세보기 검색
                document.querySelector(selectorMap.raffleSearchInput).addEventListener('keyup', function () {
                    let searchQuery = this.value.toLowerCase();
                    let rows = Array.from(document.querySelector(selectorMap.raffleDetailInfoTbody).getElementsByTagName('tr'));

                    rows.forEach(row => {
                        let text = row.textContent.toLowerCase();
                        row.style.display = text.indexOf(searchQuery) !== -1 ? '' : 'none';
                    });

                    event.raffleParticipantsIsAllCheck();
                });

                // 숫자 입력만 가능하도록 처리
                oCommon.addDelegateTarget(document, 'input', `.only-number`, (event) => {
                    event.target.value = event.target.value.replace(/[^0-9]/g, '');
                });

                // 추첨 인원 전체 선택 / 해제 이벤트
                oCommon.addDelegateTarget(document, 'change', `${selectorMap.raffleParticipantsAllCheck}`, (e) => {
                    event.raffleParticipantsCheckProc(e.target.checked);
                });

                // 추첨 인원 개별 선택 / 해제 이벤트
                oCommon.addDelegateTarget(document, 'change', `${selectorMap.raffleParticipantsCheck}`, (e) => {
                    event.raffleParticipantsIsAllCheck();
                });

                // 추첨 시작 버튼 클릭 이벤트
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.raffleStartBtn}`, (e) => {
                    const {raffleNo} = e.target.dataset;

                    // if (!confirm('선택된 참여자로 추첨을 시작하시겠습니까?')) {
                    //     return;
                    // }

                    event.raffleProc(raffleNo);
                });

                // 재추첨 시작 버튼 클릭 이벤트
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.raffleReStartBtn}`, (e) => {
                    const {raffleNo} = e.target.dataset;
                    const selectRaffleInfo = RaffleListArray[raffleNo];

                    if (!selectRaffleInfo) {
                        oModal.errorModalShow('해당 추첨 정보가 없습니다.', (e) => {
                            event.screenReset();
                        });
                        return;
                    }
                    // if (!confirm('재추첨을 하시겠습니까?\n기존 추첨 정보는 삭제됩니다.')) {
                    //     return;
                    // }

                    selectRaffleInfo.winnersInfo = [];
                    selectRaffleInfo.status = RAFFLE_STATE.DEAD_LINE_COMPLETED;

                    api.raffleWinnerReset(raffleNo, selectRaffleInfo);
                    render.raffleDetailViewShowProc(raffleNo);
                });
            },
            raffleParticipantsCheckProc: (isCheck) => {
                document.querySelectorAll(selectorMap.raffleParticipantsCheck).forEach((element) => {
                    if (element.closest('tr').style.display !== 'none') {
                        element.checked = isCheck;
                    }
                });
            },
            raffleParticipantsIsAllCheck: () => {
                let isAllCheck = true;
                document.querySelectorAll(`${selectorMap.raffleParticipantsCheck}`).forEach((element) => {
                    if (element.closest('tr').style.display !== 'none' && !element.checked) {
                        isAllCheck = false;
                    }
                });

                document.querySelector(selectorMap.raffleParticipantsAllCheck).checked = isAllCheck;
            },
            raffleProc: (raffleNo) => {
                const selectRaffleInfo = RaffleListArray[raffleNo];
                const {participantsInfo} = selectRaffleInfo;
                const raffleInputCount = document.querySelector(selectorMap.raffleInputCount).value.trim();
                const raffleCheckCount = document.querySelectorAll(`${selectorMap.raffleParticipantsCheck}:checked`).length;
                const checkParticipants = document.querySelectorAll(`${selectorMap.raffleParticipantsCheck}:checked`);
                let winnersInfo = [];

                if (raffleInputCount === '') {
                    oModal.errorModalShow('추첨 인원을 입력해주세요.', (e) => {
                        document.querySelector(selectorMap.raffleInputCount).focus();
                    });
                    return;
                }
                if (raffleInputCount <= 0) {
                    oModal.errorModalShow('추첨 인원을 1명 이상 입력해주세요.', (e) => {
                        document.querySelector(selectorMap.raffleInputCount).focus();
                    });
                    return;
                }
                if (raffleInputCount > participantsInfo.length) {
                    oModal.errorModalShow('추첨 인원이 참가자 수보다 많습니다.', (e) => {
                        document.querySelector(selectorMap.raffleInputCount).focus();
                    });
                    return;
                }
                if (raffleInputCount > raffleCheckCount) {
                    oModal.errorModalShow('선택된 참가자 수보다 추첨 인원이 많습니다.', (e) => {
                        document.querySelector(selectorMap.raffleInputCount).focus();
                    });
                    return;
                }

                for (let i = 0; i < raffleInputCount; i++) {
                    while (true) {
                        const randomNumber = Math.floor(Math.random() * raffleCheckCount);
                        if (checkParticipants.hasOwnProperty(randomNumber)) {
                            const index = checkParticipants[randomNumber].value;
                            // 이미 같은 데이터가 존재하는지
                            if (winnersInfo.filter((info) => info.userId === participantsInfo[index].userId).length > 0) {
                                continue;
                            }
                            winnersInfo.push(participantsInfo[index]);
                            break;
                        }
                    }
                }

                selectRaffleInfo.winnersInfo = winnersInfo;
                selectRaffleInfo.status = RAFFLE_STATE.FINISH;
                render.raffleDetailViewShowProc(raffleNo);

                api.raffleWinnerAlimSend(winnersInfo);
            },
            screenReset: () => {
                document.querySelectorAll('.top-container').forEach((element) => {
                    element.style.display = 'none';
                });
                render.raffleList();
            },
            addRaffleParticipant: (messageObj, userId) => {
                const messageJson = JSON.parse(messageObj);
                const {raffleNo, nickName, grade, customColumn} = messageJson;

                if (!RaffleListArray[raffleNo]) {
                    return;
                }

                if (RaffleListArray[raffleNo].participantsInfo.filter((info) => info.userId === userId).length > 0) {
                    RaffleListArray[raffleNo].participantsInfo.filter((info) => {
                        if (info.userId === userId) {
                            info.customColumn = customColumn;
                        }
                    });
                } else {
                    RaffleListArray[raffleNo].participantsInfo.push({
                        userId, nickName, grade, customColumn,
                    });
                }

                RaffleListArray[raffleNo].headCount = RaffleListArray[raffleNo].participantsInfo.length;
            },
        };
    })();

    const api = (() => {
        return {
            raffleCreate: (index, raffleInfo) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.CREATE_RAFFLE, JSON.stringify({
                    raffleNo: index,
                    raffleName: raffleInfo.raffleName,
                    raffleColumnList: raffleInfo.raffleColumnList,
                    status: raffleInfo.status,
                    headCount: raffleInfo.headCount,
                }));
            },
            raffleStateChange: (raffleIndex, raffleInfo) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.CHANGE_RAFFLE_INFO, JSON.stringify({
                    raffleNo: raffleIndex,
                    raffleName: raffleInfo.raffleName,
                    raffleColumnList: raffleInfo.raffleColumnList,
                    status: raffleInfo.status,
                    headCount: raffleInfo.headCount,
                }));
            },
            raffleWinnerReset: (raffleIndex, raffleInfo) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.CHANGE_RAFFLE_INFO, JSON.stringify({
                    raffleNo: raffleIndex,
                    raffleName: raffleInfo.raffleName,
                    raffleColumnList: raffleInfo.raffleColumnList,
                    status: raffleInfo.status,
                    headCount: raffleInfo.headCount,
                    winnersInfo: [],
                }));
            },
            raffleWinnerAlimSend: (winnersInfo) => {
                winnersInfo.forEach((info) => {
                    const {userId} = info;
                    oAfreeca.api.broadcastWhisper(userId, CUSTOM_ACTION_CODE.SEND_WINNER_ALIM, null);
                });
            },
        };
    })();

    const messageListener = (() => {
        return {
            init: () => {
                oAfreeca.api.broadcastListener((action, message, fromId) => {
                    if (action === CUSTOM_ACTION_CODE.ADD_RAFFLE_PARTICIPANT) {
                        event.addRaffleParticipant(message, fromId);
                    } else if (action === CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO) {
                        const message = RaffleListArray.map((raffleInfo, index) => {
                            return {
                                raffleNo: index,
                                raffleName: raffleInfo.raffleName,
                                status: raffleInfo.status,
                                isParticipants: raffleInfo.participantsInfo.some((info) => info.userId === fromId),
                                raffleColumnList: raffleInfo.raffleColumnList,
                            };
                        });
                        if (message.length) {
                            oAfreeca.api.broadcastWhisper(fromId, CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO, JSON.stringify(message));
                        }
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
            //     raffleColumnList: ['티어', '디스코드', '롤아이디', 'test1', 'test2'],
            //     status: RAFFLE_STATE.ING,
            //     participantsInfo: [
            //         {
            //             userId: 'ghtyru01',
            //             nickName: 'ghtyru01',
            //             grade: USER_GRADE.VIP,
            //             customColumn: [
            //                 '브론즈',
            //                 'ghtyru231',
            //                 '올라프장인',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru02',
            //             nickName: 'ghtyru02',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru03',
            //             nickName: 'ghtyru03',
            //             grade: USER_GRADE.NORMAL,
            //             customColumn: [
            //                 '다이아몬드',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru04',
            //             nickName: 'ghtyru04',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru05',
            //             nickName: 'ghtyru05',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru06',
            //             nickName: 'ghtyru06',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '다이아몬드',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru07',
            //             nickName: 'ghtyru07',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru08',
            //             nickName: 'ghtyru08',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru09',
            //             nickName: 'ghtyru09',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru10',
            //             nickName: 'ghtyru10',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //     ],
            //     winnersInfo: [],
            // });
            // RaffleListArray.push({
            //     raffleName: '테스트2',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디'],
            //     status: RAFFLE_STATE.DEAD_LINE_COMPLETED,
            //     participantsInfo: [
            //         {
            //             userId: 'ghtyru01',
            //             nickName: 'ghtyru01',
            //             grade: USER_GRADE.NORMAL,
            //             customColumn: [
            //                 'column1',
            //                 'column2',
            //                 'column3',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru02',
            //             nickName: 'ghtyru02',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 'column1',
            //                 'column2',
            //                 'column3',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru03',
            //             nickName: 'ghtyru03',
            //             grade: USER_GRADE.VIP,
            //             customColumn: [
            //                 'column1',
            //                 'column2',
            //                 'column3',
            //             ],
            //         },
            //     ],
            // });
            // RaffleListArray.push({
            //     raffleName: '테스트3',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디', 'test1', 'test2'],
            //     status: RAFFLE_STATE.FINISH,
            //     participantsInfo: [
            //         {
            //             userId: 'ghtyru01',
            //             nickName: 'ghtyru01',
            //             grade: USER_GRADE.VIP,
            //             customColumn: [
            //                 '브론즈',
            //                 'ghtyru231',
            //                 '올라프장인',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru02',
            //             nickName: 'ghtyru02',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru03',
            //             nickName: 'ghtyru03',
            //             grade: USER_GRADE.NORMAL,
            //             customColumn: [
            //                 '다이아몬드',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru04',
            //             nickName: 'ghtyru04',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru05',
            //             nickName: 'ghtyru05',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru06',
            //             nickName: 'ghtyru06',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '다이아몬드',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru07',
            //             nickName: 'ghtyru07',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru08',
            //             nickName: 'ghtyru08',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru09',
            //             nickName: 'ghtyru09',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru10',
            //             nickName: 'ghtyru10',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //     ],
            //     winnersInfo: [
            //         {
            //             userId: 'ghtyru04',
            //             nickName: 'ghtyru04',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //         {
            //             userId: 'ghtyru05',
            //             nickName: 'ghtyru05',
            //             grade: USER_GRADE.FAN,
            //             customColumn: [
            //                 '실버',
            //                 '다드루와',
            //                 '다드루와',
            //                 'column4',
            //                 'column5',
            //             ],
            //         },
            //     ],
            // });
            // RaffleListArray.push({
            //     raffleName: '참가자 없음',
            //     raffleColumnList: ['티어', '디스코드', '롤아이디'],
            //     status: RAFFLE_STATE.ING,
            //     participantsInfo: [],
            // });
            render.raffleList();
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
