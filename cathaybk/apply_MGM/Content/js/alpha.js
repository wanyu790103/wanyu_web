    $(function(){
		
		setTimeout(function () { $('.smart_say').css('display', 'none') }, 2000);
				$('.smart_alpha').click(function () {
					var $this = $(this);
					var cathayUrl = 'https://www.cathaybk.com.tw/ChatWeb/chat?traceType=branchId&traceValue=Chatweb';
					var iframe_src = $('.smart_box iframe').attr('src');
					if (iframe_src == '') {
						$('.smart_box iframe').attr('src', cathayUrl);
					}
					$this.hasClass('shut') ? $this.addClass('end') : $this.removeClass('end');
					$('.smart_box').toggle();
					$this.toggleClass('shut');
					$('.smart_say').css('display', 'none');
				});
				$('.m_icon').click(function () {
					var $this = $(this);
					var m_cathayUrl = 'https://www.cathaybk.com.tw/ChatWeb/chat?traceType=branchId&traceValue=Chatweb';
					var m_iframe_src = $('.m_smart_box iframe').attr('src');
					if (m_iframe_src == '') {
						$('.m_smart_box iframe').attr('src', m_cathayUrl);
					}
					$('.m_smart_box').addClass('on');
					$('.m_bg').css('display','block');
					$('body').addClass('on');
					$('.circCont').css('display','block');
					$('.circCont,.m_bg').click(function () {
						$('.m_smart_box').removeClass('on');
						$('.m_bg').css('display','none');
						$('body').removeClass('on');
					});					
				});

    });