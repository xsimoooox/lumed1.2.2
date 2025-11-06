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
                        <a href="article-details.html?id=${article.id}" class="btn btn-outline">Voir détails</a>
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
            title: 'Conférence: Technologies et Société',
            date: '2025-12-05',
            time: '10:00 - 16:00',
            type: 'conference',
            category: 'technology',
            location: 'UEMF Grand Hall',
            capacity: '300 participants',
            description: 'Une conférence rassemblant experts et étudiants pour discuter de l\'impact des technologies sur la société.',
            detailedDescription: `Conférence principale sur l'impact des technologies et des médias numériques.

Programme :
- Keynotes par des chercheurs et professionnels
- Panels de discussion
- Sessions Q&A

Cette session mettra en lumière des approches responsables et des cas d\'usage concrets.`,
            schedule: [
                { time: '10:00', activity: 'Accueil et ouverture' },
                { time: '10:30', activity: 'Keynote: L\'IA pour le bien commun' },
                { time: '12:00', activity: 'Panel: éthique et technologie' },
                { time: '14:00', activity: 'Ateliers' },
                { time: '16:00', activity: 'Clôture' }
            ],
            objectives: [
                'Comprendre les enjeux sociétaux des nouvelles technologies',
                'Rencontrer des experts du domaine',
                'Découvrir des opportunités de projet'
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
            title: 'Atelier Pratique: Développement Web',
            date: '2025-11-20',
            time: '09:00 - 13:00',
            type: 'workshop',
            category: 'development',
            location: 'UEMF Lab 2',
            capacity: '40 participants',
            description: 'Atelier hands-on pour apprendre les bases du développement web moderne.',
            mediaType: 'image',
            mediaUrl: 'assets/event-dev-workshop.jpg',
            createdAt: new Date().toISOString(),
            registrationStatus: 'open'
        });
    }

    if (!events.some(e => String(e.id) === 'event_seed3')) {
        toAddEvents.push({
            id: 'event_seed3',
            title: 'Soirée de Networking & Projets',
            date: '2025-11-28',
            time: '18:00 - 21:00',
            type: 'networking',
            category: 'community',
            location: 'UEMF Lounge',
            capacity: '150 participants',
            description: 'Rencontrez des porteurs de projets, mentors et sponsors autour d\'un buffet.',
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
            title: 'Vidéo: L\'avenir de l\'IA',
            category: 'Tech',
            tags: ['IA', 'vidéo'],
            readingTime: 6,
            summary: 'Une présentation vidéo sur les tendances clés en IA.',
            content: `Regardez la vidéo ci‑dessous pour découvrir les dernières avancées en intelligence artificielle et leur impact possible.`,
            featuredImage: 'assets/article-ai-video.jpg',
            mediaType: 'youtube',
            mediaUrl: 'https://www.youtube.com/embed/8ngv3ZIvqDo',
            resources: [
                { type: 'video', title: 'Vidéo complète', url: 'https://youtu.be/8ngv3ZIvqDo' }
            ],
            author: { name: 'Équipe lumed', role: 'Rédaction', avatar: 'assets/team1.jpg' },
            createdAt: new Date().toISOString()
        });
    }

    if (!articles.some(a => String(a.id) === 'article_seed2')) {
        toAddArticles.push({
            id: 'article_seed2',
            title: 'Retour sur le Hackathon',
            category: 'Événements',
            tags: ['Hackathon', 'IA'],
            readingTime: 5,
            summary: 'Résumé et photos du dernier hackathon organisé par le club.',
            content: `Le hackathon a réuni des équipes motivées et a produit des prototypes intéressants.`,
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
            title: 'Nouveaux Projets Étudiants',
            category: 'Projets',
            tags: ['Projets', 'Étudiants'],
            readingTime: 4,
            summary: 'Découvrez quelques projets récents menés par nos étudiants.',
            content: `Présentation de projets innovants réalisés cette année.`,
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
