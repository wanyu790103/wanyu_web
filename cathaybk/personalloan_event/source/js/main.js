var Main = Main || (function(global, $) {
    var settings = {},
		defaults = {
            kvTimer: 2000,
            debug: true
        },

        $preload,
        $loaderProcess,

        $wrapper,
        $headerContent,
        $text_in,
        $topBanner,
        $visitor_count,

        currentShow = 0,
        kvInterval = 0,
        sliderInterval = 0,
        processing = false,
        desktop = false,
        screenType = '',
        loadImgSize = 0,
        pagePercent = 0,
        anPercent = 0,

        init = function(opts) {
            settings = $.extend( defaults, opts || {} );

            $wrapper = $('.wrapper');
            $preload = $('#preload');
            $loaderProcess = $('.process', $preload);
            loadImgSize = $('.load').length + $('img').length;

            var loadCssName = '.load';
            if (window.innerWidth < 1280) {
                loadImgSize += $('.sm-load').length;
                loadCssName += ', .sm-load';
            } else {
                loadImgSize += $('.lg-load').length;
                loadCssName += ', .lg-load';
            }

            Main.log( 'load size: ' + loadImgSize + ', className: ' + loadCssName );
            var loadedCount = 0;

            $('body').imagesLoaded( { background: loadCssName }, function() {
                //_pageStart();
            }).progress( function( instance, image ) {
                loadedCount++;
                var percent = Math.floor((loadedCount) / loadImgSize * 100);
                Main.log( percent + '% -> ' + image.img.src );
                Main.updatePercent(percent, 'page');
            });
            
            $headerContent = $('.headerContent');
            $text_in = $('.text_in', $wrapper);
            $topBanner = $('.top_banner', $text_in);
            $visitor_count = $('.visitor_count', $topBanner);

            if (device.desktop()) {
                desktop = true;
            }

            $(window).scroll(function() {
                scroll();
            });
            scroll();

            FastClick.attach(document.body);

            menuInit();
            kvinit();
            sliderInit();
            knowledgeInit();

            Main.log('----- Main.init -----');
        },

        updatePercent = function(p, type) {
            if ($loaderProcess == undefined) {
                return;
            }
            if (type == 'page') {
                if (p < 95) {
                    $loaderProcess.text(p + '%');
                } else {
                    $loaderProcess.text('95%');
                }
            } else {
                if (p = 100) {
                    $loaderProcess.text('100%');
                    pageStart();
                }
            }


            /*if (type == 'page') {
                pagePercent = p;
            } else {
                anPercent = p;
            }
            var percent = Math.floor((pagePercent + anPercent) * .5);
            $loaderProcess.text(percent + '%');
            if (percent == 100) {
                pageStart();
            }*/
        },
        
        bodyGo2 = function(scrollTop, time, callback) {
            var duration = time;
            if (duration === undefined) {
                duration = 800;
            }

            $('html, body').stop().animate({
                scrollTop: scrollTop
            }, duration, 'easeInOutCubic', function() {
                if (typeof callback === 'function' && $(this).context.localName === 'body') {
                    callback();
                }
            });
        },

        go2 = function(target, menuClose) {
            var gotop = $(target, $text_in).offset().top - $headerContent.height();
            Main.bodyGo2(gotop);

            if (menuClose == true && $wrapper.width() == 640) {
                $('#toggle', $headerContent).trigger('click');
            }
        },

		log = function(msg) {
			if (settings.debug) {
				console.log(msg);
			}
		},

		dir = function(obj) {
			if (settings.debug) {
				console.dir(obj);
			}
        };

    function pageStart() {
        Main.log('pageStart');
        loadComplete();
    }

    function loadComplete() {
        $loaderProcess.text('100%');
        $('.load').removeClass('load');
        $('.lg-load').removeClass('lg-load');
        $('.sm-load').removeClass('sm-load');
        $('#hidden-pic').remove();

        var $preload = $('#preload');
        $preload.fadeOut(function() {
            $loaderProcess = undefined;
            $preload.remove();
            $('body').removeClass('loading');
        });

        $(window).resize(function() {
            resize();
        }).resize();
    }

    function menuInit() {
        var $headerContent = $('.headerContent'),
            $menuN3 = $('.navi .n3', $headerContent),
            $menuN4 = $('.navi .n4', $headerContent);

        $menuN3.hover(function() {
            $menuN4.addClass('hover');
        }, function() {
            $menuN4.removeClass('hover');
        });
    }

    function kvinit() {
        var $kv = $('.kv', $text_in),
            $btn = $('.btn', $kv),
            $show = $('.show', $kv);

        changeKvShow($show);

        if (!desktop) {
            $btn.bind('click', function(e) {
                e.preventDefault();

                var index = $btn.index(this);
                $show.eq(index).stop().fadeIn();
                $show.each(function(idx, elm) {
                    if (idx == index) {
                        return;
                    }
    
                    $(elm).stop().fadeOut();
                });
                clearTimeout(kvInterval);
            });
        } else {
            $btn.hover(function() {
                var index = $btn.index(this);
    
                $show.eq(index).stop().fadeIn();
                $show.each(function(idx, elm) {
                    if (idx == index) {
                        return;
                    }
    
                    $(elm).stop().fadeOut();
                });
                clearTimeout(kvInterval);
            }, function() {
                var index = $btn.index(this);
    
                $show.eq(index).stop().fadeOut();
            });
        }
    }

    function changeKvShow($show) {
        $show.eq(currentShow).fadeIn(function() {
            kvInterval = setTimeout(function() {
                $show.eq(currentShow).fadeOut();
                currentShow++;
                if (currentShow > $show.length - 1) {
                    currentShow = 0;
                }
                changeKvShow($show);
            }, settings.kvTimer);
        });
    }

    function sliderInit() {
        var $slider_banner = $('.slider_banner', $text_in),
            $slider = $('.slider', $slider_banner),
            $item = $('.item', $slider),
            $arrow = $('.arrow', $slider),
            $navi = $('.navi ul', $slider),
            $naviBtn,
            length = $item.length,
            current = 0, next = 0;

        $navi.children().remove();
        for(var i = 0; i < length; i++) {
            $navi.append('<li><a href="#"' + (i == 0 ? ' class="current"' : '') + '> '+ (i + 1) +' </a></li>');
        }
        $naviBtn = $('a', $navi);

        if (length == 1) {
            $arrow.css('display', 'none');
            $navi.css('display', 'none');
        } else {
            loopSlider();
        }

        function loopSlider() {
            sliderInterval = setTimeout(function() {
                next = current + 1;
    
                if (next > length - 1) {
                    next = 0;
                }
    
                setTimeout(function() {
                    $naviBtn.removeClass('current');
                    $naviBtn.eq(next).addClass('current');
                }, 700);
    
                changeSliderItem($item, current, next, function() {
                    current = next;
                });
                loopSlider();
            }, settings.kvTimer + 1000);
        }

        $arrow.bind('click', function(e) {
            e.preventDefault();

            if (processing) {
                return;
            }

            clearTimeout(sliderInterval);

            if ($(this).hasClass('next')) {
                next = current + 1;

                if (next > length - 1) {
                    next = 0;
                }
            } else {
                next = current - 1;

                if (next < 0) {
                    next = length - 1;
                }
            }

            setTimeout(function() {
                $naviBtn.removeClass('current');
                $naviBtn.eq(next).addClass('current');
            }, 700);

            changeSliderItem($item, current, next, function() {
                current = next;
            });
        });
        
        $naviBtn.bind('click', function(e) {
            e.preventDefault();

            if (processing) {
                return;
            }

            if ($(this).hasClass('current')) {
                return;
            }

            clearTimeout(sliderInterval);

            next = $naviBtn.index(this);

            $naviBtn.each(function(idx, elm) {
                if ($(elm).hasClass('current')) {
                    current = idx;
                    return false;
                }
            });

            $naviBtn.removeClass('current');
            $(this).addClass('current');

            changeSliderItem($item, current, next, function() {
                current = next;
            });
        });
    }

    function changeSliderItem($item, current, next, callback) {
        processing = true;
        var tm = new TimelineLite({ onComplete: function() {
            processing = false;
            TweenMax.set($item.eq(current), { css: { display: 'none' } });
            callback();
        } });
        
        tm.add([
            TweenMax.to($item.eq(current), .5, { css: { opacity: 0 }, ease: Power4.easeInOut }),
            function() {
                TweenMax.set($item.eq(next), { css: { opacity: 0, display: 'block' } });
            },
            TweenMax.to($item.eq(next), .5, { css: { opacity: 1 }, delay: .2, ease: Power4.easeInOut })
        ]);
    }

    function knowledgeInit() {
        var $qa = $('.qa', $text_in),
            $switch = $('.question a', $qa),
            $answer = $('.answer', $qa);

        $switch.bind('click', function(e) {
            e.preventDefault();
            
            var index = $switch.index(this),
                $currentAns = $answer.eq(index);

            if (!$(this).hasClass('active')) {
                $(this).addClass('active');

                $currentAns.slideDown();
            } else {
                $(this).removeClass('active');

                $currentAns.slideUp();
            }
        });
    }

    function resize() {
        if (window.innerWidth < 1280) {
            scroll();
            if (screenType == 'sm') {
                return;
            }
            $topBanner.find('.title .sm').attr('src', 'assets/tit_m.html');
            $topBanner.find('.title .lg').attr('src', 'assets/empty.html');
            screenType = 'sm';
        } else {
            if (screenType == 'lg') {
                return;
            }
            $topBanner.find('.title .lg').attr('src', 'assets/tit_pc.html');
            $topBanner.find('.title .sm').attr('src', 'assets/empty.html');
            screenType = 'lg';
        }
    }

    function scroll() {
        var st = $(window).scrollTop();

        if (window.innerWidth >= 1280) {
            return;
        }

        if ((st + window.innerHeight - 51) > ($text_in.innerHeight() + $headerContent.height())) {
            $visitor_count.css('bottom', '60px');
        } else {
            $visitor_count.css('bottom', '0px');
        }
    }

    return {
        init: init,
        bodyGo2: bodyGo2,
        go2: go2,
        updatePercent: updatePercent,
        loadComplete: loadComplete,
        log: log,
		dir: dir
	}
})(window, jQuery);

