// VERSION: 2.2 LAST UPDATE: 13.03.2012
/* 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * Website: http://code.google.com/p/jqueryrotate/ 
 */

// Documentation removed from script file (was kinda useless and outdated)

(function($) {
var supportedCSS,styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
for (var a=0;a<toCheck.length;a++) if (styles[toCheck[a]] !== undefined) supportedCSS = toCheck[a];
// Bad eval to preven google closure to remove it from code o_O
// After compresion replace it back to var IE = 'v' == '\v'
var IE = eval('"v"=="\v"');

jQuery.fn.extend({
    rotate:function(parameters)
    {
        if (this.length===0||typeof parameters=="undefined") return;
            if (typeof parameters=="number") parameters={angle:parameters};
        var returned=[];
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);	
                if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

                    var paramClone = $.extend(true, {}, parameters); 
                    var newRotObject = new Wilq32.PhotoEffect(element,paramClone)._rootObj;

                    returned.push($(newRotObject));
                }
                else {
                    element.Wilq32.PhotoEffect._handleRotation(parameters);
                }
            }
            return returned;
    },
    getRotateAngle: function(){
        var ret = [];
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);	
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    ret[i] = element.Wilq32.PhotoEffect._angle;
                }
            }
            return ret;
    },
    stopRotate: function(){
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);	
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    clearTimeout(element.Wilq32.PhotoEffect._timer);
                }
            }
    }
});

// Library agnostic interface

Wilq32=window.Wilq32||{};
Wilq32.PhotoEffect=(function(){

	if (supportedCSS) {
		return function(img,parameters){
			img.Wilq32 = {
				PhotoEffect: this
			};
            
            this._img = this._rootObj = this._eventObj = img;
            this._handleRotation(parameters);
		}
	} else {
		return function(img,parameters) {
			// Make sure that class and id are also copied - just in case you would like to refeer to an newly created object
            this._img = img;

			this._rootObj=document.createElement('span');
			this._rootObj.style.display="inline-block";
			this._rootObj.Wilq32 = 
				{
					PhotoEffect: this
				};
			img.parentNode.insertBefore(this._rootObj,img);
			
			if (img.complete) {
				this._Loader(parameters);
			} else {
				var self=this;
				// TODO: Remove jQuery dependency
				jQuery(this._img).bind("load", function()
				{
					self._Loader(parameters);
				});
			}
		}
	}
})();

