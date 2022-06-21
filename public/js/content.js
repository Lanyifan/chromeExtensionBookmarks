let bookmarks = function () {
    return chrome.bookmarks.getTree().then(function (res) {
        return res;
    })
};

export default bookmarks;