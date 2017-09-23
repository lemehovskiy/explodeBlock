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

}

(function ($) {

    $.fn.explodeBlock = function (options) {

        let general_settings = $.extend({
            animate_in: 0.3,
            animate_out: 0.7,
            animate_duration: 1.5,
            animate_type: 'scroll_position'

        }, options);

        let window_height,
            scrollTop,
            trigger;

        $(window).on('scroll resize', function () {
            window_height = $(window).outerHeight();
            scrollTop = $(window).scrollTop();

            trigger = scrollTop + window_height;
        });


        $(this).each(function () {

            let $this = $(this),
                animation_length = 0,
                animation_trigger_start,
                animation_trigger_end,
                element_height,
                element_width,
                $element_blocks = $this.find('.block'),
                $element_blocks_alt_layer,
                explode_tl = new TimelineMax();


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
                    })
                });

                $element_blocks_alt_layer = $element_blocks.find('div');
            }


            function create_exlode_timeline() {

                explode_tl.pause();

                explode_tl.add('move-in')
                    .to($element_blocks, 1, {x: 0, y: 0, scale: 1}, 'move-in')
                    .to($element_blocks_alt_layer, 1, {autoAlpha: 1}, 'move-in')

                explode_tl.seek('move-in')

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
                animation_trigger_end = animation_trigger_start + window_height + element_height;

                animation_length = animation_trigger_end - animation_trigger_start;

                if (trigger > animation_trigger_start && trigger < animation_trigger_end) {

                    let progress = (trigger - animation_trigger_start) / animation_length;


                    if (general_settings.animate_type == 'scroll_position') {

                        let l_scroll_progress;

                        if (progress < general_settings.animate_in) {

                            l_scroll_progress = 1 / general_settings.animate_in * progress
                        }

                        else if (progress > general_settings.animate_in && progress < general_settings.animate_out) {

                            l_scroll_progress = 1;
                        }

                        else {
                            l_scroll_progress = 1 / general_settings.animate_out - 1 / general_settings.animate_out * progress
                        }

                        TweenLite.to(explode_tl, general_settings.animate_duration, {progress: l_scroll_progress});
                    }


                    else if (general_settings.animate_type == 'immediately') {

                        if (progress < general_settings.animate_in) {

                            TweenLite.to(explode_tl, general_settings.animate_duration, {progress: 0});
                        }

                        else if (progress > general_settings.animate_in && progress < general_settings.animate_out) {

                            TweenLite.to(explode_tl, general_settings.animate_duration, {progress: 1});

                        }

                        else if (progress > general_settings.animate_out) {

                            TweenLite.to(explode_tl, general_settings.animate_duration, {progress: 0});

                        }
                    }

                }
            })
        });
    }
}));