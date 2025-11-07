// content.js - lightweight public helpers for adding events and articles

function saveEventPublic(eventData) {
    const events = JSON.parse(localStorage.getItem('avnEvents')) || [];
    events.push(eventData);
    localStorage.setItem('avnEvents', JSON.stringify(events));
    console.log('Public event saved:', eventData);
}

function saveArticlePublic(articleData) {
    const articles = JSON.parse(localStorage.getItem('avnArticles')) || [];

    // Determine next sequential article image filename (article1.jpg, article2.jpg, ...)
    const existingNumbers = articles
        .map(a => a.featuredImage)
        .filter(Boolean)
        .map(fn => {
            try {
                const m = String(fn).match(/article[-_ ]?(\d+)\.jpg$/i);
                return m ? parseInt(m[1], 10) : 0;
            } catch (e) {
                return 0;
            }
        });

    const maxExisting = existingNumbers.length ? Math.max(...existingNumbers) : 0;
    const nextIndex = maxExisting + 1;

    // If caller passed a data URL (typical from a file input), store it in a private field
    // and assign a friendly filename for referencing. We can't write files to the assets
    // folder from client-side JS, so we keep the data URL in localStorage with the article.
    if (articleData.featuredImage && typeof articleData.featuredImage === 'string' && articleData.featuredImage.startsWith('data:')) {
        // keep the base64 data in a separate field so the UI can render it directly
        articleData._imageData = articleData.featuredImage;
        articleData.featuredImage = `assets/article${nextIndex}.jpg`;
    } else if (!articleData.featuredImage) {
        // If no image provided, assign the next article filename (may point to an asset you add later)
        articleData.featuredImage = `assets/article${nextIndex}.jpg`;
    } else {
        // If a string filename/URL was provided, we optionally normalize simple names that
        // are not already following the articleN pattern by assigning a new sequential name.
        const provided = String(articleData.featuredImage);
        const matchesPattern = /article[-_ ]?\d+\.jpg$/i.test(provided);
        if (!matchesPattern) {
            articleData.featuredImage = `assets/article${nextIndex}.jpg`;
            // If provided was a URL (not data:), keep it as backup for rendering
            articleData._originalImage = provided;
        }
    }

    articles.push(articleData);
    localStorage.setItem('avnArticles', JSON.stringify(articles));
    console.log('Public article saved:', articleData);
}

function loadArticlesPublic(containerId = 'articles-list') {
    const articles = JSON.parse(localStorage.getItem('avnArticles')) || [];
    const container = document.getElementById(containerId);
    if (!container) return;

    if (articles.length === 0) {
        container.innerHTML = '<p class="no-articles">No articles published yet.</p>';
        return;
    }

    let html = '';
    articles.forEach(article => {
        // Prefer inline image data if present (from data URL uploads), otherwise use featuredImage
        let imageUrl = article._imageData || article.featuredImage || 'assets/default-article.jpg';
        // If we stored an original external URL as backup, prefer it for display if no inline data
        if (!article._imageData && article._originalImage) {
            imageUrl = article._originalImage;
        }

        const mediaUrl = article.mediaType === 'youtube' ? article.mediaUrl : (article.mediaUrl || imageUrl);

        html += `
            <article class="article-card">
                <div class="article-image-container">
                    <img class="article-image" src="${imageUrl}" alt="${article.title}" onerror="this.src='assets/default-article.jpg'">
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        <span class="article-date">${new Date(article.createdAt).toLocaleDateString()}</span>
                        ${article.category ? `<span class="article-category">${article.category}</span>` : ''}
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.summary || ''}</p>
                    <div class="article-footer">
                        <a href="article-details.html?id=${article.id}" class="btn btn-outline">View Details</a>
                        ${article.mediaType === 'youtube' ? '<span class="video-badge"><i class="fas fa-play"></i> Vidéo</span>' : ''}
                    </div>
                </div>
            </article>
        `;
    });

    container.innerHTML = html;
}

