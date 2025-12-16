# Live HTML to PDF Converter

A powerful, real-time web application for converting HTML content to PDF with live preview, AI-powered code assistance, and comprehensive customization options. Built with modern web technologies for seamless HTML editing and professional PDF generation.

## 🚀 Features

-   **Live HTML Editor**: Monaco Editor with syntax highlighting for HTML, CSS, and JavaScript
-   **Dual Editing Modes**: Combined or separate HTML/CSS/JS editing modes
-   **Real-time Preview**: Instant preview of your HTML content as you type
-   **AI-Powered Assistance**: Integrated AI assistant (Ollama) for code suggestions and HTML editing
-   **Customizable PDF Generation**:
    -   Custom headers and footers (text or HTML)
    -   Page numbers and date stamps
    -   Configurable margins (mm, cm, inches)
    -   A4 format support
-   **Resizable Panels**: Flexible UI with adjustable editor, preview, and assistant panels
-   **Dark Mode Support**: Beautiful dark theme for comfortable coding
-   **Export Options**: Download PDFs directly from the browser

## 🛠️ Tech Stack

### Core Framework

-   **[Next.js 16](https://nextjs.org/)** - React framework with App Router
-   **[React 19](https://react.dev/)** - UI library
-   **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Key Libraries

-   **[Puppeteer](https://pptr.dev/)** - Headless Chrome for PDF generation
-   **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - VS Code editor component
-   **[React Resizable Panels](https://github.com/bvaughn/react-resizable-panels)** - Resizable panel layout
-   **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### AI Integration

-   **[Ollama](https://ollama.ai/)** - Local AI model integration for code assistance

## 📋 Prerequisites

-   Node.js 18+ and npm/yarn/pnpm
-   Ollama (optional, for AI assistance features)
    -   Install from [ollama.ai](https://ollama.ai/)
    -   Pull a model: `ollama pull llama3.2:3b`

## 🚀 Getting Started

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/live_html_to_pdf.git
    cd live_html_to_pdf
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Run the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

#### Production Deployment Notes

**Chrome/Chromium Requirements:**

Puppeteer requires Chrome/Chromium to generate PDFs. For production deployments:

1. **Automatic Installation (Recommended):**

    - The `postinstall` script will attempt to download Chrome automatically
    - This works for most deployment platforms

2. **Manual Chrome Installation:**

    - Install Chrome/Chromium on your server
    - Set the `CHROME_PATH` environment variable to point to the Chrome executable
    - Example: `CHROME_PATH=/usr/bin/chromium`

3. **Common Chrome Paths:**

    - Linux: `/usr/bin/chromium` or `/usr/bin/google-chrome`
    - The code will automatically detect Chrome in common locations

4. **For Serverless/Container Deployments:**
    - Ensure Chrome dependencies are installed in your container
    - For Docker, add Chrome installation to your Dockerfile
    - For platforms like Vercel, consider using `puppeteer-core` with a compatible Chrome package

**Environment Variables:**

-   `CHROME_PATH`: Custom path to Chrome/Chromium executable (optional)

## 💻 Usage

1. **Edit HTML**: Use the Monaco editor to write or paste your HTML content
2. **Preview**: See live preview in the right panel
3. **Configure PDF**: Set margins, headers, and footers in the PDF settings panel
4. **Generate PDF**: Click the generate button to create and download your PDF
5. **AI Assistance**: Enable the assistant panel for AI-powered code suggestions

## 🤝 Contributing

We welcome contributions! This project is open source and community-driven. Here's how you can help:

### How to Contribute

1. **Fork the repository**

    ```bash
    # Click the Fork button on GitHub
    ```

2. **Create a feature branch**

    ```bash
    git checkout -b feature/your-feature-name
    ```

3. **Make your changes**

    - Write clean, maintainable code
    - Follow existing code style
    - Add comments where necessary
    - Test your changes thoroughly

4. **Commit your changes**

    ```bash
    git commit -m "Add: your feature description"
    ```

5. **Push to your fork**

    ```bash
    git push origin feature/your-feature-name
    ```

6. **Open a Pull Request**
    - Provide a clear description of your changes
    - Reference any related issues
    - Include screenshots if UI changes

### Contribution Guidelines

-   Follow the existing code style and conventions
-   Write meaningful commit messages
-   Update documentation for new features
-   Add tests for new functionality when possible
-   Be respectful and constructive in discussions

## 📝 Scope of Improvements

We're actively working on enhancing this project. Here are areas where contributions are especially welcome:

### 🤖 AI Integration Enhancements

-   **Enhanced AI Editing**: Improve AI integration for more intelligent HTML content editing

    -   Context-aware code suggestions
    -   Multi-turn conversation support for complex edits
    -   Better code understanding and refactoring suggestions
    -   Support for multiple AI providers (OpenAI, Anthropic, etc.)

-   **AI-Powered Features**:
    -   Auto-completion and code generation
    -   HTML structure optimization suggestions
    -   Accessibility improvements via AI
    -   SEO optimization recommendations
    -   Code quality analysis and fixes

### 🎨 UI/UX Improvements

-   **Enhanced Editor Experience**:

    -   Code snippets and templates library
    -   Multiple theme options
    -   Keyboard shortcuts customization
    -   Split view for comparing versions

-   **Preview Enhancements**:
    -   Responsive preview modes (mobile, tablet, desktop)
    -   Print preview mode
    -   Zoom controls
    -   Fullscreen preview option

### 📄 PDF Generation Features

-   **Advanced PDF Options**:

    -   Multiple page formats (Letter, Legal, Custom sizes)
    -   Landscape/Portrait orientation
    -   Custom page breaks
    -   Table of contents generation
    -   Watermark support
    -   PDF metadata (author, title, keywords)

-   **Header/Footer Improvements**:
    -   Rich text editor for headers/footers
    -   Image support in headers/footers
    -   Different headers/footers for first page
    -   Custom fonts and styling

### 🔧 Technical Enhancements

-   **Performance**:

    -   Optimize Puppeteer rendering
    -   Implement PDF caching
    -   Reduce bundle size
    -   Lazy loading for components

-   **Testing**:

    -   Unit tests for core functionality
    -   Integration tests for PDF generation
    -   E2E tests with Playwright/Cypress
    -   Visual regression testing

-   **Developer Experience**:
    -   Better error handling and user feedback
    -   Comprehensive logging
    -   Development tools and debugging aids
    -   API documentation

### 🌐 Additional Features

-   **Export Options**:

    -   Export to multiple formats (PNG, JPEG, SVG)
    -   Batch processing
    -   Scheduled PDF generation
    -   Cloud storage integration

-   **Collaboration**:

    -   Real-time collaborative editing
    -   Share and comment on documents
    -   Version history
    -   Export/import configurations

-   **Templates & Presets**:

    -   Pre-built HTML templates
    -   PDF configuration presets
    -   Custom template library
    -   Template marketplace

-   **Accessibility**:

    -   Screen reader support
    -   Keyboard navigation improvements
    -   ARIA labels and roles
    -   High contrast mode

-   **Internationalization**:
    -   Multi-language support
    -   RTL language support
    -   Localized date/time formats

### 🔒 Security & Privacy

-   Input sanitization improvements
-   XSS protection enhancements
-   Secure PDF generation
-   Privacy-focused AI integration options

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

-   [Next.js](https://nextjs.org/) team for the amazing framework
-   [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
-   [Puppeteer](https://pptr.dev/) for PDF generation capabilities
-   [Ollama](https://ollama.ai/) for local AI integration
-   All contributors who help improve this project

## 📞 Support

-   **Issues**: [GitHub Issues](https://github.com/akshay-Kalekar/live_html_to_pdf/issues)
-   **Discussions**: [GitHub Discussions](https://github.com/akshay-Kalekar/live_html_to_pdf/discussions)
-   **Email**: [Your Email]

---

**Made with ❤️ by the community**

⭐ Star this repo if you find it useful!
