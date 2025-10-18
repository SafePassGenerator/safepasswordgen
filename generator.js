// Password Generator Logic
const lengthSlider = document.getElementById('length-slider');
const lengthDisplay = document.getElementById('length-display');
const generatedPassword = document.getElementById('generated-password');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');

// Character sets
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Update length display
lengthSlider.addEventListener('input', function() {
    lengthDisplay.textContent = this.value;
});

// Generate password
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const selectedSets = [];
    
    // Get selected character sets
    if (document.getElementById('uppercase').checked) selectedSets.push(charSets.uppercase);
    if (document.getElementById('lowercase').checked) selectedSets.push(charSets.lowercase);
    if (document.getElementById('numbers').checked) selectedSets.push(charSets.numbers);
    if (document.getElementById('symbols').checked) selectedSets.push(charSets.symbols);
    
    if (selectedSets.length === 0) {
        generatedPassword.textContent = 'Please select at least one character set';
        return;
    }
    
    // Combine all selected character sets
    const allChars = selectedSets.join('');
    
    // Generate password using crypto.getRandomValues()
    const passwordArray = new Uint8Array(length);
    crypto.getRandomValues(passwordArray);
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += allChars[passwordArray[i] % allChars.length];
    }
    
    generatedPassword.textContent = password;
}

// Copy to clipboard
function copyToClipboard() {
    const password = generatedPassword.textContent;
    if (password && password.trim() !== '') {
        navigator.clipboard.writeText(password).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy to Clipboard';
            }, 2000);
        });
    }
}

// Clear password
function clearPassword() {
    generatedPassword.textContent = '';
}

// Event listeners
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);
clearBtn.addEventListener('click', clearPassword);

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);
if (currentTheme === 'dark') {
    themeIcon.textContent = '☀️';
} else {
    themeIcon.textContent = '🌙';
}

themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});
