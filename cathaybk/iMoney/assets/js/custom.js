;(function($, win) {
$.fn.inViewport = function(cb) {
   return this.each(function(i,el) {
     function visPx(){
       var elH = $(el).outerHeight(),
           H = $(win).height(),
           r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
       return cb.call(el, Math.max(0, t>0? Math.min(elH, H-t) : Math.min(b, H)));  
     }
     visPx();
     $(win).on("resize scroll", visPx);
   });
};

}(jQuery, window));

// click
function menuToggle() {

  $('.c-hamburger').click(function(){
    $(".c-hamburger").toggleClass('active');
    $(".menu-panel").toggleClass('is-toggle');
    $("body").toggleClass('scroll-hide');
    return false;
  });
  
}

// sticky on scroll
function sticky() {

  $(window).scroll(function() {    
    var scroll = $(window).scrollTop();
    if (scroll >= 30) {
      $(".site-header").addClass("sticky");
      $("#back-to-top").removeClass("animated fadeOutDownBig").addClass("animated fadeInUpBig");
      $('#follow-pane').addClass('change-bottom');
    } else {
      $(".site-header").removeClass("sticky");
      $("#back-to-top").removeClass("animated fadeInUpBig").addClass("animated fadeOutDownBig");
      $('#follow-pane').removeClass('change-bottom');
    }
  });

  $(window).height(function() {    
    var scroll = $(window).scrollTop();
    if (scroll >= 30) {
      $(".site-header").addClass("sticky");
      $("#back-to-top").removeClass("animated fadeOutDownBig").addClass("animated fadeInUpBig");
      $('#follow-pane').addClass('change-bottom');
    } else {
      $(".site-header").removeClass("sticky");
      $("#back-to-top").removeClass("animated fadeInUpBig").addClass("animated fadeOutDownBig");
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


// scroll Reveal
function scrollreveal() {

  window.sr = ScrollReveal({ 
    reset: false,
    viewFactor: 0.1,
    duration: 500,
    scale: 1.00,
    opacity: 0,
    rotate: { x: 0, y: 0, z: 0 },
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  var fadeIn = {
    origin: "bottom",
    distance: "0px",
    duration: 500,
    scale: 1.00,
    delay: 100
  }

  var fadeInLeft = {
    origin: "left",
    duration: 500,
    scale: 1.00,
    delay: 100
  }

  var fadeInBottom = {
    origin: "bottom",
    distance: "50px",
    duration: 500,
    scale: 1.00,
    delay: 100
  }

  var zoomIn = {
    origin: "left",
    distance: "0",
    duration: 1000,
    scale: .5,
    opacity: 1,
    delay: 500
  }



  sr.reveal('.board-01 .brand',{ delay: 0, opacity: 0, duration: 1000 }, fadeInBottom);

  sr.reveal('.board .title',{ delay: 0, opacity: 0, duration: 1000 }, fadeInBottom);
  sr.reveal('.board .subtitle',{ delay: 100, opacity: 0, duration: 1000 }, fadeIn);
  sr.reveal('.board .link-row',{ delay: 100, opacity: 0, duration: 1000 }, fadeInBottom);
  sr.reveal('.board .board-04_u1',{ delay: 0, opacity: 0, duration: 1000 }, fadeInBottom);


  sr.reveal('.board-01 .icon-group .item', fadeInBottom, 100);
  sr.reveal('.board-03 .icon-group .item', fadeInBottom, 100);


  sr.reveal('.article-page .article-section', fadeInBottom);
  sr.reveal('.product-inner-page .product-section', fadeInBottom);

}



// collapse
function collapse() {

  $('.product-info__heading .notice-toggle').click(function () {
    $(this).toggleClass("is-active");
    $(".notice-block").toggleClass("is-view");
  });

}


(function($){

  $(window).load(function(){
    
    $("a[rel='m_PageScroll2id'],a[href='#top']").mPageScroll2id({
      forceSingleHighlight:true,
      offset:".site-header"
    });
    
    $(window).hashchange(function(){
      var loc=window.location,
        to=loc.hash.split("/")[1] || "#top";
      $.mPageScroll2id("scrollTo",to,{
        clicked:$("a[href='"+loc+"'],a[href='"+loc.hash+"']")
      });
    });

  });

})(jQuery);

$(document).ready(function(){

  sticky();
  menuToggle();
  scrollreveal();
  collapse();

  $('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      effectTime: 500,
      visibleOnly: true,
      combined: true,
      delay: 5000,
      threshold: 20
  });
  

  $('.sumoSelect').SumoSelect();

  function queryStringToObject(queryString) {
      var pairs = queryString.slice(1).split('&');

      var result = {};
      if (pairs.length < 1 || !pairs[0]) return result;

      pairs.forEach(function (pair) {
          pair = pair.split('=');
          result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      });
      
      return result;
  }

  function objectToQueryString(queryObj) {
      return $.map(queryObj, function (value, key) {
          return encodeURIComponent(key) + "=" + encodeURIComponent(value);
      }).join("&");
  }
  
  //inherit Url QueryString & merge href Querystring
  $("a[href]").each(function () {
      var href = $(this).attr("href");
      
      if (!href || href.indexOf("://") > 0 || href.indexOf("#") === 0) return;

      var hrefArray = href.split("?");

      var urlQueryObj = $.extend({}, queryStringToObject(location.search), queryStringToObject("?" + (hrefArray[1] || "")));

      var urlQuery = objectToQueryString(urlQueryObj);
      urlQuery = urlQuery ? "?" + urlQuery : urlQuery;

      $(this).attr("href", hrefArray[0] + urlQuery);
  });

});


/*
$(window).bind("load", function() {

  var timeout = setTimeout(function() {
    $("img.lazy, img[data-original]").trigger("sporty")
  }, 1500);

});
*/

$(window).load(function() {

  $("#loader").fadeOut(100,function() {
    $("body").removeClass("preload");
  });

});