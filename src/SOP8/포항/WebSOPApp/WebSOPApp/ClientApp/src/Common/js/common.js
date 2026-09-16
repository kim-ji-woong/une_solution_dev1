$(document).ready(function(){

	//GNB
	$('.mngMenu > li').hover(
		function () {
			$(this).addClass('on');
			$(this).children('ul').slideDown('fast');
		},
		function () {
			$(this).removeClass('on');
			$(this).children('ul').stop().slideUp('fast');
		} 
	);

	$('.mngAll > .container').html($('.mngMenu').clone());

	//전체메뉴
	$('.mngBtn').click(function(){
		if($(this).is('.on')) {
			$(this).removeClass('on');
			$('.mngAll').slideUp('fast');
		}else {
			$(this).addClass('on');
			$('.mngAll').slideDown('fast');
		}
	});
	

	//모바일2뎁스 메뉴
	$('.gnbMenu > li > span').click(function(){
		$(this).next('.gnbDepth').addClass('on');
		$('.gnbMo').addClass('wh');
	});	
	$('.gnbDepth > em').click(function(){
		$('.gnbDepth').removeClass('on');
		$('.gnbMo').removeClass('wh');
	});


	




	//scroll style
	$('.scrollbar-outer').scrollbar();


	//select
	$('.sarSel button').click(function(){
		if($(this).is('.on')) {			
			$(this).removeClass('on');
			$(this).next().slideUp();
		}else {
			$(this).addClass('on');
			$(this).next().slideDown();
		}
	});

	//treeview
	$('.treeview').hummingbird();





	$('.sopAcdn > dt').click(function(){
		if($(this).is('.on')) {
			$(this).removeClass('on');
			$(this).next().slideUp('fast');
		}else {
			$('.sopAcdn > dt').removeClass('on');
			$('.sopAcdn > dd').slideUp('fast');
			$(this).addClass('on');
			$(this).next().slideDown('fast');
		}
	});

	$('#splTgl').click(function(){
		if($(this).is('.on')) {
			$(this).removeClass('on');
			$('#spLft').animate({'left': '0px'});
			$('#spWrap').animate({'padding-left': '410px'});
		}else {
			$(this).addClass('on');
			$('#spLft').animate({'left': '-390px'});
			$('#spWrap').animate({'padding-left': '20px'});
		}
	});

	$('#spcTgl').click(function(){
		if($(this).is('.on')) {
			$(this).removeClass('on');
			$('.spcTools').animate({'width': '70px'});
			$('.spcCont').animate({'padding-left': '70px'});
		}else {
			$(this).addClass('on');
			$('.spcTools').animate({'width': '140px'});
			$('.spcCont').animate({'padding-left': '140px'});			
		}
	});

	$('.sprmAcdn > dt').click(function(){
		if($(this).is('.on')) {
			$(this).removeClass('on');
			$(this).next().slideUp('fast');
		}else {
			$('.sprmAcdn > dt').removeClass('on');
			$('.sprmAcdn > dd').slideUp('fast');
			$(this).addClass('on');
			$(this).next().slideDown('fast');
		}
	});

	$('.spcEye').click(function(){
		$(this).toggleClass('on');
	});

	$('#sqTgl').click(function(){
		if($(this).is('.on')) {
			$(this).removeClass('on');			
			if($(this).is('.stng')) {
				$('#sqLft').animate({'left': '-260px'});
				$('#sqWrap').animate({'padding-left': '15px'});
			} else {
				$('#sqLft').animate({'left': '-320px'});
				$('#sqWrap').animate({'padding-left': '15px'});
			};				
		}else {
			$(this).addClass('on');
			if($(this).is('.stng')) {
				$('#sqLft').animate({'left': '0px'});
				$('#sqWrap').animate({'padding-left': '275px'});
			} else {
				$('#sqLft').animate({'left': '0px'});
				$('#sqWrap').animate({'padding-left': '335px'});
			}
		}
	});



	$('.dsmAcdn > dt').click(function(){
		if($(this).is('.on')) {
			$(this).removeClass('on');
			$(this).next().slideUp('fast');
		}else {
			$('.dsmAcdn > dt').removeClass('on');
			$('.dsmAcdn > dd').slideUp('fast');
			$(this).addClass('on');
			$(this).next().slideDown('fast');
		}
	});



	//datepicker
	 $('.dtPkr').datepicker({
		dateFormat: 'yy-mm-dd'
		,monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'] //달력의 월 부분 텍스트
		,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
		,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
		,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
	});


	/*웹페이지 열었을 때*/
	$("#lightRedICO").show();
	$("#lightGrayICO").hide();
	/*light_redICO 클릭했을 때 light_grayICO 보여줌*/
	$("#lightRedICO").click(function () {
		$("#lightRedICO").hide();
		$("#lightGrayICO").show();
	});

	/*light_grayICO 클릭했을 때 light_redICO 보여줌*/
	$("#lightGrayICO").click(function () {
		$("#lightRedICO").show();
		$("#lightGrayICO").hide();
	});


	/*웹페이지 열었을 때*/
	$("#lightRedICO2").show();
	$("#lightGrayICO2").hide();
	/*light_redICO2 클릭했을 때 light_grayICO2 보여줌*/
	$("#lightRedICO2").click(function () {
		$("#lightRedICO2").hide();
		$("#lightGrayICO2").show();
	});
	/*light_grayICO2 클릭했을 때 light_redICO2 보여줌*/
	$("#light_grayICO2").click(function () {
		$("#lightRedICO2").show();
		$("#lightGrayICO2").hide();
	});


	/*웹페이지 열었을 때*/
	$("#lightRedICO03").show();
	$("#lightGrayICO03").hide();
	/*light_redICO 클릭했을 때 light_grayICO 보여줌*/
	$("#lightRedICO03").click(function () {
		$("#lightRedICO03").hide();
		$("#lightGrayICO03").show();
	});
	/*light_grayICO 클릭했을 때 light_redICO 보여줌*/
	$("#lightGrayICO03").click(function () {
		$("#lightRedICO03").show();
		$("#lightGrayICO03").hide();
	});


	/*웹페이지 열었을 때*/
	$("#lightRedICO4").show();
	$("#lightGrayICO4").hide();
	/*light_redICO2 클릭했을 때 light_grayICO2 보여줌*/
	$("#lightRedICO4").click(function () {
		$("#lightRedICO4").hide();
		$("#lightGrayICO4").show();
	});
	/*light_grayICO2 클릭했을 때 light_redICO2 보여줌*/
	$("#lightGrayICO4").click(function () {
		$("#lightRedICO4").show();
		$("#lightGrayICO4").hide();
	});
});

