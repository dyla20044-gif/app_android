/* REQUERIMIENTO 2: Sistema de Tema Dual */
:root { /* Default/Light Mode */
    --main-bg: #ffffff;
    --secondary-bg: #f0f0f0;
    --text-color: #1a1a1a;
    --nav-bg: #ffffff;
    --icon-color: #444444;
    --red-highlight: #e50914;
    --input-bg: #e0e0e0;
    --input-placeholder: #666;
}

body.dark-mode {
    --main-bg: #000000;
    --secondary-bg: #1a1a1a;
    --text-color: #ffffff;
    --nav-bg: #000000;
    --icon-color: #ffffff;
    --red-highlight: #e50914;
    --input-bg: #262626;
    --input-placeholder: #999;
}

html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden; /* Prevent body scroll */
}

body {
    /* Aplicar variables de tema */
    background-color: var(--main-bg);
    color: var(--text-color);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    display: flex;
    flex-direction: column;
}

#app-container {
    flex-grow: 1;
    overflow-y: auto; /* Allow content scroll */
    padding-bottom: 70px;
}

.screen {
    display: none;
    padding-bottom: 70px;
}

.screen.active {
    display: block;
}

/* Loader */
#loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}
.loader-spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid #fff;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* REQUERIMIENTO 1: Barra de navegación superior (Rediseño) */
.top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px; /* Ajuste para el diseño de la imagen */
    height: 50px;
    background-color: var(--nav-bg);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.top-nav .nav-left, .top-nav .nav-center-icons, .top-nav .nav-right {
    display: flex;
    align-items: center;
    gap: 15px;
}

.top-nav .logo-text {
    font-size: 1.6em;
    font-weight: bold;
    letter-spacing: 1px;
    color: var(--text-color);
}

.icon-button {
    background: none;
    border: none;
    color: var(--icon-color);
    font-size: 1.2em;
    cursor: pointer;
    padding: 0;
}

/* Icono de perfil en recuadro rojo */
.nav-item-profile {
    background-color: var(--red-highlight);
    color: #ffffff;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
    transition: opacity 0.2s;
    text-decoration: none;
}
.nav-item-profile:hover {
    opacity: 0.9;
}

/* Overlay de Búsqueda */
.search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: var(--nav-bg);
    display: none;
    align-items: center;
    padding: 10px 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    z-index: 101;
}
.search-overlay.active {
    display: flex;
}
.search-overlay #search-input {
    flex-grow: 1;
    padding: 10px 15px;
    border: none;
    border-radius: 20px;
    margin: 0;
    background-color: var(--input-bg);
    color: var(--text-color);
}
.search-overlay #search-input::placeholder {
    color: var(--input-placeholder);
}

#close-search-button {
    background: none;
    border: none;
    color: var(--icon-color);
    font-size: 1.5em;
    margin-left: 10px;
    cursor: pointer;
}

.screen-header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.screen-header h2 {
    font-size: 1.5em;
    margin: 0;
}

/* Icon button for genres */
.icon-button {
    background: none;
    border: none;
    color: var(--icon-color);
    font-size: 1.5em;
    cursor: pointer;
    padding: 5px;
}

/* Carrusel de Banners */
.hero-banner-carousel {
    overflow: hidden;
    position: relative;
    margin-bottom: 20px;
}

#banner-list {
    scroll-snap-type: x mandatory;
    display: flex;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

#banner-list::-webkit-scrollbar {
    display: none;
}

.banner-item {
    scroll-snap-align: start;
    flex: 0 0 auto;
    width: 100%;
    height: 250px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 20px;
}

.banner-item::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
}

.banner-buttons-container {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 10px;
}
.banner-button {
    background-color: rgba(255, 255, 255, 0.2);
    color: var(--text-color);
    border: 1px solid var(--text-color);
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9em;
    cursor: pointer;
    backdrop-filter: blur(5px);
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}
.banner-button.red {
    background-color: var(--red-highlight);
    color: #ffffff;
    border: none;
}
.banner-button:hover {
    background-color: rgba(255, 255, 255, 0.4);
}
.banner-button.red:hover {
    background-color: rgba(255, 51, 51, 0.9);
}

.pro-badge {
    color: var(--red-highlight);
    font-weight: bold;
    font-size: 0.9em;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid var(--red-highlight);
    text-shadow: none;
}

