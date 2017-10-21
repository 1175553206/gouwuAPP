$(function(){
	
	menu();
})
function menu(){
	//导航动画效果
	/*var _len=$('.menu .m1').length;
	for(i=0;i<_len;i++){
		$('.menu .m1').eq(i).animate({'top':60*i+100+'px'},950+i*200);
	}*/
	
	//top
	$(window).scroll(function(){
		if($(window).scrollTop()>100)
		{
			$('.menu .m-top').fadeIn(300);
		}else{
			$('.menu .m-top').fadeOut(300);	
		}
		
	})
	$('.menu .m-top').click(function(){
		$('body').animate({'scrollTop':0},500);//chrome
		$('html').animate({'scrollTop':0},500);//ie ff
	})
	
	//显示二级导航
	$('.menu .m1').mouseenter(function(){
		$('.menu .m1 .in').hide();
		$(this).find('.in').show();
	})
	$('.menu .m1').mouseleave(function(){
		$('.menu .m1 .in').hide();
	})
	
}

function menu_in_open(){
	$('.menu').addClass('menu-active');
	_menu_ani=$('.menu-in').animate({'opacity':'1','left':'50px'},150);
	$('.menu-in').fadeIn(200);
}
function menu_in_close(){
	$('.menu').removeClass('menu-active');
	_menu_ani=$('.menu-in').animate({'opacity':0,'left':'40px'},200);
	$('.menu-in').fadeOut(200);
}