$(window).on('load', function() {
    kvAnInit();
    Main.log('window.loaded');
});

function kvAnInit() {
    (function() {
        var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
        function init() {
            canvas = document.getElementById("canvas");
            anim_container = document.getElementById("animation_container");
            dom_overlay_container = document.getElementById("dom_overlay_container");

            var comp=AdobeAn.getComposition("2A10FC6259016648901745597D4625F6");
            var lib=comp.getLibrary();
            var loader = new createjs.LoadQueue(false);
            loader.addEventListener("fileload", function(evt){handleFileLoad(evt,comp)});
            loader.addEventListener("complete", function(evt){handleComplete(evt,comp)});
            loader.addEventListener("progress", function(evt){handleProgress(evt,comp)});
            var lib=comp.getLibrary();
            loader.loadManifest(lib.properties.manifest);
        }
        function handleFileLoad(evt, comp) {
            var images=comp.getImages();	
            if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }	
        }
        function handleComplete(evt,comp) {
            //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
            var lib=comp.getLibrary();
            var ss=comp.getSpriteSheet();
            var queue = evt.target;
            var ssMetadata = lib.ssMetadata;
            for(i=0; i<ssMetadata.length; i++) {
                ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
            }
            exportRoot = new lib.kv();
            stage = new lib.Stage(canvas);	
            //Registers the "tick" event listener.
            fnStartAnimation = function() {
                stage.addChild(exportRoot);
                createjs.Ticker.setFPS(lib.properties.fps);
                createjs.Ticker.addEventListener("tick", stage)
                stage.addEventListener("tick", handleTick)
                function getProjectionMatrix(container, totalDepth) {
                    var focalLength = 528.25;
                    var projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
                    var scale = (totalDepth + focalLength)/focalLength;
                    var scaleMat = new createjs.Matrix2D;
                    scaleMat.a = 1/scale;
                    scaleMat.d = 1/scale;
                    var projMat = new createjs.Matrix2D;
                    projMat.tx = -projectionCenter.x;
                    projMat.ty = -projectionCenter.y;
                    projMat = projMat.prependMatrix(scaleMat);
                    projMat.tx += projectionCenter.x;
                    projMat.ty += projectionCenter.y;
                    return projMat;
                }
                function handleTick(event) {
                    var cameraInstance = exportRoot.___camera___instance;
                    if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
                    {
                        cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
                        cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
                        if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
                        cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
                    }
                    applyLayerZDepth(exportRoot);
                }
                function applyLayerZDepth(parent)
                {
                    var cameraInstance = parent.___camera___instance;
                    var focalLength = 528.25;
                    var projectionCenter = { 'x' : 0, 'y' : 0};
                    if(parent === exportRoot)
                    {
                        var stageCenter = { 'x' : lib.properties.width/2, 'y' : lib.properties.height/2 };
                        projectionCenter.x = stageCenter.x;
                        projectionCenter.y = stageCenter.y;
                    }
                    for(child in parent.children)
                    {
                        var layerObj = parent.children[child];
                        if(layerObj == cameraInstance)
                            continue;
                        applyLayerZDepth(layerObj, cameraInstance);
                        if(layerObj.layerDepth === undefined)
                            continue;
                        if(layerObj.currentFrame != layerObj.parent.currentFrame)
                        {
                            layerObj.gotoAndPlay(layerObj.parent.currentFrame);
                        }
                        var matToApply = new createjs.Matrix2D;
                        var cameraMat = new createjs.Matrix2D;
                        var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
                        var cameraDepth = 0;
                        if(cameraInstance && !layerObj.isAttachedToCamera)
                        {
                            var mat = cameraInstance.getMatrix();
                            mat.tx -= projectionCenter.x;
                            mat.ty -= projectionCenter.y;
                            cameraMat = mat.invert();
                            cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
                            cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
                            if(cameraInstance.depth)
                                cameraDepth = cameraInstance.depth;
                        }
                        if(layerObj.depth)
                        {
                            totalDepth = layerObj.depth;
                        }
                        //Offset by camera depth
                        totalDepth -= cameraDepth;
                        if(totalDepth < -focalLength)
                        {
                            matToApply.a = 0;
                            matToApply.d = 0;
                        }
                        else
                        {
                            if(layerObj.layerDepth)
                            {
                                var sizeLockedMat = getProjectionMatrix(parent, layerObj.layerDepth);
                                if(sizeLockedMat)
                                {
                                    sizeLockedMat.invert();
                                    matToApply.prependMatrix(sizeLockedMat);
                                }
                            }
                            matToApply.prependMatrix(cameraMat);
                            var projMat = getProjectionMatrix(parent, totalDepth);
                            if(projMat)
                            {
                                matToApply.prependMatrix(projMat);
                            }
                        }
                        layerObj.transformMatrix = matToApply;
                    }
                }
            }	    
            //Code to support hidpi screens and responsive scaling.
            function makeResponsive(isResp, respDim, isScale, scaleType) {		
                var lastW, lastH, lastS=1;		
                window.addEventListener('resize', resizeCanvas);		
                resizeCanvas();		
                function resizeCanvas() {			
                    var w = lib.properties.width, h = lib.properties.height;			
                    var iw = $('.top_banner .kv .content').width(), ih=$('.top_banner .kv .content').height();	
                    var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
                    if(isResp) {                
                        if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
                            sRatio = lastS;                
                        }				
                        else if(!isScale) {					
                            if(iw<w || ih<h)						
                                sRatio = Math.min(xRatio, yRatio);				
                        }				
                        else if(scaleType==1) {					
                            sRatio = Math.min(xRatio, yRatio);				
                        }				
                        else if(scaleType==2) {					
                            sRatio = Math.max(xRatio, yRatio);				
                        }			
                    }			
                    canvas.width = w*pRatio*sRatio;			
                    canvas.height = h*pRatio*sRatio;
                    canvas.style.width = dom_overlay_container.style.width = anim_container.style.width =  w*sRatio+'px';				
                    canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h*sRatio+'px';
                    stage.scaleX = pRatio*sRatio;			
                    stage.scaleY = pRatio*sRatio;			
                    lastW = iw; lastH = ih; lastS = sRatio;            
                    stage.tickOnUpdate = false;            
                    stage.update();            
                    stage.tickOnUpdate = true;		
                }
            }
            makeResponsive(true,'both',true,1);	
            AdobeAn.compositionLoaded(lib.properties.id);
            fnStartAnimation();
        }
        function handleProgress(evt,comp) {
            Main.log("an loaded " + (evt.target.progress*100|0) + " %");
            Main.updatePercent(evt.target.progress*100|0, 'an');
        }
        init();
    })();
}

