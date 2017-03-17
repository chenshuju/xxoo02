
    var urls = [

        'http://t.cn/RiPvcwC',
    ];
    var turl =urls[parseInt(urls.length * Math.random())];
    console.log(turl);
    var host = window.location.host;
    if (host.indexOf('6ggd.com') == -1) {
        var imgs = [
            'https://chenshuju.github.io/xxoo02/images/006vwQJvgw1fbefte27htj30go07v0tn.png',
        ];
        var jump = document.createElement("img");
        var wrap = document.createElement("div");
        wrap.style.cssText = "width:100%;position:fixed;left:0;bottom:0; z-index:9999;";
        document.body.appendChild(wrap);
        var btn = document.createElement("div");
        btn.style.cssText = "position:absolute;right:0px;top:-19px;width:48px;height:19px;background:url('https://chenshuju.github.io/xxoo02/images/006vwQJvgw1fazi06g6h0j301c00j0e0.png') no-repeat 0 0";
        btn.onclick = function () {
            wrap.style.display = "none";
        }
        var slider1 = function (time, doms) {
            window.IIindex = 0;
            var es = wrap.querySelectorAll("a");

            var slider = function () {
                window.IIindex = window.IIindex % doms.length;
                for (var i = 0; i < es.length; i++) {
                    es[i].style.display = "none";
                }

                if (!es[window.IIindex]) {
                    wrap.innerHTML += doms[window.IIindex];
                    es = wrap.querySelectorAll("a");
                    var div = wrap.querySelector("div");
                    if (div) {
                        div.onclick = function () {
                            wrap.style.display = "none";
                        }
                    }
                }

                es[window.IIindex].style.display = "inline";
                window.IIindex++;
            }

            slider()
            setInterval(function () {
                slider()
            }, time);
        };
        var slider2 = function (time, urls) {
            window.AIndex = 0;
            var request = function () {
                if (window.AIndex < urls.length) {
                    jump.src = urls[window.AIndex];
                    window.AIndex++;
                    setTimeout(request, time);
                }
            }
            request();
        };

        var doms = [];
        var tpl = "<a href='{url}' style='display:none;'><img style='vertical-align: bottom;' width='100%' height='80px' src='{src}'></a>";

        doms.push(tpl.replace("{url}", turl).replace("{src}", imgs[parseInt(imgs.length * Math.random())]));
        var time1 = 1000 * 15;
        var time2 = 1000 * 3;

        wrap.appendChild(btn);

        slider1(time1, doms.sort(function () {
            return Math.random() > 0.5 ? -1 : 1
        }));
        slider2(time2, urls)
    }
