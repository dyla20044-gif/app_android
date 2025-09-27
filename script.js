import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query, where, addDoc, orderBy, limit, updateDoc, setDoc, increment, runTransaction } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Configuración de Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyCF5lyEIFkKhzgc4kOMebWZ7oZrxWDNw2Y",
    authDomain: "app-aeff2.firebaseapp.com",
    projectId: "app-aeff2",
    storageBucket: "app-aeff2.firebasestorage.app",
    messagingSenderId: "12229598213",
    appId: "1:12229599999:web:80555d9d22c30b69ddd06c",
    measurementId: "G-ZMQN0D6D4S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- Elementos del DOM ---
const appContainer = document.getElementById('app-container');
const homeScreen = document.getElementById('home-screen');
const moviesScreen = document.getElementById('movies-screen');
const seriesScreen = document.getElementById('series-screen');
const profileScreen = document.getElementById('profile-screen');
const detailsScreen = document.getElementById('details-screen');
const favoritesScreen = document.getElementById('favorites-screen');
const requestScreen = document.getElementById('request-screen');
const privacyScreen = document.getElementById('privacy-screen');
const termsScreen = document.getElementById('terms-screen');
const helpScreen = document.getElementById('help-screen');
const settingsScreen = document.getElementById('settings-screen');
const authScreen = document.getElementById('auth-screen');
const navItems = document.querySelectorAll('.bottom-nav .nav-item');
const screenButtons = document.querySelectorAll('[data-screen]');
const searchIconTop = document.getElementById('search-icon');
const videoModal = document.getElementById('video-modal');
const videoPlayer = document.getElementById('video-player');
const closeButtons = document.querySelectorAll('.close-button');
const detailsPosterTop = document.getElementById('details-poster-top');
const detailsTitle = document.getElementById('details-title');
const detailsYear = document.getElementById('details-year');
const detailsGenres = document.getElementById('details-genres');
const detailsSinopsis = document.getElementById('details-sinopsis');
const directorName = document.getElementById('director-name');
const actorsList = document.getElementById('actors-list');
const genresButton = document.getElementById('genres-button');
const seriesGenresButton = document.getElementById('series-genres-button');
const genresModal = document.getElementById('genres-modal');
const genresList = document.getElementById('genres-list');
const allMoviesGrid = document.getElementById('all-movies-grid');
const allSeriesGrid = document.getElementById('all-series-grid');
const bannerList = document.getElementById('banner-list');
const loader = document.getElementById('loader');
const premiumInfoModal = document.getElementById('premium-info-modal');
const premiumInfoCtaButton = document.getElementById('premium-info-cta');
const premiumInfoCloseButton = document.getElementById('premium-info-close');
const premiumInfoLoginLink = document.getElementById('premium-info-login-link');
const paymentModal = document.getElementById('payment-modal');
const proStatusButton = document.getElementById('pro-status-button');
const signoutButton = document.getElementById('signout-button');
const buyButtons = document.querySelectorAll('.buy-button');
const movieRequestInput = document.getElementById('movie-request-input');
const submitRequestButton = document.getElementById('submit-request-button');
const favoritesGrid = document.getElementById('favorites-grid');
const profileLoggedIn = document.getElementById('profile-logged-in');
const profileLoggedOut = document.getElementById('profile-logged-out');
const profileLoginLink = document.getElementById('profile-login-link');
const createAccountButton = document.getElementById('create-account-button');
const showSignupLink = document.getElementById('show-signup-link');
const showLoginLink = document.getElementById('show-login-link');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupButton = document.getElementById('signup-button');
const socialLoginButtons = document.querySelectorAll('.social-button');
const profileMyList = document.getElementById('profile-my-list');
const profilePrivacy = document.getElementById('profile-privacy');
const profileTerms = document.getElementById('profile-terms');
const profileSubscription = document.getElementById('profile-subscription');
const profileHelpCenter = document.getElementById('profile-help-center');
const authBackButton = document.getElementById('auth-back-button');
const authLoginLink = document.getElementById('auth-login-link');
const buyWithPaypalButton = document.getElementById('buy-with-paypal');
const buyWithBinanceButton = document.getElementById('buy-with-binance');
const seasonsContainer = document.getElementById('seasons-container');
const episodesContainer = document.getElementById('episodes-container');
const playButtonContainer = document.getElementById('details-play-button-container');
const embeddedPlayerContainer = document.getElementById('embedded-player-container');
const freeAdModal = document.getElementById('free-ad-modal');
const verGratisButton = document.getElementById('ver-gratis-button');
const verProButton = document.getElementById('ver-pro-button');
const freeModalCloseButton = document.querySelector('.free-modal-close-button');
const seeMoreButtons = document.querySelectorAll('.see-more-btn');
const proRestrictionModal = document.getElementById('pro-restriction-modal');
const proModalCta = document.getElementById('pro-modal-cta');
const proModalText = document.getElementById('pro-modal-text');
const historyList = document.getElementById('history-list');
const historySection = document.getElementById('history-section');
const searchFilters = document.getElementById('search-filters');
const filterButtons = document.querySelectorAll('.filter-button');

// --- Elementos del Rediseño de la Barra Superior y Social (REQs 1, 2, 3, 4) ---
const btnToggleTheme = document.getElementById('btn-toggle-theme');
const btnDownloadApp = document.getElementById('btn-download-app');
const downloadAppModal = document.getElementById('download-app-modal');
const btnOpenSearch = document.getElementById('btn-open-search');
const searchOverlay = document.getElementById('search-overlay');
const closeSearchButton = document.getElementById('close-search-button');
const searchInput = document.getElementById('search-input'); // Usamos el input dentro del overlay

// ELEMENTOS SOCIALES REUBICADOS
const viewCountDisplay = document.getElementById('view-count-display'); // Ahora en movie-metadata
const likeCountDisplayText = document.getElementById('like-count-display-text'); // Contenedor de Like
const favoriteButton = document.getElementById('favorite-button'); // Heart icon in movie-actions
const commentInput = document.getElementById('comment-input');
const btnPostComment = document.getElementById('btn-post-comment');
const commentsFeed = document.getElementById('comments-feed');
const noCommentsMessage = document.getElementById('no-comments-message');
const relatedMoviesContainer = document.getElementById('related-movies'); // Contenedor de Similares

// ELEMENTOS DE PESTAÑAS (TABS)
const detailsTabsHeader = document.getElementById('details-tabs-header');
const detailsTabsContent = document.getElementById('details-tabs-content');


// --- ELEMENTOS AGREGADOS PARA NUEVOS REQUERIMIENTOS ---
// REQUERIMIENTO: Errores amigables
const loginMessage = document.getElementById('login-message');
const signupMessage = document.getElementById('signup-message');
const requestMessage = document.getElementById('request-message');
const detailsRequestMessage = document.getElementById('details-request-message');
// REQUERIMIENTO: Notificaciones y Eventos (SOLO CONSUMO)
const btnOpenNotifications = document.getElementById('btn-open-avisos'); // El botón de la campana
const userNotificationsModal = document.getElementById('user-notifications-modal');
const btnClearAllNotifications = document.getElementById('btn-clear-all-notifications');
const notificationsClose = document.getElementById('notifications-close');
const contentPublishingModal = document.getElementById('admin-avisos-modal');
const btnPubSaveNotify = document.getElementById('btn-save-notify-app-new'); 

let moviesData = [];
let seriesData = [];
let bannerMovies = [];
let allMovieGenres = {};
let allTvGenres = {};
let bannerInterval;
let resumeAutoScrollTimeout;
let currentUser = null;
let currentMovieOrSeries = null;
let lastSearchResults = [];

// ======================================================================
// LÓGICA DE NOTIFICACIONES (REAL-TIME Y LIMPIEZA) - SIN CAMBIOS
// ======================================================================

