const canvas = document.getElementById('matrix');
const context = canvas ? canvas.getContext('2d') : null;
const notification = document.getElementById('notification');
const SECRET_KEY = 'plateadouno123';

// Tipo de cambio inicial (valor de respaldo en caso de que la API falle)
let exchangeRate = 3.75; // 1 USD = 3.75 PEN (valor aproximado reciente)

async function fetchExchangeRate() {
    try {
        const response = await fetch('https://api.currencyapi.com/v3/latest?apikey=YOUR_CURRENCYAPI_KEY&base_currency=USD¤cies=PEN');
        const data = await response.json();
        if (data.data && data.data.PEN) {
            exchangeRate = data.data.PEN.value;
            showNotification('Tipo de cambio actualizado: 1 USD = ' + exchangeRate.toFixed(2) + ' PEN');
        } else {
            showNotification('No se pudo obtener el tipo de cambio. Usando valor de respaldo.');
        }
    } catch (error) {
        showNotification('Error al obtener el tipo de cambio. Usando valor de respaldo.');
    }
}

function convertToPEN(usd) {
    return (usd * exchangeRate).toFixed(2);
}

function getPriceValue(price) {
    return parseFloat(price.replace(' USD', '')) || 0;
}

function formatPrice(usdValue) {
    const penValue = convertToPEN(usdValue);
    return `${penValue} PEN (${usdValue.toFixed(2)} USD)`;
}

function resizeCanvas() {
    if (!canvas) {
        console.error('Canvas no encontrado');
        return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initializeMatrixEffect() {
    console.log('Inicializando efecto Matrix...');
    if (!canvas || !context) {
        console.error('Canvas o contexto no encontrado');
        return;
    }

    resizeCanvas();
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    let fontSize = window.innerWidth < 768 ? 10 : window.innerWidth < 480 ? 8 : 18;
    let columns = Math.floor(canvas.width / fontSize);
    const rainDrops = [];

    for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * canvas.height / fontSize;
    }

    const draw = () => {
        context.fillStyle = 'rgba(0, 0, 0, 0.1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(0, 255, 0, 0.8)';
        context.font = `${fontSize}px monospace, 'Courier New'`;
        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            const x = i * fontSize;
            const y = rainDrops[i] * fontSize;
            context.fillText(text, x, y);
            if (y > canvas.height && Math.random() > 0.98) {
                rainDrops[i] = 0;
            }
            rainDrops[i] += 1;
        }
    };

    setInterval(draw, window.innerWidth < 768 ? 100 : 50);

    window.addEventListener('resize', () => {
        resizeCanvas();
        fontSize = window.innerWidth < 768 ? 10 : window.innerWidth < 480 ? 8 : 18;
        columns = Math.floor(canvas.width / fontSize);
        rainDrops.length = columns;
        for (let x = 0; x < columns; x++) {
            rainDrops[x] = rainDrops[x] || Math.random() * canvas.height / fontSize;
        }
    });
}

function setupProductMediaCanvas(productElement) {
    const mediaContainer = productElement.querySelector('.product-media');
    const canvas = document.createElement('canvas');
    canvas.width = mediaContainer.offsetWidth;
    canvas.height = mediaContainer.offsetHeight;
    mediaContainer.insertBefore(canvas, mediaContainer.firstChild);

    const ctx = canvas.getContext('2d');
    let productFontSize = Math.min(canvas.width, canvas.height) / 20;
    let productColumns = Math.floor(canvas.width / productFontSize);
    const productRainDrops = [];

    for (let x = 0; x < productColumns; x++) {
        productRainDrops[x] = Math.random() * canvas.height / productFontSize;
    }

    const drawProductMedia = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.font = `${productFontSize}px monospace, 'Courier New'`;
        for (let i = 0; i < productRainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            const x = i * productFontSize;
            const y = productRainDrops[i] * productFontSize;
            ctx.fillText(text, x, y);
            if (y > canvas.height && Math.random() > 0.98) {
                productRainDrops[i] = 0;
            }
            productRainDrops[i] += 1;
        }
    };

    setInterval(drawProductMedia, 50);
}

function showNotification(message) {
    if (!notification) {
        console.error('Elemento de notificación no encontrado');
        return;
    }
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Comando copiado: ' + text);
    });
}

export {
    SECRET_KEY,
    exchangeRate,
    fetchExchangeRate,
    convertToPEN,
    getPriceValue,
    formatPrice,
    setupProductMediaCanvas,
    showNotification,
    copyToClipboard,
    initializeMatrixEffect
};