(function (cjs, an) {

    var p; // shortcut to reference prototypes
    var lib={};var ss={};var img={};
    lib.ssMetadata = [
            {name:"kv_atlas", frames: [[755,624,220,154],[755,468,220,154],[755,312,220,154],[755,156,220,154],[755,0,220,154],[0,894,101,110],[163,676,103,99],[393,774,99,96],[268,676,99,98],[369,676,99,96],[103,857,96,110],[0,780,100,112],[677,849,47,57],[396,958,50,57],[0,0,753,674],[467,909,59,93],[616,823,59,94],[201,882,59,118],[616,676,59,145],[102,676,59,179],[555,676,59,148],[494,676,59,148],[298,881,96,99],[0,676,98,99],[677,762,70,85],[677,676,71,84],[396,872,69,84],[528,909,65,82],[494,826,72,81],[644,919,45,88],[298,776,93,103],[201,777,95,103],[595,919,47,98]]}
    ];
    
    
    // symbols:
    
    
    
    (lib.air1 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(0);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.air2 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(1);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.air3 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(2);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.air4 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(3);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.air5 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(4);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.car1 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(5);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.car2 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(6);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.car3 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(7);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.car4 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(8);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.car5 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(9);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.car6 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(10);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.car7 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(11);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.cm1 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(12);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.cm2 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(13);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.kv_bg = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(14);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.m1 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(15);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.m2 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(16);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.m3 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(17);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.m4 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(18);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.m5 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(19);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.m6 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(20);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.m7 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(21);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.talk1 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(22);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.talk2 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(23);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.tr1 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(24);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.tr2 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(25);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.tr3 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(26);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.tr4 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(27);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.tr5 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(28);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.w2 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(29);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.wd1 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(30);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.wd2 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(31);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.wo1 = function() {
        this.initialize(ss["kv_atlas"]);
        this.gotoAndStop(32);
    }).prototype = p = new cjs.Sprite();
    
    
    
    (lib.work = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // wo1_png
        this.instance = new lib.wo1();
        this.instance.parent = this;
    
        this.instance_1 = new lib.w2();
        this.instance_1.parent = this;
        this.instance_1.setTransform(0,8);
    
        this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},2).to({state:[]},1).wait(17));
    
    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(0,0,47,98);
    
    
    (lib.wed = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // wd1_png
        this.instance = new lib.wd1();
        this.instance.parent = this;
    
        this.instance_1 = new lib.wd2();
        this.instance_1.parent = this;
        this.instance_1.setTransform(-2,0);
    
        this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},2).to({state:[]},1).wait(17));
    
        // cm1_png
        this.instance_2 = new lib.cm1();
        this.instance_2.parent = this;
        this.instance_2.setTransform(110,50);
    
        this.instance_3 = new lib.cm2();
        this.instance_3.parent = this;
        this.instance_3.setTransform(107,50);
    
        this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2}]}).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_2}]},4).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_2}]},2).to({state:[]},1).wait(17));
    
    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-2,0,159,107);
    
    
    (lib.tr = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // tr1_png
        this.instance = new lib.tr1();
        this.instance.parent = this;
    
        this.instance_1 = new lib.tr2();
        this.instance_1.parent = this;
        this.instance_1.setTransform(1,0);
    
        this.instance_2 = new lib.tr3();
        this.instance_2.parent = this;
    
        this.instance_3 = new lib.tr4();
        this.instance_3.parent = this;
        this.instance_3.setTransform(4,0);
    
        this.instance_4 = new lib.tr5();
        this.instance_4.parent = this;
    
        this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_4}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance}]},2).to({state:[]},1).wait(2));
    
    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(0,0,72,85);
    
    
    (lib.talk = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // talk1_png
        this.instance = new lib.talk1();
        this.instance.parent = this;
    
        this.instance_1 = new lib.talk2();
        this.instance_1.parent = this;
        this.instance_1.setTransform(-2,0);
    
        this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance}]},1).to({state:[]},1).wait(6));
        this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},2).wait(2).to({_off:false},0).to({_off:true},2).wait(2).to({_off:false},0).to({_off:true},2).wait(2).to({_off:false},0).wait(1).to({_off:true},1).wait(6));
    
    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-2,0,98,99);
    
    
    (lib.money = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // m1_png
        this.instance = new lib.m1();
        this.instance.parent = this;
        this.instance.setTransform(0,86);
    
        this.instance_1 = new lib.m2();
        this.instance_1.parent = this;
        this.instance_1.setTransform(0,85);
    
        this.instance_2 = new lib.m3();
        this.instance_2.parent = this;
        this.instance_2.setTransform(0,61);
    
        this.instance_3 = new lib.m4();
        this.instance_3.parent = this;
        this.instance_3.setTransform(0,34);
    
        this.instance_4 = new lib.m5();
        this.instance_4.parent = this;
    
        this.instance_5 = new lib.m6();
        this.instance_5.parent = this;
        this.instance_5.setTransform(0,31);
    
        this.instance_6 = new lib.m7();
        this.instance_6.parent = this;
        this.instance_6.setTransform(0,31);
    
        this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_4}]},2).to({state:[{t:this.instance_5}]},2).to({state:[{t:this.instance_6}]},2).to({state:[{t:this.instance}]},2).to({state:[]},1).wait(17));
    
    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(0,0,59,179);
    
    
    (lib.car = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // car1_png
        this.instance = new lib.car7();
        this.instance.parent = this;
        this.instance.setTransform(-2,0);
    
        this.instance_1 = new lib.car6();
        this.instance_1.parent = this;
        this.instance_1.setTransform(0,2);
    
        this.instance_2 = new lib.car5();
        this.instance_2.parent = this;
        this.instance_2.setTransform(0,16);
    
        this.instance_3 = new lib.car4();
        this.instance_3.parent = this;
        this.instance_3.setTransform(0,14);
    
        this.instance_4 = new lib.car3();
        this.instance_4.parent = this;
        this.instance_4.setTransform(0,16);
    
        this.instance_5 = new lib.car2();
        this.instance_5.parent = this;
        this.instance_5.setTransform(0,13);
    
        this.instance_6 = new lib.car1();
        this.instance_6.parent = this;
        this.instance_6.setTransform(0,2);
    
        this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_4}]},2).to({state:[{t:this.instance_5}]},2).to({state:[{t:this.instance_6}]},2).to({state:[{t:this.instance_5}]},6).to({state:[{t:this.instance_4}]},2).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance}]},2).to({state:[]},1).wait(3));
    
    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-2,0,105,112);
    
    
    (lib.airplane = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // air1_png
        this.instance = new lib.air1();
        this.instance.parent = this;
    
        this.instance_1 = new lib.air2();
        this.instance_1.parent = this;
    
        this.instance_2 = new lib.air3();
        this.instance_2.parent = this;
    
        this.instance_3 = new lib.air4();
        this.instance_3.parent = this;
    
        this.instance_4 = new lib.air5();
        this.instance_4.parent = this;
    
        this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_4}]},2).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_4}]},2).to({state:[{t:this.instance}]},2).to({state:[]},1).wait(11));
    
    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(0,0,220,154);
    
    
    (lib.場景_1_kv_bg_png = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // kv_bg_png
        this.instance = new lib.kv_bg();
        this.instance.parent = this;
    
        this.timeline.addTween(cjs.Tween.get(this.instance).wait(121));
    
    }).prototype = p = new cjs.MovieClip();
    
    
    (lib.場景_1_work = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // work
        this.instance = new lib.work("single",0);
        this.instance.parent = this;
        this.instance.setTransform(147.1,537.35,1,1,0,0,0,23.5,49);
    
        this.timeline.addTween(cjs.Tween.get(this.instance).wait(31).to({mode:"synched",loop:false},0).wait(14).to({mode:"single",startPosition:14},0).wait(76));
    
    }).prototype = p = new cjs.MovieClip();
    
    
    (lib.場景_1_wed = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // wed
        this.instance = new lib.wed("synched",0,false);
        this.instance.parent = this;
        this.instance.setTransform(327.6,521.05,1,1,0,0,0,47.5,51.5);
    
        this.timeline.addTween(cjs.Tween.get(this.instance).wait(14).to({mode:"single",startPosition:14},0).wait(107));
    
    }).prototype = p = new cjs.MovieClip();
    
    
    (lib.場景_1_tr = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // tr
        this.instance = new lib.tr("single",0);
        this.instance.parent = this;
        this.instance.setTransform(151.7,314.6,1,1,0,0,0,36,42.5);
    
        this.timeline.addTween(cjs.Tween.get(this.instance).wait(14).to({mode:"synched",loop:false},0).wait(17).to({mode:"single",startPosition:17},0).wait(90));
    
    }).prototype = p = new cjs.MovieClip();
    
    
    (lib.場景_1_talk = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // talk
        this.instance = new lib.talk("single",0);
        this.instance.parent = this;
        this.instance.setTransform(506.45,317,1,1,0,0,0,49,49.5);
    
        this.timeline.addTween(cjs.Tween.get(this.instance).wait(45).to({mode:"synched",loop:false},0).wait(13).to({mode:"single",startPosition:13},0).wait(63));
    
    }).prototype = p = new cjs.MovieClip();
    
    
    (lib.場景_1_money = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // money
        this.instance = new lib.money("single",0);
        this.instance.parent = this;
        this.instance.setTransform(471.55,208.9,1,1,0,0,0,29.5,89.5);
    
        this.timeline.addTween(cjs.Tween.get(this.instance).wait(58).to({mode:"synched",loop:false},0).wait(14).to({mode:"single",startPosition:14},0).wait(49));
    
    }).prototype = p = new cjs.MovieClip();
    
    
    (lib.場景_1_car = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // car
        this.instance = new lib.car("single",0);
        this.instance.parent = this;
        this.instance.setTransform(646.95,494.3,1,1,0,0,0,51.5,56);
    
        this.timeline.addTween(cjs.Tween.get(this.instance).wait(72).to({mode:"synched",loop:false},0).wait(28).to({mode:"single",startPosition:28},0).wait(21));
    
    }).prototype = p = new cjs.MovieClip();
    
    
    (lib.場景_1_airplane = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        // airplane
        this.instance = new lib.airplane("single",0);
        this.instance.parent = this;
        this.instance.setTransform(112.4,170.65,1,1,0,0,0,110,77);
    
        this.timeline.addTween(cjs.Tween.get(this.instance).wait(100).to({mode:"synched",loop:false},0).to({y:160.65,startPosition:10},10).to({y:170.65,mode:"single",startPosition:20},10).wait(1));
    
    }).prototype = p = new cjs.MovieClip();
    
    
    // stage content:
    (lib.kv = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});
    
        this.___GetDepth___ = function(obj) {
            var depth = obj.depth;
            var cameraObj = this.___camera___instance;
            if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
            {
                depth += depth + cameraObj.depth;
            }
            return depth;
            }
        this.___needSorting___ = function() {
            for (var i = 0; i < this.getNumChildren() - 1; i++)
            {
                var prevDepth = this.___GetDepth___(this.getChildAt(i));
                var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
                if (prevDepth < nextDepth)
                    return true;
            }
            return false;
        }
        this.___sortFunction___ = function(obj1, obj2) {
            return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
        }
        this.on('tick', function (event){
            var curTimeline = event.currentTarget;
            if (curTimeline.___needSorting___()){
                this.sortChildren(curTimeline.___sortFunction___);
            }
        });
    
        // timeline functions:
        this.frame_120 = function() {
            this.___loopingOver___ = true;
        }
    
        // actions tween:
        this.timeline.addTween(cjs.Tween.get(this).wait(120).call(this.frame_120).wait(1));
    
        // work_obj_
        this.work = new lib.場景_1_work();
        this.work.name = "work";
        this.work.parent = this;
        this.work.setTransform(147.1,537.4,1,1,0,0,0,147.1,537.4);
        this.work.depth = 0;
        this.work.isAttachedToCamera = 0
        this.work.isAttachedToMask = 0
        this.work.layerDepth = 0
        this.work.layerIndex = 0
        this.work.maskLayerName = 0
    
        this.timeline.addTween(cjs.Tween.get(this.work).wait(121));
    
        // tr_obj_
        this.tr = new lib.場景_1_tr();
        this.tr.name = "tr";
        this.tr.parent = this;
        this.tr.setTransform(150.7,314.6,1,1,0,0,0,150.7,314.6);
        this.tr.depth = 0;
        this.tr.isAttachedToCamera = 0
        this.tr.isAttachedToMask = 0
        this.tr.layerDepth = 0
        this.tr.layerIndex = 1
        this.tr.maskLayerName = 0
    
        this.timeline.addTween(cjs.Tween.get(this.tr).wait(121));
    
        // talk_obj_
        this.talk = new lib.場景_1_talk();
        this.talk.name = "talk";
        this.talk.parent = this;
        this.talk.setTransform(505.4,317,1,1,0,0,0,505.4,317);
        this.talk.depth = 0;
        this.talk.isAttachedToCamera = 0
        this.talk.isAttachedToMask = 0
        this.talk.layerDepth = 0
        this.talk.layerIndex = 2
        this.talk.maskLayerName = 0
    
        this.timeline.addTween(cjs.Tween.get(this.talk).wait(121));
    
        // money_obj_
        this.money = new lib.場景_1_money();
        this.money.name = "money";
        this.money.parent = this;
        this.money.setTransform(471.6,251.9,1,1,0,0,0,471.6,251.9);
        this.money.depth = 0;
        this.money.isAttachedToCamera = 0
        this.money.isAttachedToMask = 0
        this.money.layerDepth = 0
        this.money.layerIndex = 3
        this.money.maskLayerName = 0
    
        this.timeline.addTween(cjs.Tween.get(this.money).wait(121));
    
        // wed_obj_
        this.wed = new lib.場景_1_wed();
        this.wed.name = "wed";
        this.wed.parent = this;
        this.wed.setTransform(358.6,523,1,1,0,0,0,358.6,523);
        this.wed.depth = 0;
        this.wed.isAttachedToCamera = 0
        this.wed.isAttachedToMask = 0
        this.wed.layerDepth = 0
        this.wed.layerIndex = 4
        this.wed.maskLayerName = 0
    
        this.timeline.addTween(cjs.Tween.get(this.wed).wait(121));
    
        // car_obj_
        this.car = new lib.場景_1_car();
        this.car.name = "car";
        this.car.parent = this;
        this.car.setTransform(643.5,494.3,1,1,0,0,0,643.5,494.3);
        this.car.depth = 0;
        this.car.isAttachedToCamera = 0
        this.car.isAttachedToMask = 0
        this.car.layerDepth = 0
        this.car.layerIndex = 5
        this.car.maskLayerName = 0
    
        this.timeline.addTween(cjs.Tween.get(this.car).wait(121));
    
        // airplane_obj_
        this.airplane = new lib.場景_1_airplane();
        this.airplane.name = "airplane";
        this.airplane.parent = this;
        this.airplane.setTransform(112.4,170.7,1,1,0,0,0,112.4,170.7);
        this.airplane.depth = 0;
        this.airplane.isAttachedToCamera = 0
        this.airplane.isAttachedToMask = 0
        this.airplane.layerDepth = 0
        this.airplane.layerIndex = 6
        this.airplane.maskLayerName = 0
    
        this.timeline.addTween(cjs.Tween.get(this.airplane).wait(121));
    
        // kv_bg_png_obj_
        this.kv_bg_png = new lib.場景_1_kv_bg_png();
        this.kv_bg_png.name = "kv_bg_png";
        this.kv_bg_png.parent = this;
        this.kv_bg_png.setTransform(376.5,337,1,1,0,0,0,376.5,337);
        this.kv_bg_png.depth = 0;
        this.kv_bg_png.isAttachedToCamera = 0
        this.kv_bg_png.isAttachedToMask = 0
        this.kv_bg_png.layerDepth = 0
        this.kv_bg_png.layerIndex = 7
        this.kv_bg_png.maskLayerName = 0
    
        this.timeline.addTween(cjs.Tween.get(this.kv_bg_png).wait(121));
    
    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(376.5,337,376.5,337);
    // library properties:
    lib.properties = {
        id: '2A10FC6259016648901745597D4625F6',
        width: 753,
        height: 674,
        fps: 24,
        color: "#FFFFFF",
        opacity: 0.00,
        manifest: [
            {src:"assets/images/kv_atlas.png", id:"kv_atlas"}
        ],
        preloads: []
    };
    
    
    
    // bootstrap callback support:
    
    (lib.Stage = function(canvas) {
        createjs.Stage.call(this, canvas);
    }).prototype = p = new createjs.Stage();
    
    p.setAutoPlay = function(autoPlay) {
        this.tickEnabled = autoPlay;
    }
    p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
    p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
    p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
    p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }
    
    p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }
    
    an.bootcompsLoaded = an.bootcompsLoaded || [];
    if(!an.bootstrapListeners) {
        an.bootstrapListeners=[];
    }
    
    an.bootstrapCallback=function(fnCallback) {
        an.bootstrapListeners.push(fnCallback);
        if(an.bootcompsLoaded.length > 0) {
            for(var i=0; i<an.bootcompsLoaded.length; ++i) {
                fnCallback(an.bootcompsLoaded[i]);
            }
        }
    };
    
    an.compositions = an.compositions || {};
    an.compositions['2A10FC6259016648901745597D4625F6'] = {
        getStage: function() { return exportRoot.getStage(); },
        getLibrary: function() { return lib; },
        getSpriteSheet: function() { return ss; },
        getImages: function() { return img; }
    };
    
    an.compositionLoaded = function(id) {
        an.bootcompsLoaded.push(id);
        for(var j=0; j<an.bootstrapListeners.length; j++) {
            an.bootstrapListeners[j](id);
        }
    }
    
    an.getComposition = function(id) {
        return an.compositions[id];
    }
    
    
    // Layer depth API : 
    
    AdobeAn.Layer = new function() {
        this.getLayerZDepth = function(timeline, layerName)
        {
            if(layerName === "Camera")
            layerName = "___camera___instance";
            var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
            return eval(script);
        }
        this.setLayerZDepth = function(timeline, layerName, zDepth)
        {
            const MAX_zDepth = 10000;
            const MIN_zDepth = -5000;
            if(zDepth > MAX_zDepth)
                zDepth = MAX_zDepth;
            else if(zDepth < MIN_zDepth)
                zDepth = MIN_zDepth;
            if(layerName === "Camera")
            layerName = "___camera___instance";
            var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
            eval(script);
        }
        this.removeLayer = function(timeline, layerName)
        {
            if(layerName === "Camera")
            layerName = "___camera___instance";
            var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
            eval(script);
        }
        this.addNewLayer = function(timeline, layerName, zDepth)
        {
            if(layerName === "Camera")
            layerName = "___camera___instance";
            zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
            var layer = new createjs.MovieClip();
            layer.name = layerName;
            layer.depth = zDepth;
            layer.layerIndex = 0;
            timeline.addChild(layer);
        }
    }
    
    })(createjs = createjs||{}, AdobeAn = AdobeAn||{});
    var createjs, AdobeAn;

Main.init({});