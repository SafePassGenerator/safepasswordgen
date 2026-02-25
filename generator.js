/**
 * Safe Password Generator - Client-side JavaScript
 * Uses Web Crypto API for secure random number generation
 * Never transmits or stores generated passwords
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const generator = new PasswordGenerator();
        generator.init();
    });
    
    /**
     * Password Generator Class
     */
    class PasswordGenerator {
        constructor() {
            this.elements = {};
            this.charSets = {
                lowercase: 'abcdefghijklmnopqrstuvwxyz',
                uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                numbers: '0123456789',
                symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
            };
            this.similarChars = 'il1Lo0O';
            this.minLength = 8;
            this.maxLength = 128;
            this.defaultLength = 16;
        }
        
        /**
         * Initialize the generator
         */
        init() {
            this.cacheElements();
            this.bindEvents();
            this.setDefaults();
            this.generatePassword(); // Generate initial password
        }
        
        /**
         * Cache DOM elements
         */
        cacheElements() {
            this.elements = {
                lengthSlider: document.getElementById('spg-length-slider'),
                lengthDisplay: document.getElementById('spg-length-display'),
                includeUppercase: document.getElementById('spg-include-uppercase'),
                includeLowercase: document.getElementById('spg-include-lowercase'),
                includeNumbers: document.getElementById('spg-include-numbers'),
                includeSymbols: document.getElementById('spg-include-symbols'),
                excludeSimilar: document.getElementById('spg-exclude-similar'),
                passwordOutput: document.getElementById('spg-password-output'),
                generateButton: document.getElementById('spg-generate-button'),
                copyButton: document.getElementById('spg-copy-button'),
                clearButton: document.getElementById('spg-clear-button'),
                strengthIndicator: document.getElementById('spg-strength-indicator'),
                strengthBar: document.getElementById('spg-strength-bar'),
                liveRegion: document.getElementById('spg-live-region')
            };
        }
        
        /**
         * Bind event listeners
         */
        bindEvents() {
            // Length slider
            if (this.elements.lengthSlider) {
                this.elements.lengthSlider.addEventListener('input', (e) => {
                    this.updateLengthDisplay(e.target.value);
                });
            }
            
            // Character set checkboxes
            const checkboxes = [
                this.elements.includeUppercase,
                this.elements.includeLowercase,
                this.elements.includeNumbers,
                this.elements.includeSymbols,
                this.elements.excludeSimilar
            ];
            
            checkboxes.forEach(checkbox => {
                if (checkbox) {
                    checkbox.addEventListener('change', () => {
                        this.validateCharacterSets();
                    });
                }
            });
            
            // Buttons
            if (this.elements.generateButton) {
                this.elements.generateButton.addEventListener('click', () => {
                    this.generatePassword();
                });
            }
            
            if (this.elements.copyButton) {
                this.elements.copyButton.addEventListener('click', () => {
                    this.copyToClipboard();
                });
            }
            
            if (this.elements.clearButton) {
                this.elements.clearButton.addEventListener('click', () => {
                    this.clearPassword();
                });
            }
            
            // Keyboard navigation
            if (this.elements.passwordOutput) {
                this.elements.passwordOutput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.generatePassword();
                    }
                });
            }
        }
        
        /**
         * Set default values
         */
        setDefaults() {
            if (this.elements.lengthSlider) {
                this.elements.lengthSlider.value = this.defaultLength;
                this.elements.lengthSlider.min = this.minLength;
                this.elements.lengthSlider.max = this.maxLength;
                this.updateLengthDisplay(this.defaultLength);
            }
            
            // Set default character sets
            if (this.elements.includeUppercase) this.elements.includeUppercase.checked = true;
            if (this.elements.includeLowercase) this.elements.includeLowercase.checked = true;
            if (this.elements.includeNumbers) this.elements.includeNumbers.checked = true;
            if (this.elements.includeSymbols) this.elements.includeSymbols.checked = false;
            if (this.elements.excludeSimilar) this.elements.excludeSimilar.checked = true;
        }
        
        /**
         * Update length display
         */
        updateLengthDisplay(length) {
            if (this.elements.lengthDisplay) {
                this.elements.lengthDisplay.textContent = length;
            }
        }
        
        /**
         * Validate character sets
         */
        validateCharacterSets() {
            const hasCharset = this.elements.includeUppercase?.checked ||
                              this.elements.includeLowercase?.checked ||
                              this.elements.includeNumbers?.checked ||
                              this.elements.includeSymbols?.checked;
            
            if (this.elements.generateButton) {
                this.elements.generateButton.disabled = !hasCharset;
            }
            
            if (!hasCharset && this.elements.liveRegion) {
                this.announceToScreenReader('Please select at least one character set');
            }
        }
        
        /**
         * Generate secure password using Web Crypto API
         */
        generatePassword() {
            try {
                // Validate character sets
                this.validateCharacterSets();
                
                const length = parseInt(this.elements.lengthSlider?.value || this.defaultLength, 10);
                const charset = this.buildCharacterSet();
                
                if (!charset) {
                    this.showError('Please select at least one character set');
                    return;
                }
                
                // Generate password using Web Crypto API
                const password = this.generateSecurePassword(charset, length);
                
                // Ensure password meets requirements
                const validPassword = this.ensurePasswordRequirements(password, charset);
                
                // Display password
                if (this.elements.passwordOutput) {
                    this.elements.passwordOutput.value = validPassword;
                }
                
                // Update strength indicator
                this.updateStrengthIndicator(validPassword);
                
                // Announce to screen readers
                this.announceToScreenReader('New password generated');
                
            } catch (error) {
                console.error('Password generation error:', error);
                this.showError('Error generating password. Please try again.');
            }
        }
        
        /**
         * Build character set based on selected options
         */
        buildCharacterSet() {
            let charset = '';
            
            if (this.elements.includeLowercase?.checked) {
                charset += this.charSets.lowercase;
            }
            if (this.elements.includeUppercase?.checked) {
                charset += this.charSets.uppercase;
            }
            if (this.elements.includeNumbers?.checked) {
                charset += this.charSets.numbers;
            }
            if (this.elements.includeSymbols?.checked) {
                charset += this.charSets.symbols;
            }
            
            // Remove similar characters if requested
            if (this.elements.excludeSimilar?.checked) {
                charset = charset.split('').filter(char => 
                    !this.similarChars.includes(char)
                ).join('');
            }
            
            return charset;
        }
        
        /**
         * Generate secure password using Web Crypto API
         */
        generateSecurePassword(charset, length) {
            const charsetArray = charset.split('');
            const password = [];
            
            // Use Web Crypto API for secure random values
            const randomValues = new Uint32Array(length);
            window.crypto.getRandomValues(randomValues);
            
            for (let i = 0; i < length; i++) {
                const randomIndex = randomValues[i] % charsetArray.length;
                password.push(charsetArray[randomIndex]);
            }
            
            return password.join('');
        }
        
        /**
         * Ensure password meets requirements (at least one from each selected set)
         */
        ensurePasswordRequirements(password, charset) {
            const requirements = [];
            
            if (this.elements.includeLowercase?.checked) {
                requirements.push(/[a-z]/);
            }
            if (this.elements.includeUppercase?.checked) {
                requirements.push(/[A-Z]/);
            }
            if (this.elements.includeNumbers?.checked) {
                requirements.push(/[0-9]/);
            }
            if (this.elements.includeSymbols?.checked) {
                requirements.push(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
            }
            
            // Check if password meets all requirements
            const meetsRequirements = requirements.every(regex => regex.test(password));
            
            if (meetsRequirements) {
                return password;
            }
            
            // If requirements not met, regenerate with constraints
            return this.generateConstrainedPassword(charset, password.length, requirements);
        }
        
        /**
         * Generate password with specific constraints
         */
        generateConstrainedPassword(charset, length, requirements) {
            let attempts = 0;
            const maxAttempts = 100;
            
            while (attempts < maxAttempts) {
                const password = this.generateSecurePassword(charset, length);
                const meetsRequirements = requirements.every(regex => regex.test(password));
                
                if (meetsRequirements) {
                    return password;
                }
                
                attempts++;
            }
            
            // Fallback: force at least one character from each required set
            return this.forcePasswordRequirements(charset, length, requirements);
        }
        
        /**
         * Force password to meet requirements
         */
        forcePasswordRequirements(charset, length, requirements) {
            const password = this.generateSecurePassword(charset, length - requirements.length);
            const requiredChars = [];
            
            // Add required characters
            if (this.elements.includeLowercase?.checked) {
                requiredChars.push(this.getRandomChar(this.charSets.lowercase));
            }
            if (this.elements.includeUppercase?.checked) {
                requiredChars.push(this.getRandomChar(this.charSets.uppercase));
            }
            if (this.elements.includeNumbers?.checked) {
                requiredChars.push(this.getRandomChar(this.charSets.numbers));
            }
            if (this.elements.includeSymbols?.checked) {
                requiredChars.push(this.getRandomChar(this.charSets.symbols));
            }
            
            // Shuffle and combine
            const allChars = password.split('').concat(requiredChars);
            return this.shuffleArray(allChars).join('');
        }
        
        /**
         * Get random character from string
         */
        getRandomChar(str) {
            const randomValues = new Uint32Array(1);
            window.crypto.getRandomValues(randomValues);
            return str[randomValues[0] % str.length];
        }
        
        /**
         * Shuffle array using Fisher-Yates algorithm with crypto randomness
         */
        shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const randomValues = new Uint32Array(1);
                window.crypto.getRandomValues(randomValues);
                const j = randomValues[0] % (i + 1);
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
        
        /**
         * Update password strength indicator
         */
        updateStrengthIndicator(password) {
            const strength = this.calculatePasswordStrength(password);
            
            if (this.elements.strengthIndicator) {
                this.elements.strengthIndicator.textContent = `Strength: ${strength.label}`;
                this.elements.strengthIndicator.className = `spg-strength-indicator spg-strength-${strength.level}`;
            }
            
            if (this.elements.strengthBar) {
                this.elements.strengthBar.style.width = `${strength.score}%`;
                this.elements.strengthBar.className = `spg-strength-bar spg-strength-${strength.level}`;
            }
        }
        
        /**
         * Calculate password strength
         */
        calculatePasswordStrength(password) {
            let score = 0;
            let feedback = [];
            
            // Length scoring
            if (password.length >= 8) score += 20;
            if (password.length >= 12) score += 20;
            if (password.length >= 16) score += 20;
            if (password.length >= 20) score += 20;
            
            // Character variety scoring
            if (/[a-z]/.test(password)) score += 10;
            if (/[A-Z]/.test(password)) score += 10;
            if (/[0-9]/.test(password)) score += 10;
            if (/[^a-zA-Z0-9]/.test(password)) score += 10;
            
            // Bonus for length
            if (password.length > 20) score += 10;
            
            // Determine strength level
            let level, label;
            if (score < 30) {
                level = 'weak';
                label = 'Weak';
            } else if (score < 60) {
                level = 'medium';
                label = 'Medium';
            } else if (score < 80) {
                level = 'strong';
                label = 'Strong';
            } else {
                level = 'very-strong';
                label = 'Very Strong';
            }
            
            return { score: Math.min(score, 100), level, label };
        }
        
        /**
         * Copy password to clipboard
         */
        async copyToClipboard() {
            if (!this.elements.passwordOutput?.value) {
                this.showError('No password to copy');
                return;
            }
            
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(this.elements.passwordOutput.value);
                } else {
                    // Fallback for older browsers
                    this.elements.passwordOutput.select();
                    document.execCommand('copy');
                }
                
                this.showSuccess('Password copied to clipboard!');
                this.announceToScreenReader('Password copied to clipboard');
                
            } catch (error) {
                console.error('Copy failed:', error);
                this.showError('Failed to copy password. Please select and copy manually.');
            }
        }
        
        /**
         * Clear password
         */
        clearPassword() {
            if (this.elements.passwordOutput) {
                this.elements.passwordOutput.value = '';
            }
            
            if (this.elements.strengthIndicator) {
                this.elements.strengthIndicator.textContent = 'Strength: -';
                this.elements.strengthIndicator.className = 'spg-strength-indicator';
            }
            
            if (this.elements.strengthBar) {
                this.elements.strengthBar.style.width = '0%';
                this.elements.strengthBar.className = 'spg-strength-bar';
            }
            
            this.announceToScreenReader('Password cleared');
        }
        
        /**
         * Show success message
         */
        showSuccess(message) {
            if (this.elements.copyButton) {
                const originalText = this.elements.copyButton.textContent;
                this.elements.copyButton.textContent = 'Copied!';
                this.elements.copyButton.classList.add('spg-success');
                
                setTimeout(() => {
                    this.elements.copyButton.textContent = originalText;
                    this.elements.copyButton.classList.remove('spg-success');
                }, 2000);
            }
        }
        
        /**
         * Show error message
         */
        showError(message) {
            console.error('Password Generator Error:', message);
            this.announceToScreenReader(message);
        }
        
        /**
         * Announce message to screen readers
         */
        announceToScreenReader(message) {
            if (this.elements.liveRegion) {
                this.elements.liveRegion.textContent = message;
                setTimeout(() => {
                    this.elements.liveRegion.textContent = '';
                }, 1000);
            }
        }
    }
    
})();
