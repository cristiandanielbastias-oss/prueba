// =======================================================================
// Aythana Productos Capilares - Funcionalidades JS
// =======================================================================

// -----------------------------------------------------------------------
// 1. Lógica del Carrito, WhatsApp y Email (Simulación de Compra)
// -----------------------------------------------------------------------

// Datos de los productos (deben coincidir con productos.html para precios y nombres)
const productData = {
    1: { name: "Shampoo Nutritivo", price: 2500 },
    2: { name: "Acondicionador Reparador", price: 2300 },
    3: { name: "Mascarilla Hidratante", price: 3800 },
    4: { name: "Sérum Protector", price: 1950 },
    5: { name: "Alisado", price: 2750 },
    6: { name: "Restaurador de Puntas", price: 4650 },
    7: { name: "Acondicionador Loreal", price: 1950 },
    8: { name: "Restaurador Molecular", price: 3500 }
};

// Cargar carrito desde el almacenamiento local para persistencia
let cart = JSON.parse(localStorage.getItem('aythanaCart')) || [];

// Función para actualizar el contador visual del carrito (botón flotante)
function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        countElement.textContent = totalItems;
        // Muestra/Oculta el contador si hay productos
        countElement.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Funcionalidad de Añadir productos al carrito (con lógica real y feedback)
function addToCart(productId) {
    const product = productData[productId];
    if (!product) {
        console.error("Producto no encontrado:", productId);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, name: product.name, price: product.price, quantity: 1 });
    }

    // Guardar en el almacenamiento local
    localStorage.setItem('aythanaCart', JSON.stringify(cart));
    updateCartCount();
    
    // Feedback visual temporal
    const btn = event.target;
    // Asegurarse de que el event.target sea el botón, no solo el ícono dentro
    const buttonElement = btn.closest('button');
    
    if (buttonElement) {
        const originalContent = buttonElement.innerHTML;
        buttonElement.innerHTML = '¡Añadido!';
        buttonElement.classList.remove('btn-primary');
        buttonElement.classList.add('btn-success');
        
        setTimeout(() => {
            // Se restaura el contenido original usando el ícono de Bootstrap Icons
            buttonElement.innerHTML = originalContent; 
            buttonElement.classList.remove('btn-success');
            buttonElement.classList.add('btn-primary');
        }, 1500);
    }
}

// Función para generar el resumen del pedido (texto)
function generateOrderSummary() {
    if (cart.length === 0) {
        return { text: "Mi carrito está vacío.", total: 0 };
    }

    let summaryText = "¡Hola! Me gustaría hacer un pedido con los siguientes productos de Aythana:\n\n";
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        // Usar formato es-AR para precios
        summaryText += `${item.quantity} x ${item.name} ($${item.price.toLocaleString('es-AR')}) - Subtotal: $${subtotal.toLocaleString('es-AR')}\n`;
        total += subtotal;
    });

    summaryText += `\nTotal estimado: $${total.toLocaleString('es-AR')}`;
    summaryText += "\n\nPor favor, confirmen disponibilidad y el proceso de pago. Gracias.";

    return { text: summaryText, total: total };
}

// Función de Checkout (Finalizar Compra - Simulación)
function checkout() {
    if (cart.length === 0) {
        alert("El carrito está vacío. Por favor, añade algunos productos antes de finalizar la compra.");
        return;
    }

    const order = generateOrderSummary();
    const encodedText = encodeURIComponent(order.text);
    
    // Datos de contacto fijos del footer
    const phoneNumber = '549380325913'; 
    const emailAddress = 'cristiandanielbastias@yahoo.com.ar';
    const subject = encodeURIComponent("Pedido de Productos Aythana - Total: $" + order.total.toLocaleString('es-AR'));

    // Generar enlaces dinámicos para la simulación
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${encodedText}`;

    const message = `
        ¡Pedido Listo para Enviar!
        
        Resumen:
        ${order.text.replace(/¡Hola! Me gustaría hacer un pedido con los siguientes productos de Aythana:\n\n/, '')}
        
        Este es el paso final de la SIMULACIÓN. ¿Cómo desea enviar su pedido?
        
        1. Click en ACEPTAR para abrir WhatsApp.
        2. Click en CANCELAR para abrir su cliente de correo electrónico (Mail).
    `;

    if (confirm(message)) {
        // Opción 1: WhatsApp
        window.open(whatsappLink, '_blank');
        clearCartAfterCheckout();
    } else {
        // Opción 2: Correo Electrónico
        window.open(mailtoLink, '_blank');
        clearCartAfterCheckout();
    }
}

function clearCartAfterCheckout() {
    if (confirm("¿Desea vaciar el carrito después de enviar el pedido (simulado)?")) {
        cart = [];
        localStorage.removeItem('aythanaCart');
        updateCartCount();
    }
}


// -----------------------------------------------------------------------
// 2. Funcionalidad de Scroll to Top y Carrusel (Lógica existente)
// -----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', (event) => {
    // Inicializar el contador del carrito al cargar la página
    updateCartCount();
    
    // === Scroll to Top Logic ===
    // Crea el botón dinámicamente
    const btn = document.createElement('button');
    btn.setAttribute('id', 'scrollToTopBtn');
    btn.setAttribute('aria-label', 'Volver al inicio');
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>'; 
    document.body.appendChild(btn);

    // Muestra u oculta el botón basado en el desplazamiento
    window.onscroll = function() {
        // Muestra el botón si el scroll supera los 100px
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    };

    // Al hacer clic, desplaza suavemente al inicio de la página
    btn.onclick = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // === Inicialización del Carrusel (Destacados en index.html) ===
    // Requiere que el ID 'productosDestacadosCarousel' exista en index.html
    const destacadosCarousel = document.getElementById('productosDestacadosCarousel');
    if (destacadosCarousel) {
        // Inicializa el Carrusel de Bootstrap con intervalo automático
        new bootstrap.Carousel(destacadosCarousel, {
            interval: 5000 // Deslizamiento automático cada 5 segundos
        });
    }
});