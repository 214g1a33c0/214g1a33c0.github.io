// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animate sections on scroll
const animateSections = () => {
    const sections = document.querySelectorAll('.animate-on-scroll');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('animate');
        }
    });
}

// Run on scroll
window.addEventListener('scroll', animateSections);

// Variables for form elements
let contactForm;
let submitBtn;
let formStatus;
let EMAIL_CONFIG;

// We'll use a single DOMContentLoaded event for all initialization
// Run on load - moved the animateSections call here
document.addEventListener('DOMContentLoaded', function() {
    // First run animations
    animateSections();
      // Get EmailJS config from window object (set inline in HTML) or use hardcoded values as fallback
    EMAIL_CONFIG = window.emailjsConfig 
    
    // Initialize EmailJS with your user ID
    emailjs.init(EMAIL_CONFIG.USER_ID);
    console.log('EmailJS initialized with user ID:', EMAIL_CONFIG.USER_ID);
    
    // Get form elements
    contactForm = document.getElementById('contactForm');
    submitBtn = document.getElementById('submitBtn');
    formStatus = document.getElementById('form-status');

    // Set up form submission event
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            // Validate form fields
            if (!nameInput.value.trim()) {
                showValidationMessage(nameInput, 'Please enter your name');
                return;
            }
            
            if (!emailInput.value.trim()) {
                showValidationMessage(emailInput, 'Please enter your email address');
                return;
            }
            
            // Basic email validation
            if (!isValidEmail(emailInput.value)) {
                showValidationMessage(emailInput, 'Please enter a valid email address');
                return;
            }
            
            if (!subjectInput.value.trim()) {
                showValidationMessage(subjectInput, 'Please enter a subject');
                return;
            }
            
            if (!messageInput.value.trim()) {
                showValidationMessage(messageInput, 'Please enter your message');
                return;
            }
              // Disable the submit button and show sending state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Prepare template parameters
            const templateParams = {
                from_name: nameInput.value,
                from_email: emailInput.value,
                subject: subjectInput.value,
                message: messageInput.value
            };
              console.log('Sending email with params:', templateParams);
            console.log('Using config:', EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID);
            
            // Add a debugger statement - uncomment when using dev tools
            // debugger;
              // Make sure EmailJS is available
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS is not defined. Make sure the library is loaded.');
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Email service not available. Please try again later.';
                formStatus.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                return;
            }
            
            // Re-initialize EmailJS with the User ID to ensure it's correctly set
            emailjs.init(EMAIL_CONFIG.USER_ID);
            
            emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, templateParams)
                .then(function(response) {
                    console.log('Email sent successfully!', response.status, response.text);
                    
                    // Show success message
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Your message has been sent successfully!';
                    formStatus.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                })
                .catch(function(error) {
                    console.error('Failed to send email:', error);
                    
                    // Show error message
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Failed to send message. Please try again later.';
                    formStatus.style.display = 'block';
                      // Reset button
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                });
        });
    }
});

// Function to validate email format
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Function to show validation message
function showValidationMessage(inputElement, message) {
    // Remove any existing validation message
    const existingMessage = inputElement.parentNode.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and add new validation message
    const validationMessage = document.createElement('div');
    validationMessage.className = 'validation-message';
    validationMessage.textContent = message;
    
    // Highlight the input field
    inputElement.classList.add('invalid');
    
    // Insert message after the input
    inputElement.parentNode.insertBefore(validationMessage, inputElement.nextSibling);
    
    // Remove message when user starts typing
    inputElement.addEventListener('input', function() {
        validationMessage.remove();
        inputElement.classList.remove('invalid');
    }, { once: true });
}

// Cursor effects - star-like transition when moving
document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.85) { // Only create stars occasionally to avoid overloading
        const star = document.createElement('div');
        star.className = 'cursor-star';
        star.style.left = e.pageX + 'px';
        star.style.top = e.pageY + 'px';
        document.body.appendChild(star);
        
        // Random color variations for stars
        const colors = ['#29a8ff', '#66c2ff', '#0077cc', '#004d99'];
        star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random size variations
        const size = Math.random() * 5 + 3;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Remove the star element after animation completes
        setTimeout(() => {
            star.remove();
        }, 1000);
    }
});

// Circle fade transition on click
document.addEventListener('click', function(e) {
    const circle = document.createElement('div');
    circle.className = 'cursor-circle';
    circle.style.left = e.pageX + 'px';
    circle.style.top = e.pageY + 'px';
    document.body.appendChild(circle);
      // Remove the circle element after animation completes
    setTimeout(() => {
        circle.remove();
    }, 1000);
});

// Fallback direct send function
function sendContactForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submitBtn');
    
    // Basic validation
    if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fill out all fields';
        formStatus.style.display = 'block';
        return;
    }
    
    // Disable the button during sending
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Check if window.emailjsConfig exists, if not use updated credentials
    const config = window.emailjsConfig || {
        USER_ID: "jSDXcMBifNfEc5l5x",
        SERVICE_ID: "service_2vqmb2k",
        TEMPLATE_ID: "template_s6ibv8o"
    };
    
    // Prepare template parameters
    const templateParams = {
        from_name: nameInput.value,
        from_email: emailInput.value,
        subject: subjectInput.value,
        message: messageInput.value
    };
    
    console.log('Trying to send email with updated credentials:', config);
    
    // Make sure EmailJS is available
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not available');
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Email service not available. Please try again later.';
        formStatus.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        return;
    }
    
    // Re-initialize EmailJS with User ID to ensure it's properly set
    emailjs.init(config.USER_ID);
    
    // Send email
    emailjs.send(
        config.SERVICE_ID, 
        config.TEMPLATE_ID, 
        templateParams
    )
    .then(function(response) {
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Your message has been sent successfully!';
        formStatus.style.display = 'block';
        document.getElementById('contactForm').reset();
        submitBtn.textContent = 'Send Message';
    })
    .catch(function(error) {
        console.error('EmailJS Error:', error);
        formStatus.className = 'form-status error';
        let errorMessage = 'Failed to send message';
        
        if (error && error.text) {
            errorMessage += ': ' + error.text;
            
            // Special handling for common errors
            if (error.text.includes('not found')) {
                errorMessage += '. Please verify your EmailJS account settings.';
            }
        }
        
        formStatus.textContent = errorMessage;
        formStatus.style.display = 'block';
        submitBtn.textContent = 'Send Message';
    })
    .finally(function() {
        submitBtn.disabled = false;
    });
}
