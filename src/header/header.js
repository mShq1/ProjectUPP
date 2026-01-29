
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerDropdown = document.querySelector('.burger-dropdown');
    
    if (burgerMenu && burgerDropdown) {
        burgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            burgerMenu.classList.toggle('active');
            burgerDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!burgerMenu.contains(e.target) && !burgerDropdown.contains(e.target)) {
                burgerMenu.classList.remove('active');
                burgerDropdown.classList.remove('active');
            }
        });

        burgerDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                burgerDropdown.classList.remove('active');
            });
        });
    }
});

