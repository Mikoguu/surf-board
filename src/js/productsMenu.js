
const measureWidth = item => {

  let reqItemWidth = 0;

  const screenWidth = $(window).width();
  const container = item.closest('.products-menu');
  const menuItems = container.find('.products-menu__item');
  const menuItemsWidth = menuItems.width() * menuItems.length;

  const textContainer = item.find('.products-menu__container');
  const paddingLeft = parseInt(textContainer.css('padding-left'));
  const paddingRight = parseInt(textContainer.css('padding-right'));


  const isTablet = window.matchMedia("(max-width: 768px)").matches;
  
  if (isTablet) {
    
    reqItemWidth = screenWidth - menuItemsWidth;

  } else {
    
    reqItemWidth = 500;
  
  }

  return {
    container: reqItemWidth,
    textContainer: reqItemWidth - paddingLeft - paddingRight
  }; 
}; 


const foldEveryItem = container => {
  const items = container.find('.products-menu__item');
  const content = container.find('.products-menu__content');
  
  items.removeClass('active');
  content.width(0);
}

const unfoldItem = item => {
  const hiddenContent = item.find('.products-menu__content');
  const reqWidth = measureWidth(hiddenContent);
  const textBlock = item.find('.products-menu__container');

  item.addClass('active');
  hiddenContent.width(reqWidth.container);
  textBlock.width(reqWidth.textContainer);
  

}

$('.products-menu__title').on('click' , e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const item = $this.closest('.products-menu__item');
  const itemOpened = item.hasClass('active');
  const container = $this.closest('.products-menu');

  if (itemOpened) {
    
    foldEveryItem(container);
  
  } else {
    
    foldEveryItem(container);
    unfoldItem(item);
  
  }
})
