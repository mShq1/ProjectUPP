
function initCategorySection() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const mainImage = document.getElementById('category-main-image');
    const infoTitle = document.querySelector('.category-info-title');
    const infoDescription = document.querySelector('.category-info-description');
    
    if (!categoryButtons.length || !mainImage) return;
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
 
            this.classList.add('active');

            const imageSrc = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            
            mainImage.src = `../home-page/view/${imageSrc}`;
            mainImage.alt = title;
            
            if (infoTitle) infoTitle.textContent = title;
            if (infoDescription) infoDescription.textContent = description;
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initCategorySection();
});