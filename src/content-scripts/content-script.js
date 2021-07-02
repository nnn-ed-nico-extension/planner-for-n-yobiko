import * as utils from 'n-yobiko-utils';

chrome.runtime.onMessage.addListener(
    function({ method }, sender, sendResponse) {
        if (method === 'getDetail') {
            sendResponse(utils.getChapterDetail());
        }
    }
);