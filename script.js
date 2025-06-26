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
  function toggleMenu() {
    document.querySelector('.header-nav').classList.toggle('active');
    document.querySelector('.header-email').classList.toggle('active');
  }
});
