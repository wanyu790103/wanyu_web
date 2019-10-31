 $('.List_winner_lightbox').addClass('on');
 $('.lightbox_bg').addClass('on');
 $("document").ready(function () {
     $(".tab-slider--body").hide();
     $(".tab-slider--body:first").show();

     $(".tab-slider--nav li").click(function () {
         $(".tab-slider--body").hide();
         var activeTab = $(this).attr("rel");
         $("#" + activeTab).fadeIn();
         if ($(this).attr("rel") == "tab2") {
             $('.tab-slider--tabs').addClass('slide');
         } else {
             $('.tab-slider--tabs').removeClass('slide');
         }
         $(".tab-slider--nav li").removeClass("active");
         $(this).addClass("active");
     });
     $(".item_more1").click(function (e) {
         $(".item_moretext1").toggleClass("on");
     });
     $(".item_more2").click(function (e) {
         $(".item_moretext2").toggleClass("on");
     });

     $(".lightbox_bg.on").click(function (e) {
         $(this).removeClass("on");
         $(".List_winner_lightbox.on").removeClass("on");
     });
     $(".close_i").click(function (e) {
         $('.List_winner_lightbox.on').removeClass("on");
         $(".lightbox_bg.on").removeClass("on");
     });

     $(".p_buttom.green").click(function (e) {
         $(".List_winner_lightbox").addClass("on");
         $(".lightbox_bg").addClass("on");
         $('.List_winner_lightbox .close_i,.lightbox_bg').click(function () {
             $('.List_winner_lightbox').removeClass("on");
             $(".lightbox_bg").removeClass("on");
         });
     });
 });



 $(document).ready(function(){
    $(".lightBox").on("click", function(){
      $(".backDrop").animate({"opacity": "1"}, 500);
      $(".box").animate({"opacity": "1.0"}, 500);
      $(".backDrop, .box").css("display", "block");
      $(".surprise-egg").css("display", "none");
    });
    
    $(".active2item").on("click", function(){
        $(".backDrop").animate({"opacity": "1"}, 500);
        $(".active2box").animate({"opacity": "1.0"}, 500);
        $(".backDrop, .active2box").css("display", "block");
        $(".surprise-egg").css("display", "none");
    });
    $(".activeitem").on("click", function(){
        $(".backDrop").animate({"opacity": "1"}, 500);
        $(".activebox").animate({"opacity": "1.0"}, 500);
        $(".backDrop, .activebox").css("display", "block");
        $(".surprise-egg").css("display", "none");
    });

    $(".close, .backDrop").on("click", function(){
      closeBox();
    });
  
    function closeBox(){
      $(".backDrop, .box,.active2box, .activebox").animate({"opacity": "0"}, 500, function(){
      $(".backDrop, .box, .active2box, .activebox").css("display", "none");
      $(".surprise-egg").css("display", "block");
      });
    }
  
  });

  $('.down').click(function(){
    $('html,body').animate({scrollTop:$('#textactive').offset().top}, 800);
  });