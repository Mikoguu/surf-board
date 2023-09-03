const burgerMenu = document.querySelector('.burger-menu');
const menuModal = document.querySelector('.menu-modal');
const computedStyles = getComputedStyle(menuModal);
const closeButton = document.querySelector('.menu-modal__close');
const wrapper = document.querySelector('.wrapper');

burgerMenu.addEventListener('click' , e => {
   
  e.preventDefault();

  menuModal.style.display = 'flex';
  wrapper.style.height = `${100}%`;
  

})

closeButton.addEventListener('click' , e => {

  e.preventDefault();

  menuModal.style.display = 'none';
})