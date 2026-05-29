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

// Visited States Configuration (49 States Visited, 1 State 'AK' as Explore placeholder)
// Paste your Google Photos Shared Album links into albumUrl to link them directly to the map!
const travelHistory = {
  "AL": { name: "Alabama", visited: true, visits: [{ year: "2019", note: "Riding through the heart of the South, exploring historic routes.", albumUrl: "" }] },
  "AK": { name: "Alaska", visited: false, visits: [] },
  "AZ": { name: "Arizona", visited: true, visits: [{ year: "2020", note: "Cruising the desert highways and canyons under dramatic skies.", albumUrl: "" }] },
  "AR": { name: "Arkansas", visited: true, visits: [{ year: "2019", note: "Riding the winding mountain curves of the Ozarks.", albumUrl: "" }] },
  "CA": { name: "California", visited: true, visits: [{ year: "2021", note: "Riding the iconic twists of the Pacific Coast Highway.", albumUrl: "" }] },
  "CO": { name: "Colorado", visited: true, visits: [{ year: "2020", note: "Tackling high-altitude mountain passes and Rockies views.", albumUrl: "" }] },
  "CT": { name: "Connecticut", visited: true, visits: [{ year: "2022", note: "Cruising through beautiful New England historic towns.", albumUrl: "" }] },
  "DE": { name: "Delaware", visited: true, visits: [{ year: "2022", note: "Scenic coastal rides along the Delaware Bay.", albumUrl: "" }] },
  "FL": { name: "Florida", visited: true, visits: [{ year: "2019", note: "Cruising along the Overseas Highway through the Florida Keys.", albumUrl: "" }] },
  "GA": { name: "Georgia", visited: true, visits: [{ year: "2019", note: "Exploring historic roads, Spanish moss, and Southern paths.", albumUrl: "" }] },
  "HI": { name: "Hawaii", visited: true, visits: [{ year: "2023", note: "Exploring the volcanic coastlines and tropical routes of the islands.", albumUrl: "" }] },
  "ID": { name: "Idaho", visited: true, visits: [{ year: "2021", note: "Riding through rugged river canyons and forest routes.", albumUrl: "" }] },
  "IL": { name: "Illinois", visited: true, visits: [{ year: "2018", note: "Starting journeys along the classic Route 66 corridors.", albumUrl: "" }] },
  "IN": { name: "Indiana", visited: true, visits: [{ year: "2018", note: "Scenic rides through Midwest farmlands and state forests.", albumUrl: "" }] },
  "IA": { name: "Iowa", visited: true, visits: [{ year: "2018", note: "Cruising the rolling hills and crossing the Mississippi River routes.", albumUrl: "" }] },
  "KS": { name: "Kansas", visited: true, visits: [{ year: "2020", note: "Expansive horizons and endless open skies along the plains.", albumUrl: "" }] },
  "KY": { name: "Kentucky", visited: true, visits: [{ year: "2019", note: "Riding through beautiful horse country and rolling bluegrass hills.", albumUrl: "" }] },
  "LA": { name: "Louisiana", visited: true, visits: [{ year: "2019", note: "Cruising bayou routes and exploring unique Cajun country roads.", albumUrl: "" }] },
  "ME": { name: "Maine", visited: true, visits: [{ year: "2022", note: "Lighthouses, rocky shores, and Acadia coastal highways.", albumUrl: "" }] },
  "MD": { name: "Maryland", visited: true, visits: [{ year: "2022", note: "Scenic loops around Chesapeake Bay and historic sites.", albumUrl: "" }] },
  "MA": { name: "Massachusetts", visited: true, visits: [{ year: "2022", note: "Exploring Cape Cod loops and historic colonial roads.", albumUrl: "" }] },
  "MI": { name: "Michigan", visited: true, visits: [{ year: "2018", note: "Michigan coast, lighthouses & unpaved logging roads in Free Soil.", albumUrl: "" }] },
  "MN": { name: "Minnesota", visited: true, visits: [{ year: "2018", note: "Cruising along the scenic North Shore of Lake Superior.", albumUrl: "" }] },
  "MS": { name: "Mississippi", visited: true, visits: [{ year: "2019", note: "Riding the historic Natchez Trace Parkway.", albumUrl: "" }] },
  "MO": { name: "Missouri", visited: true, visits: [{ year: "2019", note: "Exploring the winding roads of the Ozarks and Route 66 landmarks.", albumUrl: "" }] },
  "MT": { name: "Montana", visited: true, visits: [{ year: "2021", note: "Riding the Going-to-the-Sun Road in Glacier National Park.", albumUrl: "" }] },
  "NE": { name: "Nebraska", visited: true, visits: [{ year: "2020", note: "Following the historic Platte River valley trails westward.", albumUrl: "" }] },
  "NV": { name: "Nevada", visited: true, visits: [{ year: "2021", note: "Crossing the vast, desolate stretches of the Loneliest Road in America.", albumUrl: "" }] },
  "NH": { name: "New Hampshire", visited: true, visits: [{ year: "2022", note: "Carving through the White Mountains and the Kancamagus Highway.", albumUrl: "" }] },
  "NJ": { name: "New Jersey", visited: true, visits: [{ year: "2022", note: "Scenic coastal rides along the Delaware Water Gap.", albumUrl: "" }] },
  "NM": { name: "New Mexico", visited: true, visits: [{ year: "2020", note: "Exploring red rock mesas, high deserts, and adobe villages.", albumUrl: "" }] },
  "NY": { name: "New York", visited: true, visits: [{ year: "2022", note: "Cruising upstate mountain routes, the Adirondacks, and Hudson Valley.", albumUrl: "" }] },
  "NC": { name: "North Carolina", visited: true, visits: [{ year: "2019", note: "Riding the breathtaking heights of the Blue Ridge Parkway.", albumUrl: "" }] },
  "ND": { name: "North Dakota", visited: true, visits: [{ year: "2021", note: "Exploring the rugged beauty of the Theodore Roosevelt Badlands.", albumUrl: "" }] },
  "OH": { name: "Ohio", visited: true, visits: [{ year: "2018", note: "Winding state routes through the scenic Hocking Hills.", albumUrl: "" }] },
  "OK": { name: "Oklahoma", visited: true, visits: [{ year: "2020", note: "Tracing the classic red dirt stretches of historic Route 66.", albumUrl: "" }] },
  "OR": { name: "Oregon", visited: true, visits: [{ year: "2021", note: "Winding coastal cliffs, towering pines, and Columbia River Gorge views.", albumUrl: "" }] },
  "PA": { name: "Pennsylvania", visited: true, visits: [{ year: "2022", note: "Crossing historic covered bridges and Allegheny forest routes.", albumUrl: "" }] },
  "RI": { name: "Rhode Island", visited: true, visits: [{ year: "2022", note: "Coastal loops through historic Newport and Narragansett Bay.", albumUrl: "" }] },
  "SC": { name: "South Carolina", visited: true, visits: [{ year: "2019", note: "Warm Southern breeze along the Atlantic coastal marshes.", albumUrl: "" }] },
  "SD": { name: "South Dakota", visited: true, visits: [{ year: "2021", note: "Riding Badlands loops, Iron Mountain Road, and the Black Hills.", albumUrl: "" }] },
  "TN": { name: "Tennessee", visited: true, visits: [{ year: "2019", note: "Cruising the Great Smoky Mountains and winding valley roads.", albumUrl: "" }] },
  "TX": { name: "Texas", visited: true, visits: [{ year: "2020", note: "Cruising the massive, open expanses of West Texas and Hill Country.", albumUrl: "" }] },
  "UT": { name: "Utah", visited: true, visits: [{ year: "2020", note: "Carving through the dramatic red rock canyons of Zion and Bryce.", albumUrl: "" }] },
  "VT": { name: "Vermont", visited: true, visits: [{ year: "2022", note: "Riding green valleys, gap roads, and seeing autumn foliage colors.", albumUrl: "" }] },
  "VA": { name: "Virginia", visited: true, visits: [{ year: "2019", note: "Cruising the Blue Ridge Parkway and Skyline Drive summits.", albumUrl: "" }] },
  "WA": { name: "Washington", visited: true, visits: [{ year: "2021", note: "Exploring the Olympic Peninsula loop and misty rainforest routes.", albumUrl: "" }] },
  "WV": { name: "West Virginia", visited: true, visits: [{ year: "2019", note: "Carving the tight, challenging curves of the Appalachian mountains.", albumUrl: "" }] },
  "WI": { name: "Wisconsin", visited: true, visits: [{ year: "2018", note: "Exploring the quiet, scenic roads along the Door County Peninsula.", albumUrl: "" }] },
  "WY": { name: "Wyoming", visited: true, visits: [{ year: "2021", note: "Grand Teton passes, Yellowstone hot springs, and high plains.", albumUrl: "" }] },
  "DC": { name: "Washington D.C.", visited: true, visits: [{ year: "2022", note: "Riding around the historic national malls and monument circles.", albumUrl: "" }] }
};

