<script>
    // ESTA VARIABLE SE DEFINE EN TU script.js PERO LA HACEMOS GLOBAL AQUÍ
    let currentUser = {}; 

    // 1. LISTA DE FUENTES EXTERNAS (Con la URL real de IPTV-ORG)
    const country_sources = {
        MX: { name: "México", url: "https://iptv-org.github.io/iptv/countries/mx.m3u" },
        EC: { name: "Ecuador", url: "https://iptv-org.github.io/iptv/countries/ec.m3u" },
        AR: { name: "Argentina", url: "https://iptv-org.github.io/iptv/countries/ar.m3u" },
        CL: { name: "Chile", url: "https://iptv-org.github.io/iptv/countries/cl.m3u" },
        MUSIC: { name: "Música", url: "https://iptv-org.github.io/iptv/categories/music.m3u" },
        DOCS: { name: "Documentales", url: "https://iptv-org.github.io/iptv/categories/documentaries.m3u" },
        ALL: { name: "Todos", url: "https://iptv-org.github.io/iptv/index.m3u" },
        // La categoría PREMIUM de Deportes
        SPORTS: { name: "Deportes (Premium)", url: "https://iptv-org.github.io/iptv/categories/sports.m3u", premium: true }
    };

    // Almacén de canales en memoria después de cargarlos
    let cached_channels = {}; 
    
    // Variables y lógica de reproducción (Mantenida)
    const tv_video = document.getElementById('tv-video-player');
    const tv_channel_grid = document.getElementById('tv-channel-grid');
    const tv_current_name = document.getElementById('tv-current-channel-name');
    const premium_wall = document.getElementById('premium-wall');
    const country_nav = document.getElementById('country-nav');
    let tv_currentItem = null;
    let hls_instance = null;


    // ----------------------------------------------------
    // FUNCIONES CORE DE REPRODUCCIÓN 
    // ----------------------------------------------------
    function tv_loadChannel(item, index, countryCode) {
        const channels = cached_channels[countryCode];
        if (!channels || channels.length === 0) return;

        const channel = channels[index];
        const url = channel.url;
        const name = channel.name;
        
        tv_current_name.textContent = `Reproduciendo: ${name} (${countryCode})`;
        
        if (tv_currentItem) {
            tv_currentItem.classList.remove('active');
        }
        // Aseguramos que el elemento exista antes de intentar poner la clase 'active'
        const currentItem = document.querySelector(`.tv-grid-item[data-index="${index}"][data-country="${countryCode}"]`);
        if (currentItem) {
             currentItem.classList.add('active');
             tv_currentItem = currentItem;
        }

        if (hls_instance) {
            hls_instance.destroy();
            hls_instance = null;
        }
        
        if (Hls.isSupported() && (url.endsWith('.m3u8') || url.includes('.m3u8'))) {
            hls_instance = new Hls();
            hls_instance.attachMedia(tv_video);
            hls_instance.on(Hls.Events.MEDIA_ATTACHED, function () {
                hls_instance.loadSource(url);
                hls_instance.on(Hls.Events.MANIFEST_PARSED, function () {
                    tv_video.play().catch(e => console.log("Error de auto-play:", e));
                });
                hls_instance.on(Hls.Events.ERROR, function (event, data) {
                    if (data.fatal) {
                        tv_current_name.textContent = `❌ ERROR: ${name} (Stream caído)`;
                        hls_instance.destroy();
                    }
                });
            });
        } else if (tv_video.canPlayType('application/vnd.apple.mpegurl')) {
            tv_video.src = url;
            tv_video.addEventListener('loadedmetadata', function () { tv_video.play().catch(e => console.log("Error de auto-play nativo:", e)); });
        } else {
            tv_video.src = url;
            tv_video.play().catch(e => {
                tv_current_name.textContent = `⚠️ ADVERTENCIA: Error al iniciar ${name} (URL no soportada)`;
            });
        }
    }
    
    function tv_renderChannelGrid(channels, countryCode) {
        tv_channel_grid.style.display = 'grid';
        premium_wall.style.display = 'none';

        let htmlContent = '';
        channels.forEach((channel, index) => {
            const name = channel.name; // Usamos el nombre ya limpio
            const info = channel.info || 'HD/SD';

            htmlContent += `
                <div class="tv-grid-item" data-index="${index}" data-country="${countryCode}" onclick="tv_loadChannel(this, ${index}, '${countryCode}')">
                    <div class="tv-grid-item-content">
                        <div class="tv-grid-item-title">${name}</div>
                        <div class="tv-grid-item-info">${info} | En vivo</div>
                    </div>
                </div>
            `;
        });
        tv_channel_grid.innerHTML = htmlContent;
    }

    /**
     * @brief Analiza el contenido de un archivo M3U de forma robusta para extraer el nombre del canal.
     * @param {string} m3uContent Contenido completo del archivo M3U.
     * @param {string} categoryName Nombre de la categoría (País/Música/Docs).
     * @returns {Array<Object>} Lista de objetos de canal.
     */
    function parseM3U(m3uContent, categoryName) {
        const channels = [];
        const lines = m3uContent.split('\n');
        let currentChannel = {};

        for (const line of lines) {
            if (line.startsWith('#EXTINF:')) {
                // 1. Extraer el nombre de forma robusta (texto después de la última coma)
                const parts = line.split(',');
                let channelName = 'Canal Desconocido';
                
                if (parts.length > 1) {
                    channelName = parts[parts.length - 1].trim();
                } 
                
                // 2. Extracción de información (calidad)
                let info = categoryName;
                const qualityMatch = line.match(/\s(\d+p|HD|SD|FHD)\b/i);
                if (qualityMatch) {
                    info = qualityMatch[1].toUpperCase();
                }

                // 3. Limpieza del nombre final (eliminar etiquetas de calidad y avisos)
                // Elimina texto entre paréntesis o corchetes, o avisos de Geo-blocked.
                channelName = channelName.replace(/\s*\[.*?\]\s*/g, '').replace(/\s*\(.*?\)\s*/g, '').trim();
                
                // 4. Asignar 'Canal Desconocido' solo si realmente está vacío
                if (channelName === '') {
                    // Si el nombre aún está vacío después de la limpieza, usamos el ID como fallback
                    const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
                    channelName = tvgNameMatch ? tvgNameMatch[1].trim() : 'Canal Desconocido';
                }

                const tvgIDMatch = line.match(/tvg-id="([^"]*)"/);
                const tvgID = tvgIDMatch ? tvgIDMatch[1].trim() : '';

                currentChannel = {
                    name: channelName,
                    info: info,
                    tvgId: tvgID
                };
            } else if (line.startsWith('http') || line.startsWith('https')) {
                if (currentChannel.name) {
                    currentChannel.url = line.trim();
                    // Filtramos streams obviamente rotos o con geobloqueo/avisos
                    if (!currentChannel.name.includes('[Geo-blocked]')) {
                        channels.push(currentChannel);
                    }
                }
                currentChannel = {};
            }
        }
        return channels;
    }


    // ----------------------------------------------------
    // FUNCIÓN PRINCIPAL DE FILTRADO Y CARGA (MEJORADA)
    // ----------------------------------------------------
    async function tv_filterChannels(countryCode) {
        // 1. Manejo de la botonera activa
        document.querySelectorAll('#country-nav .country-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.country-button[data-country="${countryCode}"]`).classList.add('active');

        const source = country_sources[countryCode];
        
        // 2. Lógica de Muro Premium (Integración Real con currentUser.isPro)
        // isPro se actualiza en script.js
        if (source.premium && (!currentUser || !currentUser.isPro)) {
            tv_channel_grid.style.display = 'none';
            premium_wall.style.display = 'block';
            tv_current_name.textContent = "¡Sección Premium! Activa tu plan.";
            if (hls_instance) hls_instance.destroy();
            tv_video.src = '';
            return;
        }

        // Ocultar muro de pago y mostrar la cuadrícula
        premium_wall.style.display = 'none';
        tv_channel_grid.style.display = 'grid';
        tv_channel_grid.innerHTML = '<p style="color:#E50914; text-align:center; padding-top:20px;">Cargando canales, espera un momento...</p>';
        tv_current_name.textContent = `Cargando: ${source.name}...`;

        let channelsToRender = [];

        if (cached_channels[countryCode]) {
            channelsToRender = cached_channels[countryCode];
        } else {
            try {
                const response = await fetch(source.url);
                if (!response.ok) throw new Error('Error al cargar la lista M3U');

                const m3uContent = await response.text();
                channelsToRender = parseM3U(m3uContent, source.name);
                
                // Almacenar en caché solo si la carga fue exitosa
                cached_channels[countryCode] = channelsToRender; 

            } catch (error) {
                console.error("Fallo al obtener o parsear el M3U:", error);
                tv_channel_grid.innerHTML = `<p style="color:#f00; text-align:center; padding-top:20px;">❌ Error al cargar canales de ${source.name}.</p>`;
                tv_current_name.textContent = `ERROR: No se pudo cargar ${source.name}.`;
                return;
            }
        }

        // 4. Renderizar y cargar el primer canal
        tv_renderChannelGrid(channelsToRender, countryCode);

        const firstChannel = document.querySelector(`#tv-channel-grid .tv-grid-item[data-country="${countryCode}"]`);
        if (firstChannel) {
            tv_loadChannel(firstChannel, 0, countryCode); 
        } else {
            tv_current_name.textContent = `No se encontraron canales disponibles para ${source.name}.`;
            tv_channel_grid.innerHTML = `<p style="color:#aaa; text-align:center; padding-top:20px;">No hay canales en esta sección. Intenta con otra o recarga la página.</p>`;
            if (hls_instance) hls_instance.destroy();
            tv_video.src = '';
        }
    }

    // ----------------------------------------------------
    // LÓGICA DE NAVEGACIÓN Y RENDERIZADO DE BOTONES
    // ----------------------------------------------------
    
    // Función centralizada para renderizar todos los botones de país
    function renderCountryButtons() {
        country_nav.innerHTML = '';
        for (const code in country_sources) {
            const source = country_sources[code];
            const button = document.createElement('button');
            button.className = `country-button ${source.premium ? 'premium' : ''}`;
            button.textContent = source.name;
            button.setAttribute('data-country', code);
            button.onclick = () => tv_filterChannels(code);
            country_nav.appendChild(button);
        }
    }
    
    // La función handleScreenNavigation (definida globalmente para tu app)
    function handleScreenNavigation(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active');
        });

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.style.display = 'block';
            targetScreen.classList.add('active');
        }

        // Lógica específica para la TV
        if (screenId === 'tv-live-screen') {
            if (country_nav.children.length === 0) {
                renderCountryButtons();
            }
            // Si ya estamos en la TV, cargamos o recargamos el filtro por defecto (MX)
            if (document.querySelector('#country-nav .country-button.active') === null || tv_channel_grid.children.length === 0) {
                tv_filterChannels('MX');
            }
        }
    }
    
    // Inicialización de la navegación (Se mantiene tu lógica original)
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

                const screenId = this.getAttribute('data-screen');
                handleScreenNavigation(screenId);
            });
        });

        const activeNav = document.querySelector('.bottom-nav .nav-item.active');
        if (activeNav) {
            const initialScreenId = activeNav.getAttribute('data-screen');
            handleScreenNavigation(initialScreenId);
        } else {
             handleScreenNavigation('home-screen'); 
        }
        
        // Conecta el botón Premium al perfil para simular el flujo de pago
        const premiumCtaBtn = document.querySelector('.premium-cta-btn');
        if(premiumCtaBtn) {
            premiumCtaBtn.onclick = function() {
                // Navega a la pantalla de perfil para activar la cuenta premium
                handleScreenNavigation('profile-screen');
            };
        }
    });
</script>