let notificationsData = []; 

function showAppMessage(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `auth-message-box ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function updateNotificationIndicator() {
    const twoDaysInMs = 1000 * 60 * 60 * 24 * 2;
    
    notificationsData = notificationsData.filter(n => {
        const timestampMs = n.timestamp.toDate ? n.timestamp.toDate().getTime() : n.timestamp; 
        return (Date.now() - timestampMs) <= twoDaysInMs;
    });

    const unreadCount = notificationsData.filter(n => !n.isRead).length;
    const indicatorElement = document.getElementById('notification-indicator');
    
    if (indicatorElement) {
        if (unreadCount > 0) {
            indicatorElement.classList.remove('hidden');
        } else {
            indicatorElement.classList.add('hidden');
        }
    }
}

function renderNotifications() {
    const listElement = document.getElementById('notifications-list');
    const emptyMessage = document.getElementById('empty-notifications-message');
    const clearButton = document.getElementById('btn-clear-all-notifications');
    if (!listElement || !emptyMessage || !clearButton) return;
    
    listElement.innerHTML = '';
    
    if (notificationsData.length === 0) {
        emptyMessage.textContent = "Aún no tienes notificaciones.";
        emptyMessage.classList.remove('hidden');
        clearButton.classList.add('hidden');
        return;
    }
    
    emptyMessage.classList.add('hidden');
    clearButton.classList.remove('hidden');

    notificationsData.forEach(notification => {
        const item = document.createElement('div');
        const docId = notification.docId; 
        
        const timestampDate = notification.timestamp.toDate ? notification.timestamp.toDate() : new Date(notification.timestamp);
        const timeString = timestampDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        item.className = `notification-item ${!notification.isRead ? 'unread' : ''}`;
        
        item.innerHTML = `
            <img src="${notification.image}" alt="${notification.title}" onerror="this.onerror=null;this.src='https://placehold.co/50x70?text=IMG'">
            <div class="notification-item-text">
                <strong>${notification.title}</strong>
                <small>${notification.description} - ${timeString}</small>
            </div>
        `;
        
        item.addEventListener('click', async () => {
            if (!notification.isRead && docId) {
                const notifRef = doc(db, 'userNotifications', docId);
                try {
                    await updateDoc(notifRef, { isRead: true });
                } catch (error) {
                    console.error("Error al marcar como leído:", error);
                }
            }
            
            closeModal(userNotificationsModal);
            if (notification.targetScreen) {
                switchScreen(notification.targetScreen); 
            }
        });
        
        listElement.appendChild(item);
    });
}

function setupRealtimeNotificationsListener() {
    const notificationsColRef = collection(db, 'userNotifications');
    const q = query(notificationsColRef, orderBy("timestamp", "desc"));
    
    onSnapshot(q, (snapshot) => {
        notificationsData = snapshot.docs.map(doc => ({
            docId: doc.id,
            ...doc.data()
        }));

        updateNotificationIndicator(); 
        
        if (userNotificationsModal.classList.contains('active')) {
            renderNotifications();
        }

    }, (error) => {
        console.error("Error al obtener notificaciones en tiempo real:", error);
    });
}
// ======================================================================
// FIN: LÓGICA DE NOTIFICACIONES (REAL-TIME Y LIMPIEZA)
// ======================================================================


// --- Funciones de Utilidad ---

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
    }
}
function showModal(modal) {
    if (modal) {
        modal.classList.add('active');
    }
}

function showLoader() {
    if (loader) loader.style.display = 'flex';
}

function hideLoader() {
    if (loader) loader.style.display = 'none';
}

function closeAllModals() {
    const modalsToClose = [
        document.getElementById('video-modal'),
        document.getElementById('premium-info-modal'),
        document.getElementById('payment-modal'),
        document.getElementById('free-ad-modal'),
        document.getElementById('pro-restriction-modal'),
        document.getElementById('download-app-modal'),
        userNotificationsModal,
        contentPublishingModal
    ].filter(Boolean); 

    modalsToClose.forEach(modal => closeModal(modal));
}

closeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const modal = event.target.closest('.modal') || event.target.closest('.modal-from-bottom');
        if (modal) {
            closeModal(modal);
        }
    });
});
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal') || event.target.classList.contains('modal-from-bottom')) {
        closeModal(event.target);
    }
});

function resetDetailsPlayer() {
    if (embeddedPlayerContainer) {
        embeddedPlayerContainer.style.display = 'none';
        embeddedPlayerContainer.innerHTML = '';
    }
    detailsPosterTop.style.backgroundColor = 'transparent';
    detailsPosterTop.style.backgroundImage = ''; 
    playButtonContainer.style.display = 'flex';
}

// --- Lógica del Tema Dual ---

function applyTheme(mode) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(mode);
    
    if (btnToggleTheme) {
        const icon = btnToggleTheme.querySelector('i');
        if (mode === 'dark-mode') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

function initializeTheme() {
    const storedMode = localStorage.getItem('theme');
    
    if (storedMode) {
        applyTheme(storedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark-mode');
    } else {
        applyTheme('light-mode');
    }
}

if (btnToggleTheme) {
    btnToggleTheme.addEventListener('click', () => {
        const currentMode = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        const newMode = currentMode === 'dark-mode' ? 'light-mode' : 'dark-mode';
        
        applyTheme(newMode);
        localStorage.setItem('theme', newMode);
    });
}

// --- Funciones de Reproducción y Lógica de Vistas/Likes Únicos ---

// Función para obtener el contador de Vistas o Likes global
async function getCount(tmdbId, field = 'likes') {
    const itemRef = doc(db, 'movies', tmdbId.toString());
    const docSnap = await getDoc(itemRef);
    return docSnap.exists() ? docSnap.data()[field] || 0 : 0;
}

// LÓGICA DE VISTAS (REVERTIDA A CONTAR CADA CLIC)
async function incrementViewCount(tmdbId) {
    const itemRef = doc(db, 'movies', tmdbId.toString());
    
    try {
        // CORRECCIÓN CRÍTICA: Usar setDoc({merge: true}) para crear el documento si falta o actualizar el campo.
        await setDoc(itemRef, {
            views: increment(1)
        }, { merge: true });

        const docSnap = await getDoc(itemRef);
        let views = docSnap.exists() ? docSnap.data().views || 0 : 0;
        
        if (viewCountDisplay) {
            viewCountDisplay.innerHTML = `<i class="fas fa-eye"></i> ${views.toLocaleString()} Vistas`;
        }
    } catch (e) {
        console.warn("Error al incrementar vistas:", e);
        if (viewCountDisplay) {
            viewCountDisplay.innerHTML = `<i class="fas fa-eye"></i> Error`;
        }
    }
}


// LÓGICA DE LIKES ÚNICOS Y PERSISTENTES
async function checkUserLiked(tmdbId) {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        return false;
    }
    const userId = auth.currentUser.uid;
    // Esta consulta requiere un índice: userId + tmdbId
    const q = query(collection(db, 'movieLikes'), 
        where('userId', '==', userId), 
        where('tmdbId', '==', tmdbId.toString()),
        limit(1)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
}

async function renderLikeState(tmdbId) {
    const hasLiked = await checkUserLiked(tmdbId);
    if (favoriteButton) {
        // Toglea entre ícono hueco (far) y sólido (fas)
        if (hasLiked) {
            favoriteButton.classList.remove('far');
            favoriteButton.classList.add('fas', 'liked');
        } else {
            favoriteButton.classList.remove('fas', 'liked');
            favoriteButton.classList.add('far');
        }
    }
}

async function handleLike(tmdbId) {
    if (!currentUser || currentUser.isAnonymous) {
        switchScreen('auth-screen');
        return;
    }

    const userId = auth.currentUser.uid;
    const hasLiked = await checkUserLiked(tmdbId);
    
    if (hasLiked) {
        alert('Ya has dado "Me Gusta" a este contenido.');
        return;
    }

    const itemRef = doc(db, 'movies', tmdbId.toString());

    try {
        // 1. Incrementa el contador total (CORRECCIÓN CRÍTICA: Usar setDoc)
        await setDoc(itemRef, {
            likes: increment(1) 
        }, { merge: true });
        
        // 2. Registra el like del usuario para que sea persistente
        await addDoc(collection(db, 'movieLikes'), {
            userId: userId,
            tmdbId: tmdbId.toString(),
            timestamp: new Date()
        });

        // Actualiza la interfaz
        renderLikeState(tmdbId); // Llama a la función para ponerlo sólido
        
        const newCount = await getCount(tmdbId, 'likes');
        if (likeCountDisplayText) {
            likeCountDisplayText.innerHTML = `<i class="fas fa-heart"></i> ${newCount} Me Gusta`;
        }
    } catch (e) {
        console.error("Error al registrar like:", e);
        alert('Hubo un error al registrar tu "Me Gusta".');
    }
}

// NUEVO LISTENER: Se adjunta la función de like al icono de corazón en movie-actions
if (favoriteButton) {
    favoriteButton.addEventListener('click', () => {
        if (currentMovieOrSeries && currentMovieOrSeries.tmdbId) {
            handleLike(currentMovieOrSeries.tmdbId);
        }
    });
}


function showFreeAdModal(freeEmbedCode) {
    showModal(freeAdModal);
    setupFreeAdModalButtons(freeEmbedCode);
}

function setupFreeAdModalButtons(freeEmbedCode) {
    verGratisButton.onclick = () => {
        closeModal(freeAdModal);
        playEmbeddedVideo(freeEmbedCode, false, currentUser, currentMovieOrSeries);
    };

    verProButton.onclick = () => {
        closeModal(freeAdModal);
        showModal(paymentModal);
    };
    
    freeModalCloseButton.onclick = () => {
        closeModal(freeAdModal);
    };
}
function showProRestrictionModal() {
    showModal(proRestrictionModal);
}
proModalCta.addEventListener('click', () => {
    closeModal(proRestrictionModal);
    showModal(paymentModal);
});

async function addMovieToHistory(item) {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        return;
    }
    try {
        const historyRef = collection(db, 'history');
        // Esta consulta requiere un índice: userId + tmdbId
        const existingDocs = await getDocs(query(historyRef, where('userId', '==', auth.currentUser.uid), where('tmdbId', '==', item.id)));
        if (existingDocs.empty) {
            await addDoc(historyRef, {
                userId: auth.currentUser.uid,
                tmdbId: item.id,
                title: item.title || item.name,
                poster_path: item.poster_path,
                type: item.media_type || 'movie',
                timestamp: new Date()
            });
        }
    } catch (e) {
        console.error("Error al agregar al historial: ", e);
    }
}

function playEmbeddedVideo(embedCode, isPremium, currentUser, item) {
    if (isPremium && (!currentUser || !currentUser.isPro)) {
        showProRestrictionModal();
    } else {
        detailsPosterTop.style.backgroundImage = 'none';
        detailsPosterTop.style.backgroundColor = '#000';
        playButtonContainer.style.display = 'none';
        embeddedPlayerContainer.style.display = 'block';
        embeddedPlayerContainer.innerHTML = embedCode;
        // SE MANTIENE LA LLAMADA A INCREMENTAR VISTAS AL INICIAR LA REPRODUCCIÓN
        incrementViewCount(currentMovieOrSeries.tmdbId);
        addMovieToHistory(item);
    }
}

function renderMoviePlayButtons(localMovie, tmdbMovie) {
    playButtonContainer.innerHTML = '';
    if (localMovie && (localMovie.freeEmbedCode || localMovie.proEmbedCode)) {
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.innerHTML = `<i class="fas fa-play"></i>`;

        playButton.onclick = async () => {
            showLoader();
            try {
                const isProUser = currentUser && currentUser.isPro;
                let embedCode = null;
                let isPremium = false;

                if (isProUser && localMovie.proEmbedCode) {
                    isPremium = true;
                    const response = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${localMovie.tmdbId}&isPro=true`);
                    const data = await response.json();
                    embedCode = data.embedCode;
                } else if (localMovie.freeEmbedCode) {
                    isPremium = false;
                    const response = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${localMovie.tmdbId}&isPro=false`);
                    const data = await response.json();
                    embedCode = data.embedCode;
                } else {
                    showProRestrictionModal();
                    hideLoader();
                    return;
                }

                if (embedCode) {
                    if (isPremium) {
                        playEmbeddedVideo(embedCode, true, currentUser, tmdbMovie);
                    } else {
                        showFreeAdModal(embedCode);
                    }
                } else {
                    alert('No se encontró un reproductor para esta película.');
                }
            } catch (error) {
                console.error('Error al obtener el código del reproductor:', error);
                alert('Hubo un error al cargar el reproductor. Intenta de nuevo.');
            } finally {
                hideLoader();
            }
        };
        playButtonContainer.appendChild(playButton);
    } else {
        renderRequestButton(tmdbMovie);
    }
}

async function renderSeriesButtons(localSeries, tmdbSeries) {
    try {
        playButtonContainer.innerHTML = '';
        seasonsContainer.style.display = 'block';
        seasonsContainer.innerHTML = '<h3>Temporadas</h3>';
        
        const seriesDetails = await fetchFromTMDB(`tv/${tmdbSeries.id}`);
        
        if (!seriesDetails || !seriesDetails.seasons) {
             throw new Error("No seasons data available for this series.");
        }
        
        seriesDetails.seasons.forEach(season => {
            const seasonButton = document.createElement('button');
            seasonButton.className = 'season-button';
            seasonButton.textContent = `Temporada ${season.season_number}`;
            seasonButton.onclick = async () => {
                episodesContainer.innerHTML = '<h3>Episodios</h3><div class="episodes-grid"></div>';
                const episodesGrid = episodesContainer.querySelector('.episodes-grid');
                const seasonDetails = await fetchFromTMDB(`tv/${tmdbSeries.id}/season/${season.season_number}`);
                
                if (!seasonDetails || !seasonDetails.episodes) {
                    throw new Error("No episodes data available for this season.");
                }

                seasonDetails.episodes.forEach(episode => {
                    const episodeButton = document.createElement('button');
                    episodeButton.className = 'episode-button';
                    episodeButton.textContent = `E${episode.episode_number}`;
                    
                    const localEpisode = localSeries?.seasons?.[season.season_number]?.episodes?.[episode.episode_number];
                    
                    if (localEpisode && (localEpisode.freeEmbedCode || localEpisode.proEmbedCode)) {
                         episodeButton.onclick = async () => {
                            showLoader();
                            try {
                                const isProUser = currentUser && currentUser.isPro;
                                const hasProPlayer = !!localEpisode.proEmbedCode;
                                const hasFreePlayer = !!localEpisode.freeEmbedCode;
                                
                                if (isProUser && hasProPlayer) {
                                    const response = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${localSeries.tmdbId}&season=${season.season_number}&episode=${episode.episode_number}&isPro=true`);
                                    const data = await response.json();
                                    if (data.embedCode) {
                                        playEmbeddedVideo(data.embedCode, true, currentUser, episode);
                                    } else {
                                        alert('No se encontró un reproductor PRO para este episodio.');
                                    }
                                } else if (hasFreePlayer) {
                                    showFreeAdModal(localEpisode.freeEmbedCode);
                                } else {
                                    showProRestrictionModal();
                                }
                            } catch(error) {
                                console.error('Error al obtener el código del reproductor:', error);
                                alert('Hubo un error al cargar el reproductor. Intenta de nuevo.');
                            } finally {
                                hideLoader();
                            }
                         };
                    } else {
                        episodeButton.disabled = true;
                        episodeButton.textContent = `E${episode.episode_number} (Próximamente)`;
                        episodeButton.style.backgroundColor = '#333';
                        episodeButton.style.cursor = 'not-allowed';
                    }
                    episodesGrid.appendChild(episodeButton);
                });
            };
            seasonsContainer.appendChild(seasonButton);
        });
    } catch (error) {
        console.error('Error al renderizar los botones de temporadas:', error);
        seasonsContainer.innerHTML = '<p>No se encontraron temporadas para esta serie.</p>';
        playButtonContainer.innerHTML = '<p>No se encontraron reproductores.</p>';
    }
}


