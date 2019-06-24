$(document).ready(function(){

	$("#toggle").on("click", function(){
		 $(".line").toggleClass("on");
	    $(".menu").toggleClass('active');
	    $(".back_b").toggleClass("on");
	});
	$(".notice .t").on("click", function(){
		 $(".notice_n").toggleClass('notice_o');
		 $(".text").toggleClass("on",1500);
		 $(".text").animate({opacity: '1'});
	});
	

});
