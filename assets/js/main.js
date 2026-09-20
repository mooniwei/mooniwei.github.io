/*
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$head = $('head'),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ],
			'xlarge-to-max':    '(min-width: 1681px)',
			'small-to-xlarge':  '(min-width: 481px) and (max-width: 1680px)'
		});

	// Stops animations/transitions until the page has ...

		// ... loaded.
			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-preload');
				}, 100);
			});

		// ... stopped resizing.
			var resizeTimeout;

			$window.on('resize', function() {

				// Mark as resizing.
					$body.addClass('is-resizing');

				// Unmark after delay.
					clearTimeout(resizeTimeout);

					resizeTimeout = setTimeout(function() {
						$body.removeClass('is-resizing');
					}, 100);

			});

	// Fixes.

		// Object fit images.
			if (!browser.canUse('object-fit')
			||	browser.name == 'safari')
				$('.image.object').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Hide original image.
						$img.css('opacity', '0');

					// Set background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
							.css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

				});

	// News.
		var $newsScroll = $('.news-scroll');

		var resizeNews = function() {

			$newsScroll.each(function() {

				var $this = $(this),
					height = 0;

				$this.children('.news-item').slice(0, 3).each(function() {
					height += $(this).outerHeight(true);
				});

				if (height > 0)
					$this.css('height', Math.ceil(height + 2) + 'px');

			});

		};

		$window
			.on('load.news resize.news', resizeNews);

		resizeNews();

	// Publication note typewriter.
		var $publicationNote = $('.publication-note');

		if ($publicationNote.length) {

			var publicationNoteText = $publicationNote.text().trim(),
				hasTypedPublicationNote = false,
				reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			$publicationNote
				.attr('aria-label', publicationNoteText)
				.empty()
				.append('<span class="typewriter-text" aria-hidden="true"></span><span class="typewriter-caret" aria-hidden="true"></span>');

			var typePublicationNote = function() {

				if (hasTypedPublicationNote)
					return;

				hasTypedPublicationNote = true;

				if (reduceMotion) {
					$publicationNote.find('.typewriter-text').text(publicationNoteText);
					return;
				}

				var index = 0,
					$text = $publicationNote.find('.typewriter-text');

				var typeNextCharacter = function() {
					$text.text(publicationNoteText.slice(0, index + 1));
					index++;

					if (index < publicationNoteText.length)
						window.setTimeout(typeNextCharacter, 45);
					else
						window.setTimeout(function() {
							$text.text('');
							index = 0;
							window.setTimeout(typeNextCharacter, 300);
						}, 3000);
				};

				typeNextCharacter();

			};

			if ('IntersectionObserver' in window) {
				var publicationNoteObserver = new IntersectionObserver(function(entries) {
					if (entries[0].isIntersecting) {
						typePublicationNote();
						publicationNoteObserver.disconnect();
					}
				}, { threshold: 0.6 });

				publicationNoteObserver.observe($publicationNote[0]);
			}
			else
				typePublicationNote();

		}

	// Publication abstracts.
		var $publicationTitles = $('.publication-title');

		var setPublicationAbstract = function($button, open) {

			var $panel = $('#' + $button.attr('aria-controls'));

			$button.attr('aria-expanded', open ? 'true' : 'false');
			$panel
				.attr('aria-hidden', open ? 'false' : 'true')
				.toggleClass('is-open', open);

		};

		var closeOtherPublicationAbstracts = function($currentButton) {

			$publicationTitles.filter('[aria-expanded="true"]').not($currentButton)
				.each(function() {
					setPublicationAbstract($(this), false);
				});

		};

		$publicationTitles
			.on('mouseenter', function() {

				var $button = $(this);

				closeOtherPublicationAbstracts($button);
				setPublicationAbstract($button, true);

			})
			.on('click', function(event) {

				var supportsHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

				if (event.detail > 0 && supportsHover) {
					setPublicationAbstract($(this), true);
					return;
				}

				var $button = $(this),
					willOpen = $button.attr('aria-expanded') !== 'true';

				closeOtherPublicationAbstracts($button);
				setPublicationAbstract($button, willOpen);

			});

		$('.publication-item').on('mouseleave', function() {
			setPublicationAbstract($(this).find('.publication-title'), false);
		});

	// Publication filters.
		var $publicationFilters = $('.publication-filter'),
			$publicationItems = $('.publication-item'),
			$publicationFilterStatus = $('#publication-filter-status'),
			activePublicationFilter = null;

		$publicationFilters.on('click', function() {

			var $filter = $(this),
				selectedFilter = $filter.data('filter');

			activePublicationFilter = activePublicationFilter === selectedFilter ? null : selectedFilter;

			$publicationFilters.each(function() {
				var $this = $(this),
					isActive = $this.data('filter') === activePublicationFilter;

				$this
					.attr('aria-pressed', isActive ? 'true' : 'false')
					.toggleClass('is-active', isActive);
			});

			$publicationItems.each(function() {
				var $item = $(this),
					isVisible = !activePublicationFilter || $item.data('publication-type') === activePublicationFilter;

				$item.toggleClass('is-filtered-out', !isVisible);

				if (!isVisible)
					setPublicationAbstract($item.find('.publication-title'), false);
			});

			$publicationFilterStatus.text(activePublicationFilter
				? 'Showing ' + activePublicationFilter + ' publications.'
				: 'Showing all publications.');

		});

	// Sidebar.
		var $sidebar = $('#sidebar'),
			$sidebar_inner = $sidebar.children('.inner');

		// Inactive by default on <= large.
			breakpoints.on('<=large', function() {
				$sidebar.addClass('inactive');
			});

			breakpoints.on('>large', function() {
				$sidebar.removeClass('inactive');
			});

		// Hack: Workaround for Chrome/Android scrollbar position bug.
			if (browser.os == 'android'
			&&	browser.name == 'chrome')
				$('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>')
					.appendTo($head);

		// Toggle.
			$('<a href="#sidebar" class="toggle">Toggle</a>')
				.appendTo($sidebar)
				.on('click', function(event) {

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Toggle.
						$sidebar.toggleClass('inactive');

				});

		// Events.

			// Link clicks.
				$sidebar.on('click', 'a', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Vars.
						var $a = $(this),
							href = $a.attr('href'),
							target = $a.attr('target');

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Check URL.
						if (!href || href == '#' || href == '')
							return;

					// Hide sidebar.
						$sidebar.addClass('inactive');

					// Redirect to href.
						setTimeout(function() {

							if (target == '_blank')
								window.open(href);
							else
								window.location.href = href;

						}, 500);

				});

			// Prevent certain events inside the panel from bubbling.
				$sidebar.on('click touchend touchstart touchmove', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Prevent propagation.
						event.stopPropagation();

				});

			// Hide panel on body click/tap.
				$body.on('click touchend', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Deactivate.
						$sidebar.addClass('inactive');

				});

		// Scroll lock.
		// Note: If you do anything to change the height of the sidebar's content, be sure to
		// trigger 'resize.sidebar-lock' on $window so stuff doesn't get out of sync.

			$window.on('load.sidebar-lock', function() {

				var sh, wh, st;

				// Reset scroll position to 0 if it's 1.
					if ($window.scrollTop() == 1)
						$window.scrollTop(0);

				$window
					.on('scroll.sidebar-lock', function() {

						var x, y;

						// <=large? Bail.
							if (breakpoints.active('<=large')) {

								$sidebar_inner
									.data('locked', 0)
									.css('position', '')
									.css('top', '');

								return;

							}

						// Calculate positions.
							x = Math.max(sh - wh, 0);
							y = Math.max(0, $window.scrollTop() - x);

						// Lock/unlock.
							if ($sidebar_inner.data('locked') == 1) {

								if (y <= 0)
									$sidebar_inner
										.data('locked', 0)
										.css('position', '')
										.css('top', '');
								else
									$sidebar_inner
										.css('top', -1 * x);

							}
							else {

								if (y > 0)
									$sidebar_inner
										.data('locked', 1)
										.css('position', 'fixed')
										.css('top', -1 * x);

							}

					})
					.on('resize.sidebar-lock', function() {

						// Calculate heights.
							wh = $window.height();
							sh = $sidebar_inner.outerHeight() + 30;

						// Trigger scroll.
							$window.trigger('scroll.sidebar-lock');

					})
					.trigger('resize.sidebar-lock');

				});

	// Menu.
		var $menu = $('#menu'),
			$menu_openers = $menu.children('ul').find('.opener');

		// Openers.
			$menu_openers.each(function() {

				var $this = $(this);

				$this.on('click', function(event) {

					// Prevent default.
						event.preventDefault();

					// Toggle.
						$menu_openers.not($this).removeClass('active');
						$this.toggleClass('active');

					// Trigger resize (sidebar lock).
						$window.triggerHandler('resize.sidebar-lock');

				});

			});

})(jQuery);