function renderRequestButton(tmdbItem) {
    const requestButton = document.createElement('button');
    requestButton.className = 'request-movie-button';
    requestButton.innerHTML = `<i class="fas fa-paper-plane"></i> Pedir ahora`;
    requestButton.onclick = async () => {
        if (!auth.currentUser || auth.currentUser.isAnonymous) {
            alert('Debes iniciar sesión para solicitar un contenido.');
            switchScreen('auth-screen');
            return;
        }
        try {
            const response = await fetch('https://serivisios.onrender.com/request-movie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: tmdbItem.title || tmdbItem.name,
                    poster_path: tmdbItem.poster_path,
                    tmdbId: tmdbItem.id
                })
            });
            if (response.ok) {
                const successMsg = "Tu solicitud fue enviada. Si eres usuario gratuito, espera 3 a 6 horas. Si eres usuario premium, espera alrededor de 2 horas.";
                const detailsRequestMessage = document.getElementById('details-request-message');
                if (detailsRequestMessage) {
                    showAppMessage(detailsRequestMessage, successMsg, 'success');
                } else {
                    alert(successMsg);
                }
            } else {
                alert('Hubo un error al enviar la solicitud. Intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error al solicitar el contenido:', error);
            alert('No se pudo conectar con el servidor para enviar la solicitud.');
        }
    };
    playButtonContainer.appendChild(requestButton);
}

