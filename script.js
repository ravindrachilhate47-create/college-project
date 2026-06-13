let selectedCategory = "All";
let searchQuery = "";
let liveApiNews = []; 

const BACKEND_URL = "http://localhost:8000/api/blogs";

const trendingNewsData = [
    { id: "news-t1", title: "OpenAI Rolls Out Advanced GPT-5 Neural Architecture Globally", category: "Tech", content: "The global tech sector experienced a massive shift today as OpenAI officially deployed its next-generation GPT-5 architecture. Early benchmarks reveal human-level reasoning capabilities across complex mathematics, advanced data science pipelines, and secure enterprise software engineering.", imgUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800", date: "Real-Time Live", likes: 142, comments: [] },
    { id: "news-t2", title: "NVIDIA Unveils Blackwell Ultra Microchips For Enterprise AI Hubs", category: "Tech", content: "NVIDIA announced its newest semiconductor line tailored for massive data centers. The Blackwell Ultra promise a 3x efficiency jump in LLM training and scale-out enterprise architecture.", imgUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800", date: "Real-Time Live", likes: 95, comments: [] },
    { id: "news-f1", title: "Bitcoin Smashes All-Time Highs Amid Institutional ETF Inflows", category: "Finance", content: "Cryptocurrency markets reached an unprecedented milestone this morning as Bitcoin surged past key resistance levels. Wall Street institutional spot ETFs recorded a massive $2.4 Billion net inflow in a single session.", imgUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800", date: "Real-Time Live", likes: 210, comments: [] },
    { id: "news-e1", title: "Global Inflation Index Cools Down As Supply Chains Fully Normalize", category: "Economics", content: "The World Economic Forum reported a sharp stabilization in global commodity pricing indexes today. Easing freight costs and optimized manufacturing pipelines indicate a highly positive fiscal quarter ahead for retail market spaces.", imgUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800", date: "Real-Time Live", likes: 64, comments: [] },
    { id: "news-p1", title: "International Clean Energy Accord Signed By 25 Sovereign Nations", category: "Politics", content: "A historic environmental policy treaty was finalized in Geneva today. The signed accord establishes new zero-tariff trade regulations for renewable energy components and smart grid tech distribution globally.", imgUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800", date: "Real-Time Live", likes: 88, comments: [] },
    { id: "news-i1", title: "Smart Automation Driving 40% Operational Efficiency In Modern Production Factories", category: "Industries", content: "Industrial sectors are rapidly scaling up production pipelines by embedding IoT sensor arrays and automated robotic workflows directly into modern manufacturing setups.", imgUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800", date: "Real-Time Live", likes: 73, comments: [] }
];

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    initializeTheme();
    initializeTicker();
    
    liveApiNews = [...trendingNewsData];
    displayBlogs();

    const postContent = document.getElementById("postContent");
    const charCount = document.getElementById("charCount");
    if (postContent && charCount) {
        postContent.addEventListener("input", () => {
            charCount.innerText = postContent.value.length;
        });
    }

    const blogForm = document.getElementById("blogForm");
    if(blogForm) {
        blogForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const title = document.getElementById("postTitle").value;
            const category = document.getElementById("postCategory").value;
            const content = document.getElementById("postContent").value;
            
            const randomSeed = Math.floor(Math.random() * 10000);
            const imgUrl = `https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&sig=${randomSeed}`;
            const date = "Today";

            const newBlog = { title, category, content, imgUrl, date };

            try {
                const response = await fetch(BACKEND_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newBlog)
                });
                if(response.ok) {
                    blogForm.reset();
                    document.getElementById("charCount").innerText = "0";
                    alert("🎉 Thoughts uploaded successfully to MySQL Database!");
                    displayBlogs();
                }
            } catch (err) {
                console.warn("MySQL Offline Simulation Mode Active.");
            }
        });
    }
});

