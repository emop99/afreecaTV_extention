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
        addDelegateTarget: function (
            target,
            eventName,
            elementSelector,
            handler,
            isCapture = false
        ) {
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
    };
})();

export default oCommon;
