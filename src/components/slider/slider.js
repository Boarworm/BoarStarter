// sliders init
$(function () {
    // home page big slider
    $('.js-main-page-slider').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
    });
    // home page popular slider
    $('.js-main-page-popular-slider').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
    });
}); // end ready