Wilq32.PhotoEffect.prototype={
    _setupParameters : function (parameters){
		this._parameters = this._parameters || {};
        if (typeof this._angle !== "number") this._angle = 0 ;
        if (typeof parameters.angle==="number") this._angle = parameters.angle;
        this._parameters.animateTo = (typeof parameters.animateTo==="number") ? (parameters.animateTo) : (this._angle); 

        this._parameters.step = parameters.step || this._parameters.step || null;
		this._parameters.easing = parameters.easing || this._parameters.easing || function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; }
		this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
        this._parameters.callback = parameters.callback || this._parameters.callback || function(){};
        if (parameters.bind && parameters.bind != this._parameters.bind) this._BindEvents(parameters.bind); 
	},
	_handleRotation : function(parameters){
          this._setupParameters(parameters);
          if (this._angle==this._parameters.animateTo) {
              this._rotate(this._angle);
          }
          else { 
              this._animateStart();          
          }
	},

	_BindEvents:function(events){
		if (events && this._eventObj) 
		{
            // Unbinding previous Events
            if (this._parameters.bind){
                var oldEvents = this._parameters.bind;
                for (var a in oldEvents) if (oldEvents.hasOwnProperty(a)) 
                        // TODO: Remove jQuery dependency
                        jQuery(this._eventObj).unbind(a,oldEvents[a]);
            }

            this._parameters.bind = events;
			for (var a in events) if (events.hasOwnProperty(a)) 
				// TODO: Remove jQuery dependency
					jQuery(this._eventObj).bind(a,events[a]);
		}
	},

	_Loader:(function()
	{
		if (IE)
		return function(parameters)
		{
			var width=this._img.width;
			var height=this._img.height;
			this._img.parentNode.removeChild(this._img);
							
			this._vimage = this.createVMLNode('image');
			this._vimage.src=this._img.src;
			this._vimage.style.height=height+"px";
			this._vimage.style.width=width+"px";
			this._vimage.style.position="absolute"; // FIXES IE PROBLEM - its only rendered if its on absolute position!
			this._vimage.style.top = "0px";
			this._vimage.style.left = "0px";

			/* Group minifying a small 1px precision problem when rotating object */
			this._container =  this.createVMLNode('group');
			this._container.style.width=width;
			this._container.style.height=height;
			this._container.style.position="absolute";
			this._container.setAttribute('coordsize',width-1+','+(height-1)); // This -1, -1 trying to fix ugly problem with small displacement on IE
			this._container.appendChild(this._vimage);
			
			this._rootObj.appendChild(this._container);
			this._rootObj.style.position="relative"; // FIXES IE PROBLEM
			this._rootObj.style.width=width+"px";
			this._rootObj.style.height=height+"px";
			this._rootObj.setAttribute('id',this._img.getAttribute('id'));
			this._rootObj.className=this._img.className;			
		    this._eventObj = this._rootObj;	
		    this._handleRotation(parameters);	
		}
		else
		return function (parameters)
		{
			this._rootObj.setAttribute('id',this._img.getAttribute('id'));
			this._rootObj.className=this._img.className;
			
			this._width=this._img.width;
			this._height=this._img.height;
			this._widthHalf=this._width/2; // used for optimisation
			this._heightHalf=this._height/2;// used for optimisation
			
			var _widthMax=Math.sqrt((this._height)*(this._height) + (this._width) * (this._width));

			this._widthAdd = _widthMax - this._width;
			this._heightAdd = _widthMax - this._height;	// widthMax because maxWidth=maxHeight
			this._widthAddHalf=this._widthAdd/2; // used for optimisation
			this._heightAddHalf=this._heightAdd/2;// used for optimisation
			
			this._img.parentNode.removeChild(this._img);	
			
			this._aspectW = ((parseInt(this._img.style.width,10)) || this._width)/this._img.width;
			this._aspectH = ((parseInt(this._img.style.height,10)) || this._height)/this._img.height;
			
			this._canvas=document.createElement('canvas');
			this._canvas.setAttribute('width',this._width);
			this._canvas.style.position="relative";
			this._canvas.style.left = -this._widthAddHalf + "px";
			this._canvas.style.top = -this._heightAddHalf + "px";
			this._canvas.Wilq32 = this._rootObj.Wilq32;
			
			this._rootObj.appendChild(this._canvas);
			this._rootObj.style.width=this._width+"px";
			this._rootObj.style.height=this._height+"px";
            this._eventObj = this._canvas;
			
			this._cnv=this._canvas.getContext('2d');
            this._handleRotation(parameters);
		}
	})(),

	_animateStart:function()
	{	
		if (this._timer) {
			clearTimeout(this._timer);
		}
		this._animateStartTime = +new Date;
		this._animateStartAngle = this._angle;
		this._animate();
	},
    _animate:function()
    {
         var actualTime = +new Date;
         var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

         // TODO: Bug for animatedGif for static rotation ? (to test)
         if (checkEnd && !this._parameters.animatedGif) 
         {
             clearTimeout(this._timer);
         }
         else 
         {
             if (this._canvas||this._vimage||this._img) {
                 var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
                 this._rotate((~~(angle*10))/10);
             }
             if (this._parameters.step) {
                this._parameters.step(this._angle);
             }
             var self = this;
             this._timer = setTimeout(function()
                     {
                     self._animate.call(self);
                     }, 10);
         }

         // To fix Bug that prevents using recursive function in callback I moved this function to back
         if (this._parameters.callback && checkEnd){
             this._angle = this._parameters.animateTo;
             this._rotate(this._angle);
             this._parameters.callback.call(this._rootObj);
         }
     },

	_rotate : (function()
	{
		var rad = Math.PI/180;
		if (IE)
		return function(angle)
		{
            this._angle = angle;
			this._container.style.rotation=(angle%360)+"deg";
		}
		else if (supportedCSS)
		return function(angle){
            this._angle = angle;
			this._img.style[supportedCSS]="rotate("+(angle%360)+"deg)";
		}
		else 
		return function(angle)
		{
            this._angle = angle;
			angle=(angle%360)* rad;
			// clear canvas	
			this._canvas.width = this._width+this._widthAdd;
			this._canvas.height = this._height+this._heightAdd;
						
			// REMEMBER: all drawings are read from backwards.. so first function is translate, then rotate, then translate, translate..
			this._cnv.translate(this._widthAddHalf,this._heightAddHalf);	// at least center image on screen
			this._cnv.translate(this._widthHalf,this._heightHalf);			// we move image back to its orginal 
			this._cnv.rotate(angle);										// rotate image
			this._cnv.translate(-this._widthHalf,-this._heightHalf);		// move image to its center, so we can rotate around its center
			this._cnv.scale(this._aspectW,this._aspectH); // SCALE - if needed ;)
			this._cnv.drawImage(this._img, 0, 0);							// First - we draw image
		}

	})()
}

