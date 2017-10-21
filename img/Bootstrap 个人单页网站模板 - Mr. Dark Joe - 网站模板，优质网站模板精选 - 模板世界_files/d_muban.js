$(function(){
	$('.collection').click(function(){
		
		collect();
	});
	
	var $drank=$('.d-rank');
	$drank.find('.r1-tab span').mouseenter(function(){
		$this=$(this);
		if(!$this.hasClass('active')){
			$drank.find('.r1-tab .active').removeClass('active');
			$this.addClass('active');
			$drank.find('.tab').hide();
			$drank.find('.'+$this.attr('name')).show();
		}
	});
	
	//详情页右侧悬浮广告
	//dFixed();
	
	//生成预览地址二维码
	QRcode();
	
	
	//刷新随机推荐
	$('#reRandom').click(function(){
		reRandom();
	});
	
	//喜欢
	//like();
	
	//下载用 验证码
	fn_verify();
})

function collect(){
	var _hasActive=$('.collection').hasClass('collection_active');//是否已收藏
	var _proId=$('.product .d-head').attr('data-proId');//当前产品id
	
	if(_hasActive){
		//已收藏	
		$.ajax({
			url:'/index.php?s=home/article/collection',
			data:"id="+_proId+"&plus=0",
			success:function(data){
				if(data.status){
					_num=$('.collection .s-num').html();
					$('.collection .s-text').html('收藏');
					$('.collection .s-num').html(--_num);
					$('.collection').removeClass('collection_active');
				}else{
					//alert(data.info);
					window.location.href = data.url;
				}
			}
		})
	}else{
		//未收藏
		$.ajax({
			url:'/index.php?s=home/article/collection',
			data:"id="+_proId+"&plus=1",
			success:function(data){
				if(data.status){
					_num=$('.collection .s-num').html();
					$('.collection .s-text').html('已收藏');
					$('.collection .s-num').html(++_num);
					$('.collection').addClass('collection_active');
				}else{
					//alert(data.info);
					window.location.href = data.url;
				}
			}
		})
	}
	
	
}

function dFixed(){
	var $dfixed=$('.d-fixed');
	var dTop=$dfixed.offset().top-6;
	$(window).scroll(function(){
		if($(window).scrollTop()>dTop){
			$dfixed.css({'position':'fixed','top':'60px'});
		}else{
			$dfixed.css({'position':'static','top':0});
		};
	});
}

function QRcode(){
	//生成二维码
	var _url='http://www.templatesy.com'+$('.d-liveEdit .view').attr('href');
	var $QRcode=$('#QRcode');
	$QRcode.qrcode({
		//render	: "table",
		text: _url,
		width:"100",
		height:"100"
	});
}

var $moreUL=$('.d-more ul');
function reRandom(){
	$.ajax({
		url:"/index.php?m=Home&c=Article&a=position",
		data:{
			'flag':2,
			'limit':8,
			'from':1
		},
		dataType:"json",
		success:function(res){
			$moreUL.removeClass('ul-in');
			$moreUL.parent().append('<span class="loading">loading...</span>');
			var _len=res.length;
			var _arr="";
			for(i=0; i<_len;i++){
				_arr+='<li><a  target="_blank" class="image" href="/Article/'+res[i]["id"]+'.html"><img title="'+res[i]["title"]+'"src="'+res[i]["cover_path"]+'" /></a><a  target="_blank" href="/Article/'+res[i]["id"]+'.html" class="pro-name">'+res[i]["title"]+'</a></li>';
			};
			$moreUL.html(_arr);
			setTimeout(function(){
				$moreUL.parent().find('.loading').remove();
				$moreUL.addClass('ul-in');
			},500);
			
		}
	})
}


