  const openItem = item => {
  
  const memberCard = item.closest('.team__item');
  const detailsWindow = memberCard.find('.details__window');
  const arrow = memberCard.find('.details__icon');
  const arrowIconActive = memberCard.find('.arrow-unfold--active');
  const arrowIcon = memberCard.find('.arrow-unfold');
  const memberImg = memberCard.find('.member__img');
  const memberInfoName = memberCard.find('.details')
  const memberImgClone = memberImg.clone();

  memberImgClone.removeClass('member__img').addClass('member__img-tablet');
  $(memberInfoName).after(memberImgClone);

  if (window.innerWidth <= 768) {
    memberImgClone.css('display' , 'flex');
  }

  memberCard.addClass('active');
  detailsWindow.slideToggle();
  arrow.addClass('arrow-active');
  
  if (arrow.hasClass('arrow-active')) {
    arrowIconActive.css('display', 'block');
    arrowIcon.css('display', 'none');
  }
  
}


const closeEveryItem = memberCard => {

  const items = memberCard.find('.details__window');
  const imgs = memberCard.find('.member__img-tablet');
  const itemContainer = memberCard.find('.team__item');
  const arrow = memberCard.find('.details__icon');

  itemContainer.removeClass("active");
  items.css('display' , 'none');
  imgs.css('display' , 'none');
  
  if (arrow.hasClass('arrow-active')) {
    arrow.removeClass('arrow-active');
  }
  
}


$('.member__details-button').click(e => {

  const $this = $(e.currentTarget);
  const memberCard = $this.closest('.team__list');
  const itemContainer = $this.closest('.team__item');
  const detailsWindow = memberCard.find('.details__window');
  const arrow = memberCard.find('.details__icon');
  const arrowIconActive = memberCard.find('.arrow-unfold--active');
  const arrowIcon = memberCard.find('.arrow-unfold');
  const memberImgClone = memberCard.find('.member__img-tablet');
  const memberImgCloneDisplay = memberImgClone.css('display');

  if (itemContainer.hasClass('active') && arrow.hasClass('arrow-active')) {
    detailsWindow.css('display' , 'none');
    arrow.removeClass('arrow-active');
    memberImgClone.remove();
    arrowIconActive.css('display','none');
    arrowIcon.css('display','block');

  } else {
    closeEveryItem(memberCard);
    openItem($this);
  }
})

