import os
import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    CallbackQueryHandler,
    MessageHandler,
    filters,
)

# ---------------------------------------------------------------------------------
# ⚠️ ADVERTENCIA: NO PONGAS TUS TOKENS DIRECTAMENTE AQUÍ.
# Usa variables de entorno para mayor seguridad en Render.
# ---------------------------------------------------------------------------------

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
GOODSTREAM_API_KEY = os.environ.get("GOODSTREAM_API_KEY")

GOODSTREAM_BASE_URL = "https://goodstream.one/api"

# ---------------------------------------------------------------------------------
# Variables globales y estados del usuario
# ---------------------------------------------------------------------------------
UPLOAD_URL_STATE = 1
user_states = {}

# ---------------------------------------------------------------------------------
# Funciones de ayuda para la interfaz
# ---------------------------------------------------------------------------------
async def start_keyboard():
    keyboard = [
        [
            InlineKeyboardButton("📤 Subir video por archivo", callback_data="upload_file"),
            InlineKeyboardButton("🔗 Subir video por URL", callback_data="upload_url"),
        ],
        [InlineKeyboardButton("📈 Mis estadísticas y ganancias", callback_data="stats")]
    ]
    return InlineKeyboardMarkup(keyboard)

async def upload_keyboard(file_id):
    base_link = f"https://goodstream.one/{file_id}.html"
    keyboard = [
        [InlineKeyboardButton("🔗 Enlace de descarga", url=f"{base_link}?download=true")],
        [InlineKeyboardButton("💬 Código para foros", callback_data=f"link_forum_{file_id}")],
        [InlineKeyboardButton("🌐 Código HTML", callback_data=f"link_html_{file_id}")],
        [InlineKeyboardButton("🎬 Código embed (incrustar)", callback_data=f"link_embed_{file_id}")],
    ]
    return InlineKeyboardMarkup(keyboard)

# ---------------------------------------------------------------------------------
# Handlers de comandos y mensajes
# ---------------------------------------------------------------------------------
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Maneja el comando /start y muestra el menú principal."""
    reply_markup = await start_keyboard()
    await update.message.reply_text(
        "👋 ¡Hola! Soy tu bot para subir videos a GoodStream. Elige una opción:",
        reply_markup=reply_markup
    )
    if update.effective_user.id in user_states:
        del user_states[update.effective_user.id]

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Maneja las interacciones con los botones inline."""
    query = update.callback_query
    await query.answer()

    user_id = query.from_user.id
    data = query.data

    if data == "upload_file":
        await query.edit_message_text(
            "📤 Por favor, envíame el video que deseas subir. El archivo debe ser MP4."
        )
    elif data == "upload_url":
        user_states[user_id] = UPLOAD_URL_STATE
        await query.edit_message_text(
            "🔗 Por favor, envíame el enlace (URL) directo del video que quieres subir."
        )
    elif data == "stats":
        await get_stats(query, context)
    elif data.startswith("link_"):
        await get_link(query, data)

