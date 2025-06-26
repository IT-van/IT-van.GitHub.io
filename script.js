document.addEventListener("DOMContentLoaded", function(){
  const text = "Артём Станчук";
  const typingSpeed = 150;
  const delayAfterFinish = 3000;
  const nameElement = document.getElementById("name");

  let index = 1; 

  function typeText() {
    if (index <= text.length) {
      nameElement.textContent = text.slice(0, index);
      index++;
      setTimeout(typeText, typingSpeed);
    } else {
      setTimeout(() => {
        index = 1; 
        nameElement.textContent = text[0]; 
        typeText();
      }, delayAfterFinish);
    }
  }
  nameElement.textContent = text[0];
  typeText();
  $(".gallery").magnificPopup({
    type: "image",
    gallery:{
      enabled: true
    }
  });
  //document.addEventListener('DOMContentLoaded', function() {
  //  const burger = document.getElementById('burger');
  //  const menu = document.getElementById('menu');
  //  
  //  burger.addEventListener('click', function() {
  //      this.classList.toggle('open');
  //      menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  //  });
  //});
  document.addEventListener('DOMContentLoaded', function () {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  // Открыть/закрыть при нажатии на бургер
  burger.addEventListener('click', function (event) {
    event.stopPropagation(); // чтобы не закрылось тут же
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // Клик вне меню или бургера — закрывает меню
  document.addEventListener('click', function (event) {
    const isClickInsideMenu = menu.contains(event.target);
    const isClickOnBurger = burger.contains(event.target);

    if (!isClickInsideMenu && !isClickOnBurger) {
      burger.classList.remove('open');
      menu.classList.remove('open');
    }
  });
});
});
