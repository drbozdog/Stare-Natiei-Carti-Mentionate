
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const bookCards = document.querySelectorAll('.book-card');
    const sortButtons = document.querySelectorAll('.sort-button');
    const sortDirections = document.querySelectorAll('.sort-direction');
    const filterButtons = document.querySelectorAll('.filter-button');
    const bookGrid = document.querySelector('.book-grid');
    
    // Track current state
    let currentSort = 'date';
    let currentFilter = null;
    let sortDirectionAsc = {
        date: false,
        mentions: false,
        alpha: false
    };
    
    // Helper function to get the latest mention date from a card
    function getLatestMentionDate(card) {
        const mentionLink = card.querySelector('.mention-link');
        if (!mentionLink) return new Date(0); // Return oldest possible date if no mention
        return new Date(mentionLink.dataset.mentionDate || 0);
    }
    
    // Helper function to get the number of mentions from a card
    function getMentionCount(card) {
        return parseInt(card.dataset.mentionCount || '0', 10);
    }
    
    // Helper function to get the book title from a card
    function getBookTitle(card) {
        const titleElement = card.querySelector('.book-title');
        return titleElement ? titleElement.textContent.toLowerCase() : '';
    }
    
    // Sorting functions
    const sortFunctions = {
        date: (a, b, asc) => {
            const diff = getLatestMentionDate(b) - getLatestMentionDate(a);
            return asc ? -diff : diff;
        },
        mentions: (a, b, asc) => {
            const diff = getMentionCount(b) - getMentionCount(a);
            return asc ? -diff : diff;
        },
        alpha: (a, b, asc) => {
            const diff = getBookTitle(a).localeCompare(getBookTitle(b));
            return asc ? diff : -diff;
        }
    };
    
    // Function to update sort direction icon
    function updateSortDirectionIcon(button) {
        const sortType = button.dataset.sort;
        const isAsc = sortDirectionAsc[sortType];
        const icon = button.querySelector('i');
        icon.className = isAsc ? 'fas fa-arrow-up-short-wide' : 'fas fa-arrow-down-short-wide';
    }
    
    // Function to check if a card matches the current filter
    function matchesFilter(card) {
        if (!currentFilter) return true;
        return card.dataset[currentFilter] === 'true';
    }
    
    // Function to check if a card matches the search term
    function matchesSearch(card, searchTerm) {
        if (!searchTerm) return true;
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('.author').textContent.toLowerCase();
        const mentions = card.querySelector('.mentions').textContent.toLowerCase();
        return title.includes(searchTerm) || author.includes(searchTerm) || mentions.includes(searchTerm);
    }
    
    // Function to update card visibility
    function updateCardVisibility() {
        const searchTerm = searchInput.value.toLowerCase();
        
        bookCards.forEach(card => {
            const isVisible = matchesFilter(card) && matchesSearch(card, searchTerm);
            card.style.display = isVisible ? '' : 'none';
        });
    }
    
    // Function to sort cards
    function sortCards(sortType) {
        const cards = Array.from(bookCards);
        const isAsc = sortDirectionAsc[sortType];
        cards.sort((a, b) => sortFunctions[sortType](a, b, isAsc));
        
        // Remove all cards
        cards.forEach(card => card.remove());
        
        // Add cards back in sorted order
        cards.forEach(card => bookGrid.appendChild(card));
    }
    
    // Handle filter button clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.dataset.filter;
            
            // Toggle filter
            if (currentFilter === filterType) {
                currentFilter = null;
                button.classList.remove('active');
            } else {
                currentFilter = filterType;
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }
            
            // Update visibility and re-sort
            updateCardVisibility();
            sortCards(currentSort);
        });
    });
    
    // Handle sort button clicks
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sortType = button.dataset.sort;
            
            // Update active state
            sortButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update current sort
            currentSort = sortType;
            
            // Sort cards
            sortCards(sortType);
        });
    });
    
    // Handle sort direction clicks
    sortDirections.forEach(button => {
        button.addEventListener('click', () => {
            const sortType = button.dataset.sort;
            
            // Toggle direction
            sortDirectionAsc[sortType] = !sortDirectionAsc[sortType];
            
            // Update icon
            updateSortDirectionIcon(button);
            
            // If this is the current sort, re-sort the cards
            if (sortType === currentSort) {
                sortCards(sortType);
            }
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', () => {
        updateCardVisibility();
    });
    
    // Initial sort
    sortCards('date');
});
