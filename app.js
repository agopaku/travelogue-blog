// App State Storage
const state = {
  articles: [],
  filteredArticles: [],
  activeCategory: 'all',
  activeTimelineTag: null,
  searchQuery: ''
};

// Substack Feed Config
const SUBSTACK_URL = 'https://anilgopakumar.substack.com/feed';
const RSS2JSON_API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_URL)}`;

// Initialize Application on Page Load
document.addEventListener('DOMContentLoaded', () => {
  setupNavbarScroll();
  fetchArticles();
  setupScrollObserver();
});

// 1. Scroll Event to Add Glassmorphic Styling to Navbar
function setupNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// 2. Retrieve Feed data
async function fetchArticles() {
  const grid = document.getElementById('blogGrid');
  
  try {
    const response = await fetch(RSS2JSON_API);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    if (data.status !== 'ok') throw new Error(data.message || 'Failed to parse RSS feed');
    
    // Parse and Clean items
    state.articles = data.items
      .filter(item => {
        // Filter out administrative/formatting files (like WordPress global styles)
        const titleLower = item.title.toLowerCase();
        return !titleLower.includes('custom styles') && !item.description.includes('isGlobalStylesUserThemeJSON');
      })
      .map(item => parseFeedItem(item));
      
    state.filteredArticles = [...state.articles];
    renderArticles();
    
  } catch (error) {
    console.error('Error fetching Substack feed:', error);
    renderErrorState(error.message);
  }
}

// 3. Helper to Parse Feed Items and Extract Metadata
function parseFeedItem(item) {
  // Extract cover image from enclosure, thumbnail, or content body
  let imageUrl = item.thumbnail || '';
  
  if (item.enclosure && item.enclosure.link) {
    imageUrl = item.enclosure.link;
  }
  
  // Extract first image from HTML content if still empty
  if (!imageUrl && item.content) {
    const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      imageUrl = imgMatch[1];
    }
  }
  
  // Clean description HTML to build a text snippet
  let textSnippet = '';
  if (item.description) {
    textSnippet = item.description
      .replace(/<[^>]*>?/gm, '') // Strip HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // Tag-based Category Assignment
  const titleLower = item.title.toLowerCase();
  const categories = [];
  
  if (titleLower.includes('michigan') || titleLower.includes('betsie') || titleLower.includes('soil') || titleLower.includes(' mi')) {
    categories.push('usa');
  }
  if (titleLower.includes('gaya') || titleLower.includes('varanasi') || titleLower.includes('kerala') || titleLower.includes('rameswaram') || titleLower.includes('agumbe') || titleLower.includes('tuticorin')) {
    categories.push('india');
  }
  if (titleLower.includes('ride') || titleLower.includes('agumbe') || titleLower.includes('motorcycle') || titleLower.includes('road')) {
    categories.push('motorcycle');
  }
  
  return {
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    snippet: textSnippet.substring(0, 160) + (textSnippet.length > 160 ? '...' : ''),
    imageUrl: imageUrl,
    categories: categories,
    rawTags: item.categories || []
  };
}

// 4. Render Article Grid Cards
function renderArticles() {
  const grid = document.getElementById('blogGrid');
  grid.innerHTML = '';
  
  if (state.filteredArticles.length === 0) {
    grid.innerHTML = `
      <div class="loading-state" style="grid-column: 1 / -1; padding: 60px 20px;">
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 8px;">No travel logs match your criteria.</p>
        <a href="#journal" onclick="resetFilters()" style="color: var(--accent); font-weight: 700; text-decoration: underline;">Clear all filters</a>
      </div>
    `;
    return;
  }
  
  state.filteredArticles.forEach(item => {
    // Format pubDate nicely
    let formattedDate = item.pubDate;
    try {
      const d = new Date(item.pubDate.replace(/-/g, '/')); // Handle Safari compatibility
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {
      console.warn('Date parsing issue:', e);
    }
    
    // Assign tag badges to show on UI
    let uiTag = 'Travelogue';
    if (item.categories.includes('motorcycle')) uiTag = '🏍️ Motorcycle Ride';
    else if (item.categories.includes('usa')) uiTag = '🌲 USA Travel';
    else if (item.categories.includes('india')) uiTag = '🕉️ India Journey';
    
    const hasImage = item.imageUrl && item.imageUrl.trim().length > 0;
    const imgHtml = hasImage 
      ? `<img src="${item.imageUrl}" class="blog-img" alt="${item.title}" loading="lazy">`
      : `<div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background: linear-gradient(135deg, #161A26 0%, #0D0E12 100%); color: var(--accent); gap: 10px;">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon></svg>
           <span style="font-size:0.75rem; font-weight:700; letter-spacing: 0.1em; text-transform: uppercase;">Wanderer's Log</span>
         </div>`;
         
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.style.opacity = '0'; // For stagger fade-in observer
    
    card.innerHTML = `
      <div class="blog-img-container">
        ${imgHtml}
      </div>
      <div class="blog-card-content">
        <div class="blog-card-meta">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>${formattedDate}</span>
          <span style="color: var(--text-muted);">&bull;</span>
          <span style="letter-spacing: 0.05em;">${uiTag}</span>
        </div>
        <h3 class="blog-card-title">${item.title}</h3>
        <p class="blog-card-snippet">${item.snippet}</p>
        <div class="blog-card-actions">
          <a href="${item.link}" target="_blank" rel="noopener" class="blog-card-btn primary">Read Journal</a>
          <button onclick="shareLink('${item.title}', '${item.link}', event)" class="blog-card-btn secondary" aria-label="Share article">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
            <span>Share</span>
          </button>
        </div>
      </div>
    `;
    
    grid.appendChild(card);
  });
  
  // Trigger card fade-in animation trigger
  setTimeout(runObserverCheck, 50);
}

// 5. Render Error State
function renderErrorState(message) {
  const grid = document.getElementById('blogGrid');
  grid.innerHTML = `
    <div class="error-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <h3>Unable to load travel logs</h3>
      <p style="font-size:0.9rem; margin-top:8px;">${message || 'CORS blocking or feed error.'}</p>
      <button onclick="fetchArticles()">Try Again</button>
    </div>
  `;
}

// 6. Filtering Logic by Category Tabs
function filterCategory(category) {
  state.activeCategory = category;
  state.activeTimelineTag = null; // Clear timeline filter when clicking tabs
  
  // Reset active tag on nodes
  document.querySelectorAll('.timeline-node').forEach(node => node.classList.remove('active'));
  
  // Update Active Tab styles
  document.querySelectorAll('.category-tab').forEach(tab => {
    if (tab.getAttribute('data-filter') === category) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  applyFilters();
}

// 7. Filtering Logic by Timeline Node Click
function filterByTimelineTag(tag) {
  // Clear other category tabs
  document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
  
  // Toggle Selection
  const nodes = document.querySelectorAll('.timeline-node');
  let alreadyActive = false;
  
  nodes.forEach(node => {
    const nodeTag = node.getAttribute('data-tag');
    if (nodeTag === tag) {
      if (node.classList.contains('active')) {
        node.classList.remove('active');
        alreadyActive = true;
      } else {
        node.classList.add('active');
      }
    } else {
      node.classList.remove('active');
    }
  });
  
  if (alreadyActive) {
    // If clicked again, reset to 'all'
    state.activeTimelineTag = null;
    filterCategory('all');
  } else {
    state.activeTimelineTag = tag;
    state.activeCategory = 'all'; // Clear tab highlight
    applyFilters();
    
    // Smooth scroll down to journal grid to show filtered result
    document.getElementById('journal').scrollIntoView({ behavior: 'smooth' });
  }
}

// 8. Search Keyword Box Handler
function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  state.searchQuery = searchInput.value.toLowerCase().trim();
  applyFilters();
}

// 9. Consolidate Filters and Render
function applyFilters() {
  state.filteredArticles = state.articles.filter(item => {
    // Search filter
    const matchesSearch = item.title.toLowerCase().includes(state.searchQuery) || 
                          item.snippet.toLowerCase().includes(state.searchQuery);
    
    // Category tab filter
    let matchesCategory = true;
    if (state.activeCategory !== 'all') {
      matchesCategory = item.categories.includes(state.activeCategory);
    }
    
    // Timeline tag filter
    let matchesTimeline = true;
    if (state.activeTimelineTag) {
      const tagLower = state.activeTimelineTag.toLowerCase();
      matchesTimeline = item.title.toLowerCase().includes(tagLower) || 
                        item.snippet.toLowerCase().includes(tagLower) || 
                        item.categories.includes(tagLower);
                        
      // Special routing checks for nodes
      if (tagLower === 'freedom ride' || tagLower === 'freedom') {
        matchesTimeline = item.title.toLowerCase().includes('freedom') || item.title.toLowerCase().includes('rameswaram');
      }
    }
    
    return matchesSearch && matchesCategory && matchesTimeline;
  });
  
  renderArticles();
}

// 10. Reset Filters Helper
function resetFilters() {
  document.getElementById('searchInput').value = '';
  state.searchQuery = '';
  state.activeTimelineTag = null;
  document.querySelectorAll('.timeline-node').forEach(node => node.classList.remove('active'));
  filterCategory('all');
}

// 11. Clipboard and API Link Sharing
function shareLink(title, url, event) {
  if (event) event.stopPropagation();
  
  if (navigator.share) {
    navigator.share({
      title: title,
      url: url
    }).catch(err => console.log('Share canceled', err));
  } else {
    // Fallback: Copy link
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Copied article link to clipboard!');
      })
      .catch(err => {
        alert(`Failed to copy link. Link: ${url}`);
      });
  }
}

// 12. Newsletter Form Submission to Substack Prefill
function handleSubscribe() {
  const emailInput = document.getElementById('subscribeEmail');
  const email = emailInput.value.trim();
  
  if (!email || !validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Prefill subscription email directly onto Substack's subscription pipeline
  const prefillUrl = `https://anilgopakumar.substack.com/subscribe?email=${encodeURIComponent(email)}`;
  window.open(prefillUrl, '_blank', 'noopener');
  emailInput.value = '';
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 13. Card Scroll Reveal Micro-Animations (Observer Pattern)
let cardObserver;
function setupScrollObserver() {
  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Apply staggering delays to visible elements
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        }, index * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
}

function runObserverCheck() {
  const cards = document.querySelectorAll('.blog-card');
  cards.forEach(card => {
    if (card.style.opacity !== '1') {
      card.style.transform = 'translateY(30px)';
      cardObserver.observe(card);
    }
  });
}
