//animation idc logo while loading page

function addSlideOut(){
    $("#logoIntro").addClass("slideOutUp").addClass("fast");
    $(".bg1").css("display","none");
};

function addMenuClases(){
    $("#menu").addClass("nav-custom-after");
    $(".sidenav").addClass("sidenav-after");
    $(".btn-cta-small").css("display","block");
};

function deleteLayer(){
    $(".intro").css("display","none");
    $("body").css("position","relative");
    $(".shopping-cart").css("opacity","1");
};

$(document).ready(function() {
    setTimeout(addSlideOut, 3500);
    setTimeout(addMenuClases, 4000).slow;
    setTimeout(deleteLayer, 5000).slow;
});

// cart buttons
   
$("body").on("click",".cart-btn",function(){
    var type = "rubberBand";
    var counter = ($(".shopping-cart").find("span").text()*1)+1;
    $(".shopping-cart").find("i").addClass(type);
    $(".shopping-cart").find("span").text(counter);
    $(".shopping-cart").find("span").addClass("bg-gray-900");
    $(this).closest(".game-card-rectangular").find(".inCart").addClass("d-block");
    $(this).closest(".game-card-rectangular").find(".soon").removeClass("d-block");
    $(this).closest(".card").find(".inCart").addClass("d-block");
    $(this).closest(".card").find(".soon").removeClass("d-block");
    setTimeout(function() {
        $(".shopping-cart").find("i").removeClass(type);
        $(".shopping-cart").find("span").removeClass("bg-gray-900");
    },1000);
});

//<!-- slick carousel -->

$(document).ready(function(){    
    
    $('.carouselOffers').slick({
        dots: true,
        infinite: true,
        autoplay: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
            breakpoint: 1199.98,
            settings: {
                arrows: false
            }
            }
        ]
    });
    $('.carouselOffer1').slick({
        dots: true,
        infinite: true,
        autoplay: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
            breakpoint: 1199.98,
            settings: {
                arrows: false
            }
            }
        ]
    });
    $('.carouselOffer2').slick({
        dots: true,
        infinite: true,
        autoplay: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
            breakpoint: 1199.98,
            settings: {
                arrows: false
            }
            }
        ]
    });
    $('.carouselWhatsGood').slick({
        dots: true,
        infinite: true,
        autoplay: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
            breakpoint: 1199.98,
            settings: {
                arrows: false
            }
            }
        ]
    });
    $('.carouselRecommended').slick({
        dots: true,
        infinite: true,
        autoplay: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
            breakpoint: 1199.98,
            settings: {
                arrows: false
            }
            }
        ]
    });
    $('.carouselNews').slick({
        dots: true,
        infinite: true,
        autoplay: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
            breakpoint: 1199.98,
            settings: {
                arrows: false
            }
            }
        ]
    });



});

//Set the dimensions of the slick carousel when the tab is triggered
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $(".carouselOffers").slick('setPosition');
    $(".carouselOffer1").slick('setPosition');
    $(".carouselOffer2").slick('setPosition');
})