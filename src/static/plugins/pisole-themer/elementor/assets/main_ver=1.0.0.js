(function ($) {
	"use strict";
  	var GaviasElements = {
	 	init: function(){     
			GaviasElements.initDebouncedresize();
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-heading-block.default', GaviasElements.elementHeadingBlock);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-testimonials.default', GaviasElements.elementTestimonial);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-testimonials-carousel.default', GaviasElements.elementTestimonial);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-posts.default', GaviasElements.elementPosts);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-portfolio.default', GaviasElements.elementPortfolio);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-gallery.default', GaviasElements.elementGallery);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-events.default', GaviasElements.elementEvents);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-brand.default', GaviasElements.elementBrand);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-counter.default', GaviasElements.elementCounter);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-services.default', GaviasElements.elementServices);

			elementorFrontend.hooks.addAction('frontend/element_ready/gva-countdown.default', GaviasElements.elementCountDown);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-video-carousel.default', GaviasElements.elementVideoCarousel);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-user.default', GaviasElements.elementUser);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-circle-progress.default', GaviasElements.elementCircleProgress);
			
			elementorFrontend.hooks.addAction('frontend/element_ready/gva_icon_box_group.default', GaviasElements.elementInitCarousel);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-content-carousel.default', GaviasElements.elementInitCarousel);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-team.default', GaviasElements.elementInitCarousel);
			
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-product.default', GaviasElements.elementInitCarousel);

			elementorFrontend.hooks.addAction('frontend/element_ready/gva-listings.default', GaviasElements.elementInitCarousel);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-listings-banner-group.default', GaviasElements.elementInitCarousel);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva-listings-packages.default', GaviasElements.elementInitCarousel);
			
			elementorFrontend.hooks.addAction('frontend/element_ready/gva_lt_item_gallery.default', GaviasElements.elementInitCarousel);
			elementorFrontend.hooks.addAction('frontend/element_ready/gva_lt_item_rating_criteria.default', GaviasElements.elementListingItemRatingCriteria);

			elementorFrontend.hooks.addAction('frontend/element_ready/column', GaviasElements.elementColumn);

	 	},
	 	backend: function(){
	 		elementor.settings.page.addChangeCallback( 'pisole_post_preview', GaviasElements.handlePostPreview);
	 	},
	 	handlePostPreview: function(doc_preview_post_id){
		 	elementor.saver.update({
	         onSuccess: function onSuccess() {
	            window.location.reload();
	         }
	      });
      	window.location.reload();
		},

	 	initDebouncedresize: function(){
		 	var $event = $.event,
		  	$special, resizeTimeout;
		  	$special = $event.special.debouncedresize = {
			 	setup: function () {
					$(this).on("resize", $special.handler);
			 	},
			 	teardown: function () {
					$(this).off("resize", $special.handler);
			 	},
			 	handler: function (event, execAsap) {
					var context = this,
				  	args = arguments,
				  	dispatch = function () {
					 	event.type = "debouncedresize";
					 	$event.dispatch.apply(context, args);
				  	};

				  	if (resizeTimeout) {
					 	clearTimeout(resizeTimeout);
				  	}

					execAsap ? dispatch() : resizeTimeout = setTimeout(dispatch, $special.threshold);
			 	},
		  	threshold: 150
		};
	},

	elementColumn: function($scope){

		if(($scope).hasClass('gv-sidebar-offcanvas')){
			var html = '<div class="control-mobile">';
            	html += '<a class="control-mobile-link" href="#"><i class="fa-solid fa-bars"></i>Show Sidebar<a>';
            html += '</div>';
			$scope.append(html);

			html = '<span class="filter-top"><a href="#" class="btn-close-filter"><i class="fas fa-times"></i></a></span>';
			$scope.children('.elementor-column-wrap, .elementor-widget-wrap').children('.elementor-widget-wrap').prepend(html);
		}
		
		var _body = $('body');
		var _sidebar = $scope;
		
		$($scope).find('.control-mobile, .btn-close-filter').on('click', function(e){
			e.preventDefault();
			if(_body.hasClass('open-el-sidebar-offcanvas')){
				_sidebar.removeClass('open');
				setTimeout(function(){
					_body.removeClass('open-el-sidebar-offcanvas');
				 }, 200);
			}else{
				_sidebar.addClass('open');
				_body.addClass('open-el-sidebar-offcanvas');
			}
		});
	 },

	elementPostArchive: function($scope){
	
		var $container = $scope.find('.post-masonry-style');
		$container.imagesLoaded( function(){
	  		$container.masonry({
		 		itemSelector : '.item-masory',
		 		gutterWidth: 0,
		 		columnWidth: 1,
	  		}); 
		});
	},

	elementTestimonial: function($scope){
		var $carousel = $scope.find('.init-carousel-swiper');
		GaviasElements.initCarousel($carousel);
	},

	elementPosts: function($scope){
		var $carousel = $scope.find('.init-carousel-swiper');
		GaviasElements.initCarousel($carousel);
	},

	elementServices: function($scope){
		var $carousel = $scope.find('.init-carousel-swiper');
		GaviasElements.initCarousel($carousel);
	},

	elementPortfolio: function($scope){
		var $carousel = $scope.find('.init-carousel-swiper');
		GaviasElements.initCarousel($carousel);
		if( $.fn.isotope ){
		  	if($('.isotope-items').length){
			 	$( '.isotope-items' ).each(function() {
					var $el = $( this ),
					$filter = $( '.portfolio-filter a'),
					$loop =  $( this );

					$loop.isotope();
				
					$(window).load(function() {
				  		$loop.isotope( 'layout' );
					});
			 
					if ( $filter.length > 0 ) {
				  	$filter.on( 'click', function( e ) {
					 	e.preventDefault();
					 	var $a = $(this);
					 	$filter.removeClass( 'active' );
					 	$a.addClass( 'active' );
					 	$loop.isotope({ filter: $a.data( 'filter' ) });
				  	});
				};
			 });
		  }
		};

	 },

	 elementGallery: function($scope){
		var $carousel = $scope.find('.init-carousel-swiper');
		GaviasElements.initCarousel($carousel);
	 },

	 elementEvents: function($scope){
		var $carousel = $scope.find('.init-carousel-swiper');
		GaviasElements.initCarousel($carousel);
	 },

	 elementBrand: function($scope){
		var $carousel = $scope.find('.init-carousel-swiper');
		GaviasElements.initCarousel($carousel);
	 },

	 elementCounter: function($scope){
		var $block = $scope.find('.milestone-block');
		$block.appear(function() {
		  var $endNum = parseInt(jQuery(this).find('.milestone-number').text());
		  jQuery(this).find('.milestone-number').countTo({
			 from: 0,
			 to: $endNum,
			 speed: 4000,
			 refreshInterval: 60,
			 formatter: function (value, options) {
				value = value.toFixed(options.decimals);
				value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				return value;
			 }
		  });
		},{accX: 0, accY: 0});
	 },

	 elementCountDown: function($scope){
		$('[data-countdown="countdown"]').each(function(index, el) {
		  var $this = $(this);
		  var $date = $this.data('date').split("-");
		  $this.gvaCountDown({
			 TargetDate:$date[0]+"/"+$date[1]+"/"+$date[2]+" "+$date[3]+":"+$date[4]+":"+$date[5],
			 DisplayFormat:"<div class=\"countdown-times\"><div class=\"day\">%%D%% <span class=\"label\">Days</span> </div><div class=\"hours\">%%H%% <span class=\"label\">Hours</span> </div><div class=\"minutes\">%%M%% <span class=\"label\">Minutes</span> </div><div class=\"seconds\">%%S%% <span class=\"label\">Seconds</span></div></div>",
			 FinishMessage: "Expired"
		  });
		});
	 },

	 elementVideoCarousel: function($scope){
		var $carousel = $scope.find('.init-carousel-swiper');
		GaviasElements.initCarousel($carousel);
	 },

	elementHeadingBlock: function($scope){
		if ($scope.find('.typed-effect').length) {
			var _this = $scope.find('.typed-effect').first();
      	var typedStrings = _this.data('strings');
      	var typedTag = _this.attr('id');
      	var typed = new Typed('#' + typedTag, {
	        typeSpeed: 100,
	        backSpeed: 100,
	        fadeOut: true,
	        loop: true,
	        strings: typedStrings.split(',')
      	});
	  	}
	},

	elementInitCarousel: function($scope){
		var $carousel = $scope.find('.init-carousel-swiper');
		GaviasElements.initCarousel($carousel);
	},


	initCarousel: function($target){
		var _default = {
			items: 3, 
			items_lg: 3,
			items_md: 2,
			items_sm: 2,
			items_xs: 1,
			items_xx: 1,
			space_between: 30,
			effect: 'slide',
			loop: 1,
			speed: 600,
			autoplay: 1,
			autoplay_delay: 6000,
			autoplay_hover: 0,
			navigation: 1,
			pagination: 1,
			pagination_type: 'bullets',
			dynamic_bullets: 0
		};
		var settings = $target.data('carousel');
		settings = $.extend(!0, _default, settings);
		//-- Autoplay
		var _autoplay = false;
		if(settings.autoplay){
			_autoplay = {
				delay: settings.autoplay_delay,
				disableOnInteraction: false,
				pauseOnMouseEnter: settings.autoplay_hover,
			}
		}
		//-- Pagination 
		var _pagination = false;
		if(settings.pagination){
			_pagination = {
				el: $target.parents('.swiper-slider-wrapper').find('.swiper-pagination')[0],
			   type: settings.pagination_type,
			   clickable: true,
			  	dynamicBullets: settings.dynamic_bullets
			}
		}
		//-- Navigation
		var _navigation = false;
		if(settings.navigation){
			_navigation = {
				nextEl: $target.parents('.swiper-slider-wrapper').find('.swiper-nav-next')[0],
		    	prevEl: $target.parents('.swiper-slider-wrapper').find('.swiper-nav-prev')[0],
		    	hiddenClass: 'hidden'
			}
		}

		const swiper = new Swiper($target[0], {
		  	loop: settings.loop,
		  	spaceBetween: settings.space_between,
		  	autoplay: _autoplay,
		  	speed: settings.speed,
		  	grabCursor: false,
		  	centeredSlides: false,
		  	centeredSlidesBounds: true,
		  	effect: settings.effect,
		  	breakpoints: {
		  		0: {
		  			slidesPerView: 1
		  		},
		  		560: {
			      slidesPerView: settings.items_xx
			   },
			   640: {
			   	slidesPerView: settings.items_xs
			   },
			   768: {
			      slidesPerView: settings.items_sm
			   },
			   1024: {
			      slidesPerView: settings.items_md
			   },
			   1200: { // when window width is >= 1200px
			      slidesPerView: settings.items_lg,
			      
			   },
			   1400: { // when window width is >= 1200px
			      slidesPerView: settings.items
			   }
		  	},
		  	pagination: _pagination,
		  	navigation: _navigation,
		  	observer: true,  
	     	observeParents: true,
		   watchSlidesVisibility: true,
		   watchSlidesProgress: true,
       	slideVisibleClass: 'item-active',
       	slideNextClass: 'swiper-slide-next',
       	slidePrevClass: 'swiper-slide-prev',
       	slideActiveClass: 'swiper-slide-active',
       	on: { 
       		progress: function(){
       			//var total = settings.items;
       			var total = $target.find('.item-active').length;
					$target.find('.swiper-slide').removeClass('first');
					$target.find('.swiper-slide').removeClass('last');
					$target.find('.swiper-slide').removeClass('center');
					
					var start = 0;
					if(total == 5){start = 1;}
					if(total == 1){start = -1;}

					$target.find('.swiper-slide.item-active').each(function(index){
						if(index === start) {
							$(this).addClass('first')
						}
						if(index === start + 1){
							$(this).addClass('center')
						}
						if( index === total - (start + 1) && total > (start + 1) ) {
							$(this).addClass('last')
						}
					})
       		},
	      }
		});

		if(settings.autoplay_hover && settings.autoplay){
			$target.hover(function() {
	 			swiper.autoplay.stop();
			}, function() {
			   swiper.autoplay.start();
			});
		}
	},

	elementCircleProgress: function($scope){
		$scope.find(".circle-progress").appear(function () {
	      $scope.find(".circle-progress").each(function () {
	         let progress = $(this);
	         let progressOptions = progress.data("options");
	         progress.circleProgress({
	         	startAngle: -Math.PI / 2
	         }).on('circle-animation-progress', function(event, progress, stepValue) {
				   $(this).find('strong').html(Math.round(stepValue.toFixed(2).substr(1) * 100) + '<i>%</i>');
				});
	      });
	   });
	},

	elementListingItemRatingCriteria: function($scope){
		$scope.find('.review__progress-bar').each(function(){
		  	var $progressbar = $(this);
		  	$progressbar.css('width', $progressbar.data('progress-max'));
		})
	}

};
  
$(window).on('elementor/frontend/init', GaviasElements.init);   

}(jQuery));
