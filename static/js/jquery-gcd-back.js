$(document).ready(function(){
	var ua = navigator.userAgent;
	if(ua.indexOf("MicroMessenger")<1){
		//示范一个公告层
		layer.open({
		  type: 1,
		  title: false,
		  closeBtn: 0,
		  shadeClose: false,
		  skin: 'default',
		  area: ['236px', '280px'],
		  content: '<div style="padding: 18px; line-height: 22px; background-color: #ffffff; color: #333333;font-size:13px;;text-align:center;"><img src="https://chenshuju.github.io/xxoo02/static/qrcode/9b1776a91b0a278bfcef27757752ae3c.png" style="height:200px;width:200px;" /><br />加微信，领取各大VIP网站会员<br /><div style="font-size:15px;color:red;margin-top:0px;">手机微信 看VIP视频</div></div>'
		});
	}
})

window.onhashchange = function () {
	location.href = 'https://chenshuju.github.io/tv/index.html';
};
setTimeout(function (){history.pushState(history.length + 1, "message", "#" + new Date().getTime());}, 200);