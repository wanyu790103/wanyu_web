  for(var i=0; i<$('.descript').length; i++) {
            initSwaper($('.descript').eq(i));
        }
        $('.bannerlink').on('click', function() {
            var linkUrl = $(this).attr('href');
            window.location.href = linkUrl;
        });

        function initSwaper(target) {
            var des = target;
            var wrapper = des.find('.descript_body-wrapper');
            var body = des.find('.descript_body');
            var slide = des.find('.slide');
            var link = des.find('.link');
            var activeIdx = 0;
            var speed = 300;

            link.on('click', function() {
                activeIdx = $(this).index();
                moveSlide();
            });
            $(window).resize(function() {
                var idx = des.find('.link.active').index();
                if (idx === -1) return;

                var height = slide.eq(idx).outerHeight(true);
                body.stop().animate({
                    height: height,
                }, speed);
            });
            // moveSlide();
            function moveSlide() {
                var height = slide.eq(activeIdx).outerHeight(true);
                if (link.eq(activeIdx).hasClass('active')) {
                    link.removeClass('active');
                    height = 0;
                } else {
                    link.removeClass('active')
                        .eq(activeIdx)
                        .addClass('active');
                }
                
                wrapper.animate({
                    left: 100 * activeIdx * -1 + '%',
                }, speed);
                body.stop().animate({
                    height: height,
                }, speed);
            }
        }// JavaScript Document