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

        let general_settings = $.extend({}, options);

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
                set_blocks_init_position();
                create_exlode_timeline();
            }


            function create_alt_blocks_layer() {
                $element_blocks.each(function () {

                    $(this).append($('<div></div>').css({
                        'position': 'absolute',
                        'background-image': 'url(' + $this.data('exlode-block-alt-img') + ')',
                        'background-size': 'cover',
                        'background-position': 'center',
                        'background-repeat': 'no-repeat'
                        // 'top': -$(this).position().top + 'px',
                        // 'left': -$(this).position().left + 'px',
                    }));

                    $(this).css({
                        'overflow': 'hidden'
                    })
                });

                $element_blocks_alt_layer = $element_blocks.find('div');
            }


            function set_blocks_init_position() {
                TweenLite.set('.block-1', {x: -50, y: -50});
                TweenLite.set('.block-2', {x: 50, y: -20, scale: 0.8});
                TweenLite.set('.block-3', {x: -30, y: 20, scale: 0.86});
                TweenLite.set('.block-4', {x: 40, y: 20});
                TweenLite.set($element_blocks_alt_layer, {autoAlpha: 0})
            }


            function create_exlode_timeline() {

                explode_tl.pause();

                explode_tl.add('move-in')
                    .to('.block-1', 1, {x: 0, y: 0, scale: 1}, 'move-in')
                    .to('.block-2', 1, {x: 0, y: 0, scale: 1}, 'move-in')
                    .to('.block-3', 1, {x: 0, y: 0, scale: 1}, 'move-in')
                    .to('.block-4', 1, {x: 0, y: 0, scale: 1}, 'move-in')
                    .to($element_blocks_alt_layer, 1, {autoAlpha: 1}, 'move-in')

            }


            function update_alt_blocks_layer() {
                element_width = $this.outerWidth();
                element_height = $this.outerHeight();


                $element_blocks_alt_layer.css({
                    'width': element_width + 'px',
                    'height': element_height + 'px'
                })

                $element_blocks.each(function () {

                    $(this).find('div').css({
                        'top': -$(this).position().top + 'px',
                        'left': -$(this).position().left + 'px',
                    });

                });
            }


            $(window).on('scroll resize', function (e) {

                if (e.type == 'resize') {
                    update_alt_blocks_layer();
                }


                animation_trigger_start = $this.offset().top;
                animation_trigger_end = animation_trigger_start + window_height + element_height;

                animation_length = animation_trigger_end - animation_trigger_start;

                if (trigger > animation_trigger_start && trigger < animation_trigger_end) {

                    let progress = (trigger - animation_trigger_start) / animation_length;

                    if (progress < 0.2) {

                        TweenLite.to(explode_tl, 1, {progress: 0});
                    }

                    else if (progress > 0.2 && progress < 0.8) {

                        TweenLite.to(explode_tl, 1, {progress: 1});

                    }

                    else if (progress > 0.8) {

                        TweenLite.to(explode_tl, 1, {progress: 0});

                    }
                }
            })
        });
    }
}));