function initializeTicker() {
    const tickerContainer = document.getElementById("tickerDynamicContent");
    const tickerTime = document.getElementById("liveTickerTime");
    if (!tickerContainer) return;

    const now = new Date();
    if(tickerTime) tickerTime.innerText = `Live Desk Sync: ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

    const marketItems = [
        { label: "Crude Oil", val: "$76.45", change: "-0.8%", up: false, cat: "📈 Finance" },
        { label: "Gold Price", val: "$2,342.10", change: "+1.2%", up: true, cat: "💰 Economics" },
        { label: "Tech Index (NAS)", val: "18,245", change: "+0.4%", up: true, cat: "💻 Tech" },
        { label: "Global Trade Policy", val: "Stable", change: "Active", up: true, cat: "🏛️ Politics" },
        { label: "Manufacturing Output", val: "Index: 114.2", change: "+1.6%", up: true, cat: "🏭 Industries" },
        { label: "Bitcoin (BTC)", val: "$92,410", change: "+4.8%", up: true, cat: "💰 Finance" },
        { label: "AI Hardware Demand", val: "High", change: "+24%", up: true, cat: "💻 Tech" },
        { label: "Sovereign Carbon Tax", val: "Approved", change: "-2.3%", up: false, cat: "🏛️ Politics" }
    ];

    const doubleItems = [...marketItems, ...marketItems];

    tickerContainer.innerHTML = doubleItems.map(item => {
        const arrow = item.up ? "▲" : "▼";
        const colorClass = item.up ? "tick-up" : "tick-down";
        return `
            <div class="ticker-item">
                <span style="color: var(--text-muted); font-size:0.75rem;">${item.cat}</span>
                <span style="color: var(--text-dark); font-weight:700;">${item.label}:</span>
                <span style="color: var(--primary);">${item.val}</span>
                <span class="${colorClass}">${arrow} ${item.change}</span>
                <span class="tick-sep">|</span>
            </div>
        `;
    }).join('');
}

function handleSearch() {
    const searchInput = document.getElementById("globalSearch");
    if(searchInput) {
        searchQuery = searchInput.value.toLowerCase().trim();
        displayBlogs(); 
    }
}

function goHome() {
    selectedCategory = "All";
    searchQuery = "";
    
    const searchInput = document.getElementById("globalSearch");
    if (searchInput) searchInput.value = "";

    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(pill => pill.classList.remove('active'));
    const activePill = document.getElementById("pill-All");
    if(activePill) activePill.classList.add('active');

    const feedTitle = document.getElementById("feedTitle");
    if(feedTitle) feedTitle.innerText = "🌐 Global Feed (All World Blogs)";

    displayBlogs();
}

function filterCategory(catName) {
    selectedCategory = catName;
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(pill => pill.classList.remove('active'));
    const activePill = document.getElementById(`pill-${catName}`);
    if(activePill) activePill.classList.add('active');

    const feedTitle = document.getElementById("feedTitle");
    if(feedTitle) {
        feedTitle.innerText = catName === "All" ? "🌐 Global Feed (All World Blogs)" : `📂 Category: ${catName} Hub`;
    }
    displayBlogs(); 
}

async function displayBlogs() {
    const blogContainer = document.getElementById("blogContainer");
    if (!blogContainer) return;
    
    let userBlogs = [];
    try {
        const response = await fetch(BACKEND_URL);
        if(response.ok) {
            const mysqlData = await response.json();
            userBlogs = mysqlData.map(b => ({ ...b, isUserPost: true }));
        }
    } catch (err) {
        console.warn("MySQL layer activated.");
    }

    let combinedBlogs = [...userBlogs, ...liveApiNews];

    if(selectedCategory !== "All") {
        combinedBlogs = combinedBlogs.filter(b => b.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    if(searchQuery !== "") {
        combinedBlogs = combinedBlogs.filter(b => 
            b.title.toLowerCase().includes(searchQuery) || 
            b.content.toLowerCase().includes(searchQuery)
        );
    }

    if(combinedBlogs.length === 0) {
        blogContainer.innerHTML = `<p style="color: var(--text-muted); text-align:center; padding: 40px 0; background: var(--card-bg); border-radius:16px; border:1px solid var(--border-color);">No matching real-time trends found for "${searchQuery}".</p>`;
        return;
    }

    blogContainer.innerHTML = combinedBlogs.map(blog => {
        const commentCount = blog.comments ? blog.comments.length : 0;
        const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
        const isAlreadyLiked = likedBlogs.includes(blog.id.toString());
        const likeColor = isAlreadyLiked ? "#6366f1" : "var(--text-muted)";

        return `
            <article class="blog-card">
                <img src="${blog.imgUrl}" class="blog-img" alt="Global Feed">
                <div>
                    <span class="badge badge-${blog.category ? blog.category.toLowerCase() : 'default'}">${blog.category}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); margin-left:10px;">📅 ${blog.date}</span>
                    <h3>${blog.title}</h3>
                    <p class="excerpt">${blog.content.substring(0, 160)}...</p>
                    
                    <div class="action-bar">
                        <button class="action-btn" onclick="openModal('${blog.id}', '${escape(blog.title)}', '${escape(blog.content)}')" style="color:#6366f1; font-weight:600;">📖 Read More</button>
                        <button class="action-btn" id="like-btn-${blog.id}" onclick="likePost('${blog.id}', ${blog.isUserPost})" style="color: ${likeColor}; font-weight: 500;">👍 Like ( ${blog.likes || 0} )</button>
                        <button class="action-btn" onclick="toggleCommentBox('${blog.id}')">💬 Comment ( ${commentCount} )</button>
                        <button class="action-btn" onclick="sharePost('${escape(blog.title)}')">🔗 Share</button>
                    </div>

                    <div class="comment-section" id="comment-box-${blog.id}">
                        <div class="comment-form">
                            <input type="text" id="input-${blog.id}" placeholder="Write a verified comment...">
                            <button onclick="submitComment('${blog.id}', ${blog.isUserPost})">Post</button>
                        </div>
                        <div class="comments-list" id="list-${blog.id}">
                            ${blog.comments ? blog.comments.map(c => `<div class="comment-item">💬 ${c}</div>`).join('') : ''}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

