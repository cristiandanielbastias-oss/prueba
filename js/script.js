// ======================================================================
// AYTHANA - SCRIPT.JS (Funcionalidades Dinámicas)
// ======================================================================

// 1. Definición del Carrito y Catálogo (GLOBAL)
let cart = [];

// Catálogo simulado para vincular ID con nombre y precio (necesario para el mensaje de WhatsApp)
const productCatalog = {
    1: { name: 'Shampoo Nutritivo', price: 2500 },
    2: { name: 'Acondicionador Reparador', price: 2300 },
    3: { name: 'Mascarilla Hidratante', price: 3800 },
    4: { name: 'Sérum Protector', price: 1950 },
    // Añade aquí el resto de tus productos
    5: { name: 'Alisado', price: 2750 },
    6: { name: 'Restaurador de Puntas', price: 4650 },
    7: { name: 'Acondicionador Lorral', price: 1950 },
    8: { name: 'Restaurador Molecular', price: 3500 },
};

document.addEventListener('DOMContentLoaded', () => {

    // 2. FUNCIONALIDAD DEL BOTÓN DE WHATSAPP FLOTANTE
    const whatsappButton = document.querySelector('.whatsapp-button');

    if (whatsappButton) {
        whatsappButton.style.opacity = '0';
        whatsappButton.style.visibility = 'hidden';
        whatsappButton.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';

        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) { 
                whatsappButton.style.opacity = '1';
                whatsappButton.style.visibility = 'visible';
            } else {
                whatsappButton.style.opacity = '0';
                whatsappButton.style.visibility = 'hidden';
            }
        });

        // 🚨 VINCULACIÓN FINAL CON WHATSAPP
        whatsappButton.addEventListener('click', generateWhatsappOrder);
    }

});


// ======================================================================
// 4. FUNCIONES DE MANEJO DEL CARRITO
// ======================================================================

/**
 * Agregar un producto al carrito y actualiza el contador.
 * Esta función es llamada desde el botón en productos.html
 */
function addToCart(productId) {
    const product = productCatalog[productId];
    
    if (product) {
        // Busca si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1, name: product.name, price: product.price });
        }
        
        // Muestra una notificación (usando un alert simple como simulación)
        alert(`🛒 ¡${product.name} (x${existingItem ? existingItem.quantity : 1}) añadido al carrito!`);
        
        // Llama a la función para actualizar el botón de WhatsApp
        updateWhatsappButtonText();
    }
}

/**
 * Actualiza el texto del botón de WhatsApp para indicar los ítems en el carrito.
 */
function updateWhatsappButtonText() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    // Si no hay ítems, usamos la configuración visual del CSS
    if (totalItems > 0 && whatsappButton) {
        // Podrías añadir un elemento span para mostrar el contador
        whatsappButton.innerHTML = `<img src="img/logowhatssap.jpg" alt="WhatsApp"> (${totalItems})`;
    } else if (whatsappButton) {
        whatsappButton.innerHTML = `<img src="img/logowhatssap.jpg" alt="WhatsApp">`;
    }
}


// ======================================================================
// 5. VINCULACIÓN CON WHATSAPP
// ======================================================================

/**
 * Genera el mensaje de WhatsApp con el detalle del pedido.
 */
function generateWhatsappOrder(e) {
    // Evita el comportamiento por defecto del enlace si el carrito está vacío
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de realizar el pedido.");
        e.preventDefault(); // Detiene la navegación si no hay nada en el carrito
        return;
    }

    e.preventDefault(); // Detiene la navegación por defecto

    let message = "¡Hola Aythana! Quiero hacer un pedido con los siguientes productos:\n\n";
    let totalOrder = 0;

    cart.forEach((item, index) => {
        const subtotal = item.quantity * item.price;
        totalOrder += subtotal;

        // Formatea la línea del producto:
        message += `${index + 1}. ${item.name} (${item.quantity} und.) - Subtotal: $${subtotal.toLocaleString('es-ES')}\n`;
    });

    message += `\n*TOTAL ESTIMADO DEL PEDIDO: $${totalOrder.toLocaleString('es-ES')}*`;
    message += "\n\nPor favor, confírmame el stock, los métodos de pago y el costo de envío. ¡Gracias!";

    // Codifica el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "5493804325913"; // NÚMERO TELEFONICO
    
    // Construye la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Abre el enlace en una nueva pestaña
    window.open(whatsappUrl, '_blank');
    
    // Opcional: Limpiar el carrito después de generar el pedido
    // cart = [];
    // updateWhatsappButtonText();
}