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
  document.addEventListener('DOMContentLoaded', function () {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');
    burger.addEventListener('click', function () {
      this.classList.toggle('open');
      menu.classList.toggle('active');
    });
    document.querySelectorAll('.menu a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        burger.classList.remove('open');
      });
    });
  });
});