//喜欢
function like(){
	//localStorage.clear();//测试用 - 清空localStorage
	var _islike;
	var _proId=$('.product .d-head').attr('data-proId');//当前模板id
	var _arr;
	var $like=$('.product .head-info .like');
	
	//进入页面是判断
	_arr=JSON.parse(localStorage.getItem('template'+_proId));
	if(_arr!=null&&_arr.islike==1){
		$like.addClass('liked');
		$like.find('i').removeClass('icon-gray').addClass('icon-red');
	}
	
	$like.click(function(){
		//获取本地储存，_islike:1=>已喜欢，不等于1=>未喜欢
		_arr=JSON.parse(localStorage.getItem('template'+_proId));
		
		var $this=$(this);
		
		if(_arr==null){
			//设为已喜欢
			_arr= new Object();
			_arr.islike=1;//以对象形式储存
			var json=JSON.stringify(_arr);//转换为json类型储存到localStorage中
			localStorage.setItem('template'+_proId,json);
			
			//设为已喜欢
			like_add($this,_proId);
			return;
		};
		
		_islike=_arr.islike;
		if(_islike!=1){
			//设为已喜欢
			_arr.islike=1;
			like_add($this,_proId);
		}else{
			//设为未喜欢
			_arr.islike=0;
			like_cancel($this,_proId);
		}
		localStorage.setItem('template'+_proId,JSON.stringify(_arr));
	})
}

function like_add(el,proId){
	//设置已喜欢的样式
	el.addClass('liked');
	el.find('i').removeClass('icon-gray').addClass('icon-red');
	var _likeNum=parseInt($('.product .head-info .like .num').text());
	$.cookie('like_type','inc');
	//-----------------当前模板的喜欢数量增加 ------------------------
	$.ajax({
		url:"/index.php/Home/Article/like_updown",
		data:{
			'id':proId,
		},
		success:function(res){
			alert(res);
			if(res==1){
				$('.product .head-info .like .num').text(_likeNum+1);
			}
		}
	})
	 
}

function like_cancel(el,proId){
	//设置未喜欢的样式
	el.removeClass('liked');
	el.find('i').removeClass('icon-red').addClass('icon-gray');
	var _likeNum=parseInt($('.product .head-info .like .num').text());
	if(_likeNum==0){
		alert('抱歉，出现错误，不能继续执行');
		return false;
	};
	$.cookie('like_type','dec');
	//-----------------当前模板的喜欢数量减少 ------------------------
	$.ajax({
		url:"/index.php/Home/Article/like_updown",
		data:{
			'id':proId,
		},
		success:function(res){
			alert(res);
			if(res==1){
				$('.product .head-info .like .num').text(_likeNum-1);
			}
		}
	})
}


function fn_verify(){
	//表单提交
	var $verifyWrapInput=$('.verifyWrap input');
	$(document)
		.ajaxStart(function(){
			$verifyWrapInput.on('keydown',function(){
				if(window.event.keyCode == 13)return false;
			}).css('opacity','.1');
			
		})
		.ajaxStop(function(){
			$verifyWrapInput.unbind('keydown').css('opacity',1);
		});

	var $downloadWrap=$('.downloadWrap');
	var $downloadBtn=$downloadWrap.find('.download');
	$downloadBtn.click(function(){
		//当为外部链接的时候，直接跳转，没有验证码
		if(!$downloadBtn.hasClass('link_pan')){
			$downloadWrap.addClass('download-active');
			$('.input-veri').focus();
		}
	})

	$("form").submit(function(){
		var self = $(this);
		$.post(self.attr("action"), self.serialize(), success, "json");
		return false;

		function success(data){
			if(data.status){
				location.href=data.url;//在当前页面下载
				$downloadWrap.removeClass('download-active');
				$('.input-veri').focus().css('border-color','#e8e8e8');
				//刷新验证码
				$(".reloadverify").click();
			} else {
				alert(data.info);
				$('.input-veri').focus().css('border-color','green');
				//刷新验证码
				$(".reloadverify").click();
			}
		}
	});
	
	//刷新验证码
	var verifyimg = $(".verifyimg").attr("src");
	$(".reloadverify").click(function(){
		if( verifyimg.indexOf('?')>0){
			$(".verifyimg").attr("src", verifyimg+'&random='+Math.random());
		}else{
			$(".verifyimg").attr("src", verifyimg.replace(/\?.*$/,'')+'?'+Math.random());
		}
	});
	
	
	
	
}