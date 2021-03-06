'use strict';

/*

 explodeBlock

 Author: lemehovskiy

 */

;(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {

    $.fn.explodeBlock = function (options) {

        var general_settings = $.extend({
            animate_in: 0.3,
            animate_out: 0.7,
            animate_duration: 1.5,
            animate_type: 'scroll_position'

        }, options);

        var window_height = void 0,
            scrollTop = void 0,
            trigger = void 0;

        $(window).on('scroll resize', function () {
            window_height = $(window).outerHeight();
            scrollTop = $(window).scrollTop();

            trigger = scrollTop;
        });

        $(this).each(function () {

            var $this = $(this),
                animation_length = 0,
                animation_trigger_start = void 0,
                animation_trigger_end = void 0,
                element_height = void 0,
                element_width = void 0,
                $element_blocks = $this.find('.block'),
                $element_blocks_alt_layer = void 0,
                explode_tl = new TimelineMax(),
                timeline_scroll_progress = void 0;

            init();

            function init() {
                create_alt_blocks_layer();
                update_alt_blocks_layer();
                create_exlode_timeline();
            }

            function create_alt_blocks_layer() {
                $element_blocks.each(function () {

                    $(this).append($('<div></div>').css({
                        'position': 'absolute',
                        'background-image': 'url(' + $this.data('exlode-block-alt-img') + ')',
                        'background-size': 'cover',
                        'background-position': 'center',
                        'background-repeat': 'no-repeat',
                        'opacity': 0
                    }));

                    $(this).css({
                        'overflow': 'hidden'
                    });
                });

                $element_blocks_alt_layer = $element_blocks.find('div');
            }

            function create_exlode_timeline() {

                explode_tl.pause();

                explode_tl.add('move-in').to($element_blocks, 1, { x: 0, y: 0, scale: 1 }, 'move-in').to($element_blocks_alt_layer, 1, { autoAlpha: 1 }, 'move-in');

                explode_tl.seek('move-in');
            }

            function update_alt_blocks_layer() {
                element_width = $this.outerWidth();
                element_height = $this.outerHeight();

                $element_blocks_alt_layer.css({
                    'width': element_width + 'px',
                    'height': element_height + 'px'
                });

                $element_blocks.each(function () {
                    $(this).find('div').css({
                        'top': -parseInt($(this).css('top')) + 'px',
                        'left': -parseInt($(this).css('left')) + 'px'
                    });
                });
            }

            $(window).resize(function () {
                if (this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(function () {
                    $(this).trigger('resizeEnd');
                }, 500);
            });

            $(window).bind('resizeEnd', function () {
                update_alt_blocks_layer();
            });

            $(window).on('scroll resize', function () {

                animation_trigger_start = $this.offset().top;

                if (animation_trigger_start < window_height) {
                    animation_trigger_start = 0;
                    animation_trigger_end = animation_trigger_start + element_height;
                } else {
                    animation_trigger_end = animation_trigger_start + window_height + element_height;
                    trigger = scrollTop + window_height;
                }

                animation_length = animation_trigger_end - animation_trigger_start;

                if (trigger > animation_trigger_start && trigger < animation_trigger_end) {

                    var progress = (trigger - animation_trigger_start) / animation_length;

                    console.log(progress);

                    if (general_settings.animate_type == 'scroll_position') {

                        if (progress < general_settings.animate_in) {

                            timeline_scroll_progress = 1 / general_settings.animate_in * progress;
                        } else if (progress > general_settings.animate_in && progress < general_settings.animate_out) {

                            timeline_scroll_progress = 1;
                        } else {
                            timeline_scroll_progress = 1 / general_settings.animate_out - 1 / general_settings.animate_out * progress;
                        }

                        TweenLite.to(explode_tl, general_settings.animate_duration, { progress: timeline_scroll_progress });
                    } else if (general_settings.animate_type == 'immediately') {

                        if (progress < general_settings.animate_in) {
                            timeline_scroll_progress = 0;
                        } else if (progress > general_settings.animate_in && progress < general_settings.animate_out) {
                            timeline_scroll_progress = 1;
                        } else if (progress > general_settings.animate_out) {

                            timeline_scroll_progress = 0;
                        }

                        TweenLite.to(explode_tl, general_settings.animate_duration, { progress: timeline_scroll_progress });
                    }
                }
            });
        });
    };
});