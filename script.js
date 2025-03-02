
    document.addEventListener('DOMContentLoaded', function() {
        // Back to top button functionality
        const backToTopButton = document.querySelector('.back-to-top');
        
        function toggleBackToTopButton() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'flex';
                backToTopButton.style.opacity = '1';
            } else {
                backToTopButton.style.opacity = '0';
                setTimeout(() => {
                    if (backToTopButton.style.opacity === '0') {
                        backToTopButton.style.display = 'none';
                    }
                }, 150);
            }
        }
        
        window.addEventListener('scroll', toggleBackToTopButton);
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Enhanced search functionality with debouncing
        const searchInput = document.getElementById('search-input');
        const bookCards = document.querySelectorAll('.book-card');
        let searchTimeout;
        
        function debounce(func, wait) {
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(searchTimeout);
                    func(...args);
                };
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(later, wait);
            };
        }
        
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase();
            const words = searchTerm.split(' ').filter(word => word.length > 0);
            
            bookCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const author = card.querySelector('.author').textContent.toLowerCase();
                const content = card.textContent.toLowerCase();
                
                // If search is empty, show all cards
                if (words.length === 0) {
                    card.style.display = '';
                    card.style.opacity = '1';
                    return;
                }
                
                // Check if all search words are found
                const isMatch = words.every(word => 
                    title.includes(word) || 
                    author.includes(word) || 
                    content.includes(word)
                );
                
                if (isMatch) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        }
        
        const debouncedSearch = debounce(performSearch, 300);
        searchInput.addEventListener('input', debouncedSearch);
        
        // Book details functionality
        function showBookDetails(bookId) {
            const bookCard = document.getElementById(bookId);
            const detailsPage = document.createElement('div');
            detailsPage.className = 'book-details-page fade-in';
            
            const content = document.createElement('div');
            content.className = 'book-details-content';
            
            // Clone the book content
            const bookContent = bookCard.cloneNode(true);
            
            // Remove the "View Details" button from the clone
            const viewDetailsBtn = bookContent.querySelector('.view-details');
            if (viewDetailsBtn) {
                viewDetailsBtn.remove();
            }
            
            // Remove the gradient overlay from mentions
            const mentionsPreview = bookContent.querySelector('.mentions-preview');
            if (mentionsPreview) {
                mentionsPreview.style.overflow = 'visible';
                mentionsPreview.style.marginBottom = '0';
                mentionsPreview.classList.remove('mentions-preview');
                mentionsPreview.classList.add('book-details-mentions');
            }
            
            // Add close button
            const closeButton = document.createElement('button');
            closeButton.className = 'close-details';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            closeButton.onclick = () => {
                detailsPage.classList.remove('fade-in');
                setTimeout(() => {
                    document.body.removeChild(detailsPage);
                }, 200);
            };
            
            content.appendChild(closeButton);
            content.appendChild(bookContent);
            detailsPage.appendChild(content);
            document.body.appendChild(detailsPage);
            
            // Close on background click
            detailsPage.addEventListener('click', (e) => {
                if (e.target === detailsPage) {
                    closeButton.click();
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeButton.click();
                }
            });
            
            // Prevent body scroll when details page is open
            document.body.style.overflow = 'hidden';
            
            // Restore body scroll when details page is closed
            detailsPage.addEventListener('transitionend', () => {
                if (!detailsPage.classList.contains('fade-in')) {
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Add click handlers for view details buttons
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const bookId = e.target.closest('.book-card').id;
                showBookDetails(bookId);
            });
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Add loading animation
        window.addEventListener('load', function() {
            document.body.classList.add('loaded');
            bookCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
        
        // Initialize cards with opacity 0
        bookCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    });
    