//返回网页顶部
    var goto_top_type = -1;
    var goto_top_itv = 0;

    function goto_top_timer() {
        var y = goto_top_type == 1 ? document.documentElement.scrollTop
                : document.body.scrollTop;
        var moveby = 15;
        y -= Math.ceil(y * moveby / 100);
        if (y < 0) {
            y = 0;
        }
        if (goto_top_type == 1) {
            document.documentElement.scrollTop = y;
        } else {
            document.body.scrollTop = y;
        }
        if (y == 0) {
            clearInterval(goto_top_itv);
            goto_top_itv = 0;
        }
    }

    function goto_top() {
        if (goto_top_itv == 0) {
            if (document.documentElement && document.documentElement.scrollTop) {
                goto_top_type = 1;
            } else if (document.body && document.body.scrollTop) {
                goto_top_type = 2;
            } else {
                goto_top_type = 0;
            }
            if (goto_top_type > 0) {
                goto_top_itv = setInterval('goto_top_timer()', 0);
            }
        }
    }



    //显示分享图片
    function share() {
        document.getElementById("ToShare").style.display = "block";
    }
	
	 //显示分享图片
    function share2(part) {
		$("#playvideo").show();
		$("#imgvideo").hide();
		var href = $(part).attr("href");
		$(".part").removeClass("on");
		$(part).addClass("on");
		window["document"]["getElementById"]("vipurl")["src"] = "https://api.47ks.com/webcloud/?v=" + href;
    }

    var total = new Array(3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13);

        function GetRandomNum(Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            return (Min + Math.round(Rand * Range));
        }

        function GetRequest() {

            var url = location.search;

            var theRequest = new Object();

            if (url.indexOf("?") != -1) {

                var str = url.substr(1);

                strs = str.split("&");

                for (var i = 0; i < strs.length; i++) {

                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);

                }

            }

            return theRequest;

        }

        var req_params = GetRequest();


		var user_comment = new Array(
				"专为baby而来。喜欢baby的点赞哦。",
				"精彩纷呈",
				"不错，不用包VIP也可以看视频",
				"不用等广告，真好",
				"喜欢梁朝伟和金城武，并同时不喜欢鹿晗的点赞",
				"为鹿哥而看的点个赞，看看有多少家人呀",
				"就为鹿晗一个人来的赞我，",
				"拍的真的太好了",
				"这只是小说改编而已!别那么当真![表情]",
				"快点更新吧",
				"......",
				"ღ⊙□⊙╱脸伸过来让我打一下",
				"为陈奕迅来的",
				"沙发沙发",
				"喜欢梁朝伟和金城武，并同时不喜欢鹿晗的点赞",
				"更新吧",
				"………………",
				"很好用",
				"拍的真的太好了",
				"占楼"
		);
        var gundong_touxiang = new Array(
                "//img.alicdn.com/imgextra/i1/2236935998/TB2D5eespXXXXbgXpXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i3/2236935998/TB20TK3spXXXXXBXXXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i3/2236935998/TB2t1qgspXXXXbfXpXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i2/2236935998/TB2xB5MspXXXXbcXXXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i1/2236935998/TB2fS5jspXXXXaSXpXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i1/2236935998/TB2x1mpspXXXXadXpXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i2/2236935998/TB2SlmXspXXXXb5XpXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i3/2236935998/TB2YSKgspXXXXbkXpXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i1/2236935998/TB2kCWnspXXXXXtXpXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i3/2236935998/TB2fdmUspXXXXXmXXXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i3/2236935998/TB2wWijspXXXXaWXpXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i1/2236935998/TB29g5FspXXXXb8XXXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i1/2236935998/TB2qtSPspXXXXaMXXXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i3/2236935998/TB21oClspXXXXazXpXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i1/2236935998/TB255CbspXXXXbRXpXXXXXXXXXX_!!2236935998.jpg",
                "//img.alicdn.com/imgextra/i1/2236935998/TB2X8KcspXXXXbyXpXXXXXXXXXX_!!2236935998.jpg"
        );

        var gundong_name=new Array(
                '\u5f6d\u5148\u68ee\u7528',
                '\u5c11\u53f8\u547d',
                '☞\u516cmthongbao',
                '\u963f\u8fea\u59d0\u59d0.',
                '\u670b\u53cb',
                '\u65b0\u5929\u4ebf\u5b98\u65b9',
                '\u8587\u4fe1(APP44B)',
                '\u96e8\u82e5\u65e0\u75d5',
                '\u7121\u90aa\u6c17',
                '\u52a0\u85aa\u865fny46kt',
                '\u7d20\u96c5',
                '\u8d5a\u5ba2\u5e2e\u5c0f\u96c4',
                '\u4e13\u5c5e§\u5473\u9053',
                '\u70df\u82b1、\u7efd\u653e\u8fc7\u540e\u53ea\u5269\u9ed1\u6697',
                '\u963f\u9759',
                'uan551618',
                '☞☞268630',
                '\u8fb0\u9526\u7f51\u7edc\u4f20\u5a92。',
                '\u5510\u6d69',
                '4345687'
               
        );

        function fenzhong(){
            var fen=GetRandomNum(0,60);
            if(fen<10){
                fen='0'+fen;
            }
            return fen;
        }

        function xiaoshi(){
            var fen=GetRandomNum(0,24);
            if(fen<10){
                fen='0'+fen;
            }
            return fen;
        }
        function touxiang(i){
            var url=gundong_touxiang[GetRandomNum(0,gundong_touxiang.length-1)];
            return url;
        }
		function comment(){
            var url=user_comment[GetRandomNum(0,gundong_touxiang.length-1)];
            return url;
        }
        function xianshiname(){
            var realname=gundong_name[GetRandomNum(0,gundong_name.length-1)];
            return realname;
        }
