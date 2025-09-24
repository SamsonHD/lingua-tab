# LinguaTab - Daily Word Learning Chrome Extension

[![Version](https://img.shields.io/badge/version-1.0.6-blue.svg)](https://github.com/SamsonHD/lingua-tab)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow.svg)](https://chrome.google.com/webstore)

LinguaTab transforms your browser's new tab into a beautiful, educational experience. Every day, discover one carefully selected word from your chosen language, complete with English translation and example sentence, all presented on stunning animated WebGL shader backgrounds.

## ✨ Features

### 🌍 Multi-Language Support
- 🇪🇸 **Spanish** - Essential Spanish vocabulary
- 🇫🇷 **French** - Beautiful French expressions  
- 🇩🇪 **German** - Practical German words
- 🇮🇹 **Italian** - Elegant Italian phrases
- 🇯🇵 **Japanese** - Japanese with optional furigana support
- 🇺🇦 **Ukrainian** - Ukrainian vocabulary
- 🇵🇹 **Portuguese** - Portuguese language learning

### 🎨 Visual Experience
- **Stunning WebGL Shaders** - Multiple animated background effects
- **Real-time Clock** - Current time with contextual greetings
- **Dark Mode Optimized** - Easy on the eyes, perfect for any time of day
- **Responsive Design** - Works beautifully on any screen size
- **Accessibility Features** - Animation controls and high contrast options

### 📚 Learning Features
- **Daily Word Discovery** - One new word every day, never overwhelming
- **Saved Words System** - Save and manage your favorite words
- **Audio Pronunciation** - Text-to-speech for proper pronunciation
- **Example Sentences** - See words used in context
- **Progress Tracking** - Export/import your saved vocabulary
- **Smart Filtering** - Search and filter your saved words by language

### ⚙️ Customization
- **Language Selection** - Easy switching between supported languages
- **Shader Themes** - Choose from multiple visual backgrounds
- **Animation Controls** - Pause or hide animations for accessibility
- **Settings Sync** - Preferences sync across all your Chrome devices

## 🚀 Installation

### For Users (Chrome Web Store)
*Coming soon to Chrome Web Store*

### For Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/SamsonHD/lingua-tab.git
   cd lingua-tab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build:extension
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

5. **Start developing**
   ```bash
   npm run dev
   ```

## 🛠️ Development

### Tech Stack
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **WebGL** - Hardware-accelerated shader rendering
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── SavedWordsModal.tsx
│   ├── LanguageSelector.tsx
│   └── ...
├── dictionaries/       # Language word databases
├── utils/             # Utility functions
├── styles/            # CSS and styling
└── App.tsx           # Main application component
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:extension` - Build Chrome extension
- `npm run preview` - Preview production build

## 🎯 Usage

1. **Install the extension** and open a new tab
2. **Choose your language** using the language selector
3. **Explore your daily word** - see the word, meaning, and example
4. **Click the word** to hear pronunciation
5. **Save interesting words** using the star button
6. **View saved words** using the bookmark icon
7. **Customize settings** via the settings button

### Keyboard Shortcuts
- `←` `→` - Navigate between words (if implemented)
- `R` - Refresh to get new daily word
- `Space` - Play pronunciation audio

## 📱 Chrome Extension Features

### Manifest V3 Compliance
- Fully compliant with Chrome's latest extension standards
- Secure content security policy
- Optimized performance and security

### Storage & Sync
- Uses Chrome's sync storage for preferences
- Settings sync across all devices
- Local word saving with export/import functionality

### Permissions
- `storage` - For saving user preferences and word lists
- No unnecessary permissions required

## 🔒 Privacy

LinguaTab is privacy-focused:
- **No tracking** - No analytics or user tracking
- **Local storage** - All data stored locally in Chrome
- **No external requests** - Works completely offline
- **Open source** - Full transparency in code

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📋 Roadmap

### Version 1.1 (Planned)
- [ ] Additional languages (Arabic, Chinese, Korean)
- [ ] More shader effects
- [ ] User feedback integration
- [ ] Performance optimizations

### Version 2.0 (Future)
- [ ] Expanded word databases (500+ words per language)
- [ ] Difficulty levels
- [ ] Usage statistics
- [ ] Custom word lists
- [ ] API integration for unlimited vocabulary

### Version 3.0 (Long-term)
- [ ] User progress tracking
- [ ] Gamification elements
- [ ] Social features
- [ ] Mobile companion app

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shader Effects**: Based on shaders from [Shadertoy](https://www.shadertoy.com/)
- **Icons**: Lucide React icon library
- **Fonts**: Inter font family for optimal readability
- **Community**: Thanks to all contributors and users

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/SamsonHD/lingua-tab/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SamsonHD/lingua-tab/discussions)
- **Email**: [Contact Support](mailto:oleksandr.kurchev@gmail.com)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=SamsonHD/lingua-tab&type=Date)](https://star-history.com/#SamsonHD/lingua-tab&Date)

---

**Made with ❤️ for daily language learning**

*Transform every new tab into a moment of discovery.*