if (IE)
{
Wilq32.PhotoEffect.prototype.createVMLNode=(function(){
document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
		try {
			!document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
			return function (tagName) {
				return document.createElement('<rvml:' + tagName + ' class="rvml">');
			};
		} catch (e) {
			return function (tagName) {
				return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
			};
		}		
})();
}

})(jQuery);
 var gundong_touxiang = new Array( 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEKfv6SwrzPVicSvwPdl8ZP6Tx01koxSuTib7b7kNb27tZyicXufMx6EP8p0ejf7KibgrvZ37ib0l7rdstg/96', 'http://wx.qlogo.cn/mmopen/ajNVdqHZLLBZ0q8N3wBlQj6QibMRSgkHT3K0nribHBiaMw3888l5fqOcGJskibvCGgjYq5iaHFpW0pqsvOjUHdbsd6A/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ74783FdxdedSadeKOpxeCGqkKvH4KicP8ibvexd4QcYZI8yGzXNAQ5iaIU0sgFRkReDVibkrZiaS6K86qm0rhZZp5aj/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oKibPL8FNJY3N2G0FqOKqibwia4AYgAKGsNjGcOZ73WkE0iasJ06sHHoYcNoLUkR7x0dicyEZgGrKEFh39/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WneiaicfkPHjkZFiccS3dsC5pXj67viafXMqRYxjmfBiaYl2lgicibJgzRBzXEWMAFnJ8W08tHr66xqGYCmSN4RJic6Zm360/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4Wnc1W5krR5JOQ50AgF4lASm4hgoxMcEvpicqiau6jTpYMCxRI2I3WJ3fhb1f8bguDIUbd0xSH0ribnArGf5amuWZvcb/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAliblvkzfl2CL6lhP5f1Z6U10J0ShSUAyTCHz21AngN1U87qwHoOGpu2m5gqV5ylW4VYDzuRziaIjNUUlvSfibIqHicF/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlicQmGO8X1VZcgApJ9yyKsvfPcsjw8WcbkAWYZ2JhFQ9mObJBkl78DE5xV4OC0Nd7Fn50JJqKicbbwFib8ymBkY4W7/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ4UTtWQeZ560bOoAyZwpGBVeDpB2z6M2SBxPSKhkqwfOzcWKtjZmZbSpVfunm1vILo1aaWkyoFbXfAVib0FaUWRW/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ5US8J1QRBsuIAFC8mWlSErASK63iaNXZylowD5APib1kUbU0VT17n0Ggr6377nibT6uYJg9OHJqic0NkNZwpzR74gd/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHaPNhVIAr51r8G7SsJo0ZLz0LkHPxEMlU6UvefQJLqS4wibz1Dictic00JqJpsLLNpeoRA2XFSKMHHbU15Zibln8fRY/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oK10xmHXIU9sXLEhJkaEx4AZFNK4WOaQl7ZLwgic4YnfbCTQRiaEicCZPf9I1eAmKM1AvQKGG5Lm9tgp/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ74783FdxdedYlarCiapPsxTg1QZEXmkvvfKnq3yWuySXFkDWWnZDCYjibYiapOHEh340oaNicdJTOtxoIyPveWdOpP/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHYK8eb41v0IGkvKXAmGsE6odcdeywIRqOu8uUhmYwrqfr3NAae3uxz0JosSeTMD3MWzLr21iaQ9wwEJVKG007Vul/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WneiaicfkPHjkZF05CNcXZhWicTctgiczlicBUiciculDEChAgMkEWtNPVCRCoSX4KFT1NgvyDnrseSd6Dr6blW72GGFqAz/96', 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEJqIowicRftlHvu2bw6sBwUsr27F0PQb8ic1MGodrFQ3DtMWCibJPuJMzSaSA7vwkjrCmdKmgnRZ6Lhw/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ74783FdxdedYjia67IXpp74nS3XaF5QJpibOmDbtHuM24ywypBTb3FILcZy0Dbb17lJBaQC6puZQMpYBiarnuFDZM/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oK2ttEyZvJtlUrs7J8PYQ13iaU8u8JgIQjVuibFGRgodXeduRYDAZkibf6tLwmEZYpKNRKBbRrPobevN/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oK4ibwOtxXGc9toTiaUonicv0JrJia3rRNVg3PU52QRic9IPQe36b8TdO5jicuaXA5EBMGAE1bBBEbhFTCu/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAl8MBVSYQJmrqCpjFpuqkYnpMjIribMAqh7zRIQZiaGnfq8DWDnQzKibPHhwyQoPNBoHuicw10Y15LgRHmc4HaoibicF5m/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlicQmGO8X1VZcoR4s77VqzjMeuaZcR2PRguk2p8jJ0dLN4SBVUyJJVyYI9I6oocvTGI5kek7frNRTsc92aUvxj50/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oK9yPIcWSh33nBWWJ7M4X9LJg6LJcpfTWibGb3ric5FyiaAibceMia7eqSib7veIP1aLKX3llPpkLJyCzp1/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHbreWKlnyuXusXEtHzAwU2pmcUzTfGZfHqhW3KxPUZuuJczzaXtAoot0cK8gjkmIbjO6BPsU9GuDXqNwPGwZxicr/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlicQmGO8X1VZcovIGsrTbHJ9HkHjhYDTfslQnZz0PZEoqV2agacTNt1BVU6LpM2M8nTUHvv2xdZjXXhQiawcOKNQl/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlicI73wnUqwQvJklhW0jIEd33QZvGIf7emPyz8gvtuEswic6cXzas2Wf4TGhVJXgp7qEJFicEY4qOWjj41wyfSH4Y0/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ7td6pBSHctzbSbeWBGHqlibcsOrBJIyxwpn0lEgRLaTZSAMGEPib5K1EzrY0OyibKTIEB5FfkGRba270HXKghytKic/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WnelE8icwdWXlYEGrwWF6lnWaLmH9heCib0ANdDfxBcSbrDFtZGUBkKOUqU00ibtOicnponGcpicIAHicnpw/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAl8U517fsqdraDP9iaCqicE6I80wFeMBDohZBiaC9kEfvSFibr6TpYNkrH9336kJngKSCLwb4dicTYgLTg9cPicyicbOB7ia/96', 'http://wx.qlogo.cn/mmopen/LBrOAQmYlluYQA4fM1sbDpPeklDoUl1xx2Qj2T38CS2FY5GVyZZ48cBG4ubcGPvKLoT7IesW0hpt7IXV5GKm9Vus4elmcFicR/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WncOnjBU8bHibicicYicvniazgl1nhenHlfKRYmg6kVkNRWvCg2sAav0bq40Pl0NQ7qNEAnttafricIb3Xlqs7fSTviaLEo/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ5x0XyoPBKXpSMicOnCaia4yHPvFTIPeaj10ic5fLpxqDE6ZibNcEYJ2qicfWLN0I5bMODtVibzmVc7vq5biaNRpVzbznv/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WnfHHsYtGMllwcMcPcSsEZnyfvOzSeNEibasNJHhH1Qia2ZDEhWib8dNbImZnZGFLb9Z1g9OXSY8J11s6Qq70BpnSoo/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oKiccFkKufc710TSia6u98jKSOelW0X3u2HSgzNTCGia6UicwQpVD6jXngBkuBItFThlZk87cx7ibHqTqW/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oK8lvicArHZUiabgFfkcT0Ua1bzM3KsN0awqaTrKQib8Gndpn1ibx5fsiaAfmAicmv82YGogoDBbNqJaibzG/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ5Qjkwx80T1U7BFeuGzn3Z0JJ7W7sFnY6icjCLANVRIeI0k4UZTKccGHnKu4ypHCFQY6050YC2hSjy3PibRUvl9G1/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ74783FdxdedcpaVOXYkha8vF9p7YvS03E09QbZQxTRTokQ6lfrgZD2Cm0NxdzjPwLKo7nb23I3L1jcOypNkzq4/96', 'http://wx.qlogo.cn/mmopen/CpCibtib23t5DsyRo8hHuxb9TpICvgS8UB9FQicic2mjacpxIjc17js6WhmLNnWTibibW3mCMqj3GakULnEjPNeTvrG2K9mzOM6OEq/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ74783FdxdedX4sykRv7TAgylicAadymu6aPYV8k5hibRhvHjKv2hhtNEzE6ZbML6LmoulgbnvCSzqf8BMvRXODN8/96', 'http://wx.qlogo.cn/mmopen/ajNVdqHZLLD7107Biackz45xD0tOT5EIhsyicc9uK9nFd0otQoKUcIMXysqyJ4EMKOSRicVuYOCY0eGk6W3n6keSJrLSzXjhy8am5dPT3yQpnk/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ4OibfqPuoeDMGl8KflcXgUeK6yCH00oeSMrbYXpyBPICwNDuvA0DIzswibb8gD0v0IhnXDZOwu0EzzbnjrI4uzibQ/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ6q2l4332xf9vwcxYTFSUVFWpicIDicIPNTzjmkicmgibw5XsLcLMVKS3EwUrYuiakMEslGUUhibjibzlI2xm4TurL0q9u/96', 'http://wx.qlogo.cn/mmopen/CpCibtib23t5CicZFK9jGz9cLrCbL4JNBc7TPs0OasS411m6OVbkM3NU8yd5CXtxicdsTjfTvkabw7nhGZE99vLnHxw821xpEBvb/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlicQmGO8X1VZctvGQtXkl6iavd4hG9uJ5yayzMh8YKoR24DZGNY2xyXu2mRaRCUL49FUiaRsYe10z4crQmeBS4icWyS/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAl9Px1zpjkpH8q23d4GqwV2ficcyMORJjkwoYERasgXtvTmDicibtDBItQeQ89ibQBkA5JN4O8TibbsVVw0IvNSrnRfOK/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlicQmGO8X1VZcurs6t5Os1dG5BzViaUhvj5LZIgy57Fsjy8icfZvkv8Q8hHVJGFRxnksicxlLQ9D2h1QTLmTyTZmU5E/96', 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEKfv6SwrzPVicSvwPdl8ZP6Tx01koxSuTib7b7kNb27tZyicXufMx6EP8p0ejf7KibgrvZ37ib0l7rdstg/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHZQmicSeZiayv4iacRywULiaVM9r8Dymvc8ia4ESBBTwT9ZZyu4ViaNLczcoBUyv2auNMhhxhZmib0zt6dlKXUMwhchhL2/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WneiaicfkPHjkZFiccS3dsC5pXj67viafXMqRYxjmfBiaYl2lgicibJgzRBzXEWMAFnJ8W08tHr66xqGYCmSN4RJic6Zm360/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oK6dJv6Eic0kpbaW3YxGib2hVZnFnoQWouqehnQ3zSg15KicdqdI6DMdiaibA3ANQ5U4fXDFiaXl3wZNQA1/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ74783FdxdedSadeKOpxeCGqkKvH4KicP8ibvexd4QcYZI8yGzXNAQ5iaIU0sgFRkReDVibkrZiaS6K86qm0rhZZp5aj/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WneyMQxEWGO9etribwpib93ozMkthzn2KGbVfhXerWsU6VhJDY1p6JA9aGHyoChkPHFY2YLiaoGIE2Gd0Qf32IVnUFa/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHaf4bKHugJlUyJORBQFXib6T1EyHHPKGuzU9WibyoTME8mYoGMicRMYicicsdF5s9HZRygxrtsSPpzfuFIJ2emYMSW2r/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlibK27FKibbDCpcyOAm5Fq0icUFvPNttorK3xZznHEDOpziaKMgiaLicFsOFj1KTLSss72JELpoCpibGSlOjQibwqiaaLxPK/96', 'http://wx.qlogo.cn/mmopen/ajNVdqHZLLBZ0q8N3wBlQj6QibMRSgkHT3K0nribHBiaMw3888l5fqOcGJskibvCGgjYq5iaHFpW0pqsvOjUHdbsd6A/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlibY5jsiaicbsSSicicIJJaDP6gtxicQrXudVQs3UbWubicy4WNiaNd8Uua6XWpO1jsJq8vFrQvUrJtNbSBcjw70jeG7ubN/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlicQmGO8X1VZcvnIRrqysgYWsp9SAAco0vBXtynKczGtiam0gJ1pz5ZvbELaiaX0rwGkaPMwg9yd8cne0JUrpAp1Oe/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHblCyVfsh6trG4M3AsR9HR4qgZv8h1LMThHRA1s0wwQAoVoeBGpRJy3PAw4RDs8Tm5uXOQ1cucrGSZQwZa2KnXP/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ5x0XyoPBKXpSMicOnCaia4yHPvFTIPeaj10ic5fLpxqDE6ZibNcEYJ2qicfWLN0I5bMODtVibzmVc7vq5biaNRpVzbznv/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WnfHHsYtGMllwcMcPcSsEZnyfvOzSeNEibasNJHhH1Qia2ZDEhWib8dNbImZnZGFLb9Z1g9OXSY8J11s6Qq70BpnSoo/96', 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEKfv6SwrzPVicSvwPdl8ZP6Tx01koxSuTib7b7kNb27tZyicXufMx6EP8p0ejf7KibgrvZ37ib0l7rdstg/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oKiccFkKufc710TSia6u98jKSOelW0X3u2HSgzNTCGia6UicwQpVD6jXngBkuBItFThlZk87cx7ibHqTqW/96', 'http://wx.qlogo.cn/mmopen/ajNVdqHZLLBZ0q8N3wBlQj6QibMRSgkHT3K0nribHBiaMw3888l5fqOcGJskibvCGgjYq5iaHFpW0pqsvOjUHdbsd6A/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ74783FdxdedSadeKOpxeCGqkKvH4KicP8ibvexd4QcYZI8yGzXNAQ5iaIU0sgFRkReDVibkrZiaS6K86qm0rhZZp5aj/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ5Qjkwx80T1U7BFeuGzn3Z0JJ7W7sFnY6icjCLANVRIeI0k4UZTKccGHnKu4ypHCFQY6050YC2hSjy3PibRUvl9G1/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WneiaicfkPHjkZFiccS3dsC5pXj67viafXMqRYxjmfBiaYl2lgicibJgzRBzXEWMAFnJ8W08tHr66xqGYCmSN4RJic6Zm360/96', 'http://wx.qlogo.cn/mmopen/CpCibtib23t5CicZFK9jGz9cLrCbL4JNBc7TPs0OasS411m6OVbkM3NU8yd5CXtxicdsTjfTvkabw7nhGZE99vLnHxw821xpEBvb/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ74783FdxdedcpaVOXYkha8vF9p7YvS03E09QbZQxTRTokQ6lfrgZD2Cm0NxdzjPwLKo7nb23I3L1jcOypNkzq4/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlicQmGO8X1VZcurs6t5Os1dG5BzViaUhvj5LZIgy57Fsjy8icfZvkv8Q8hHVJGFRxnksicxlLQ9D2h1QTLmTyTZmU5E/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oKibPL8FNJY3N2G0FqOKqibwia4AYgAKGsNjGcOZ73WkE0iasJ06sHHoYcNoLUkR7x0dicyEZgGrKEFh39/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oK6dJv6Eic0kpbaW3YxGib2hVZnFnoQWouqehnQ3zSg15KicdqdI6DMdiaibA3ANQ5U4fXDFiaXl3wZNQA1/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlicQmGO8X1VZctvGQtXkl6iavd4hG9uJ5yayzMh8YKoR24DZGNY2xyXu2mRaRCUL49FUiaRsYe10z4crQmeBS4icWyS/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ4OibfqPuoeDMGl8KflcXgUeK6yCH00oeSMrbYXpyBPICwNDuvA0DIzswibb8gD0v0IhnXDZOwu0EzzbnjrI4uzibQ/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHY8Pvxstm5oK8lvicArHZUiabgFfkcT0Ua1bzM3KsN0awqaTrKQib8Gndpn1ibx5fsiaAfmAicmv82YGogoDBbNqJaibzG/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ74783FdxdedX4sykRv7TAgylicAadymu6aPYV8k5hibRhvHjKv2hhtNEzE6ZbML6LmoulgbnvCSzqf8BMvRXODN8/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHZQmicSeZiayv4iacRywULiaVM9r8Dymvc8ia4ESBBTwT9ZZyu4ViaNLczcoBUyv2auNMhhxhZmib0zt6dlKXUMwhchhL2/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAl9Px1zpjkpH8q23d4GqwV2ficcyMORJjkwoYERasgXtvTmDicibtDBItQeQ89ibQBkA5JN4O8TibbsVVw0IvNSrnRfOK/96', 'http://wx.qlogo.cn/mmopen/CpCibtib23t5DsyRo8hHuxb9TpICvgS8UB9FQicic2mjacpxIjc17js6WhmLNnWTibibW3mCMqj3GakULnEjPNeTvrG2K9mzOM6OEq/96', 'http://wx.qlogo.cn/mmopen/NFG2UYeaAlicQmGO8X1VZcgApJ9yyKsvfPcsjw8WcbkAWYZ2JhFQ9mObJBkl78DE5xV4OC0Nd7Fn50JJqKicbbwFib8ymBkY4W7/96', 'http://wx.qlogo.cn/mmopen/ajNVdqHZLLD7107Biackz45xD0tOT5EIhsyicc9uK9nFd0otQoKUcIMXysqyJ4EMKOSRicVuYOCY0eGk6W3n6keSJrLSzXjhy8am5dPT3yQpnk/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ74783FdxdedYjia67IXpp74nS3XaF5QJpibOmDbtHuM24ywypBTb3FILcZy0Dbb17lJBaQC6puZQMpYBiarnuFDZM/96', 'http://wx.qlogo.cn/mmopen/sv0wha7haJ6q2l4332xf9vwcxYTFSUVFWpicIDicIPNTzjmkicmgibw5XsLcLMVKS3EwUrYuiakMEslGUUhibjibzlI2xm4TurL0q9u/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4Wnc1W5krR5JOQ50AgF4lASm4hgoxMcEvpicqiau6jTpYMCxRI2I3WJ3fhb1f8bguDIUbd0xSH0ribnArGf5amuWZvcb/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WneLoBuBh55KOSCjickSOfK2EZdSYBNc1ibgicUtLl5KQ2EZlz1yALrPlrP2NJSt1W6TibYhJ43uWGkgNQ/96', 'http://wx.qlogo.cn/mmopen/dibCvqHg4WneyMQxEWGO9etribwpib93ozMkthzn2KGbVfhXerWsU6VhJDY1p6JA9aGHyoChkPHFY2YLiaoGIE2Gd0Qf32IVnUFa/96', 'http://wx.qlogo.cn/mmopen/icz582VuVOHYqftZbQ3FOEKRgcLK3sO7ickheADdxfrQ0tA9p1GcOeicYD6C8TxwCt9wyzvhCpuqCpQbibFaeicYyDGstiaeYMKmcp/96' ); var gundong_name=new Array( '彭先森用', '少司命', '☞公mthongbao', '阿迪姐姐.', '朋友', '新天亿官方', '西西哈', '雨若无痕', '無邪気', '学到老', '素雅', '赚客帮小雄', '专属§味道', '烟花、绽放过后只剩黑暗', '阿静', 'uan551618', '☞☞268630', '辰锦网络传媒。', '唐浩', '4345687', '巨花魔芋', '^_^尾巴', '天使^_^', '叫我王翔就好了。', '梦雪儿', '屁屁屁', '十五', '真性情', '✎﹏ℳ๓﹏恋ღ', '红包总裁', '兔子样?', '小姑凉', '【古风】', '青山', '东方', '滨州孙杰', '火爆捡钱', 'A今天', '小彩', 'Vroo', '李23', '日照孙磊', 'aerla', '巧巧', 'xuan', '嗯', '十一年', '彭先森', '莫小琳', '朋友', '谢明', '范二小超人?', '☞ongbao', '艾特', '丽丽', '创造机遇?', '少司命我的女神', '林佳鹏', 'suc0000', 'Q100773', '兔子样?', '小姑凉', '彭先亚', '【古风】', '我的女神', '满天红包☞', '东方', '朋友', 'aerla', '滨州孙杰', '十一年', '阿迪姐姐.', '范二小超人?', '巧巧', 'Vroo', '青山', 'A今天', '莫小琳', '嗯', '日照孙磊', 'huan888', '雨若无痕', '小彩', '满天飞☞☞4268630', 'xuan', '李23', '新天亿官方', 'waldenpond', '艾特', '思思' );var chouzhongjiangping=new Array('100元充值卡已领取!','Apple Watch已发货!','满天星手镯已发货!','20元话费卡已领取!','iPhone 6s已发货!' );