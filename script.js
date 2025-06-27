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
  //тут наченается писанина ChatGPT
  //document.addEventListener('DOMContentLoaded', function () {
  //const burger = document.getElementById('burger');
  //const menu = document.getElementById('menu');
//
  //// Открыть/закрыть при нажатии на бургер
  //burger.addEventListener('click', function (event) {
  //  event.stopPropagation(); // чтобы не закрылось тут же
  //  burger.classList.toggle('open');
  //  menu.classList.toggle('open');
  //});
//
  //// Клик вне меню или бургера — закрывает меню
  //document.addEventListener('click', function (event) {
  //  const isClickInsideMenu = menu.contains(event.target);
  //  const isClickOnBurger = burger.contains(event.target);
//
  //  if (!isClickInsideMenu && !isClickOnBurger) {
  //    burger.classList.remove('open');
  //    menu.classList.remove('open');
  //  }
  //});
//});
window.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("lang-select");
  if (!popup) return; // если нет окна — выходим
  let visitCount = parseInt(localStorage.getItem("visitCount")) || 0;
  let langSelected = localStorage.getItem("langSelected");
  visitCount += 1;
  localStorage.setItem("visitCount", visitCount);
  if (!langSelected || visitCount >= 5) {
    popup.style.display = "block";
    document.body.classList.add("freeze-scroll");
    localStorage.setItem("visitCount", 0);
  } else {
    popup.style.display = "none";
  }
});
function selectLang(lang) {
  localStorage.setItem("langSelected", lang);
  const popup = document.getElementById("lang-select");

  if (lang === "ru") {
    if (popup) popup.style.display = "none";
    document.body.classList.remove("freeze-scroll");
  } else if (lang === "fi") {
    window.location.href = "fi.html"; 
  }
}
window.selectLang = selectLang; 
});
