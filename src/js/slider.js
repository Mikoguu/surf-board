const slider = $(".products").bxSlider({
  pager: false,
  controls: false
});

$('.product-slider__arrow--prev').click (e => {
  e.preventDefault();
  slider.goToPrevSlide();
})

$('.product-slider__arrow--next').click (e => {
  e.preventDefault();
  slider.goToNextSlide();
})