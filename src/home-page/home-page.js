// home-page.js - добавьте этот код в конец файла

// Функция для категорий
function initCategorySection() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const mainImage = document.getElementById('category-main-image');
    const infoTitle = document.querySelector('.category-info-title');
    const infoDescription = document.querySelector('.category-info-description');
    
    if (!categoryButtons.length || !mainImage) return;
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Получаем данные из data-атрибутов
            const imageSrc = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            
            // Обновляем изображение
            mainImage.src = `../home-page/view/${imageSrc}`;
            mainImage.alt = title;
            
            // Обновляем заголовок и описание
            if (infoTitle) infoTitle.textContent = title;
            if (infoDescription) infoDescription.textContent = description;
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCategorySection();
    // другие функции инициализации...
});