.category-section {
    margin-bottom: 20px;
}

.category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.category-header h2 {
    font-size: 1.2em;
    margin: 0;
}

.see-more-btn {
    color: var(--red-highlight);
    text-decoration: none;
    font-size: 0.9em;
    transition: color 0.2s;
}

.movie-list {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding: 10px 20px;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.movie-list::-webkit-scrollbar {
    display: none;
}

.movie-card {
    flex: 0 0 auto;
    width: 130px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;
    position: relative;
}

.movie-card:hover {
    transform: scale(1.05);
}

.movie-poster {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
}
.movie-card .badge {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: var(--red-highlight);
    color: #fff;
    font-size: 0.7em;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
}

.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
    padding: 20px;
}

.bottom-nav {
    background-color: var(--nav-bg);
    padding: 10px 0;
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.4);
    z-index: 100;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666666; /* Color fijo para inactivo */
    text-decoration: none;
    font-size: 0.8em;
    transition: color 0.2s;
}

.nav-item.active {
    color: var(--red-highlight);
}

.nav-item i {
    font-size: 1.4em;
    margin-bottom: 5px;
}

/* Modal y pantalla de detalles de película */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    justify-content: center;
    align-items: center;
    padding: 20px;
}
.modal.active {
    display: flex;
}

.movie-details-screen {
    background-color: var(--main-bg);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: none;
}

.movie-details-screen.active {
    display: block;
}

.details-header-section {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50;
}

#details-poster-top {
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
/* Nuevo estilo para el contenedor del reproductor incrustado */
#embedded-player-container {
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 20; 
}
#embedded-player-container iframe {
    width: 100%;
    height: 100%;
    border: none;
}


.poster-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    justify-content: center;
    align-items: center;
}
/* Nuevo estilo para ocultar la superposición cuando el reproductor esté activo */
#details-poster-top.playing .poster-overlay {
    display: none;
}


.play-button {
    background-color: rgba(255, 255, 255, 0.2);
    border: 2px solid #ffffff;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    color: #ffffff;
    font-size: 2em;
    cursor: pointer;
    backdrop-filter: blur(5px);
    transition: background-color 0.2s;
}

.play-button:hover {
    background-color: rgba(255, 255, 255, 0.4);
}

.details-content-scrollable {
    overflow-y: auto;
    flex-grow: 1;
    padding-top: 226px;
}

.details-info-section {
    padding: 20px;
}

.movie-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.movie-header h2 {
    font-size: 1.8em;
    margin: 0;
}

.movie-actions i {
    font-size: 1.5em;
    margin-left: 15px;
    cursor: pointer;
    color: var(--icon-color);
}

.movie-metadata {
    color: #999;
    font-size: 0.9em;
    margin-top: 5px;
}

.movie-metadata span:not(:last-child)::after {
    content: ' · ';
}

#details-sinopsis {
    margin-top: 15px;
    line-height: 1.5;
}

.text-button {
    background: none;
    border: none;
    color: var(--red-highlight);
    font-size: 0.9em;
    cursor: pointer;
    padding: 0;
    margin-left: 5px;
    text-decoration: underline;
}

.movie-cast {
    margin-top: 20px;
}

.ad-banner {
    width: 100%;
    height: auto;
    margin-top: 20px;
}

.ad-banner img {
    width: 100%;
    height: auto;
    border-radius: 8px;
}

.related-section {
    width: 100%;
    margin-top: 30px;
}

.related-section h3 {
    margin-bottom: 10px;
}

.button {
    background-color: var(--red-highlight);
    color: #ffffff;
    padding: 12px 25px;
    text-decoration: none;
    border-radius: 30px;
    margin: 0 8px;
    font-weight: bold;
    display: inline-block;
    transition: background-color 0.2s;
    cursor: pointer;
    border: none;
}

.button.secondary {
    background-color: var(--secondary-bg);
    color: var(--text-color);
    border: 1px solid var(--input-placeholder);
}

.button:hover {
    background-color: #ff3333;
}

.button.secondary:hover {
    background-color: #444;
}

.modal-content.video-content {
    width: 95%;
    max-width: 900px;
    padding: 10px;
}

#video-player {
    width: 100%;
    height: auto;
}

