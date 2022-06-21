

// let bookmarksData = [];

let bookmarks = function () {
    return chrome.bookmarks.getTree().then(function (res) {
        // console.log(res);
        return res;
    })
    // return bookmarksData;
};

export default bookmarks;