// 하단 버튼
function popupBtmBtn() {
	var popup = document.getElementById("BTMPopup");
	popup.classList.toggle("hide");
}

$("#BTMPopup > span").click(function () {
	$(".popupBtmIcon").hide();
});

$("#BTMPopup .popuptextLine").click(function () {
	$(".popupBtmIcon").show();
});

// tabmenu
$(function () {

	$(".tabcontent").hide();
	$(".tabcontent:first").show();

	$("ul.tabs li").click(function () {
		$("ul.tabs li").removeClass("active").css("color", "#fff");
		//$(this).addClass("active").css({"color": "darkred","font-weight": "bolder"});
		$(this).addClass("active").css("color", "#fff");
		$(".tabcontent").hide()
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).fadeIn()
	});
});

$(function () {

	//첫번째 제1공장, 제 2공장, 제 3공장, 제 4공장 클릭
	$('.viewListHead').click(function () {
		//1뎁스 밑에 있는 하위메뉴 초기화 
		$('.viewListDo .viewListConts').removeClass("on");

		$('.viewList2Depth').removeClass("on");
		$('.viewList3Depth').removeClass("on");
		$('.viewList4Depth').removeClass("on");
		$('.viewList5Depth').removeClass("on");


		$(this).parent().next().addClass("on");

	})

	//두번째 제 1공장~4공장 밑에 1동 ~ 4동 클릭
	$(".viewList1Depth").click(function () {
		$('.viewList2Depth').removeClass("on");
		$('.viewList3Depth').removeClass("on");
		$('.viewList4Depth').removeClass("on");
		$('.viewList5Depth').removeClass("on");
		$(this).next().addClass("on");
	})


	//세번쨰 1층 ~ 2층 클릭
	$(".viewList2DepthHead").click(function () {
		$('.viewList3Depth').removeClass("on");
		$('.viewList4Depth').removeClass("on");
		$('.viewList5Depth').removeClass("on");
		$(this).next().addClass("on");
	})



	// 3뎁스
	$(".viewList3DepthHead").click(function () {
		$('.viewList4Depth').removeClass("on");
		$('.viewList5Depth').removeClass("on");
		$(this).next().addClass("on");
	})


	// 4뎁스 viewList_4Depth 
	$(".viewList4Depth > li").click(function () {
		$('.viewList5Depth').removeClass("on");
		$(this).find(".viewList5Depth").addClass("on");
	})

	/*
	$(".viewList_1Depth").click(function(){
	  $(this).next().addClass("on");
	})
	*/

})



$(window).bind('scroll', function() {

	if ($(window).scrollTop() > 400) {
		$('#ftQuick').addClass('show');			 
	} else {
		$('#ftQuick').removeClass('show');
	}
});