.close-button {
    color: var(--text-color);
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.footer-text {
    text-align: center;
    color: #555;
    font-size: 0.8em;
    padding: 20px 0;
}

/* Payment Modal */
.modal-content.payment-content {
    background-color: var(--secondary-bg);
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    width: 90%;
    max-width: 500px;
    position: relative;
    /* Centrado */
    margin: auto;
}

.payment-content h2 {
    font-size: 1.8em;
    margin-bottom: 10px;
}

.payment-content p {
    color: var(--text-color);
    line-height: 1.4;
}

.plans-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.plan-card {
    background-color: var(--main-bg);
    padding: 20px;
    border-radius: 10px;
    border: 1px solid var(--input-placeholder);
    flex: 1;
}

.plan-card h3 {
    margin: 0;
    font-size: 1.2em;
}

.plan-card p {
    font-size: 1.5em;
    font-weight: bold;
    color: var(--red-highlight);
    margin: 10px 0;
}

.legal-text {
    font-size: 0.7em;
    color: #555;
    margin-top: 20px;
}

/* New profile buttons style */
.profile-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
}

.profile-button {
    width: 100%;
    text-align: left;
    padding: 15px;
    border-radius: 10px;
    font-size: 1.1em;
}

.profile-button i {
    font-size: 1.2em;
    margin-right: 15px;
}

/* New modal for premium info */
.modal-from-bottom {
    position: fixed;
    z-index: 1000;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0.3s, opacity 0.3s;
}

.modal-from-bottom.active {
    visibility: visible;
    opacity: 1;
}

.modal-from-bottom .modal-content {
    background-color: var(--secondary-bg);
    padding: 30px 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    width: 100%;
    max-width: 500px;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out;
    position: relative;
    box-sizing: border-box;
}

.modal-from-bottom.active .modal-content {
    transform: translateY(0);
}

.premium-info-title {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 20px;
}

.premium-benefits {
    text-align: left;
    margin-bottom: 20px;
}

.premium-benefits p {
    font-size: 1.1em;
    margin: 10px 0;
}

.premium-benefits i {
    color: var(--red-highlight);
    margin-right: 10px;
}

.premium-cta-button {
    width: 100%;
    font-size: 1.2em;
    padding: 15px;
}

.premium-info-login {
    margin-top: 20px;
    color: var(--text-color);
    font-size: 0.9em;
}

.premium-info-login a {
    color: var(--red-highlight);
    text-decoration: none;
    font-weight: bold;
}
/* New Profile Logged Out State */
.profile-cta {
    padding: 20px;
    text-align: left;
}
.profile-cta-title {
    font-size: 1.8em;
    font-weight: bold;
    margin-top: 0;
}
.profile-footer-links {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
}
.profile-link {
    color: var(--text-color);
    text-decoration: none;
    font-size: 1.1em;
    transition: color 0.2s;
}
.profile-link:hover {
    color: #ffffff;
}
.terms-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 10px;
}
.terms-checkbox input {
    width: auto;
    margin-top: 5px;
}
.terms-label {
    font-size: 0.8em;
    color: var(--text-color);
    text-align: left;
}

/* Nuevo Estilo para el flujo de registro */
.profile-header {
    background-color: var(--nav-bg);
    padding: 20px;
}

.profile-info-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.profile-info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile-avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.profile-avatar-large {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3em;
    font-weight: bold;
    color: #fff;
    overflow: hidden;
}

.profile-avatar-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.edit-profile-button {
    background: none;
    border: none;
    color: #fff;
    font-size: 1em;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
}

.profile-logged-in-options {
    padding: 20px;
}

.profile-premium-cta {
    background-color: var(--secondary-bg);
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    margin-bottom: 20px;
}

.profile-premium-cta p {
    font-size: 1.2em;
    margin-bottom: 10px;
    color: var(--text-color);
}

.profile-options-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.profile-option {
    color: var(--text-color);
    text-decoration: none;
    font-size: 1.1em;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
}

.profile-option:hover {
    color: #fff;
}

/* New Screens */
.profile-form-container {
    padding: 20px;
}

.profile-avatar-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
}

.profile-avatar-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3em;
    color: #fff;
}

.avatar-options {
    display: flex;
    gap: 10px;
}

