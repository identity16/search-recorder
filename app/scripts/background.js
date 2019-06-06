// 설치 시,
chrome.runtime.onInstalled.addListener(function () {
});

// 페이지 로드 시, 
chrome.webNavigation.onCompleted.addListener(function (data) {
    var parsedUrl = getJsonFromUrl(data.url);
    console.log('history: ' + parsedUrl['q']);
}, { url: [{ hostContains: 'www.google.', pathSuffix: 'search' }] });

// URL에서 querystrinng을 읽어 JSON 형태로 리턴
function getJsonFromUrl(url) {
    if (!url) url = location.href;
    var question = url.indexOf("?");
    var hash = url.indexOf("#");
    if (hash == -1 && question == -1) return {};
    if (hash == -1) hash = url.length;
    var query = question == -1 || hash == question + 1 ? url.substring(hash) :
        url.substring(question + 1, hash);
    var result = {};
    query.split("&").forEach(function (part) {
        if (!part) return;
        part = part.split("+").join(" "); // replace every + with space, regexp-free version
        var eq = part.indexOf("=");
        var key = eq > -1 ? part.substr(0, eq) : part;
        var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
        var from = key.indexOf("[");
        if (from == -1) result[decodeURIComponent(key)] = val;
        else {
            var to = key.indexOf("]", from);
            var index = decodeURIComponent(key.substring(from + 1, to));
            key = decodeURIComponent(key.substring(0, from));
            if (!result[key]) result[key] = [];
            if (!index) result[key].push(val);
            else result[key][index] = val;
        }
    });
    return result;
}