// Custom Travel Journeys (India, historic runs, etc.) to merge into the main timeline
const customTrips = [
  { name: "Freedom Ride", location: "Rameswaram & Tuticorin, India", year: "2014", note: "ECR coastal sprint to Rama Sethu, sleeping on milestone benches at 3 AM.", tag: "Freedom" },
  { name: "Agumbe Rain Forest", location: "Agumbe, India", year: "2014", note: "Riding the famous hairpin bends and rain-soaked ghats of Western India.", tag: "Agumbe" },
  { name: "Exotic Kerala", location: "Kerala, India", year: "2014", note: "Riding through backwaters, tea gardens, and tropical coastlines.", tag: "Kerala" },
  { name: "Varanasi & Bodh Gaya", location: "Varanasi, India", year: "2016", note: "Exploring the spiritual ghats and finding serene enlightenment in Bodh Gaya.", tag: "India" }
];

// Initialize Application on Page Load
document.addEventListener('DOMContentLoaded', () => {
  setupNavbarScroll();
  fetchArticles();
  setupScrollObserver();
  setupMapInteraction();
  renderDynamicTimeline();
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

// 14. Interactive USA Map Hook & State Configuration Load
function setupMapInteraction() {
  const mapSvg = document.getElementById('us-map');
  const tooltip = document.getElementById('map-tooltip');
  
  if (!mapSvg || !tooltip) return;
  
  // Find all state path elements in the SVG
  const statePaths = mapSvg.querySelectorAll('.state-path');
  
  statePaths.forEach(path => {
    const stateId = path.getAttribute('id');
    const info = travelHistory[stateId];
    
    // 1. Label and apply 'visited' class styles to the paths
    if (info && info.visited) {
      path.classList.add('visited');
    }
    
    // 2. Mouseover Tooltip Trigger
    path.addEventListener('mouseover', (e) => {
      if (info) {
        let visitText = 'To Explore';
        if (info.visited && info.visits && info.visits.length > 0) {
          const years = info.visits.map(v => v.year).join(', ');
          visitText = `Visited (${years})`;
        }
        tooltip.innerHTML = `<strong>${info.name}</strong><br>${visitText}`;
        tooltip.style.opacity = '1';
      }
    });
    
    // 3. Mousemove tracking to keep tooltip aligned to cursor
    path.addEventListener('mousemove', (e) => {
      // Offset tooltip from cursor
      tooltip.style.left = `${e.clientX + 15}px`;
      tooltip.style.top = `${e.clientY + 15}px`;
    });
    
    // 4. Mouseout Trigger
    path.addEventListener('mouseout', () => {
      tooltip.style.opacity = '0';
    });
    
    // 5. Click event to open State Detail Modal
    path.addEventListener('click', () => {
      if (info && info.visited) {
        openStateModal(stateId);
      } else if (info) {
        alert(`${info.name} is on my bucket list to explore on a future ride!`);
      }
    });
  });
}

// 15. Open State Detail Modal with linked Google Photos & Substack Articles
// 15. Open State Detail Modal with linked Google Photos & Substack Articles
function openStateModal(stateId) {
  const modal = document.getElementById('stateModal');
  const title = document.getElementById('modalStateTitle');
  const visitsContainer = document.getElementById('modalVisitsContainer');
  const substackSection = document.getElementById('modalSubstackSection');
  const linksContainer = document.getElementById('modalSubstackLinks');
  
  const info = travelHistory[stateId];
  if (!info || !modal) return;
  
  // Set modal title
  title.textContent = info.name;
  
  // Render visits list dynamically
  visitsContainer.innerHTML = '';
  if (info.visits && info.visits.length > 0) {
    info.visits.forEach(visit => {
      const card = document.createElement('div');
      card.className = 'visit-log-card';
      
      // Determine Photo Album URL or Fallback
      let albumUrl = visit.albumUrl || '';
      let btnText = 'View Photo Album';
      if (!albumUrl || albumUrl.trim().length === 0) {
        albumUrl = `https://photos.google.com/search/${encodeURIComponent(info.name + ' ' + visit.year)}`;
        btnText = `Search Photos (${visit.year})`;
      }
      
      card.innerHTML = `
        <div class="visit-log-header">
          <span class="visit-year">${visit.year}</span>
          <a href="${albumUrl}" target="_blank" rel="noopener" class="visit-album-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <span>${btnText}</span>
          </a>
        </div>
        <p class="visit-note">${visit.note}</p>
      `;
      visitsContainer.appendChild(card);
    });
  } else {
    visitsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No visits recorded yet.</p>`;
  }
  
  // Search for matching Substack articles in local state
  const stateQuery = info.name.toLowerCase();
  const stateIdQuery = stateId.toLowerCase();
  
  const matchingArticles = state.articles.filter(article => {
    return article.title.toLowerCase().includes(stateQuery) || 
           article.snippet.toLowerCase().includes(stateQuery) ||
           article.categories.includes(stateIdQuery) ||
           article.categories.includes(stateQuery);
  });
  
  linksContainer.innerHTML = '';
  if (matchingArticles.length > 0) {
    substackSection.style.display = 'block';
    matchingArticles.forEach(article => {
      const a = document.createElement('a');
      a.className = 'modal-substack-link';
      a.href = article.link;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = `
        <span>${article.title}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      `;
      linksContainer.appendChild(a);
    });
  } else {
    substackSection.style.display = 'none';
  }
  
  // Show modal
  modal.classList.add('open');
}

// 16. Close State Detail Modal Action
function closeStateModal(event) {
  const modal = document.getElementById('stateModal');
  if (!modal) return;
  
  if (event === 'force') {
    modal.classList.remove('open');
  } else if (event && event.target === modal) {
    modal.classList.remove('open');
  }
}

// 17. Scroll to map and open state modal
function scrollToMapAndOpenModal(stateId) {
  const mapSection = document.getElementById('map');
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: 'smooth' });
    // Wait for smooth scroll to finish before opening modal
    setTimeout(() => {
      openStateModal(stateId);
    }, 600);
  }
}

// 18. Generate and render Travel Highlights Timeline dynamically
function renderDynamicTimeline() {
  const timelineContainer = document.getElementById('dynamicTimeline');
  if (!timelineContainer) return;
  
  // Clear existing nodes except connecting line
  const existingNodes = timelineContainer.querySelectorAll('.timeline-node');
  existingNodes.forEach(node => node.remove());
  
  const events = [];
  
  // Gather US visits
  Object.keys(travelHistory).forEach(stateId => {
    const info = travelHistory[stateId];
    if (info.visited && info.visits) {
      info.visits.forEach(visit => {
        events.push({
          type: 'state',
          stateCode: stateId,
          name: info.name,
          year: parseInt(visit.year) || 0,
          yearStr: visit.year,
          note: visit.note,
          tag: info.name
        });
      });
    }
  });
  
  // Gather Custom visits
  customTrips.forEach(trip => {
    events.push({
      type: 'custom',
      name: trip.name,
      location: trip.location,
      year: parseInt(trip.year) || 0,
      yearStr: trip.year,
      note: trip.note,
      tag: trip.tag
    });
  });
  
  // Sort oldest to newest
  events.sort((a, b) => a.year - b.year);
  
  // Generate and append cards
  events.forEach(event => {
    const node = document.createElement('div');
    node.className = 'timeline-node';
    
    let metaText = '';
    let titleText = '';
    let descText = '';
    let clickHandler = '';
    
    if (event.type === 'state') {
      metaText = `USA Travel • ${event.yearStr}`;
      titleText = event.name;
      descText = event.note;
      node.setAttribute('data-state', event.stateCode);
      // Double escaping quotes in handler
      node.addEventListener('click', () => {
        scrollToMapAndOpenModal(event.stateCode);
      });
    } else {
      metaText = `${event.location} • ${event.yearStr}`;
      titleText = event.name;
      descText = event.note;
      node.setAttribute('data-tag', event.tag);
      node.addEventListener('click', () => {
        filterByTimelineTag(event.tag);
      });
    }
    
    node.innerHTML = `
      <div class="node-dot"></div>
      <div class="node-card">
        <span class="node-meta">${metaText}</span>
        <h3 class="node-title">${titleText}</h3>
        <p class="node-desc">${descText}</p>
        <span class="node-link">${event.type === 'state' ? 'View details & map &rarr;' : 'Filter articles &rarr;'}</span>
      </div>
    `;
    
    timelineContainer.appendChild(node);
  });
}

