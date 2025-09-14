const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// El token del bot ahora se lee de las variables de entorno
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// URL de tu servidor de backend en Render
const RENDER_BACKEND_URL = 'https://serivisios.onrender.com';

// ID del administrador, se lee de las variables de entorno
const ADMIN_CHAT_ID = parseInt(process.env.ADMIN_CHAT_ID, 10);

// Clave de la API de TMDB, se lee de las variables de entorno
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Un objeto para guardar el estado de la conversación con el administrador
const adminState = {};

// Middleware para validar que solo el administrador use el bot
bot.on('message', (msg) => {
  if (msg.chat.id !== ADMIN_CHAT_ID) {
    bot.sendMessage(msg.chat.id, 'Lo siento, no tienes permiso para usar este bot.');
    return;
  }
});
bot.on('callback_query', (callbackQuery) => {
  if (callbackQuery.message.chat.id !== ADMIN_CHAT_ID) {
    bot.sendMessage(callbackQuery.message.chat.id, 'Lo siento, no tienes permiso para usar este bot.');
    return;
  }
});


// Escucha el comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Guarda el estado del administrador
  adminState[chatId] = { step: 'menu' };

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Subir película gratis', callback_data: 'subir_gratis' }],
        [{ text: 'Subir película Premium', callback_data: 'subir_premium' }]
      ]
    }
  };

  bot.sendMessage(chatId, '¡Hola! ¿Qué quieres hacer hoy?', options);
});

// Escucha los clics en los botones
bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  const chatId = msg.message.chat.id;

  if (data === 'subir_gratis' || data === 'subir_premium') {
    adminState[chatId] = {
      step: 'search',
      isPremium: data === 'subir_premium'
    };
    bot.sendMessage(chatId, `Has elegido subir una película ${adminState[chatId].isPremium ? 'Premium' : 'gratis'}. Por favor, escribe el nombre de la película para buscar en TMDB.`);
  }
});

// Escucha los mensajes de texto para la búsqueda
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  // Ignora los comandos del bot
  if (userText.startsWith('/')) {
    return;
  }
  
  if (adminState[chatId] && adminState[chatId].step === 'search') {
    try {
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(userText)}&language=es-ES`;

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        let message = 'Resultados de la búsqueda:';
        const inlineKeyboard = data.results.slice(0, 5).map(movie => {
          return [{
            text: `${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})`,
            callback_data: `add_movie_${movie.id}`
          }];
        });

        const options = {
          reply_markup: {
            inline_keyboard: inlineKeyboard
          }
        };

        bot.sendMessage(chatId, message, options);

        // Guarda los resultados de la búsqueda para usarlos más tarde
        adminState[chatId].results = data.results;
        adminState[chatId].step = 'select_movie';

      } else {
        bot.sendMessage(chatId, 'No se encontraron resultados para tu búsqueda. Intenta de nuevo con otro nombre.');
        adminState[chatId].step = 'search';
      }

    } catch (error) {
      console.error("Error al buscar en TMDB:", error);
      bot.sendMessage(chatId, 'Hubo un error al buscar la película. Intenta de nuevo.');
      adminState[chatId].step = 'search';
    }
  } else if (adminState[chatId] && adminState[chatId].step === 'awaiting_video_link') {
    const videoLink = userText;
    const movieId = adminState[chatId].selectedMovieId;
    const movieData = adminState[chatId].results.find(m => m.id === movieId);
    const isPremium = adminState[chatId].isPremium;

    try {
      // Envía los datos al servidor de Render para agregar la película
      const response = await fetch(`${RENDER_BACKEND_URL}/add-movie`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: movieData.id,
          title: movieData.title,
          poster_path: movieData.poster_path,
          videoLink: videoLink,
          isPremium: isPremium
        })
      });

      if (response.ok) {
        bot.sendMessage(chatId, `¡La película "${movieData.title}" fue agregada exitosamente!`);
      } else {
        const errorData = await response.json();
        bot.sendMessage(chatId, `Hubo un error al agregar la película: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error al comunicarse con el backend:", error);
      bot.sendMessage(chatId, "No se pudo conectar con el servidor para agregar la película.");
    } finally {
      // Reinicia el estado del bot
      adminState[chatId] = { step: 'menu' };
    }
  }
});

// Escucha el clic en "Agregar película"
bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  const chatId = msg.chat.id;

  if (data.startsWith('add_movie_') && adminState[chatId] && adminState[chatId].step === 'select_movie') {
    const movieId = parseInt(data.replace('add_movie_', ''), 10);
    const movieData = adminState[chatId].results.find(m => m.id === movieId);
    
    if (movieData) {
      adminState[chatId].step = 'awaiting_video_link';
      adminState[chatId].selectedMovieId = movieId;

      const posterUrl = movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : 'https://placehold.co/500x750?text=No+Poster';
      
      const message = `Seleccionaste "${movieData.title}".\n\nPor favor, envía el enlace MP4 de la película.`;
      
      bot.sendPhoto(chatId, posterUrl, { caption: message });

    } else {
      bot.sendMessage(chatId, 'Error: Película no encontrada. Intenta buscar de nuevo.');
      adminState[chatId].step = 'search';
    }
  }
});

console.log('El bot está en funcionamiento...');
