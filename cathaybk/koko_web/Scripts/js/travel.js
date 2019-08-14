var status = moment().add(3,'hours').format('HH:00');;
console.log(status);




// var select1 = document.getElementById("selectDay");
// var options = ["01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","24:00"];
// for(var i = 0; i < options.length; i++) {
//     var opt = options[i];
//     var el = document.createElement("option");
//     el.textContent = opt;
//     el.value = opt;
//     select1.appendChild(el);
// }

$(".tab_content").hide();
$(".tab_content:first").show();
$(function() {
  $("#datepicker").datepicker({
      showOtherMonths : true,
      hideIfNoPrevNext : true,
      dateFormat:'yy-mm-dd',
      timeFormat: "HH:mm",
      minDate : "0d",
      maxDate : "+180d"
  });
});

	//fancyradio
	var fancyradio = {
		init: function () {
			$('.fancyRadio').each(function () {
				var el = $(this);
				var id = el.find('.fancyRadio__input:checked').attr('id');
				var $content = $('[data-for="' + id + '"]');
				if ($content.length) {
					$('[data-for="' + id + '"]').show();
					$(this).closest('.fancyRadio').addClass('open');
				}
			})
		},
		binding: function () {
			$('.fancyRadio__label').click(function () {
				var $container = $(this).closest('.fancyRadio');
				var $target = $('[data-for="' + $(this).attr('for') + '"]');
				var ISchecked = $(this).prev().prop('checked');
				if (ISchecked) {
					return false;
				}
				$container.siblings('.fancyRadio__content').slideUp(0);
				$target.slideDown(0);
				if ($target.length) {
					$(this).closest('.fancyRadio').addClass('open');
				} else {
					$(this).closest('.fancyRadio').removeClass('open');
				}
			});
		}
  };
  fancyradio.init();
  fancyradio.binding();


  
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
// vue
Vue.component('loading-screen', {
  template: '<div id="loading">Loading...</div>'
})
var app = new Vue({
  el: document.body,
  data: {
    user: {
      isLoading: true,
      time: ['01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00']
    }
  },
  mounted () {
    setTimeout(() => {
      this.isLoading = false
    }, 3000)
  }
  
})
