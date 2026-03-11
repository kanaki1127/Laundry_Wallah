// EmailJS Configuration - REPLACE WITH YOUR ACTUAL CREDENTIALS
const PUBLIC_KEY = "jwh-qwr5cU5Sq7iT1"; // Get from EmailJS dashboard
const SERVICE_ID = "service_h3250b4"; // From Email Services
const TEMPLATE_ID = "template_2d6m20f"; // From your template

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

// Cart array to store selected items
let cart = [];
let total = 0;

// Function to scroll to services section
function scrollToServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

// Function to add item to cart
function addToCart(name, price) {
    cart.push({
        name: name,
        price: price
    });
    total = total + price;
    displayCart();
    showMessage(name + ' added to cart!', 'green');
}

// Function to remove item from cart
function removeFromCart(name, price) {
    for(let i = 0; i < cart.length; i++) {
        if(cart[i].name === name && cart[i].price === price) {
            cart.splice(i, 1);
            total = total - price;
            break;
        }
    }
    displayCart();
    showMessage(name + ' removed from cart!', 'orange');
}

// Function to display cart items
function displayCart() {
    let cartDiv = document.getElementById('cart-items');
    let totalSpan = document.getElementById('total-amount');
    
    cartDiv.innerHTML = '';
    
    if(cart.length === 0) {
        cartDiv.innerHTML = '<p class="empty-cart">Cart is empty. Add some services!</p>';
        totalSpan.innerText = '0';
        return;
    }
    
    for(let i = 0; i < cart.length; i++) {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = '<span>' + (i+1) + '. ' + cart[i].name + '</span> <span>₹' + cart[i].price + '</span>';
        cartDiv.appendChild(itemDiv);
    }
    
    totalSpan.innerText = total;
}

// Function to show temporary message
function showMessage(msg, color) {
    let messageDiv = document.getElementById('booking-message');
    messageDiv.innerHTML = msg;
    messageDiv.style.color = color;
    
    setTimeout(function() {
        messageDiv.innerHTML = '';
    }, 3000);
}

// Format cart for email
function formatCartForEmail() {
    if(cart.length === 0) return 'No services selected';
    
    let result = '';
    for(let i = 0; i < cart.length; i++) {
        result = result + (i+1) + '. ' + cart[i].name + ' - ₹' + cart[i].price + '\n';
    }
    return result;
}

// Book now button functionality
document.getElementById('book-now').addEventListener('click', function() {
    // Get form values
    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let messageDiv = document.getElementById('booking-message');
    
    // Validation
    if(name === '') {
        messageDiv.innerHTML = '❌ Please enter your name';
        messageDiv.style.color = 'red';
        return;
    }
    
    if(email === '' || !email.includes('@') || !email.includes('.')) {
        messageDiv.innerHTML = '❌ Please enter a valid email';
        messageDiv.style.color = 'red';
        return;
    }
    
    if(phone === '' || phone.length !== 10 || isNaN(phone)) {
        messageDiv.innerHTML = '❌ Please enter a valid 10-digit phone number';
        messageDiv.style.color = 'red';
        return;
    }
    
    if(cart.length === 0) {
        messageDiv.innerHTML = '❌ Please add at least one service to cart';
        messageDiv.style.color = 'red';
        return;
    }
    
    // Get current date and time
    let now = new Date();
    let date = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
    let time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    let fullTime = date + ' ' + time;
    
    // Format services
    let servicesList = formatCartForEmail();
    
    // Email parameters - MUST match your template EXACTLY
    let templateParams = {
        name: name,
        email: email,
        phone: phone,
        services: servicesList,
        total: total,
        time: fullTime
    };
    
    // Log for debugging
    console.log('Sending email with:', templateParams);
    
    // Show sending message
    messageDiv.innerHTML = '⏳ Sending booking confirmation...';
    messageDiv.style.color = 'blue';
    
    // Send email via EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            messageDiv.innerHTML = '✅ Booking confirmed! Check your email.';
            messageDiv.style.color = 'green';
            
            // Clear cart and form
            cart = [];
            total = 0;
            displayCart();
            
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
        })
        .catch(function(error) {
            console.log('EmailJS error:', error);
            messageDiv.innerHTML = '❌ Error: ' + (error.text || 'Failed to send email');
            messageDiv.style.color = 'red';
        });
});

// Newsletter subscription
function subscribeNewsletter() {
    let name = document.getElementById('news-name').value.trim();
    let email = document.getElementById('news-email').value.trim();
    
    if(name === '' || email === '') {
        alert('Please enter both name and email');
        return;
    }
    
    if(!email.includes('@') || !email.includes('.')) {
        alert('Please enter valid email');
        return;
    }
    
    alert('✅ Thank you for subscribing, ' + name + '!');
    
    document.getElementById('news-name').value = '';
    document.getElementById('news-email').value = '';
}

// Initialize on page load
window.onload = function() {
    displayCart();
    console.log('Laundry App Ready!');
};