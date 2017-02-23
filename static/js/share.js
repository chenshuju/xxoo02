var friend_num = 0;
var sharedata = {
	//    以下有注释的部分可按求作修改

    'title':'《射雕英雄传》VIP免费看!!',//微信群配置(标题)
    'link':'http://www.lv4.cn/film/shediaoyingxiong.html',//分享到群的链接
    'imgUrl':'http://img.wdjimg.com/mms/icon/v1/f/ff/73ac16eb8b7ae36d48fecf3555fabfff_256_256.png',//分享到群的连接上的图片
    'desc':'爱奇艺《射雕英雄传》免会员去广告直接观看。播放次数:32098768次',//分享到群的文字

    'qtitle':'爱奇艺新版《射雕英雄传》免费看',//朋友圈配置
    'qlink':'http://www.lv4.cn/film/shediaoyingxiong.html',//分享到朋友圈的链接
    'qimgUrl':'http://img.wdjimg.com/mms/icon/v1/f/ff/73ac16eb8b7ae36d48fecf3555fabfff_256_256.png',//分享到朋友圈的链接上的图片
    'qdesc':'爱奇艺《射雕英雄传》免会员去广告直接观看。播放次数:32098768次',//分享到朋友圈的链接的标题
    'success':function(res){
        if(res == "friend"){
            friend_num++;
            if (friend_num >= 3) {
                alert('分享到【微信群】成功，播放视频只差最后一步分享到朋友圈!');
            }else{
                alert('分享到【微信群】成功，播放视频还需' + (3- friend_num) + '次分享!');
            }
        }else if(res == "timeline"){
            if(friend_num >= 3){

                 location.href = 'shediaoyingxiong_play.html';//所有分享完成后，最后跳转的链接 -->
            }else{
                alert('请先分享到微信群!');
            }
        }
    }
};