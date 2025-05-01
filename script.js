// Загрузка сохранённого цвета
    const savedColor = localStorage.getItem('bgColor');
    if (savedColor) {
      document.body.style.backgroundColor = savedColor;
    }

    // Навешиваем события на элементы
    document.querySelectorAll('.dropdown-content a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const color = link.getAttribute('data-color');
        document.body.style.backgroundColor = color;
        localStorage.setItem('bgColor', color);
      });
    });