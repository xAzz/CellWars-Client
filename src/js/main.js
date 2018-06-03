import Engine from './components/Engine.js';
import Player from './components/entities/Player.js';

// window globals
window.Buffer = buffer.Buffer;

// css animations
$.fn.extend({
    animateCss: function(animationName) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

// animate ui
$('.play').animateCss('zoomInUp');

// modals
$('body').on('shown.bs.modal', '.modal', function() {
    $(this).css({
        'top': '50%',
        'margin-top': function() {
            return -($(this).height() / 2);
        }
    });
});

// bootbox
bootbox.setDefaults({animate: false});

// disable mouse
// $('body').attr('oncontextmenu', 'return false;');

$('#asia i').hide();
$('#americas i').hide();

Player.connect('140.113.92.237:50001');
// Player.connect('188.226.135.116:50000');

$('#europe').on('click', function() {
    $('#asia i').hide();
    $('#americas i').hide();
    $('#europe i').show();
    $('#europe i').animateCss('jello');

    Player.flush();
    Player.connect('140.113.92.237:50001');
});

$('#asia').on('click', function() {
    $('#europe i').hide();
    $('#americas i').hide();
    $('#asia i').show();
    $('#asia i').animateCss('jello');

    Player.flush();
    Player.connect('140.113.92.237:50000');
});

$('#americas').on('click', function() {
    $('#europe i').hide();
    $('#asia i').hide();
    $('#americas i').show();
    $('#americas i').animateCss('jello');

    Player.connect('140.113.92.237:50002');
});

// button mouseover
$('button').on('mouseover', function() {
    let current = $(this).css('background-color');
    $(this).css('background', color.rgb($(this).css('background-color')).darken(0.25));

    $(this).on('mouseout', function() {
        $(this).css('background', current);
    });
});

// input focus
$('input').on('focusin', function() {
    let current = $(this).css('background-color');
    $(this).css('background', color.rgb($(this).css('background-color')).darken(0.15));
    $(this).on('focusout', function() {
        $(this).css('background', current);
    });
});

Engine.start();
