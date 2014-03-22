var Repy;
(function (Repy) {
    Repy.AllDownload = (function () {
        this.Sites = {};

        this.Startup = function (params) {
            for (var key in this.Sites) {
                var plugin = this.Sites[key];
                var param = {};
                if (params !== undefined) {
                    if (params.debug !== undefined && typeof params.debug === "boolean" && params.debug) {
                        plugin.logCallback = function (str) {
                            alert(str);
                        };
                    }
                    if (params[key] !== undefined) {
                        param = params[key];
                    }
                }
                if (plugin.target(param)) {
                    plugin.exec(param);
                }
            }
        };

        var Site = (function () {
            function Site(func) {
                this.target = func.target;
                this.exec = func.exec;
            }
            Site.prototype.log = function (str) {
                if (this.logCallback !== undefined) {
                    this.logCallback(str);
                }
            };
            return Site;
        })();

        this.Sites.Youtube = new Site({
            target: function (param) {
                return window.location.hostname.indexOf("youtube.com") != -1;
            },
            exec: function (param) {
                var url = (function () {
                    var fmt_url_map = window.ytplayer.config.args.url_encoded_fmt_stream_map;
                    var list = fmt_url_map.split(",");
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var fmt = item.split("itag=")[1].split("&")[0];
                        var type = item.split("type=")[1].split("&")[0];
                        var url = item.split("url=")[1].split("&")[0];
                        url = decodeURIComponent(url);
                        var title = window.ytplayer.config.args.title;
                        url = url + "&title=" + encodeURIComponent(title);
                        if (typeof param.type != "string")
                            return url;
                        if (type.indexOf(param.type) > 0)
                            return url;
                    }
                })();
                this.log(url);
                if (url)
                    window.location.assign(url);
            }
        });

        this.Sites.NetCommons = new Site({
            target: function (param) {
                return window.photoalbumCls !== undefined;
            },
            exec: function (param) {
                var obj = window.photoalbumCls;
                var div = document.createElement("div");
                document.body.appendChild(div);
                for (var c in obj) {
                    if (typeof obj[c] !== "object")
                        continue;
                    for (var i = 0; i < obj[c].photos.length; i++) {
                        div.innerHTML = div.innerHTML + "<img src=\"" + obj[c].photos[i].src + "\" />";
                    }
                }
            }
        });

        this.Sites.NetCommons2 = new Site({
            target: function (param) {
                return window.photo_urls !== undefined;
            },
            exec: function (param) {
                var obj = window.photo_urls;
                var div = document.createElement("div");
                document.body.appendChild(div);
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i] === undefined)
                        continue;
                    for (var j = 0; j < obj[i].length; j++) {
                        if (obj[i][j] === undefined)
                            continue;
                        div.innerHTML = div.innerHTML + "<img src=\"" + obj[i][j] + "\" />";
                    }
                }
            }
        });

        this.Sites.Flickr = new Site({
            target: function (param) {
                return location.hostname.indexOf("www.flickr.com") != -1;
            },
            exec: function (param) {
                var url = (function () {
                    var req = new XMLHttpRequest();
                    location.href.match(/\d+/g);
                    var pid = RegExp.lastMatch;
                    req.open('GET', '//www.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key=dbe0ad6f572dd896b0c78eca94e6997f&photo_id=' + pid, false);
                    req.send(null);
                    var res = JSON.parse(req.responseText);
                    if (res.stat == "ok") {
                        return (res.sizes.size[res.sizes.size.length - 1].source.replace(".jpg", "_d.jpg"));
                    }
                    return false;
                })();
                this.log(url);
                if (url)
                    window.location.assign(url);
            }
        });

        this.Sites.Photozou = new Site({
            target: function (param) {
                return location.hostname.indexOf("photozou.jp") != -1;
            },
            exec: function (param) {
                var url = (function () {
                    var req = new XMLHttpRequest();
                    req.open('GET', location.href.replace("show", "photo_only"), false);
                    req.send(null);
                    return req.responseText.match(/http:\S+download=yes/);
                })();
                this.log(url);
                if (url)
                    window.location.assign(url);
            }
        });

        return this;
    })();
})(Repy || (Repy = {}));

/*
javascript:
(function(){
var js = document.createElement("script");
js.type = "text/javascript";
js.charset = "utf-8";
js.src = "https://bitbucket.org/repy/alldownload.js/raw/master/AllDownload.js";
js.addEventListener("load", function () {
Repy.AllDownload.Startup();
});
document.body.appendChild(js);
})();
*/

/*
javascript:
(function(){
var js = document.createElement("script");
js.type = "text/javascript";
js.charset = "utf-8";
js.src = "https://bitbucket.org/repy/alldownload.js/raw/master/AllDownload.js";
js.addEventListener("load", function () {
Repy.AllDownload.Startup({ debug: true, Youtube: { type: "mp4" } });
});
document.body.appendChild(js);
})();
*/
