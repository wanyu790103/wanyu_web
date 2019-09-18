
$(".tab_content").hide();
$(".tab_content:first").show();

  
//tab mode

   $("ul.tabs_list li").click(function() {
   
     $(".tab_content").hide();
     var activeTab = $(this).attr("rel"); 
     $("#"+activeTab).fadeIn();		
     $("ul.tabs_list li").removeClass("active");
     $(this).addClass("active");

     $(".tab-accordion_heading").removeClass("d_active");
     $(".tab-accordion_heading[rel^='"+activeTab+"']").addClass("d_active");
      target= $('.tabs_list');
        $('html,body').animate({
          scrollTop: target.offset().top-110
        }, 1000);
   
   });

 /* acoordion mode */

 $(".tab-accordion_heading").click(function() {
     
     $(".tab_content").hide();
     var d_activeTab = $(this).attr("rel"); 
     $("#"+d_activeTab).fadeIn();
   
    $(".tab-accordion_heading").removeClass("d_active");
     $(this).addClass("d_active");
   
     $("ul.tabs_list li").removeClass("active");
     $("ul.tabs_list li[rel^='"+d_activeTab+"']").addClass("active");
      
   if ( $( this ).hasClass( "d_active" ) ) {
            $(this).removeClass("d_active");
            $("#"+d_activeTab).fadeIn();
   }
  
   });


// sticky on scroll
function sticky() {

  $(window).scroll(function() {    
    var scroll = $(window).scrollTop();
    if (scroll >= 30) {

      $('#follow-pane').addClass('change-bottom');
    } else {
      $('#follow-pane').removeClass('change-bottom');
    }
  });

  $(window).height(function() {    
    var scroll = $(window).scrollTop();
    if (scroll >= 30) {
      $('#follow-pane').addClass('change-bottom');
    } else {
      $('#follow-pane').removeClass('change-bottom');
    }
  });
  $('.page-control').inViewport(function(px){
    if(px >0){
      $('#follow-pane').addClass('reset-fixed animated fadeIn');
    }
    else{
      $('#follow-pane').removeClass('reset-fixed animated fadeIn');
    }
  });

}


$(function () {
	$('.owl-carouselphone').owlCarousel({
		margin:10,
		nav:false,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:1
			},
			1000:{
				items:3
			}
		}
  })
  
  $('.owl-itemjQ-owl').owlCarousel({
    autoplayHoverPause: true,
    margin:5,
    responsiveClass: true,
    nav: true,
    stagePadding: 100,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      960: {
        items:3
      },
      1000: {
        items:4
      },
      1600: {
        items: 5
      }
    }

  })
});