async def handle_video_file(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Maneja la subida de un video enviado como archivo."""
    file_info = await context.bot.get_file(update.message.video.file_id)
    download_url = file_info.file_path

    message = await update.message.reply_text("⏳ Subiendo video... esto puede tardar unos minutos.")

    try:
        # Obtener el servidor de carga
        response = requests.get(f"{GOODSTREAM_BASE_URL}/upload/server", params={"key": GOODSTREAM_API_KEY})
        response.raise_for_status()
        upload_server = response.json()["resultado"]

        # Descargar el archivo de Telegram y subirlo a GoodStream
        video_content = requests.get(download_url).content
        
        files = {"file": video_content}
        data = {"key": GOODSTREAM_API_KEY}
        
        response = requests.post(upload_server, files=files, data=data)
        response.raise_for_status()
        upload_result = response.json()
        
        if "archivos" in upload_result and upload_result["archivos"][0]["estado"] == "OK":
            file_id = upload_result["archivos"][0]["file_code"]
            reply_markup = await upload_keyboard(file_id)
            await message.edit_text("✅ ¡Subida completa! Elige el tipo de enlace:", reply_markup=reply_markup)
        else:
            await message.edit_text("❌ Ha ocurrido un error al subir el video. Inténtalo de nuevo.")

    except requests.exceptions.HTTPError as e:
        await message.edit_text(f"❌ Error HTTP: {e.response.status_code}. Mensaje: {e.response.text}")
    except Exception as e:
        await message.edit_text(f"❌ Ocurrió un error inesperado: {str(e)}")


async def handle_url(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Maneja la subida de un video a través de una URL."""
    user_id = update.effective_user.id

    if user_id not in user_states or user_states[user_id] != UPLOAD_URL_STATE:
        return

    url = update.message.text
    await update.message.reply_text("⏳ Procesando URL y subiendo video...")

    try:
        response = requests.get(f"{GOODSTREAM_BASE_URL}/upload/url", params={"key": GOODSTREAM_API_KEY, "url": url})
        response.raise_for_status()
        upload_result = response.json()
        
        if upload_result["estado"] == 200:
            file_id = upload_result["resultado"]["file_code"]
            reply_markup = await upload_keyboard(file_id)
            await update.message.reply_text("✅ ¡Subida completa! Elige el tipo de enlace:", reply_markup=reply_markup)
        else:
            await update.message.reply_text("❌ Ha ocurrido un error al procesar la URL. Inténtalo de nuevo.")
    
    except requests.exceptions.HTTPError as e:
        await update.message.reply_text(f"❌ Error HTTP: {e.response.status_code}. Mensaje: {e.response.text}")
    except Exception as e:
        await update.message.reply_text(f"❌ Ocurrió un error inesperado: {str(e)}")

    del user_states[user_id]

async def get_link(query, data):
    """Genera y envía el enlace solicitado."""
    _, link_type, file_id = data.split("_")
    
    base_link = f"https://goodstream.one/{file_id}.html"
    link = ""

    if link_type == "forum":
        link = f"[URL]{base_link}[/URL]"
    elif link_type == "html":
        link = f'<a href="{base_link}">Ver video</a>'
    elif link_type == "embed":
        link = f'<iframe src="https://goodstream.one/embed-{file_id}.html" frameborder="0" allowfullscreen></iframe>'
    
    await query.edit_message_text(f"Aquí está tu enlace:\n\n`{link}`", parse_mode="Markdown")

async def get_stats(query, context):
    """Maneja la solicitud de estadísticas."""
    try:
        response = requests.get(f"{GOODSTREAM_BASE_URL}/account/stats", params={"key": GOODSTREAM_API_KEY})
        response.raise_for_status()
        stats_data = response.json()["resultado"][0]

        stats_message = (
            "📊 **Tus estadísticas y ganancias en tiempo real:**\n"
            f"👀 Vistas: {stats_data['vistas']}\n"
            f"⬇️ Descargas: {stats_data['descargas']}\n"
            f"👥 Referidos: {stats_data['refs']}\n"
            f"💰 Ganancias: ${stats_data['beneficio_total']}"
        )

        await query.edit_message_text(stats_message, parse_mode="Markdown")

    except requests.exceptions.HTTPError as e:
        await query.edit_message_text(f"❌ Error HTTP: {e.response.status_code}. Mensaje: {e.response.text}")
    except Exception as e:
        await query.edit_message_text(f"❌ Ocurrió un error al obtener las estadísticas: {str(e)}")

# ---------------------------------------------------------------------------------
# Configuración del bot y inicio
# ---------------------------------------------------------------------------------
def main() -> None:
    """Función principal para iniciar el bot."""
    if not TELEGRAM_BOT_TOKEN:
        print("❌ Error: La variable de entorno TELEGRAM_BOT_TOKEN no está configurada.")
        return
    
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(button_handler))
    application.add_handler(MessageHandler(filters.VIDEO & ~filters.COMMAND, handle_video_file))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_url))

    print("🚀 Bot iniciado. ¡Listo para recibir comandos!")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