// --- Funciones Sociales (Comentarios) ---

async function postComment(tmdbId, text) {
    if (!currentUser || currentUser.isAnonymous) {
        switchScreen('auth-screen');
        return;
    }
    if (text.trim() === "") {
        return;
    }

    try {
        await addDoc(collection(db, "comments"), {
            tmdbId: tmdbId.toString(),
            userId: currentUser.uid,
            // Usar email o un nombre de usuario más amigable
            userName: currentUser.email ? currentUser.email.split('@')[0] : 'Usuario', 
            text: text.trim(),
            timestamp: new Date()
        });
        commentInput.value = '';
    } catch (e) {
        console.error("Error al publicar comentario:", e);
        alert('No se pudo publicar el comentario.');
    }
}

if (btnPostComment) {
    btnPostComment.addEventListener('click', () => {
        if (currentMovieOrSeries && currentMovieOrSeries.tmdbId) {
            postComment(currentMovieOrSeries.tmdbId, commentInput.value);
        }
    });
}

function renderComments(tmdbId) {
    const commentsColRef = collection(db, 'comments');
    // Esta consulta requiere un índice: tmdbId + timestamp (desc)
    const q = query(commentsColRef, where("tmdbId", "==", tmdbId.toString()), orderBy("timestamp", "desc"));
    
    // Configurar listener en tiempo real (Fix Comentarios)
    onSnapshot(q, (snapshot) => {
        commentsFeed.innerHTML = '';
        if (snapshot.empty) {
            // Asegurar que el mensaje de "no comentarios" se vea correctamente
            const emptyMessageElement = document.createElement('p');
            emptyMessageElement.id = 'no-comments-message';
            emptyMessageElement.style.color = '#888';
            emptyMessageElement.textContent = 'Sé el primero en comentar.';
            commentsFeed.appendChild(emptyMessageElement);
            return;
        }
        
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const date = data.timestamp.toDate().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
            
            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item';
            commentItem.innerHTML = `
                <div class="comment-header">
                    <span class="comment-user">${data.userName || 'Usuario Anónimo'}</span>
                    <span class="comment-date">${date}</span>
                </div>
                <p class="comment-text">${data.text}</p>
            `;
            commentsFeed.appendChild(commentItem);
        });
    }, (error) => {
        console.error("Error al obtener comentarios:", error);
    });
}


// --- Lógica de Pestañas (TABS) ---
function setupDetailsTabs(tmdbItem, type) {
    // CRITICAL FIX 1: Safety check for tab containers
    if (!detailsTabsHeader || !detailsTabsContent) {
        console.error("Tab containers not found in DOM.");
        return; // Exit function gracefully if elements are missing
    }
    
    const tabButtons = detailsTabsHeader.querySelectorAll('.tab-button');
    const tabPanes = detailsTabsContent.querySelectorAll('.tab-pane');
    
    // Limpiar listeners anteriores
    tabButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
    const newTabButtons = detailsTabsHeader.querySelectorAll('.tab-button');

    newTabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetTabId = e.target.getAttribute('data-tab');
            
            newTabButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            
            const targetPane = document.getElementById(targetTabId);
            if (targetPane) {
                targetPane.classList.add('active');
                
                // Si la pestaña es 'Similares' (related-content-pane), renderizar el contenido
                if (targetTabId === 'related-content-pane') {
                    // Carga forzada al hacer clic
                    if (relatedMoviesContainer.children.length === 0) {
                        fetchRelatedContent(tmdbItem, type);
                    }
                }
            }
        });
    });
    
    // Iniciar con la pestaña de Similares (related-content-pane) activa (el primer botón)
    document.getElementById('related-content-pane').classList.add('active');
    document.getElementById('comments-content-pane').classList.remove('active');
    document.querySelector('.tab-button[data-tab="related-content-pane"]').classList.add('active');
    document.querySelector('.tab-button[data-tab="comments-content-pane"]').classList.remove('active');
}

async function fetchRelatedContent(item, type) {
    try {
        const related = await fetchFromTMDB(type === 'movie' ? `movie/${item.id}/similar` : `tv/${item.id}/similar`);
        renderCarousel('related-movies', related, type);
    } catch (error) {
        console.error("Error fetching related content:", error);
        relatedMoviesContainer.innerHTML = '<p style="padding: 10px;">No se encontraron contenidos similares.</p>';
    }
}

