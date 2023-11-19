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
    };
})();

export default oCommon;
