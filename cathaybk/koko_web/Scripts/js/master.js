
$(function () {
	$('[data-id="js-collapse"]').on('click', function () {
			var $this = $(this);
			var $container = $(this).closest('.collapse');
			$this.toggleClass('on');
			$this.next('[data-content="collapse"]').slideToggle(300).toggleClass('open');
			if ($this.hasClass('on')) {
				setTimeout(function () {
					var offsetTop = $this.offset().top;
					$('body, html').animate({ scrollTop: offsetTop - $('header').outerHeight() });
				}, 350);
			}
		}).each(function () {
			if ($(this).hasClass('on')) {
				var $container = $(this).closest('.collapse');
				$(this).next('[data-content="collapse"]').show().addClass('open');
			}
		});

});

$(function () {

	$('.input_Freestyle').keyup(function(e){
			var input_Freestyle = $('.input_Freestyle').val();
	        $('.val_Freestyle').html(input_Freestyle);
	});

	$('.input_money').keyup(function(e){
			var input_money = $('.input_money').val();
	       if (input_money <= 4  || input_money >= 101  ) {
              $(".input_money").addClass("error");
			    $(".error_text").show("error");
			}else{
			   $(".input_money").removeClass("error");
			   $(".error_text").hide("error");
			}
	});


});