// --- Modificación de showDetailsScreen (Integración de toda la lógica) ---
async function showDetailsScreen(item, type) {
    if (searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        moviesScreen.classList.remove('search-active'); 
        document.querySelector('.top-nav').style.display = 'flex'; 
        document.querySelector('.bottom-nav').style.display = 'flex'; 
        document.getElementById('app-container').style.paddingBottom = '70px';
    }
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    detailsScreen.classList.add('active');
    appContainer.scrollTo({ top: 0, behavior: 'smooth' });
    showLoader();
    
    // LIMPIEZA INICIAL DE CONTENEDORES
    seasonsContainer.innerHTML = '';
    episodesContainer.innerHTML = '';
    seasonsContainer.style.display = 'none';
    relatedMoviesContainer.innerHTML = ''; // Limpiar relacionados al cargar
    resetDetailsPlayer();

    try {
        const posterPath = item.backdrop_path || item.poster_path;
        const posterUrl = posterPath ? `https://image.tmdb.org/t/p/original${posterPath}` : 'https://placehold.co/500x750?text=No+Poster';
        
        detailsPosterTop.style.backgroundImage = `url('${posterUrl}')`;

        detailsTitle.textContent = item.title || item.name;
        detailsSinopsis.textContent = item.overview || 'Sin sinopsis disponible.';
        detailsYear.textContent = (item.release_date || item.first_air_date) ? (item.release_date || item.first_air_date).substring(0, 4) : '';
        
        const genreNames = item.genre_ids ? item.genre_ids.map(id => (type === 'movie' ? allMovieGenres[id] : allTvGenres[id])).filter(Boolean).join(', ') : '';
        detailsGenres.textContent = genreNames;

        const credits = await fetchFromTMDB(type === 'movie' ? `movie/${item.id}/credits` : `tv/${item.id}/credits`);
        
        const director = credits.crew.find(c => c.job === 'Director');
        directorName.textContent = director ? director.name : 'No disponible';
        const actors = credits.cast.slice(0, 3).map(a => a.name).join(', ');
        actorsList.textContent = actors || 'No disponible';
        
        // --- Carga Estática de datos para la película actual ---
        // Esto previene que una actualización global recargue esta pantalla con datos antiguos.
        const moviesSnapshot = await getDocs(collection(db, 'movies'));
        const localMoviesData = moviesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const localData = localMoviesData.find(d => d.tmdbId === item.id.toString());
        // --------------------------------------------------------

        currentMovieOrSeries = localData || { tmdbId: item.id, type: type }; // Asegurar que tenga el tmdbId

        if (type === 'movie') {
            renderMoviePlayButtons(localData, item);
        } else if (type === 'tv') {
            // La lógica de temporadas debe ejecutarse ANTES de la carga de pestañas
            await renderSeriesButtons(localData, item);
        }
        
        // --- INICIALIZACIÓN DE LA SECCIÓN SOCIAL Y PESTAÑAS ---
        if (currentMovieOrSeries && currentMovieOrSeries.tmdbId) {
            // 1. Vistas (REVERTIDA A CONTAR CADA CLIC)
            const viewCount = await getCount(currentMovieOrSeries.tmdbId, 'views'); 
            if (viewCountDisplay) {
                viewCountDisplay.innerHTML = `<i class="fas fa-eye"></i> ${viewCount.toLocaleString()} Vistas`;
            }
            
            // 2. Likes (PERSISTENTE POR USUARIO)
            const likeCount = await getCount(currentMovieOrSeries.tmdbId, 'likes');
            if (likeCountDisplayText) {
                likeCountDisplayText.innerHTML = `<i class="fas fa-heart"></i> ${likeCount} Me Gusta`;
            }
            renderLikeState(currentMovieOrSeries.tmdbId); // Establece el ícono de corazón (hollow/solid)

            // 3. Comentarios (REAL-TIME LOCAL)
            renderComments(currentMovieOrSeries.tmdbId);
        }
        
        // 4. Configurar TABS (Pestañas)
        setupDetailsTabs(item, type);
        
        // Carga forzada de Similares si es la pestaña activa por defecto
        const defaultTab = document.querySelector('.tab-button[data-tab="related-content-pane"]');
        if (defaultTab && defaultTab.classList.contains('active')) {
             fetchRelatedContent(item, type);
        }


    } catch (error) {
        console.error("Error showing details:", error);
        alert('Hubo un error al cargar los detalles. Intenta de nuevo.');
        
        resetDetailsPlayer();
        history.back(); 

    } finally {
        hideLoader();
    }
}

async function fetchFromTMDB(endpoint, query = '') {
    const API_KEY = "5eb8461b85d0d88c46d77cfe5436291f";
    const BASE_URL = 'https://api.themoviedb.org/3/';
    
    let url = `${BASE_URL}${endpoint}`;
    
    if (url.includes('?')) {
        url += `&api_key=${API_KEY}&language=es-ES`;
    } else {
        url += `?api_key=${API_KEY}&language=es-ES`;
    }
    
    if (query) {
        url += `&query=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error de la API: ${response.status}`);
        }
        const data = await response.json();
        return data.results || data.items || data;
    } catch (error) {
        console.error("Error en la llamada a fetchFromTMDB:", error);
        throw error;
    }
}

function createMovieCard(movie, type = 'movie') {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/500x750?text=No+Poster';
    
    let badgeHtml = '';
    const isPopular = movie.popularity > 100;
    if (isPopular) {
        badgeHtml = `<div class="badge">TOP</div>`;
    }

    const mediaTypeLabel = movie.media_type ? `<div class="media-type-label">${movie.media_type === 'movie' ? 'Película' : 'Serie'}</div>` : '';
    
    movieCard.innerHTML = `
        ${badgeHtml}
        ${mediaTypeLabel}
        <img src="${posterUrl}" alt="${movie.title || movie.name}" class="movie-poster">
    `;
    
    movieCard.addEventListener('click', () => {
        const currentState = history.state || { screen: 'home-screen' };
        
        const isComingFromSearch = currentState.searchActive === true;

        history.pushState({ 
            screen: 'details-screen', 
            item: movie, 
            type: type || movie.media_type, 
            previousState: currentState 
        }, '', '');
        showDetailsScreen(movie, type || movie.media_type)
    });
    return movieCard;
}

function createBannerItem(movie) {
    const bannerItem = document.createElement('div');
    bannerItem.className = 'banner-item';
    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : 'https://placehold.co/1080x600?text=No+Banner';
    bannerItem.style.backgroundImage = `url('${backdropUrl}')`;
    
    const localMovie = moviesData.find(m => m.tmdbId === movie.id);
    const isPremium = localMovie && localMovie.isPremium;
    const hasEmbedCode = localMovie && (localMovie.freeEmbedCode || localMovie.proEmbedCode);

    let buttonHtml = '';
    if (hasEmbedCode) {
        const buttonText = isPremium ? '<i class="fas fa-play"></i> Ver ahora (Versión PRO)' : '<i class="fas fa-play"></i> Ver ahora';
        buttonHtml = `<button class="banner-button red">${buttonText}</button>`;
    }

    bannerItem.innerHTML = `
        <div class="banner-buttons-container">
            ${buttonHtml}
            ${isPremium ? `<span class="pro-badge">PRO</span>` : ''}
        </div>
    `;

    const playButton = bannerItem.querySelector('.red');
    if (playButton) {
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            history.pushState({ screen: 'details-screen', item: movie, type: movie.media_type || 'movie' }, '', '');
            showDetailsScreen(movie, movie.media_type || 'movie');
        });
    }

    bannerItem.addEventListener('click', () => {
        history.pushState({ screen: 'details-screen', item: movie, type: movie.media_type || 'movie' }, '', '');
        showDetailsScreen(movie, movie.media_type || 'movie')
    });
    return bannerItem;
}

function renderCarousel(containerId, movies, type = 'movie') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    movies.forEach(movie => {
        container.appendChild(createMovieCard(movie, movie.media_type || type));
    });
}

function renderGrid(container, movies, type = 'movie') {
    if (!container) return;
    container.innerHTML = '';
    movies.forEach(movie => {
        container.appendChild(createMovieCard(movie, type));
    });
}

