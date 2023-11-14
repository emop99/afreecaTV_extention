import oCommon from "./common.js";

const oModal = (() => {
    const modalTypeClassMap = {
        errorModal: 'error-modal',
    };
    const selectorMap = {
        modalDiv: '#modal-div',
        modalCloseBtn: '.modal-close-btn',
    };

    let thisCloseCallback = null;

    const template = (() => {
        return {
            errorModal: (message) => {
                return `<div class="modal-container">
                            <img src="./images/icon-error-fill.svg" alt="icon-error">
                            <h1>Error!</h1>
                            <p>${message}</p>
                            <a href="javascript:;" class="modal-close-btn">닫기</a>
                        </div>`;
            },
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
    };
})();

export default oModal;