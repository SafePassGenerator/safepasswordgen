# Safe Password Generator

Cryptographically secure password generator using Web Crypto API.

## Features
- Client-side generation (nothing sent to servers)
- Uses `crypto.getRandomValues()` (CSPRNG)
- No tracking, no analytics, no data collection
- Customizable length and character sets

## Security
- All generation happens in your browser
- Source code auditable (you're reading it)
- No external dependencies
- No cookies, no localStorage

## Technical Details
Uses `window.crypto.getRandomValues()` which provides 
cryptographically secure random values via the browser's 
native CSPRNG implementation.

## Privacy
We don't collect, store, or transmit any data. Ever.
See [Privacy Policy](https://safepasswordgenerator.net/privacy)

## License
MIT License - feel free to learn from or fork this project

## Website
https://safepasswordgenerator.net

## Security Verification

You can verify our security claims:

1. Open DevTools (F12) → Network tab
2. Generate passwords
3. Observe: Zero network requests

No data leaves your browser. Period.

## How It Works

1. User selects options (length, character sets)
2. Calculate character pool size
3. Generate random bytes using crypto.getRandomValues()
4. Map bytes to characters from pool
5. Display password (exists only in browser memory)
6. User copies password
7. Password cleared on page refresh

## Why This Generator?

| Feature | This Tool | Typical Online Generator |
|---------|-----------|-------------------------|
| Open Source | ✅ | ❌ |
| Client-side | ✅ | ❌ (many send to server) |
| No tracking | ✅ | ❌ |
| CSPRNG | ✅ | ⚠️ (Math.random often) |
| Auditable | ✅ | ❌ |

## Installation

1. Clone this repository
2. Open `index.html` in your browser
3. That's it! No build process, no dependencies

## Usage

1. Adjust password length using the slider
2. Select character sets (uppercase, lowercase, numbers, symbols)
3. Click "Generate Password"
4. Copy the generated password to your clipboard

## Development

This is a pure HTML/CSS/JavaScript project with no build process required.

### File Structure
```
safepasswordgenerator/
├── README.md
├── index.html
├── styles.css
├── generator.js
└── LICENSE
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security Considerations

- Always use HTTPS when hosting
- Consider adding Content Security Policy headers
- Regularly audit the code for security issues
- Never modify the random number generation logic

## Browser Support

- Chrome 11+
- Firefox 21+
- Safari 5.1+
- Edge 12+

Requires Web Crypto API support.

## FAQ

**Q: Is this really secure?**
A: Yes, it uses the same cryptographic functions trusted by banks and government agencies.

**Q: Can I see the source code?**
A: Yes, you're looking at it right now. Everything is open source.

**Q: Does this work offline?**
A: Yes, once loaded, it works completely offline.

**Q: Can I host this myself?**
A: Absolutely! Just download the files and host them anywhere.

## Changelog

### v1.0.0
- Initial release
- Web Crypto API integration
- Customizable character sets
- Dark mode support
- Responsive design

## Support

For questions or issues, please open an issue on GitHub or visit our website.

---

**Remember**: The best password is one that's long, unique, and stored in a password manager. This tool helps you create them securely.