.avatar-option {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border-color 0.2s;
}

.avatar-option.selected {
    border-color: #fff;
}

.input-label {
    display: block;
    text-align: left;
    margin-bottom: 5px;
    color: var(--text-color);
}

.welcome-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    text-align: center;
    height: 100%;
}

.welcome-title {
    font-size: 2.5em;
    font-weight: bold;
    color: var(--red-highlight);
    margin-bottom: 10px;
}

.welcome-subtitle {
    font-size: 1.2em;
    color: var(--text-color);
    margin-bottom: 30px;
}

.welcome-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 300px;
}

.primary-button {
    background-color: var(--red-highlight);
    color: #fff;
    font-size: 1.2em;
    padding: 15px;
    border: none;
    border-radius: 8px;
}

.secondary-button {
    background-color: #333;
    color: #fff;
    font-size: 1.2em;
    padding: 15px;
    border: none;
    border-radius: 8px;
}

.plan-header {
    display: flex;
    align-items: center;
    padding: 20px;
    gap: 15px;
}

.plan-header .back-button {
    color: #fff;
    font-size: 1.5em;
    text-decoration: none;
}

.plan-header .plan-title {
    font-size: 1.8em;
    margin: 0;
}

.plan-cards-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 0 20px 20px;
}

.plan-card {
    background-color: var(--secondary-bg);
    border: 2px solid var(--secondary-bg);
    border-radius: 10px;
    padding: 20px;
    width: 100%;
    max-width: 400px;
    position: relative;
}

.plan-card.active-plan {
    border-color: var(--red-highlight);
}

.plan-card-title {
    font-size: 1.5em;
    margin-bottom: 5px;
}

.plan-card-price {
    font-size: 1.2em;
    color: var(--red-highlight);
    font-weight: bold;
    margin-bottom: 15px;
}

.plan-benefits-list {
    list-style: none;
    padding: 0;
    margin: 0 0 20px;
    text-align: left;
}

.plan-benefits-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-color);
    margin-bottom: 5px;
}

.plan-select-button {
    width: 100%;
    padding: 12px;
}

.best-value-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--red-highlight);
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.8em;
}

/* NUEVAS CLASES PARA EL FRONTEND */
.episode-select-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.season-button {
    background-color: var(--secondary-bg);
    color: var(--text-color);
    padding: 10px 15px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.season-button:hover {
    background-color: #333;
}

.episodes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
    margin-top: 15px;
}

.episode-button {
    background-color: var(--secondary-bg);
    color: var(--text-color);
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s;
}
.episode-button:hover {
    background-color: #333;
}

.play-options-container {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.server-option-button {
    background: none;
    border: 1px solid var(--text-color);
    color: var(--text-color);
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 0.9em;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
    text-align: center;
}
.server-option-button:hover {
    background-color: #333;
    border-color: var(--red-highlight);
}

.badge-1080p {
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 0.7em;
    padding: 2px 6px;
    border-radius: 4px;
    backdrop-filter: blur(5px);
}

.details-play-button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.request-movie-button {
    background-color: var(--red-highlight);
    color: #ffffff;
    border: none;
    padding: 12px 25px;
    border-radius: 30px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
}

.request-movie-button:hover {
    background-color: rgba(229, 9, 20, 0.9);
}
/* Estilos para la nueva pantalla flotante */
#free-ad-modal .modal-content {
    text-align: center;
    padding: 30px 20px;
    max-width: 400px;
}
.modal-title-ad {
    font-size: 1.5em;
    margin-bottom: 10px;
}
.modal-text-ad {
    color: var(--text-color);
    line-height: 1.5;
    margin-bottom: 20px;
}
.modal-buttons-ad {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.modal-small-text {
    font-size: 0.8em;
    color: #888;
    margin-top: 10px;
}
/* Auth Screen Redesign */
.auth-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    position: relative;
    z-index: 10;
}
.auth-header-title {
    font-size: 1.5em;
    font-weight: bold;
}
.auth-content-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: calc(100% - 70px);
    padding: 0 20px;
    box-sizing: border-box;
}
.auth-form {
    width: 100%;
    max-width: 400px;
    display: none;
    animation: fadeIn 0.5s ease-in-out;
}
.auth-form.active-form {
    display: block;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.auth-title {
    font-size: 1.8em;
    font-weight: 700;
    margin-bottom: 30px;
}
.auth-form input {
    width: 100%;
    box-sizing: border-box;
    padding: 15px 20px;
    margin-bottom: 15px;
    background-color: var(--input-bg);
    border: none;
    border-radius: 8px;
    color: var(--text-color);
    font-size: 1em;
}
.password-container {
    position: relative;
    margin-bottom: 15px;
}
.password-container input {
    margin-bottom: 0;
}
.password-toggle {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--input-placeholder);
    cursor: pointer;
}
.auth-button {
    width: 100%;
    margin: 0 0 15px 0;
    padding: 15px;
    border-radius: 8px;
    font-size: 1.1em;
    font-weight: 600;
}
.auth-button.primary {
    background-color: var(--red-highlight); 
}
.auth-button.primary:hover {
    background-color: #ff3333; 
}
.auth-button.secondary {
    background-color: #333; 
}
.auth-button.secondary:hover {
    background-color: #444; 
}
.auth-separator {
    text-align: center;
    margin: 20px 0;
    color: #aaa;
    position: relative;
}
.auth-separator::before, .auth-separator::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background-color: #444;
}
.auth-separator::before {
    left: 0;
}
.auth-separator::after {
    right: 0;
}
.switch-form-text {
    text-align: center;
    color: var(--text-color);
    font-size: 0.9em;
}
.switch-form-text a {
    color: var(--red-highlight); 
    text-decoration: none;
    font-weight: bold;
}
.forgot-password-link {
    display: block;
    text-align: center;
    color: var(--red-highlight); 
    font-size: 0.9em;
    text-decoration: none;
    margin-top: 10px;
}

