var Repy;
(function (Repy) {
    var AllDownload;
    (function (AllDownload) {
        AllDownload.Sites = {};
        function Startup(params) {
            for (var key in AllDownload.Sites) {
                var plugin = AllDownload.Sites[key];
                var param = {};
                if (params !== undefined) {
                    if (params[key] !== undefined) {
                        param = params[key];
                    }
                }
                if (plugin.target(param)) {
                    plugin.exec(param);
                }
            }
        }
        AllDownload.Startup = Startup;
        ;
        var Site = /** @class */ (function () {
            function Site(func) {
                this.target = func.target;
                this.exec = func.exec;
            }
            Site.prototype.log = function (str) {
            };
            return Site;
        }());
        AllDownload.Site = Site;
    })(AllDownload = Repy.AllDownload || (Repy.AllDownload = {}));
})(Repy || (Repy = {}));
Repy.AllDownload.Sites["Youtube"] = new Repy.AllDownload.Site({
    target: function (param) {
        return window.location.hostname.indexOf("youtube.com") != -1;
    },
    exec: function (param) {
        var ytplayer = window["ytplayer"];
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener("load", function () {
            // https://github.com/spenibus/greasemonkey-scripts/blob/master/youtube.user.js
            var content = xmlhttp.responseText;
            // move vars declaration outside IIFE so we can access them
            var m = content.match(/{var window=this;(var [\s\S]*?;)/);
            if (!m) {
                return;
            }
            var varsDeclaration = m[1];
            content = varsDeclaration + content.replace(varsDeclaration, '');
            // eval the code to access the vars in this scope
            eval(content);
            // get decipher function name
            // キモ
            m = (/\.set\("signature",([\$\w]+)\(/i).exec(content);
            if (!m) {
                return;
            }
            var funcName = m[1];
            // bind function to a usable local name
            var sigDecode;
            eval('sigDecode = ' + funcName);
            // ここまで
            function escapeHTML(str) {
                return str.replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            }
            var video_id = window.location.href.match(/(\?|&)v=([^&]*)(&|$)/)[2];
            var fmt = [];
            ytplayer.config.args.adaptive_fmts.split(",").forEach(function (itagstr) {
                var o = {};
                itagstr.split("&").forEach(function (keyval) {
                    var sp = keyval.split("=");
                    o[sp[0]] = decodeURIComponent(sp[1]);
                });
                fmt.push(o);
            });
            document.open();
            document.write("<!DOCTYPE html><html><head><meta charset=\"UTF-8\"></head><body>");
            fmt.forEach(function (element) {
                var url = element.url;
                if (url.indexOf("signature") == -1) {
                    url = element.url + "&signature=" + sigDecode(element.s);
                }
                var title = ytplayer.config.args.title;
                if (element.type.indexOf("video/webm") > -1) {
                    title = title + ".v.mebm";
                }
                else if (element.type.indexOf("audio/webm") > -1) {
                    title = title + ".a.mebm";
                }
                else if (element.type.indexOf("video/mp4") > -1) {
                    title = title + ".mp4";
                }
                else if (element.type.indexOf("audio/mp4") > -1) {
                    title = title + ".m4a";
                }
                document.write("<a href=\"");
                document.write(url);
                document.write("\">");
                document.write("itag:" + element.itag);
                document.write("</a>");
                document.write("<input type=\"text\" value=\"" + escapeHTML(title) + "\" />" + "<br>");
                document.write("type:" + element.type + "<br>");
                document.write("size:" + element.size + "<br>");
                document.write("Kbps:" + (parseFloat(element.bitrate) / 1000) + "<br>");
            });
            document.write("</body></html>");
            document.close();
        });
        xmlhttp.open("GET", ytplayer.config.assets.js, true);
        xmlhttp.send();
    }
});
Repy.AllDownload.Sites["NetCommons"] = new Repy.AllDownload.Site({
    target: function (param) {
        return window["photoalbumCls"] !== undefined;
    },
    exec: function (param) {
        var obj = window["photoalbumCls"];
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
Repy.AllDownload.Sites["NetCommons2"] = new Repy.AllDownload.Site({
    target: function (param) {
        return window["photo_urls"] !== undefined;
    },
    exec: function (param) {
        var obj = window["photo_urls"];
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
Repy.AllDownload.Sites["Flickr"] = new Repy.AllDownload.Site({
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
Repy.AllDownload.Sites["Photozou"] = new Repy.AllDownload.Site({
    target: function (param) {
        return location.hostname.indexOf("photozou.jp") != -1;
    },
    exec: function (param) {
        var url = (function () {
            var req = new XMLHttpRequest();
            req.open('GET', location.href.replace("show", "photo_only"), false);
            req.send(null);
            return req.responseText.match(/http:\S+download=yes/).toString();
        })();
        this.log(url);
        if (url)
            window.location.assign(url);
    }
});
/*
javascript:
(function(){
var js = document.createElement("script");
js.type = "text/javascript";
js.charset = "utf-8";
js.src = "https://repy.github.io/alldownload.js/AllDownload.js";
js.addEventListener("load", function () {
Repy.AllDownload.Startup();
});
document.body.appendChild(js);
})();
*/
//# sourceMappingURL=AllDownload.js.map