var isRecording = false;

// 설치 시,
chrome.runtime.onInstalled.addListener(function () {
});

// 페이지 로드 시, 
chrome.webNavigation.onCompleted.addListener(function (data) {
    if(!isRecording) return;

    var parsedUrl = getJsonFromUrl(data.url);
    console.log('history: ' + parsedUrl['q']);
}, { url: [{ hostContains: 'www.google.', pathSuffix: 'search' }] });


// 아이콘 클릭 시,
chrome.browserAction.onClicked.addListener(function() {
    if(isRecording) {   // 기록 종료
        // TODO: 팝업으로 기록된 내용 표시
        // TODO: 변수 초기화
    }

    isRecording = !isRecording;
    
    // 상태에 따라 아이콘 변경
    var iconName = isRecording ? 'icon-on' : 'icon-off';
    chrome.browserAction.setIcon({
        path: {
            "16": "images/"+ iconName +"-16.png",
            "32": "images/"+ iconName +"-32.png",
            "48": "images/"+ iconName +"-48.png",
            "64": "images/"+ iconName +"-64.png"
        }
    })
})

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