async function likePost(id, isUserPost) {
    let likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
    if (likedBlogs.includes(id.toString())) {
        alert("🔒 You have already liked this trend! Multiple likes are restricted per user session.");
        return;
    }
    likedBlogs.push(id.toString());
    localStorage.setItem("likedBlogs", JSON.stringify(likedBlogs));

    if(!isUserPost) {
        const article = liveApiNews.find(b => b.id === id);
        if(article) { article.likes++; displayBlogs(); }
        return;
    }
    try {
        const response = await fetch(`${BACKEND_URL}/${id}/like`, { method: "POST" });
        if(response.ok) { displayBlogs(); }
    } catch (err) {
        displayBlogs();
    }
}

function openModal(id, title, content) {
    const modal = document.getElementById("readMoreModal");
    const modalData = document.getElementById("modalData");
    if(modal && modalData) {
        modalData.innerHTML = `<h2 style='margin-bottom:15px; color:var(--text-dark);'>${unescape(title)}</h2><p style='font-size:15.5px; line-height:1.7; color:var(--text-dark); white-space: pre-line;'>${unescape(content)}</p>`;
        modal.style.display = "flex";
    }
}
function closeModal() { document.getElementById("readMoreModal").style.display = "none"; }

function toggleCommentBox(id) {
    const box = document.getElementById(`comment-box-${id}`);
    if(box) box.style.display = box.style.display === "block" ? "none" : "block";
}
async function submitComment(id, isUserPost) {
    const input = document.getElementById(`input-${id}`);
    if(!input || input.value.trim() === "") return;
    const commentText = input.value.trim();

    if(!isUserPost) {
        const article = liveApiNews.find(b => b.id === id);
        if(article) { article.comments.push(commentText); displayBlogs(); }
        input.value = "";
        return;
    }
    try {
        const response = await fetch(`${BACKEND_URL}/${id}/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: commentText })
        });
        if(response.ok) { displayBlogs(); }
    } catch (err) { console.error(err); }
    input.value = "";
}

function sharePost(title) {
    navigator.clipboard.writeText(`${unescape(title)} - Read on MegaBlog Portal!`);
    alert("🚀 Trending article link copied to clipboard successfully!");
}

function initializeTheme() { document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "light"); }
function toggleTheme() {
    const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
}

function toggleDropdown() {
    const m = document.getElementById("dropdownMenu");
    if(m) m.style.display = m.style.display === "block" ? "none" : "block";
}
function loadUserProfile() {
    const u = localStorage.getItem("currentUser") || "Ravindra Chilhate";
    if(document.getElementById("dropUsername")) document.getElementById("dropUsername").innerText = u;
    if(document.getElementById("dropHandle")) document.getElementById("dropHandle").innerText = `@${u.toLowerCase().replace(/\s+/g, '')}`;
}
function logout() { alert("Session ended safely."); }