.media-type-label {
    position: absolute;
    bottom: 5px;
    left: 5px;
    background-color: var(--red-highlight);
    color: #fff;
    font-size: 0.7em;
    padding: 2px 6px;
    border-radius: 4px;
    z-index: 10;
}

.filter-bar {
    display: flex;
    gap: 10px;
    padding: 0 20px;
    margin-bottom: 20px;
    overflow-x: auto;
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
}
.filter-bar::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
}
.filter-button {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9em;
    cursor: pointer;
    white-space: nowrap;
}
.filter-button.active {
    background-color: var(--red-highlight);
    color: #fff;
}

/* REQUERIMIENTO 3: Estilos del Modal de Descarga */
.modal-from-bottom .download-content {
    max-width: 400px;
}
.app-image-placeholder {
    width: 100%;
    height: 150px;
    background-color: #333;
    /* Usar un color y borde para representar la imagen que enviarás */
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid var(--red-highlight);
}

/* REQUERIMIENTO 4: Estilos de Funciones Sociales */
.social-section {
    padding: 15px 0;
    border-top: 1px solid var(--secondary-bg);
    margin-top: 20px;
}
.social-stats {
    display: flex;
    gap: 20px;
    color: #999;
    font-size: 0.9em;
    margin-bottom: 15px;
}
.social-stats i {
    margin-right: 5px;
    color: var(--red-highlight);
}
.social-actions {
    margin-bottom: 20px;
}
.like-button {
    background: var(--secondary-bg);
    color: var(--text-color);
    border: 1px solid var(--input-placeholder);
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
}
.like-button i {
    color: var(--red-highlight);
    margin-right: 5px;
    font-weight: normal;
}
.comments-container h3 {
    font-size: 1.5em;
    margin-bottom: 10px;
    color: var(--text-color);
}
.comment-input-area {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}
#comment-input {
    flex-grow: 1;
    padding: 10px 15px;
    border: none;
    border-radius: 20px;
    background-color: var(--input-bg);
    color: var(--text-color);
}
#btn-post-comment {
    width: auto;
    padding: 10px 15px;
    border-radius: 20px;
    font-size: 1em;
    margin: 0;
}
.comments-feed {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.comment-item {
    background: var(--secondary-bg);
    padding: 10px 15px;
    border-radius: 10px;
}
.comment-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    margin-bottom: 5px;
}
.comment-user {
    font-weight: bold;
    color: var(--text-color);
}
.comment-date {
    color: #999;
}
.comment-text {
    font-size: 0.9em;
    line-height: 1.4;
    color: var(--text-color);
}