// Note: example data insertion removed as requested. The following helper
// functions that previously auto-populated `localStorage` with example
// events/articles have been deleted to avoid writing data automatically.
// To add events/articles programmatically at runtime, use the provided
// `saveEventPublic(eventData)` and `saveArticlePublic(articleData)` helpers.
// If you want to seed specific events/articles on demand, use the
// `seedCustomContent()` helper below. It will insert three events and
// three articles (one article and one event include the requested
// YouTube videos) only if they are not already present in localStorage.
function seedCustomContent() {
    // Seed events
    const events = JSON.parse(localStorage.getItem('avnEvents')) || [];
    const toAddEvents = [];

    if (!events.some(e => String(e.id) === 'event_seed1')) {
        toAddEvents.push({
            id: 'event_seed1',
            title: 'Conference: Technology and Society',
            date: '2025-12-05',
            time: '10:00 - 16:00',
            type: 'conference',
            category: 'technology',
            location: 'UEMF Grand Hall',
            capacity: '300 participants',
            description: 'A conference bringing together experts and students to discuss the impact of technology on society.',
            detailedDescription: `Main conference on the impact of technology and digital media.

Program:
- Keynotes by researchers and professionals
- Discussion panels
- Q&A Sessions

This session will highlight responsible approaches and concrete use cases.`,
            schedule: [
                { time: '10:00', activity: 'Welcome and Opening' },
                { time: '10:30', activity: 'Keynote: AI for the Common Good' },
                { time: '12:00', activity: 'Panel: Ethics and Technology' },
                { time: '14:00', activity: 'Workshops' },
                { time: '16:00', activity: 'Closing' }
            ],
            objectives: [
                'Understand societal challenges of new technologies',
                'Meet domain experts',
                'Discover project opportunities'
            ],
            mediaType: 'youtube',
            // Provided video (converted to embed URL)
            mediaUrl: 'https://www.youtube.com/embed/CzQVdsFA5eA',
            createdAt: new Date().toISOString(),
            registrationStatus: 'open'
        });
    }

    if (!events.some(e => String(e.id) === 'event_seed2')) {
        toAddEvents.push({
            id: 'event_seed2',
            title: 'Practical Workshop: Web Development',
            date: '2025-11-20',
            time: '09:00 - 13:00',
            type: 'workshop',
            category: 'development',
            location: 'UEMF Lab 2',
            capacity: '40 participants',
            description: 'Hands-on workshop to learn the basics of modern web development.',
            mediaType: 'image',
            mediaUrl: 'assets/event-dev-workshop.jpg',
            createdAt: new Date().toISOString(),
            registrationStatus: 'open'
        });
    }

    if (!events.some(e => String(e.id) === 'event_seed3')) {
        toAddEvents.push({
            id: 'event_seed3',
            title: 'Networking & Projects Evening',
            date: '2025-11-28',
            time: '18:00 - 21:00',
            type: 'networking',
            category: 'community',
            location: 'UEMF Lounge',
            capacity: '150 participants',
            description: 'Meet project leaders, mentors and sponsors over refreshments.',
            mediaType: 'image',
            mediaUrl: 'assets/event-networking.jpg',
            createdAt: new Date().toISOString(),
            registrationStatus: 'open'
        });
    }

    if (toAddEvents.length > 0) {
        const merged = events.concat(toAddEvents);
        localStorage.setItem('avnEvents', JSON.stringify(merged));
        console.log('seedCustomContent: added events', toAddEvents.map(e => e.id));
    }

    // Seed articles
    const articles = JSON.parse(localStorage.getItem('avnArticles')) || [];
    const toAddArticles = [];

    if (!articles.some(a => String(a.id) === 'article_seed1')) {
        toAddArticles.push({
            id: 'article_seed1',
            title: 'Video: The Future of AI',
            category: 'Tech',
            tags: ['AI', 'video'],
            readingTime: 6,
            summary: 'A video presentation on key AI trends.',
            content: `Watch the video below to discover the latest advances in artificial intelligence and their potential impact.`,
            featuredImage: 'assets/article-ai-video.jpg',
            mediaType: 'youtube',
            mediaUrl: 'https://www.youtube.com/embed/8ngv3ZIvqDo',
            resources: [
                { type: 'video', title: 'Full Video', url: 'https://youtu.be/8ngv3ZIvqDo' }
            ],
            author: { name: 'lumed Team', role: 'Editorial', avatar: 'assets/team1.jpg' },
            createdAt: new Date().toISOString()
        });
    }

    if (!articles.some(a => String(a.id) === 'article_seed2')) {
        toAddArticles.push({
            id: 'article_seed2',
            title: 'Hackathon Recap',
            category: 'Events',
            tags: ['Hackathon', 'AI'],
            readingTime: 5,
            summary: 'Summary and photos from the latest hackathon organized by the club.',
            content: `The hackathon brought together motivated teams and produced interesting prototypes.`,
            featuredImage: 'assets/article-hackathon.jpg',
            mediaType: 'image',
            mediaUrl: 'assets/article-hackathon.jpg',
            author: { name: 'Sarah Bennani', role: 'Chef de projet', avatar: 'assets/team3.jpg' },
            createdAt: new Date().toISOString()
        });
    }

    if (!articles.some(a => String(a.id) === 'article_seed3')) {
        toAddArticles.push({
            id: 'article_seed3',
            title: 'New Student Projects',
            category: 'Projects',
            tags: ['Projects', 'Students'],
            readingTime: 4,
            summary: 'Discover some recent projects led by our students.',
            content: `Presentation of innovative projects completed this year.`,
            featuredImage: 'assets/article-projects.jpg',
            mediaType: 'image',
            mediaUrl: 'assets/article-projects.jpg',
            author: { name: 'Club lumed', role: 'Community', avatar: 'assets/team2.jpg' },
            createdAt: new Date().toISOString()
        });
    }

    if (toAddArticles.length > 0) {
        const mergedA = articles.concat(toAddArticles);
        localStorage.setItem('avnArticles', JSON.stringify(mergedA));
        console.log('seedCustomContent: added articles', toAddArticles.map(a => a.id));
    }
}

// Seed content now (user requested adding these items). This will only add
// items that are missing to avoid overwriting existing data.
seedCustomContent();
