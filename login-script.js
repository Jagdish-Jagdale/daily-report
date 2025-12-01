document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    const chatInput = document.querySelector('.chat-field');
    const sendBtn = document.querySelector('.send-btn');
    
    // Form submission handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    async function handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Add loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        // Simulate authentication delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simple validation (replace with actual authentication)
        if (email && password) {
            // Success animation
            loginBtn.style.background = 'linear-gradient(135deg, #50c878 0%, #228B22 100%)';
            loginBtn.innerHTML = '<span class="btn-text">Success! Redirecting...</span>';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Error state
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            showError('Please fill in all fields');
        }
    }
    
    // Password toggle functionality
    window.togglePassword = function() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.querySelector('.toggle-password');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = '👁️';
        }
    };
    
    // Show signup form
    window.showSignup = function() {
        const card = document.querySelector('.login-card');
        card.style.transform = 'rotateY(180deg)';
        
        setTimeout(() => {
            showNotification('Signup feature coming soon!', 'info');
            card.style.transform = 'rotateY(0deg)';
        }, 300);
    };
    
    // Error display function
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="
                background: rgba(255, 50, 50, 0.1);
                border: 1px solid rgba(255, 50, 50, 0.3);
                color: #ff6b6b;
                padding: 12px 16px;
                border-radius: 8px;
                margin-bottom: 20px;
                animation: shakeError 0.5s ease-out;
                backdrop-filter: blur(10px);
            ">
                ❌ ${message}
            </div>
        `;
        
        const form = document.querySelector('.login-form');
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // Chat functionality
    sendBtn.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleChatSubmit();
        }
    });
    
    function handleChatSubmit() {
        const message = chatInput.value.trim();
        if (message) {
            sendBtn.style.transform = 'scale(1.2) rotate(15deg)';
            setTimeout(() => {
                sendBtn.style.transform = '';
            }, 300);
            
            setTimeout(() => {
                provideChatResponse(message);
            }, 1000);
            
            chatInput.value = '';
        }
    }
    
    function provideChatResponse(userMessage) {
        const responses = {
            'forgot': "Click 'Forgot Password?' link to reset your password via email.",
            'help': "I can help with login issues, password resets, or account setup.",
            'signup': "Currently, new account creation is handled by your administrator.",
            'error': "Try clearing your browser cache or checking your internet connection.",
            'default': "I'm here to help with any login or account related questions!"
        };
        
        let response = responses.default;
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('forgot') || lowerMessage.includes('password')) {
            response = responses.forgot;
        } else if (lowerMessage.includes('help')) {
            response = responses.help;
        } else if (lowerMessage.includes('signup') || lowerMessage.includes('register')) {
            response = responses.signup;
        } else if (lowerMessage.includes('error') || lowerMessage.includes('problem')) {
            response = responses.error;
        }
        
        showNotification(response, 'chat');
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'chat' ? 'rgba(20, 20, 20, 0.95)' : 
                        type === 'error' ? 'rgba(255, 50, 50, 0.1)' : 
                        'rgba(50, 120, 255, 0.1)';
        const borderColor = type === 'chat' ? 'rgba(120, 50, 255, 0.3)' : 
                           type === 'error' ? 'rgba(255, 50, 50, 0.3)' : 
                           'rgba(50, 120, 255, 0.3)';
        
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${bgColor};
                color: #fff;
                padding: 15px 20px;
                border-radius: 12px;
                border: 1px solid ${borderColor};
                backdrop-filter: blur(10px);
                z-index: 1000;
                animation: slideInRight 0.5s ease-out;
                max-width: 350px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <div style="font-weight: 600; margin-bottom: 5px;">
                    ${type === 'chat' ? '🤖 Assistant:' : type === 'error' ? '❌ Error:' : 'ℹ️ Info:'}
                </div>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }
    
    // Input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Social login handlers
    document.querySelector('.google-btn').addEventListener('click', function() {
        showNotification('Google login integration coming soon!', 'info');
    });
    
    document.querySelector('.microsoft-btn').addEventListener('click', function() {
        showNotification('Microsoft login integration coming soon!', 'info');
    });
    
    // Add dynamic styles for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shakeError {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Demo credentials helper
    setTimeout(() => {
        showNotification('Demo: Use any email and password to login', 'info');
    }, 3000);
});
