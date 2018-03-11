$(function () {
    const toTopBtn = $('.js-to-top-btn');
    var topOffset;
    toTopBtn.fadeOut(0);
    toTopBtn.click(function () {
        // скорость скролла
        const speed = 1000;
        // место скролла
        const top = $('body').offset().top;
        $('html, body').animate({scrollTop: top}, speed);
        return false;
    });
    $(window).on('scroll', function () {
        topOffset = $(this).scrollTop();
        if (topOffset > 500) {
            toTopBtn.fadeIn(1);
        } else {
            toTopBtn.fadeOut(1);
        }
    });
});