async function fetchHistory() {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        historySection.style.display = 'none';
        return;
    }
    try {
        // Esta consulta requiere un índice: userId + timestamp (desc)
        const q = query(collection(db, "history"), where("userId", "==", auth.currentUser.uid), orderBy("timestamp", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map(doc => doc.data());
        if (history.length > 0) {
            historySection.style.display = 'block';
            renderCarousel('history-list', history, 'movie');
        } else {
            historySection.style.display = 'none';
        }
    } catch (e) {
        console.error("Error al obtener el historial: ", e);
        historySection.style.display = 'none';
    }
}

async function fetchHomeContent() {
    showLoader();
    try {
        await fetchHistory();

        const popularMovies = await fetchFromTMDB('movie/popular');
        renderCarousel('populares-movies', popularMovies, 'movie');

        const trendingContent = await fetchFromTMDB('trending/all/day');
        renderCarousel('tendencias-movies', trendingContent);

        const actionMovies = await fetchFromTMDB('discover/movie?with_genres=28');
        renderCarousel('accion-movies', actionMovies, 'movie');

        const terrorMovies = await fetchFromTMDB('discover/movie?with_genres=27,9648');
        renderCarousel('terror-movies', terrorMovies, 'movie');
        
        const animacionMovies = await fetchFromTMDB('discover/movie?with_genres=16');
        renderCarousel('animacion-movies', animacionMovies, 'movie');

        const documentalesMovies = await fetchFromTMDB('discover/movie?with_genres=99');
        renderCarousel('documentales-movies', documentalesMovies, 'movie');

        const scifiMovies = await fetchFromTMDB('discover/movie?with-genres=878');
        renderCarousel('scifi-movies', scifiMovies, 'movie');

        const popularSeries = await fetchFromTMDB('tv/popular');
        renderCarousel('populares-series', popularSeries, 'tv');
        
        bannerMovies = trendingContent.filter(m => m.backdrop_path);
        renderBannerCarousel();
    } catch (error) {
        console.error("Error fetching home content:", error);
        alert('Hubo un error al cargar el contenido principal. Por favor, recarga la página.');
    } finally {
        hideLoader();
    }
}

function renderBannerCarousel() {
    bannerList.innerHTML = '';
    bannerMovies.forEach(movie => {
        bannerList.appendChild(createBannerItem(movie));
    });
    startBannerAutoScroll();
}

function stopBannerAutoScroll() {
    clearInterval(bannerInterval);
    if (resumeAutoScrollTimeout) {
        clearTimeout(resumeAutoScrollTimeout);
    }
}

function startBannerAutoScroll() {
    let currentIndex = 0;
    const scrollAmount = bannerList.clientWidth;
    stopBannerAutoScroll();
    bannerInterval = setInterval(() => {
        if (currentIndex < bannerMovies.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        bannerList.scrollTo({
            left: currentIndex * scrollAmount,
            behavior: 'smooth'
        });
    }, 3000);
}

bannerList.addEventListener('mousedown', stopBannerAutoScroll);
bannerList.addEventListener('mouseup', () => {
    resumeAutoScrollTimeout = setTimeout(startBannerAutoScroll, 10000); // 10 segundos
});
bannerList.addEventListener('touchstart', stopBannerAutoScroll);
bannerList.addEventListener('touchend', () => {
    resumeAutoScrollTimeout = setTimeout(startBannerAutoScroll, 10000); // 10 segundos
});

async function fetchAllGenres(type = 'movie') {
    try {
        const genres = await fetchFromTMDB(`genre/${type}/list`);
        const genreMap = {};
        genres.genres.forEach(genre => {
            genreMap[genre.id] = genre.name;
        });
        if (type === 'movie') {
            allMovieGenres = genreMap;
        } else {
            allTvGenres = genreMap;
        }
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

function renderGenresModal(type) {
    genresList.innerHTML = '';
    const currentGenres = type === 'movie' ? allMovieGenres : allTvGenres;
    for (const id in currentGenres) {
        const genreButton = document.createElement('button');
        genreButton.className = 'button secondary';
        genreButton.textContent = currentGenres[id];
        genreButton.onclick = () => {
            fetchFromTMDB(`discover/${type}?with_genres=${id}`).then(items => {
                renderGrid(type === 'movie' ? allMoviesGrid : allSeriesGrid, items, type);
                document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
                if (type === 'movie') moviesScreen.classList.add('active');
                else seriesScreen.classList.add('active');
                closeModal(genresModal);
            });
        };
        genresList.appendChild(genreButton);
    }
}

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSearch(searchInput.value);
    }
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 2) {
        handleSearch(query);
    } else if (query.length === 0) {
        moviesScreen.classList.remove('search-active');
        switchScreen('home-screen'); 
    }
});

function renderSearchResults(results, filterType = 'all') {
    allMoviesGrid.innerHTML = '';
    
    const filteredResults = results.filter(item => {
        if (filterType === 'all') {
            return true;
        }
        return item.media_type === filterType;
    });

    filteredResults.forEach(item => {
        if (item.media_type === 'movie' || item.media_type === 'tv') {
            const card = createMovieCard(item, item.media_type);
            allMoviesGrid.appendChild(card);
        }
    });

    if (filteredResults.length === 0) {
        allMoviesGrid.innerHTML = '<p>No se encontraron resultados.</p>';
    }
}

async function handleSearch(query) {
    if (query.length > 2) {
        showLoader();
        try {
            const searchResults = await fetchFromTMDB('search/multi', query);
            lastSearchResults = searchResults.filter(m => m.media_type !== 'person' && m.poster_path);
            
            renderSearchResults(lastSearchResults);

            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            moviesScreen.classList.add('active', 'search-active');
            
            document.querySelector('.top-nav').style.display = 'none';
            document.querySelector('.bottom-nav').style.display = 'flex';
            appContainer.style.paddingBottom = '70px'; 

            history.replaceState({ screen: 'movies-screen', searchActive: true, query: query, results: lastSearchResults }, '', `?screen=movies-screen&search=${encodeURIComponent(query)}`);
            
        } catch (error) {
            console.error("Error performing search:", error);
            alert('Hubo un error en la búsqueda. Por favor, intenta de nuevo.');
        } finally {
            hideLoader();
        }
    } else if (query.length === 0) {
        moviesScreen.classList.remove('search-active');
        switchScreen('home-screen'); 
    }
}


filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filterType = button.getAttribute('data-filter');
        renderSearchResults(lastSearchResults, filterType);
    });
});

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    moviesScreen.classList.remove('search-active'); 

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        const navItem = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
        if (navItem) navItem.classList.add('active');
        if (!history.state || history.state.screen !== screenId) {
             history.pushState({ screen: screenId }, '', `?screen=${screenId}`);
        }
    }

    if (screenId === 'movies-screen') {
        if (!searchOverlay.classList.contains('active')) {
            renderAllMovies();
            searchFilters.style.display = 'none';
        }
    } else if (screenId === 'series-screen') {
        renderAllSeries();
        searchFilters.style.display = 'none';
    } else if (screenId === 'home-screen') {
        fetchHomeContent();
        searchFilters.style.display = 'none';
    } else if (screenId === 'favorites-screen') {
        fetchFavorites();
        searchFilters.style.display = 'none';
    } else if (screenId === 'events-screen') {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('profile-screen').classList.add('active'); 
        searchFilters.style.display = 'none';
    }
    
    const topNav = document.querySelector('.top-nav');
    const bottomNav = document.querySelector('.bottom-nav');
    const isSearchActive = searchOverlay.classList.contains('active');

    if (screenId === 'auth-screen') { 
        topNav.style.display = 'none';
        bottomNav.style.display = 'none';
        appContainer.style.paddingBottom = '0';
    } else if (isSearchActive) { 
        topNav.style.display = 'none';
        bottomNav.style.display = 'flex'; 
        appContainer.style.paddingBottom = '70px'; 
        if (screenId === 'movies-screen') {
            moviesScreen.classList.add('search-active');
        }
    } else {
        topNav.style.display = 'flex';
        if (screenId === 'home-screen' || screenId === 'movies-screen' || screenId === 'series-screen' || screenId === 'profile-screen' || screenId === 'details-screen' || screenId === 'events-screen') { 
            bottomNav.style.display = 'flex';
            appContainer.style.paddingBottom = '70px';
        } else {
            bottomNav.style.display = 'none';
            appContainer.style.paddingBottom = '0';
        }
    }
}

