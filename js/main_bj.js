import {oConfig, RAFFLE_INFO_DEFAULT_DATA_SET, RAFFLE_STATE, USER_GRADE, USER_GRADE_NAME, WEPL_RUNNING_MESSAGE} from './modules/config.js?v=CACHE_1.0.2';
import oCommon from "./modules/common.js?v=CACHE_1.0.2";
import {ACTION_CODE, CUSTOM_ACTION_CODE, oAfreeca} from "./modules/afreeca.js?v=CACHE_1.0.2";
import oModal from "./modules/modal.js?v=CACHE_1.0.2";

const oMain = (() => {
    'use strict';

    const RaffleListArray = [];
    const selectorMap = {
        mainDiv: '#main-div',
        systemSetting: '.system-setting',
        raffleAddDiv: '#raffle-add-div',
        raffleDetailInfoDiv: '#raffle-detail-info-div',
        raffleDetailInfoTitleHeaderDiv: '#raffle-detail-info-div .header-title h2',
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
        raffleDetailInfoFooterButtonDiv: '#raffle-detail-info-div .common-footer .result-btn',
        raffleDetailInfoFooterWinnerInputFormDiv: '#raffle-detail-info-div .common-footer .lottery-number-from',
        raffleDetailInfoTable: '#raffle-detail-info-div #raffle-detail-info-table',
        raffleDetailInfoThead: '#raffle-detail-info-div #raffle-detail-info-thead',
        raffleDetailInfoTbody: '#raffle-detail-info-div #raffle-detail-info-tbody',
        raffleSearchInput: '#raffle-detail-info-div #raffle-search-input',
        raffleParticipantsAllCheck: '#raffle-detail-info-div .participants-all-check',
        raffleParticipantsCheck: '#raffle-detail-info-div .participants-check',
        raffleStartBtn: '#raffle-detail-info-div .raffle-start-btn',
        raffleReStartBtn: '#raffle-detail-info-div .raffle-restart-btn',
        raffleInputCount: '#raffle-detail-info-div .raffle-input-count',
        copyButton: '.copy-button',
    };
    const userGradeClassMap = {
        1: 'badge-gray-1',
        2: 'badge-primary-2',
        3: 'badge-primary-1',
        4: 'badge-accent-1',
    };

    const template = (() => {
        return {
            emptyRaffleList: () => {
                return `<tr><td colspan="5">추첨 리스트가 없습니다.</td></tr>`;
            },
            raffleList: () => {
                return RaffleListArray.map((row, index) => {
                    const raffleNo = index;
                    const {raffleName, status, headCount} = row;
                    return `<tr>
                                <td>${raffleNo + 1}</td>
                                <td>${raffleName}</td>
                                <td>${headCount.toLocaleString('ko')}</td>
                                <td>
                                    ${status === RAFFLE_STATE.ING ? `<a href="javascript:;" class="list-close-btn raffle-finishing-btn" data-raffle-no="${raffleNo}"><img src="./images/icon-minus-box-fill.svg" alt="icon-minus-box" data-raffle-no="${raffleNo}"></a>` :
                        status === RAFFLE_STATE.DEAD_LINE_COMPLETED || status === RAFFLE_STATE.FINISH ? template.finishingText() : ''}
                                </td>
                                <td>
                                    ${status === RAFFLE_STATE.ING || status === RAFFLE_STATE.DEAD_LINE_COMPLETED ?
                        `<a href="javascript:;" class="badge-primary-1 raffle-detail-view-btn" data-raffle-no="${raffleNo}">상세보기</a>` :
                        status === RAFFLE_STATE.FINISH ? `<a href="javascript:;" class="badge-primary-2 raffle-detail-view-btn" data-raffle-no="${raffleNo}">추첨완료</a>` :
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
                            ${raffleColumnList.map((column) => `<th>${oCommon.tagEscape(column)}</th>`).join('')}
                        </tr>`;
            },
            raffleNotFinishDetailInfoTbody: (raffleInfo) => {
                const {participantsInfo, raffleColumnList} = raffleInfo;

                if (participantsInfo.length === 0) {
                    return `<tr><td colspan="${raffleColumnList.length + 4}">참가자가 없습니다.</td></tr>`;
                }

                return `${participantsInfo.map((info, index) => `
                        <tr>
                            <td class="fix-column"><input class="form-check-input large-checkbox participants-check" type="checkbox" value="${index}"></td>
                            <td class="">${index + 1}</td>
                            <td class="">${info.nickName}</td>
                            <td class=""><p class="${userGradeClassMap[info.grade]}">${USER_GRADE_NAME[info.grade]}</p></td>
                            ${info.customColumn.map((column) => `<td class="">${oCommon.tagEscape(column)}</td>`).join('')}
                        </tr>`).join('')}`;
            },
            raffleFinishDetailInfoThead: (raffleInfo) => {
                const {raffleColumnList} = raffleInfo;
                return `<tr class="table-head">
                            <th class="fix-column">No.</th>
                            <th class="">닉네임</th>
                            <th class="">등급</th>
                            ${raffleColumnList.map((column) => `<th class="">${oCommon.tagEscape(column)}</th>`).join('')}
                        </tr>`;
            },
            raffleFinishDetailInfoTbody: (raffleInfo) => {
                return raffleInfo.winnersInfo.map((info, index) => `
                        <tr>
                            <td class="">${index + 1}</td>
                            <td class="">${info.nickName}</td>
                            <td class=""><p class="${userGradeClassMap[info.grade]}">${USER_GRADE_NAME[info.grade]}</p></td>
                            ${info.customColumn.map((column) => `<td class="">${oCommon.tagEscape(column)}</td>`).join('')}
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
                document.querySelectorAll(selectorMap.raffleAddColumnInputDiv).forEach((element) => {
                    element.remove();
                });
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
                document.querySelector(selectorMap.raffleDetailInfoTitleHeaderDiv).innerHTML = `${selectRaffleInfo.raffleName}`;
                document.querySelector(selectorMap.raffleSearchInput).value = '';
                document.querySelector(selectorMap.raffleDetailInfoTable).style.width = (selectRaffleInfo.raffleColumnList.length + 4) * 130 >= 500 ? `${(selectRaffleInfo.raffleColumnList.length + 3) * 130}px` : `100%`;

                if (selectRaffleInfo.status === RAFFLE_STATE.ING || selectRaffleInfo.status === RAFFLE_STATE.DEAD_LINE_COMPLETED) {
                    document.querySelector(selectorMap.raffleDetailInfoThead).innerHTML = template.raffleNotFinishDetailInfoThead(selectRaffleInfo);
                    document.querySelector(selectorMap.raffleDetailInfoTbody).innerHTML = template.raffleNotFinishDetailInfoTbody(selectRaffleInfo);
                    document.querySelector(selectorMap.raffleDetailInfoFooterButtonDiv).innerHTML = template.raffleStartBtn(raffleNo);
                    document.querySelector(selectorMap.raffleDetailInfoFooterWinnerInputFormDiv).style.display = '';
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} div`).classList.add('application-list-bj');
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} div`).classList.remove('random-lottery-bj');
                    document.querySelector(selectorMap.raffleParticipantsAllCheck).checked = true;
                    event.raffleParticipantsCheckProc(true);
                } else if (selectRaffleInfo.status === RAFFLE_STATE.FINISH) {
                    document.querySelector(selectorMap.raffleDetailInfoThead).innerHTML = template.raffleFinishDetailInfoThead(selectRaffleInfo);
                    document.querySelector(selectorMap.raffleDetailInfoTbody).innerHTML = template.raffleFinishDetailInfoTbody(selectRaffleInfo);
                    document.querySelector(selectorMap.raffleDetailInfoFooterButtonDiv).innerHTML = template.raffleReStartBtn(raffleNo);
                    document.querySelector(selectorMap.raffleDetailInfoFooterWinnerInputFormDiv).style.display = 'none';
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} div`).classList.remove('application-list-bj');
                    document.querySelector(`${selectorMap.raffleDetailInfoDiv} div`).classList.add('random-lottery-bj');
                }
            },
        };
    })();

    const event = (() => {
        return {
            init: () => {
                api.raffleAllReset();

                // 추첨 추가하기 버튼 클릭 이벤트
                document.querySelector(selectorMap.raffleAddShowBtn).addEventListener('click', () => {
                    if (RaffleListArray.length >= 5) {
                        oModal.errorModalShow('추첨은 최대 5개까지만 생성 가능합니다.', (e) => {
                        });
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
                        raffleNo: 0,
                        participantsInfo: [],
                        winnersInfo: [],
                        headCount: 0,
                        isParticipants: 0,
                        isWinner: 0,
                        raffleName,
                        raffleColumnList,
                        status: RAFFLE_STATE.ING,
                    });
                    RaffleListArray[RaffleListArray.length - 1].raffleNo = RaffleListArray.length - 1;

                    if (oConfig.isDev()) {
                        console.log('New RaffleListArray');
                        console.log(RaffleListArray);
                        console.table(RaffleListArray[RaffleListArray.length - 1]);
                        console.log(`=============================================`);
                    }

                    render.raffleList();

                    api.raffleCreate(RaffleListArray[RaffleListArray.length - 1]);
                });

                // close button event
                oCommon.addDelegateTarget(document, 'click', 'a.close', (event) => {
                    event.target.closest('.top-container').style.display = 'none';
                    document.querySelector(selectorMap.mainDiv).style.display = '';
                    render.raffleList();
                });

                oCommon.addDelegateTarget(document, 'click', `${selectorMap.systemSetting} .delete-all`, (event) => {
                    oModal.confirmModal('추첨 리스트 전체를 삭제하시겠습니까?', '삭제', '취소', (e) => {
                        document.querySelector(selectorMap.systemSetting).style.display = 'none';
                        RaffleListArray.length = 0;
                        render.raffleList();
                        api.raffleAllReset();
                    }, (e) => {
                    });
                });

                // 1초마다 추첨 리스트 갱신
                setInterval(() => {
                    render.raffleListRefresh();
                }, 1000);

                // 입력 최대 글자수 제한
                oCommon.addDelegateTarget(document, 'keyup', `${selectorMap.raffleAddDiv} input`, (e) => {
                    const maxLength = e.target.dataset.maxLength || 20;
                    e.target.value = e.target.value.slice(0, maxLength);
                });
                oCommon.addDelegateTarget(document, 'input', `${selectorMap.raffleAddDiv} input`, (e) => {
                    const maxLength = e.target.dataset.maxLength || 20;
                    e.target.value = e.target.value.slice(0, maxLength);
                });

                // form submit 방지
                oCommon.addDelegateTarget(document, 'submit', 'form', (e) => {
                    e.preventDefault();
                });

                // 추첨 신청 열 제거
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.columnDeleteBtn}`, (event) => {
                    if (document.querySelectorAll(selectorMap.raffleAddColumnInputDiv).length === 1) {
                        oModal.errorModalShow('최소 1개 이상의 항목은 필요합니다.', (e) => {
                        });
                        return;
                    }
                    event.target.closest(selectorMap.raffleAddColumnInputDiv).remove();
                });

                // 추첨 신청 열 추가
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.columnAddBtn}`, (event) => {
                    if (document.querySelectorAll(selectorMap.raffleAddColumnInputDiv).length === 5) {
                        oModal.errorModalShow('최대 5개까지만 추가 가능합니다.', (e) => {
                        });
                        return;
                    }
                    event.target.closest(selectorMap.raffleAddColumnDiv).insertAdjacentHTML('beforeend', template.columnInputDiv());
                });

                // 추첨 마감 처리 이벤트
                oCommon.addDelegateTarget(document, 'click', `${selectorMap.raffleFinishingBtn}`, (event) => {
                    const {raffleNo} = event.target.dataset;

                    RaffleListArray[raffleNo].status = RAFFLE_STATE.DEAD_LINE_COMPLETED;

                    event.target.closest('td').innerHTML = template.finishingText();

                    api.raffleStateChange(raffleNo, RaffleListArray[raffleNo].status);
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

                    oModal.confirmModal('선택된 참여자로 추첨을 시작하시겠습니까?', '시작', '취소', (e) => {
                        event.raffleProc(raffleNo);
                    }, (e) => {
                    });
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

                    oModal.confirmModal("재추첨을 하시겠습니까?<br>기존 추첨 정보는 삭제됩니다.", '재추첨', '취소', (e) => {
                        selectRaffleInfo.winnersInfo = [];
                        selectRaffleInfo.status = RAFFLE_STATE.DEAD_LINE_COMPLETED;

                        api.raffleWinnerReset(raffleNo);
                        render.raffleDetailViewShowProc(raffleNo);
                    }, (e) => {
                    });
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
                if (raffleInputCount > 10) {
                    oModal.errorModalShow('추첨 인원은 최대 10명까지만 가능합니다.', (e) => {
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
                        const randomNumber = Math.floor(Math.random() * participantsInfo.length);
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

                async function apiSend() {
                    api.raffleStateChange(raffleNo, RAFFLE_STATE.FINISH);
                    await oCommon.sleep(100);
                    for (const winnersInfoRow of winnersInfo) {
                        api.raffleWinnerAlimSend(raffleNo, winnersInfoRow);
                        await oCommon.sleep(100);
                    }
                }

                apiSend().then(() => {
                    render.raffleDetailViewShowProc(raffleNo);
                });
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
                    // 이미 존재하는 유저 정보라면 업데이트
                    RaffleListArray[raffleNo].participantsInfo.filter((info) => {
                        if (info.userId === userId) {
                            info.customColumn = customColumn;
                        }
                    });
                } else {
                    // 존재하지 않는 유저 정보라면 추가
                    RaffleListArray[raffleNo].participantsInfo.push({
                        userId, nickName, grade, customColumn,
                    });
                }

                RaffleListArray[raffleNo].headCount = RaffleListArray[raffleNo].participantsInfo.length;

                if (oConfig.isDev()) {
                    console.log(`Add Raffle Participant`);
                    console.log(RaffleListArray);
                    console.table(RaffleListArray[raffleNo]);
                    console.log(`=============================================`);
                }
            },
        };
    })();

    const api = (() => {
        return {
            /**
             * 추첨 생성
             * @param raffleInfo {RAFFLE_INFO_DEFAULT_DATA_SET}
             */
            raffleCreate: (raffleInfo) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.CREATE_RAFFLE, JSON.stringify({
                    raffleNo: raffleInfo.raffleNo,
                    raffleName: raffleInfo.raffleName,
                    status: raffleInfo.status,
                    raffleColumnList: raffleInfo.raffleColumnList,
                }));
            },
            /**
             * 추첨 상태 변경
             * @param raffleNo {int}
             * @param status {RAFFLE_STATE}
             */
            raffleStateChange: (raffleNo, status) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.CHANGE_RAFFLE_INFO, JSON.stringify({
                    raffleNo,
                    status,
                }));
            },
            /**
             * 추첨 재추첨 처리를 위한 당첨 정보 초기화
             * @param raffleNo {int}
             */
            raffleWinnerReset: (raffleNo) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.CHANGE_RAFFLE_INFO, JSON.stringify({
                    raffleNo,
                    status: RAFFLE_STATE.DEAD_LINE_COMPLETED,
                    winnersInfo: [],
                    isWinner: 0,
                }));
            },
            /**
             * 추첨 당첨자 알림
             * @param raffleNo {int}
             * @param winnersInfo {RAFFLE_WINNERS_INFO_DEFAULT_DATA_SET}
             */
            raffleWinnerAlimSend: (raffleNo, winnersInfo) => {
                const {userId} = winnersInfo;
                oAfreeca.api.broadcastWhisper(oCommon.idEscape(userId), CUSTOM_ACTION_CODE.SEND_WINNER_ALIM, JSON.stringify({
                    raffleNo
                }));
            },
            /**
             * 추첨 인원 변경
             * @param raffleNo {int}
             * @param headCount {int}
             */
            raffleHeadCountChange: (raffleNo, headCount) => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.CHANGE_RAFFLE_HEAD_COUNT, JSON.stringify({
                    raffleNo,
                    headCount,
                }));
            },
            /**
             * 추첨 전체 초기화
             */
            raffleAllReset: () => {
                oAfreeca.api.broadcastSend(CUSTOM_ACTION_CODE.RAFFLE_ALL_RESET, null);
            },
            /**
             * WEPL 접속 유저 정보 전송
             * @param userInfoObj {userId: string, userNickname: string, userStatus: Object}
             */
            userInfoSend: (userInfoObj) => {
                const {userId, userNickname, userStatus} = userInfoObj;
                oAfreeca.api.broadcastWhisper(oCommon.idEscape(userId), CUSTOM_ACTION_CODE.LOADING_USER_INFO, JSON.stringify({
                    userId: oCommon.idEscape(userId),
                    userNickname,
                    userStatus,
                }));
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
                    if (action === CUSTOM_ACTION_CODE.ADD_RAFFLE_PARTICIPANT) {
                        // 추첨 참가자 추가
                        const messageJson = JSON.parse(message);
                        const {raffleNo, nickName, grade, customColumn} = messageJson;

                        event.addRaffleParticipant(message, fromId);
                        api.raffleHeadCountChange(raffleNo, RaffleListArray[raffleNo].headCount);
                    } else if (action === CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO) {
                        // 유저 화면 로딩 시 추첨 정보 가져오기
                        const message = RaffleListArray.map((raffleInfo) => {
                            // 최대 Byte 제한으로 인해 정보 최소화
                            return {
                                raffleNo: raffleInfo.raffleNo,
                                raffleName: raffleInfo.raffleName,
                                status: raffleInfo.status,
                                isParticipants: raffleInfo.participantsInfo.some((info) => info.userId === fromId) ? 1 : 0,
                                headCount: raffleInfo.headCount,
                            };
                        });
                        if (message.length) {
                            oAfreeca.api.broadcastWhisper(fromId, CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO, JSON.stringify(message));
                        }
                    } else if (action === CUSTOM_ACTION_CODE.GET_DETAIL_RAFFLE_INFO) {
                        // 추첨 데이터 상세 불러오기
                        const messageJson = JSON.parse(message);
                        const {raffleNo} = messageJson;
                        const raffleInfo = RaffleListArray[raffleNo];

                        if (raffleInfo) {
                            oAfreeca.api.broadcastWhisper(fromId, CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO, JSON.stringify([{
                                raffleNo: raffleInfo.raffleNo,
                                status: raffleInfo.status,
                                raffleColumnList: raffleInfo.raffleColumnList,
                                isParticipants: raffleInfo.participantsInfo.some((info) => info.userId === fromId) ? 1 : 0,
                                participantsInfo: raffleInfo.participantsInfo.filter((info) => info.userId === fromId),
                            }]));
                        }
                    } else if (action === CUSTOM_ACTION_CODE.GET_WINNER_INFO) {
                        // 추첨 당첨자 정보 불러오기
                        const messageJson = JSON.parse(message);
                        const {raffleNo} = messageJson;
                        const raffleInfo = RaffleListArray[raffleNo];

                        if (raffleInfo) {
                            oAfreeca.api.broadcastWhisper(fromId, CUSTOM_ACTION_CODE.LOADING_USER_RAFFLE_INFO, JSON.stringify([{
                                raffleNo: raffleInfo.raffleNo,
                                winnersInfo: raffleInfo.winnersInfo.map((info) => {
                                    return {
                                        userId: info.userId,
                                        nickName: info.nickName,
                                        grade: info.grade,
                                    };
                                }),
                            }]));
                        }
                    }
                });

                oAfreeca.api.chatListen((action, messageObj) => {
                    if (oConfig.isDev()) {
                        console.log(`oAfreeca.api.chatListen`);
                        console.log(`action : ${action}`);
                        console.log(`messageObj : ${messageObj}`);
                        console.log(`====================================================`);
                    }
                    switch (action) {
                        case ACTION_CODE.MESSAGE:
                            if (messageObj.message === WEPL_RUNNING_MESSAGE) {
                                // 닉네임 추출을 위해 WEPL 실행 메시지가 오면 정보 전송
                                api.userInfoSend(messageObj);
                            }
                            break;
                        case ACTION_CODE.USERSTATUS_CHANGED:
                            // 유저 상태 변경 시 정보 전송
                            api.userInfoSend(messageObj);
                            break;
                    }
                });
            },
        };
    })();

    return {
        init: () => {
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
