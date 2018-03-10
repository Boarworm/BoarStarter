$(function () {
    $('.js-slider-with-nav-main').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.js-slider-with-nav-secondary',
        dots: false,
        arrows:false
    });
    $('.js-slider-with-nav-secondary').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.js-slider-with-nav-main',
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        arrows:false
    });
}); //end ready