window.addEventListener('popstate', async (event) => {
    const state = event.state;
    
    resetDetailsPlayer(); 
    closeAllModals(); 
    
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));

    if (state) {
        if (state.screen === 'details-screen') {
            const item = state.item;
            const type = state.type;
            if (item && type) {
                // FIX BUG DE BARRAS: Si regresamos a details-screen, debemos asegurarnos que las barras se muestren.
                // Llamamos a switchScreen para forzar la re-evaluación de las barras.
                switchScreen('details-screen'); 
                showDetailsScreen(item, type); 
            } else {
                switchScreen('home-screen');
            }
        } else {
            const previousStateIsSearch = state.searchActive;

            if (previousStateIsSearch) {
                searchOverlay.classList.add('active');
                moviesScreen.classList.add('active'); 
                moviesScreen.classList.add('search-active'); 

                searchInput.value = state.query || '';
                if (state.results) {
                    lastSearchResults = state.results;
                    renderSearchResults(lastSearchResults, 'all'); 
                }
                
                document.querySelector('.top-nav').style.display = 'none';
                document.querySelector('.bottom-nav').style.display = 'flex';
                appContainer.style.paddingBottom = '70px';
                searchFilters.style.display = 'flex'; 

            } else {
                searchOverlay.classList.remove('active');
                moviesScreen.classList.remove('search-active');
                switchScreen(state.screen); 
            }
        }
    } else {
        switchScreen('home-screen');
    }
});

// Listener del botón de salir de autenticación (FIX BARRAS)
authBackButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    // FIX BUG DE BARRAS: En lugar de solo history.back(), forzamos la navegación
    // a la pantalla de detalles o a la pantalla anterior guardada en el historial.
    const currentState = history.state;
    if (currentState && currentState.screen === 'auth-screen' && currentState.previousState) {
        switchScreen(currentState.previousState.screen);
    } else {
        switchScreen('home-screen');
    }
});


// Listener para el link de Perfil en la barra superior (ELIMINADO)
// Se eliminó la variable topProfileLink y su listener

// Listener para el botón de Descarga
if (btnDownloadApp) {
    btnDownloadApp.addEventListener('click', () => {
        showModal(downloadAppModal);
    });
}

// Listener para Abrir Búsqueda
if (btnOpenSearch) {
    btnOpenSearch.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
        
        document.querySelector('.top-nav').style.display = 'none';
        document.querySelector('.bottom-nav').style.display = 'flex';
        appContainer.style.paddingBottom = '70px'; 

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        moviesScreen.classList.add('active', 'search-active');
        searchFilters.style.display = 'flex'; 

        if (lastSearchResults.length > 0) {
            renderSearchResults(lastSearchResults);
        } else {
            allMoviesGrid.innerHTML = '';
        }

        history.pushState({ screen: 'movies-screen', searchActive: true, query: searchInput.value, results: lastSearchResults }, '', `?screen=movies-screen&search=${encodeURIComponent(searchInput.value)}`);
    });
}

// Listener para Cerrar Búsqueda
if (closeSearchButton) {
    closeSearchButton.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        moviesScreen.classList.remove('search-active'); 
        
        searchInput.value = '';
        lastSearchResults = [];
        renderSearchResults(lastSearchResults); 
        
        switchScreen('home-screen');
    });
}


document.querySelectorAll('.nav-item, .profile-button[data-screen]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetScreenId = e.currentTarget.getAttribute('data-screen');
        if (targetScreenId) {
            switchScreen(targetScreenId);
        }
    });
});
// COMENTADO para usar la lógica de switchScreen en el listener de authBackButton
/* authBackButton.addEventListener('click', (e) => {
    e.preventDefault();
    history.back();
}); */

seeMoreButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const endpoint = e.currentTarget.getAttribute('data-endpoint');
        const type = e.currentTarget.getAttribute('data-type');
        
        showLoader();
        try {
            const items = await fetchFromTMDB(endpoint);
            if (type === 'movie') {
                renderGrid(allMoviesGrid, items, 'movie');
                switchScreen('movies-screen');
            } else {
                renderGrid(allSeriesGrid, items, 'tv');
                switchScreen('series-screen');
            }
        } catch (error) {
            console.error("Error loading 'See more' content:", error);
            alert('No se pudo cargar el contenido. Intenta de nuevo.');
        } finally {
            hideLoader();
        }
    });
});

genresButton.addEventListener('click', () => {
    renderGenresModal('movie');
    showModal(genresModal);
});
seriesGenresButton.addEventListener('click', () => {
    renderGenresModal('tv');
    showModal(genresModal);
});

async function renderAllMovies() {
    showLoader();
    try {
        const movies = await fetchFromTMDB('discover/movie?sort_by=popularity.desc');
        renderGrid(allMoviesGrid, movies, 'movie');
    } catch (error) {
        console.error("Error rendering all movies:", error);
        alert('No se pudieron cargar las películas. Intenta de nuevo.');
    } finally {
        hideLoader();
    }
}

async function renderAllSeries() {
    showLoader();
    try {
        const series = await fetchFromTMDB('discover/tv?sort_by=popularity.desc');
        renderGrid(allSeriesGrid, series, 'tv');
    } catch (error) {
        console.error("Error rendering all series:", error);
        alert('No se pudieron cargar las series. Intenta de nuevo.');
    } finally {
        hideLoader();
    }
}

async function addToFavorites(movie) {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        switchScreen('auth-screen');
        return;
    }
    try {
        await addDoc(collection(db, "favorites"), {
            userId: auth.currentUser.uid,
            tmdbId: movie.id,
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            type: movie.media_type || 'movie'
        });
        alert('Añadido a Mi lista');
    } catch (e) {
        console.error("Error adding favorite: ", e);
        alert('No se pudo añadir a la lista.');
    }
}

async function fetchFavorites() {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        switchScreen('auth-screen');
        return;
    }
    showLoader();
    try {
        const q = query(collection(db, "favorites"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const favorites = querySnapshot.docs.map(doc => doc.data());
        renderGrid(favoritesGrid, favorites, 'movie');
    } catch (e) {
        console.error("Error fetching favorites: ", e);
        alert('No se pudieron cargar los favoritos.');
    } finally {
        hideLoader();
    }
}

async function playAd() {
    return new Promise((resolve) => {
        console.log("Simulating ad playback...");
        alert('Anuncio: El video comenzará en breve.');
        setTimeout(() => {
            resolve();
        }, 5000);
    });
}

submitRequestButton.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        switchScreen('auth-screen');
        return;
    }

    const movieTitle = movieRequestInput.value.trim();
    if (movieTitle === '') {
        showAppMessage(requestMessage, 'Por favor, ingresa el título de la película.', 'error');
        return;
    }

    try {
        await addDoc(collection(db, "requests"), {
            userId: auth.currentUser.uid,
            userName: auth.currentUser.displayName || 'Anónimo',
            movieTitle: movieTitle,
            requestedAt: new Date()
        });
        
        const successMsg = "Tu solicitud fue enviada. Si eres usuario gratuito, espera 3 a 6 horas. Si eres usuario premium, espera alrededor de 2 horas.";
        showAppMessage(requestMessage, successMsg, 'success');
        movieRequestInput.value = '';
    } catch (e) {
        console.error("Error adding movie request: ", e);
        showAppMessage(requestMessage, 'No se pudo enviar la solicitud. Intenta de nuevo más tarde.', 'error');
    }
});

const passwordToggles = document.querySelectorAll('.password-toggle');
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const passwordInput = toggle.previousElementSibling;
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggle.classList.toggle('fa-eye');
        toggle.classList.toggle('fa-eye-slash');
    });
});

proStatusButton.addEventListener('click', async () => {
    if (!currentUser || currentUser.isAnonymous) {
        switchScreen('auth-screen');
    } else {
        showModal(paymentModal);
    }
});

if (createAccountButton) {
    createAccountButton.addEventListener('click', () => {
        switchScreen('auth-screen');
        loginForm.classList.remove('active-form');
        signupForm.classList.add('active-form');
    });
}

if (profileLoginLink) {
    profileLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchScreen('auth-screen');
        loginForm.classList.add('active-form');
        signupForm.classList.remove('active-form');
    });
}

