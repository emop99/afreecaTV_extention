import oCommon from "./common.js";

const oModal = (() => {
    const modalTypeClassMap = {
        errorModal: 'error-modal',
        confirmModal: 'confirm-modal',
    };
    const selectorMap = {
        modalDiv: '#modal-div',
        modalCloseBtn: '.modal-close-btn',
        confirmOkBtn: '.confirm-ok-btn',
        confirmCancelBtn: '.confirm-cancel-btn',
    };

    let thisSuccessCallback = null;
    let thisCloseCallback = null;

    const template = (() => {
        return {
            errorModal: (message) => {
                return `<div class="modal-container">
                            <img src="./images/icon-error-fill.svg" alt="icon-error">
                            <h1>Error!</h1>
                            <p>${message}</p>
                            <a href="javascript:;" class="error-close-btn modal-close-btn">닫기</a>
                        </div>`;
            },
            confirmModal: (message, successBtnName, closeBtnName) => {
                return `<div class="modal-container">
                            <img src="./images/icon-error-fill.svg" alt="icon-error">
                            <h1>확인 요청</h1>
                            <p>${message}</p>
                            <div class="confirm-btns">
                                <a href="javascript:;" class="confirm-ok-btn">${successBtnName}</a>
                                <a href="javascript:;" class="confirm-cancel-btn">${closeBtnName}</a>
                            </div>
                        </div>`;
            }
        };
    })();

    const render = (() => {
        return {
            errorModal: (message, closeCallback) => {
                const modalDiv = document.querySelector(selectorMap.modalDiv);
                modalDiv.style.display = 'flex';
                modalDiv.classList.add(modalTypeClassMap.errorModal);
                modalDiv.innerHTML = template.errorModal(message);
                thisCloseCallback = closeCallback;
            },
            confirmModal: (message, successBtnName, closeBtnName, successCallback, closeCallback) => {
                const modalDiv = document.querySelector(selectorMap.modalDiv);
                modalDiv.style.display = 'flex';
                modalDiv.classList.add(modalTypeClassMap.confirmModal);
                modalDiv.innerHTML = template.confirmModal(message, successBtnName, closeBtnName);
                thisSuccessCallback = successCallback;
                thisCloseCallback = closeCallback;
            },
        };
    })();

    const event = (() => {
        return {
            init: () => {
                const modalDiv = document.querySelector(selectorMap.modalDiv);

                oCommon.addDelegateTarget(modalDiv, 'click', selectorMap.modalCloseBtn, (e) => {
                    document.querySelector(selectorMap.modalDiv).style.display = 'none';
                    document.querySelector(selectorMap.modalDiv).classList.value = '';
                    document.querySelector(selectorMap.modalDiv).innerHTML = '';
                    thisCloseCallback(e);
                });

                oCommon.addDelegateTarget(modalDiv, 'click', selectorMap.confirmOkBtn, (e) => {
                    document.querySelector(selectorMap.modalDiv).style.display = 'none';
                    document.querySelector(selectorMap.modalDiv).classList.value = '';
                    document.querySelector(selectorMap.modalDiv).innerHTML = '';
                    thisSuccessCallback(e);
                });

                oCommon.addDelegateTarget(modalDiv, 'click', selectorMap.confirmCancelBtn, (e) => {
                    document.querySelector(selectorMap.modalDiv).style.display = 'none';
                    document.querySelector(selectorMap.modalDiv).classList.value = '';
                    document.querySelector(selectorMap.modalDiv).innerHTML = '';
                    thisCloseCallback(e);
                });
            },
        };
    })();

    return {
        init: () => {
            event.init();
        },
        errorModalShow: (message, closeCallback) => {
            render.errorModal(message, closeCallback);
        },
        confirmModal: (message, successBtnName, closeBtnName, successCallback, closeCallback) => {
            render.confirmModal(message, successBtnName, closeBtnName, successCallback, closeCallback);
        },
    };
})();

export default oModal;
