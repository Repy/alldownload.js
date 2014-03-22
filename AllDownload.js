var Repy;
if(!Repy) Repy = {};

Repy.AllDownload = {};
Repy.AllDownload.Sites = {};

Repy.AllDownload.Startup = function() {
    if (typeof alldownmode == "string")if (alldownmode == "DEBUG"){
        alert(Repy.AllDownload.URLget(alldowntype));
    }
    var ret = Repy.AllDownload.URLget(alldowntype);
    if(ret)location.assign(ret);
}

Repy.AllDownload.URLget = function(type) {
    if (location.hostname.indexOf("youtube.com") != -1) return Repy.AllDownload.Sites.Youtube(type);
    if (location.hostname.indexOf("pandora.tv") != -1) return Repy.AllDownload.Sites.Pandora(type);
    if (location.hostname.indexOf("www.flickr.com") != -1) return Repy.AllDownload.Sites.Flickr(type);
    if (location.hostname.indexOf("photozou.jp") != -1) return Repy.AllDownload.Sites.Photozou(type);
    if (window.photoalbumCls) Repy.AllDownload.Sites.NetCommons(type);
    if (window.photo_urls) Repy.AllDownload.Sites.NetCommons2(type);
}

Repy.AllDownload.Sites.NetCommons = function() {
    var download = function(obj){
        var div = document.createElement("div");
        document.body.appendChild(div);
        for(var i = 0 ; i<obj.photos.length ; i++){
            div.innerHTML=div.innerHTML+"<img src=\""+ obj.photos[i].src +"\" />";
        }
    }
    for(var c in window.photoalbumCls)if(typeof window.photoalbumCls[c] == "object")download(window.photoalbumCls[c]);
    return null;
}

Repy.AllDownload.Sites.NetCommons2 = function() {
    var div = document.createElement("div");
    document.body.appendChild(div);
    for(var i = 0; i < photo_urls.length; i++)if(photo_urls[i]){
        for(var j = 0; j < photo_urls[i].length; j++)if(photo_urls[i][j]){
            div.innerHTML=div.innerHTML+"<img src=\""+ photo_urls[i][j] +"\" />";
        }
    }
}



Repy.AllDownload.Sites.Youtube = function(gettype) {
    var fmt_url_map = ytplayer.config.args.url_encoded_fmt_stream_map;
    var list = fmt_url_map.split(",");
    for(var i = 0;i<list.length;i++){
        var item = list[i];
        var fmt       = item.split("itag=")[1].split("&")[0];
        var type      = item.split("type=")[1].split("&")[0];
        var url       = item.split("url=")[1].split("&")[0];
        var title = encodeURIComponent(ytplayer.config.args.title);
        url = decodeURIComponent(url);
        
        if(typeof gettype != "string")
            return url  + "&title=" + title;
        if(type.indexOf(gettype)>0)
            return url  + "&title=" + title;
    }
};

Repy.AllDownload.Sites.Pandora = function() {
    return vod.replace("flvg", "flvorgx");
}

Repy.AllDownload.Sites.Flickr = function() {
    var req = new XMLHttpRequest();
    location.href.match(/\d+/g);
    var pid = RegExp.lastMatch;
    req.open('GET', 'http://www.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key=dbe0ad6f572dd896b0c78eca94e6997f&photo_id=' + pid, false);
    req.send(null);
    eval("var res = " + req.responseText + ";");
    if (res.stat == "ok") {
        return (res.sizes.size[res.sizes.size.length - 1].source.replace(".jpg", "_d.jpg"));
    }
    return false;
}

Repy.AllDownload.Sites.Photozou = function() {
    var req = new XMLHttpRequest();
    req.open('GET', location.href.replace("show", "photo_only"), false);
    req.send(null);
    return req.responseText.match(/http:\S+download=yes/);
}

Repy.AllDownload.Startup();


/*
javascript:
(function(){
var js = document.createElement("script");
js.type = "text/javascript";
js.charset = "utf-8";
js.src = "https://bitbucket.org/repy/alldownload.js/raw/master/AllDownload.js";
document.body.appendChild(js);
})();
*/

/*
javascript:
var alldownmode = "DEBUG";
(function(){
var js = document.createElement("script");
js.type = "text/javascript";
js.charset = "utf-8";
js.src = "https://bitbucket.org/repy/alldownload.js/raw/master/AllDownload.js";
document.body.appendChild(js);
})();
*/
