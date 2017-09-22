/*

 animatedHeadline

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

    $.fn.animatedHeadline = function (options) {

        let general_settings = $.extend({}, options);


        let window_height,
            scrollTop,
            trigger;
        // trigger_end;

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
                $element_blocks = $this.find('.block');


            $element_blocks.each(function(){
                $(this).append($('<div></div>').css({
                    'position': 'absolute',
                    'background-image': 'url(' + $this.data('exlode-block-alt-img') + ')'
                }));

            });

            let $element_blocks_alt_layer = $element_blocks.find('div');



            TweenLite.set('.block-1', {x: -50, y: -50});
            TweenLite.set('.block-2', {x: 50, y: -20, scale: 0.7});
            TweenLite.set('.block-3', {x: -30, y: 20});
            TweenLite.set('.block-4', {x: 40, y: 20});


            let tl = new TimelineMax();

            tl.pause();

            tl.add('move-in')
                .to('.block-1', 1, {x: 0, y: 0, scale: 1}, 'move-in')
                .to('.block-2', 1, {x: 0, y: 0, scale: 1}, 'move-in')
                .to('.block-3', 1, {x: 0, y: 0, scale: 1}, 'move-in')
                .to('.block-4', 1, {x: 0, y: 0, scale: 1}, 'move-in');


            $(window).on('scroll resize load', function () {

                element_width = $this.outerWidth();
                element_height = $this.outerHeight();



                $element_blocks_alt_layer.css({
                    'width': element_width + 'px',
                    'height': element_height + 'px'
                })

                $element_blocks.each(function(){

                });



                animation_trigger_start = $this.offset().top;
                animation_trigger_end = animation_trigger_start + window_height + element_height;

                animation_length = animation_trigger_end - animation_trigger_start;

                if (trigger > animation_trigger_start && trigger < animation_trigger_end) {

                    let progress = (trigger - animation_trigger_start) / animation_length;

                    console.log(progress);

                    if (progress < 0.2) {

                        TweenLite.to(tl, 1, {progress: 0});
                    }

                    else if (progress > 0.2 && progress < 0.8) {

                        TweenLite.to(tl, 1, {progress: 1});

                    }

                    else if (progress > 0.8) {

                        TweenLite.to(tl, 1, {progress: 0});

                    }

                }

            })


        });

    }

}));