if(authLoginLink){
    authLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('active-form');
        signupForm.classList.remove('active-form');
    });
}

premiumInfoCtaButton.addEventListener('click', () => {
    closeModal(premiumInfoModal);
    showModal(paymentModal);
});

premiumInfoLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(premiumInfoModal);
    switchScreen('auth-screen');
    loginForm.classList.add('active-form');
    signupForm.classList.remove('active-form');
});

profileMyList.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.isAnonymous) {
        switchScreen('auth-screen');
    } else {
        switchScreen('favorites-screen');
    }
});
profilePrivacy.addEventListener('click', (e) => {
    e.preventDefault();
    switchScreen('privacy-screen');
});
profileTerms.addEventListener('click', (e) => {
    e.preventDefault();
    switchScreen('terms-screen');
});
profileSubscription.addEventListener('click', (e) => {
    e.preventDefault();
    showModal(paymentModal);
});
profileHelpCenter.addEventListener('click', (e) => {
    e.preventDefault();
    switchScreen('help-screen');
});

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active-form');
    signupForm.classList.add('active-form');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.remove('active-form');
    loginForm.classList.add('active-form');
});

signupButton.addEventListener('click', async () => {
    signupMessage.style.display = 'none'; 
    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;
    const termsAccepted = document.getElementById('terms-checkbox').checked;

    if (!termsAccepted) {
        showAppMessage(signupMessage, 'Debes aceptar los términos y condiciones para continuar.', 'error');
        return;
    }
    
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        showAppMessage(signupMessage, '¡Registro exitoso! Por favor, activa tu Cuenta Premium.', 'success');
        switchScreen('profile-screen');
        showModal(paymentModal);
    } catch (error) {
        console.error("Signup error:", error);
        let userMessage = 'Error al registrarse. Intenta de nuevo.';
        if (error.code === 'auth/email-already-in-use') {
             userMessage = 'Este correo ya está registrado. ¿Quieres iniciar sesión?';
        } else if (error.code === 'auth/weak-password') {
             userMessage = 'La contraseña debe tener al menos 6 caracteres.';
        }
        showAppMessage(signupMessage, userMessage, 'error'); 
    }
});

loginButton.addEventListener('click', async () => {
    loginMessage.style.display = 'none'; 
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showAppMessage(loginMessage, '¡Inicio de sesión exitoso!', 'success');
        switchScreen('profile-screen');
    } catch (error) {
        console.error("Login error:", error);
        let userMessage = 'Error al iniciar sesión. Intenta de nuevo.';
        if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
            userMessage = 'Correo no registrado o inválido.';
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            userMessage = 'Contraseña incorrecta.';
        }
        showAppMessage(loginMessage, userMessage, 'error'); 
    }
});

socialLoginButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('Esta funcionalidad aún no está disponible.');
    });
});

buyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        const plan = e.target.getAttribute('data-plan');
        const amount = (plan === 'annual') ? '19.99' : '1.99';

        if (!currentUser || currentUser.isAnonymous) {
            switchScreen('auth-screen');
            return;
        }

        try {
            const response = await fetch('https://serivisios.onrender.com/create-paypal-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: plan, amount: amount })
            });

            const data = await response.json();
            
            if (response.ok && data.approval_url) {
                window.location.href = data.approval_url;
            } else {
                alert('Error al iniciar el pago con PayPal. Verifica la configuración en tu servidor.');
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert('Hubo un error al procesar tu pago. Intenta de nuevo.');
        }
    });
});

if (buyWithPaypalButton) {
    buyWithPaypalButton.addEventListener('click', () => {
        alert('Selecciona un plan antes de continuar con el pago.');
    });
}
if (buyWithBinanceButton) {
    buyWithBinanceButton.addEventListener('click', () => {
        alert('Redirigiendo a Binance... (Funcionalidad simulada)');
    });
}

signoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        alert('Has cerrado sesión.');
        window.location.reload();
    } catch (error) {
        console.error("Sign out error:", error);
        alert('No se pudo cerrar sesión. Intenta de nuevo.');
    }
});

// --- LISTENERS DE NOTIFICACIONES Y EVENTOS ---

if (btnOpenNotifications) {
    btnOpenNotifications.addEventListener('click', () => {
        renderNotifications(); 
        showModal(userNotificationsModal);
    });
}
if (notificationsClose) {
    notificationsClose.addEventListener('click', () => {
        closeModal(userNotificationsModal);
    });
}

if (btnClearAllNotifications) {
    btnClearAllNotifications.addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que quieres borrar todas tus notificaciones?')) {
            showLoader();
            try {
                const batch = db.batch();
                notificationsData.forEach(notif => {
                    if (notif.docId) {
                        const notifRef = doc(db, 'userNotifications', notif.docId);
                        batch.delete(notifRef);
                    }
                });
                await batch.commit();
                alert('Se han borrado todas tus notificaciones.');
            } catch (error) {
                console.error("Error al borrar notificaciones:", error);
                alert('Hubo un error al borrar las notificaciones. Intenta de nuevo.');
            } finally {
                hideLoader();
            }
        }
    });
}

if (btnPubSaveNotify) {
    btnPubSaveNotify.addEventListener('click', async () => {
        const embedLink = document.getElementById('admin-embed-input').value || 'Link_Simulado_PRO';

        try {
            await addDoc(collection(db, "userNotifications"), {
                title: '¡Nueva Película Publicada!',
                description: `Contenido nuevo disponible: ${embedLink.substring(0, 15)}...`,
                image: 'https://placehold.co/50x70?text=NEW',
                timestamp: new Date(),
                isRead: false,
                type: 'movie',
                targetScreen: 'details-screen' 
            });
            
            alert('Película guardada y notificación enviada a los usuarios. (Simulado)');
            closeModal(contentPublishingModal); 

        } catch (error) {
             console.error("Error al simular notificación real:", error);
             alert('Error: No se pudo conectar a la colección de notificaciones. Revisa Firebase.');
        }
    });
}

// NUEVA FUNCIÓN: Carga estática de películas y series
async function fetchAppData() {
    try {
        const moviesSnapshot = await getDocs(collection(db, 'movies'));
        moviesData = moviesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const seriesSnapshot = await getDocs(collection(db, 'series'));
        seriesData = seriesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error("Error fetching app data statically:", e);
    }
}


let isInitialized = false;
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    
    if (user && !user.isAnonymous) {
        if (profileLoggedIn) {
            profileLoggedIn.style.display = 'block';
        }
        if (profileLoggedOut) {
            profileLoggedOut.style.display = 'none';
        }
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists() && userDocSnap.data().isPro) {
            currentUser.isPro = true;
            if (proStatusButton) {
                proStatusButton.textContent = 'Cuenta Premium Activada';
                proStatusButton.disabled = true;
            }
        } else {
            currentUser.isPro = false;
            if (proStatusButton) {
                proStatusButton.textContent = 'Activar Cuenta Premium';
                proStatusButton.disabled = false;
            }
        }
    } else {
        if (profileLoggedIn) {
            profileLoggedIn.style.display = 'none';
        }
        if (profileLoggedOut) {
            profileLoggedOut.style.display = 'block';
        }
        if (!user) {
             await signInAnonymously(auth);
        }
    }

    if (!isInitialized) {
        isInitialized = true;
        setupRealtimeNotificationsListener(); 
        
        initializeTheme();
        showLoader();
        
        // CORRECCIÓN CRÍTICA: Cambiamos los onSnapshot globales por fetch estático.
        await fetchAppData();

        // Eliminamos los listeners globales de recarga aquí:
        // const moviesColRef = collection(db, 'movies');
        // onSnapshot(moviesColRef, ...)
        
        await fetchAllGenres('movie');
        await fetchAllGenres('tv');
        updateNotificationIndicator(); 
        switchScreen('home-screen');
    }
});
