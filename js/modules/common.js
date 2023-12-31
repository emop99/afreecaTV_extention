import {USER_GRADE} from "./config.js";

const oCommon = (() => {
    'use strict';

    return {
        /**
         * 버블이나 캡쳐을 이용한 이벤트 리스터를 등록
         * @param {*} target
         * @param {string} eventName 이벤트 이름
         * @param {string} elementSelector 셀렉터
         * @param {object} handler 함수
         * @param {boolean} [isCapture=false] true: 버블,false: 캡쳐
         */
        addDelegateTarget: (
            target,
            eventName,
            elementSelector,
            handler,
            isCapture = false
        ) => {
            const currentThis = this;
            target.addEventListener(
                eventName,
                function (event) {
                    for (
                        let target = event.target;
                        target && target != currentThis;
                        target = target.parentNode
                    ) {
                        if (target.matches && target.matches(elementSelector)) {
                            handler.call(target, event);
                            break;
                        }
                    }
                },
                isCapture
            );
        },
        /**
         * 딜레이 지정
         * @param ms {int}
         * @returns {Promise<unknown>}
         */
        sleep: (ms) => {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        /**
         * ID 에서 (숫자) 제거 처리
         * @param id {string}
         * @returns {string}
         */
        idEscape: (id) => {
            return id.replace(/\(\d+\)/g, '');
        },
        /**
         * 문자열의 바이트 크기를 반환
         * @param str {string}
         * @returns {number}
         */
        getByteSize: (str) => {
            return (new TextEncoder().encode(str)).length;
        },
        /**
         * 태그 문자열을 이스케이프 처리
         * @param tagString {string}
         * @returns {string}
         */
        tagEscape: function (tagString) {
            let escapeText = '';
            if (tagString) {
                escapeText = tagString.replace(/\</g, '&lt;');
                escapeText = escapeText.replace(/\>/g, '&gt;');
                escapeText = escapeText.replace(/(\n|\r\n)/g, '<br>');
            }
            return escapeText;
        },
        /**
         * 유저 등급 정보 가져오기
         * @param isManager {boolean}
         * @param isTopFan {boolean}
         * @param isFan {boolean}
         * @return {number}
         */
        getGradeInfo: (isManager, isTopFan, isFan) => {
            if (isManager) {
                return USER_GRADE.MANAGER;
            } else if (isTopFan) {
                return USER_GRADE.VIP;
            } else if (isFan) {
                return USER_GRADE.FAN;
            }
            return USER_GRADE.NORMAL;
        },
    };
})();

export default oCommon;
