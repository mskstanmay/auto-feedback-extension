let isActive = false;
let autoOffTimer = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'toggleExtension') {
        isActive = message.value;
        sendResponse({ status: isActive });
    }
    if (message.type === 'getStatus') {
        sendResponse({ status: isActive });
    }
});
