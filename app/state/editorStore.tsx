/* Centralized editor state inspired by Excalidraw's separation of UI and logic */
"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    ReactNode,
    RefObject,
} from "react";
import {
    addJavaScriptToHtml,
    combineCodeToHtml,
    extractCodeFromHtml,
    getCombinedHtml,
} from "../utils/codeParser";
import { defaultCombinedCode } from "../utils/defaults";
import {
    EditorMode,
    EditorTab,
    Message,
    PdfSectionConfig,
    PdfMargins,
    PreviewTab,
    ThemeMode,
} from "../types/editor";

const normalizeMarginsForApi = (margins: PdfMargins) => {
    if (margins.unit === "cm") {
        return {
            ...margins,
            top: margins.top * 10,
            right: margins.right * 10,
            bottom: margins.bottom * 10,
            left: margins.left * 10,
            unit: "mm" as const,
        };
    }
    if (margins.unit === "in") {
        // Convert inches to mm: 1 inch = 25.4 mm
        return {
            ...margins,
            top: margins.top * 25.4,
            right: margins.right * 25.4,
            bottom: margins.bottom * 25.4,
            left: margins.left * 25.4,
            unit: "mm" as const,
        };
    }
    return margins;
};

interface EditorContextValue {
    state: {
        editorMode: EditorMode;
        combinedCode: string;
        separateHtml: string;
        separateCss: string;
        separateJs: string;
        activeEditorTab: EditorTab;
        activeTab: PreviewTab;
        pdfBlob: string | null;
        isGeneratingPdf: boolean;
        pdfError: string | null;
        showPdfSettings: boolean;
        pdfHeader: PdfSectionConfig;
        pdfFooter: PdfSectionConfig;
        pdfMargins: PdfMargins;
        showChatPanel: boolean;
        chatMessages: Message[];
        isAiLoading: boolean;
        aiError: string | null;
        suggestion: string | null;
        showSuggestion: boolean;
        ollamaEndpoint: string;
        ollamaModel: string;
        showConfig: boolean;
        theme: ThemeMode;
        themeInitialized: boolean;
    };
    refs: {
        iframeRef: RefObject<HTMLIFrameElement | null>;
    };
    derived: {
        getPreviewHtml: () => string;
        getCurrentCombinedHtml: () => string;
    };
    actions: {
        toggleTheme: () => void;
        setShowConfig: (value: boolean) => void;
        setShowChatPanel: (value: boolean) => void;
        setActiveTab: (value: PreviewTab) => void;
        setShowPdfSettings: (value: boolean) => void;
        setPdfHeader: (value: PdfSectionConfig) => void;
        setPdfFooter: (value: PdfSectionConfig) => void;
        setPdfMargins: (value: PdfMargins) => void;
        setEditorMode: (value: EditorMode) => void;
        setActiveEditorTab: (value: EditorTab) => void;
        setSeparateHtml: (value: string) => void;
        setSeparateCss: (value: string) => void;
        setSeparateJs: (value: string) => void;
        setCombinedCode: (value: string) => void;
        generatePdf: () => Promise<void>;
        downloadPdf: () => void;
        sendAiMessage: (message: string) => Promise<void>;
        acceptSuggestion: () => void;
        rejectSuggestion: () => void;
        setShowSuggestion: (value: boolean) => void;
        setOllamaEndpoint: (value: string) => void;
        setOllamaModel: (value: string) => void;
    };
}

const EditorContext = createContext<EditorContextValue | null>(null);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Editor mode state
    const [editorMode, setEditorMode] = useState<EditorMode>("combined");

    // Combined mode state
    const [combinedCode, setCombinedCode] = useState(defaultCombinedCode);

    // Initialize separate mode from default
    const extractedDefault = useMemo(
        () => extractCodeFromHtml(defaultCombinedCode),
        []
    );

    // Separate mode state
    const [separateHtml, setSeparateHtml] = useState(extractedDefault.html);
    const [separateCss, setSeparateCss] = useState(extractedDefault.css);
    const [separateJs, setSeparateJs] = useState(extractedDefault.js);
    const [activeEditorTab, setActiveEditorTab] = useState<EditorTab>("html");

    // PDF state
    const [activeTab, setActiveTab] = useState<PreviewTab>("preview");
    const [pdfBlob, setPdfBlob] = useState<string | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [pdfError, setPdfError] = useState<string | null>(null);

    // PDF Header/Footer configuration state
    const [showPdfSettings, setShowPdfSettings] = useState(false);
    const [pdfHeader, setPdfHeader] = useState<PdfSectionConfig>({
        text: "",
        isHtml: false,
        showPageNumber: false,
        showDate: false,
        alignment: "center",
    });
    const [pdfFooter, setPdfFooter] = useState<PdfSectionConfig>({
        text: "",
        isHtml: false,
        showPageNumber: true,
        showDate: false,
        alignment: "center",
    });
    const [pdfMargins, setPdfMargins] = useState<PdfMargins>({
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
        unit: "mm",
    });

    // AI Assistant state
    const [showChatPanel, setShowChatPanel] = useState(false);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [ollamaEndpoint, setOllamaEndpoint] = useState(
        "http://localhost:11434"
    );
    const [ollamaModel, setOllamaModel] = useState("llama3.2:3b");
    const [showConfig, setShowConfig] = useState(false);

    // Theme state - initialize to light to avoid hydration mismatch
    const [theme, setTheme] = useState<ThemeMode>("light");
    const [themeInitialized, setThemeInitialized] = useState(false);

    const getCurrentCombinedHtml = useCallback(() => {
        return getCombinedHtml(
            editorMode,
            combinedCode,
            separateHtml,
            separateCss,
            separateJs
        );
    }, [editorMode, combinedCode, separateHtml, separateCss, separateJs]);

    const getPreviewHtml = useCallback(() => {
        const html = getCurrentCombinedHtml();

        // Ensure we always return valid HTML, even if empty
        if (!html || html.trim() === "") {
            const emptyHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
</head>
<body>
    <p style="padding: 20px; color: #666;">Start editing to see your preview...</p>
</body>
</html>`;
            return theme === "dark" 
                ? emptyHtml.replace("<body>", `<body style="background-color: #1a1a1a; color: #e4e4e7;">`)
                : emptyHtml;
        }

        if (theme === "dark") {
            const themeCss = `
        <style id="theme-preview-styles">
            body {
                background-color: #1a1a1a !important;
                color: #e4e4e7 !important;
            }
            /* Preserve user's styles but add dark mode overrides */
            * {
                color-scheme: dark;
            }
        </style>`;

            if (html.includes("</head>")) {
                return html.replace("</head>", `${themeCss}\n</head>`);
            } else if (html.includes("<body>")) {
                return html.replace("<body>", `${themeCss}\n<body>`);
            } else {
                return `${themeCss}\n${html}`;
            }
        }

        return html;
    }, [getCurrentCombinedHtml, theme]);

    // Initialize theme from localStorage or system preference (client-side only)
    useEffect(() => {
        if (!themeInitialized) {
            const savedTheme = localStorage.getItem(
                "theme"
            ) as ThemeMode | null;
            if (savedTheme) {
                setTheme(savedTheme);
            } else if (
                window.matchMedia("(prefers-color-scheme: dark)").matches
            ) {
                setTheme("dark");
            }
            setThemeInitialized(true);
        }
    }, [themeInitialized]);

    // Update theme and persist to localStorage
    useEffect(() => {
        if (!themeInitialized) return;

        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);

        // Update iframe preview when theme changes
        if (iframeRef.current && activeTab === "preview") {
            iframeRef.current.srcdoc = getPreviewHtml();
        }
    }, [theme, activeTab, getPreviewHtml, themeInitialized]);

    // Update iframe preview when code changes
    useEffect(() => {
        if (iframeRef.current && activeTab === "preview") {
            iframeRef.current.srcdoc = getPreviewHtml();
        }
    }, [
        editorMode,
        combinedCode,
        separateHtml,
        separateCss,
        separateJs,
        activeTab,
        getPreviewHtml,
    ]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }, []);

    const switchEditorMode = useCallback(
        (newMode: EditorMode) => {
            if (newMode === editorMode) return;

            if (newMode === "separate") {
                const extracted = extractCodeFromHtml(combinedCode);
                setSeparateHtml(extracted.html);
                setSeparateCss(extracted.css);
                setSeparateJs(extracted.js);
                setActiveEditorTab("html");
            } else {
                let combined = combineCodeToHtml(separateHtml, separateCss);
                combined = addJavaScriptToHtml(combined, separateJs);
                setCombinedCode(combined);
            }
            setEditorMode(newMode);
        },
        [editorMode, combinedCode, separateHtml, separateCss, separateJs]
    );

    const generatePdf = useCallback(async () => {
        setIsGeneratingPdf(true);
        setPdfError(null);

        const finalHtml = getCurrentCombinedHtml();

        try {
            // #region agent log
            const headerShouldBeIncluded = pdfHeader.text ||
                    pdfHeader.showPageNumber ||
                    pdfHeader.showDate;
            const footerShouldBeIncluded = pdfFooter.text ||
                    pdfFooter.showPageNumber ||
                    pdfFooter.showDate;
            fetch('http://127.0.0.1:7242/ingest/fcb40112-fc24-49d4-b1d2-1f3d848c9195',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'editorStore.tsx:330',message:'PDF generation request - header/footer state',data:{headerState:pdfHeader,footerState:pdfFooter,headerShouldBeIncluded,footerShouldBeIncluded,htmlHasTitle:finalHtml.includes('<title>')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
            // #endregion
            
            const response = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    html: finalHtml,
                    header: headerShouldBeIncluded ? pdfHeader : undefined,
                    footer: footerShouldBeIncluded ? pdfFooter : undefined,
                    margins: normalizeMarginsForApi(pdfMargins),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate PDF");
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            setPdfBlob(blobUrl);
            setActiveTab("pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            setPdfError(
                error instanceof Error
                    ? error.message
                    : "Failed to generate PDF"
            );
        } finally {
            setIsGeneratingPdf(false);
        }
    }, [getCurrentCombinedHtml, pdfHeader, pdfFooter, pdfMargins]);

    const downloadPdf = useCallback(() => {
        if (pdfBlob) {
            const link = document.createElement("a");
            link.href = pdfBlob;
            link.download = "document.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [pdfBlob]);

    const sendAiMessage = useCallback(
        async (message: string) => {
            setIsAiLoading(true);
            setAiError(null);
            setShowSuggestion(false);

            const userMessage: Message = { role: "user", content: message };
            setChatMessages((prev) => [...prev, userMessage]);

            const currentCodeForAi = getCurrentCombinedHtml();

            try {
                const response = await fetch("/api/ai-assist", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message,
                        currentCode: currentCodeForAi,
                        conversationHistory: chatMessages,
                        endpoint: ollamaEndpoint,
                        model: ollamaModel,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error || "Failed to get AI assistance"
                    );
                }

                const data = await response.json();
                const suggestedCode = data.suggestedCode || data.message || "";

                const aiMessage: Message = {
                    role: "assistant",
                    content:
                        data.message ||
                        "I've generated a code suggestion for you.",
                };
                setChatMessages((prev) => [...prev, aiMessage]);

                const currentCodeForComparison = getCurrentCombinedHtml();
                if (
                    suggestedCode &&
                    suggestedCode.trim() !== currentCodeForComparison.trim()
                ) {
                    setSuggestion(suggestedCode);
                    setShowSuggestion(true);
                }
            } catch (error) {
                console.error("Error getting AI assistance:", error);
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to get AI assistance";
                setAiError(errorMessage);

                const errorMsg: Message = {
                    role: "assistant",
                    content: `Error: ${errorMessage}`,
                };
                setChatMessages((prev) => [...prev, errorMsg]);
            } finally {
                setIsAiLoading(false);
            }
        },
        [chatMessages, getCurrentCombinedHtml, ollamaEndpoint, ollamaModel]
    );

    const acceptSuggestion = useCallback(() => {
        if (suggestion) {
            if (editorMode === "combined") {
                setCombinedCode(suggestion);
            } else {
                const extracted = extractCodeFromHtml(suggestion);
                setSeparateHtml(extracted.html);
                setSeparateCss(extracted.css);
                setSeparateJs(extracted.js);
            }
            setShowSuggestion(false);
            setSuggestion(null);
        }
    }, [suggestion, editorMode]);

    const rejectSuggestion = useCallback(() => {
        setShowSuggestion(false);
        setSuggestion(null);
    }, []);

    const value = useMemo<EditorContextValue>(
        () => ({
            state: {
                editorMode,
                combinedCode,
                separateHtml,
                separateCss,
                separateJs,
                activeEditorTab,
                activeTab,
                pdfBlob,
                isGeneratingPdf,
                pdfError,
                showPdfSettings,
                pdfHeader,
                pdfFooter,
                pdfMargins,
                showChatPanel,
                chatMessages,
                isAiLoading,
                aiError,
                suggestion,
                showSuggestion,
                ollamaEndpoint,
                ollamaModel,
                showConfig,
                theme,
                themeInitialized,
            },
            refs: {
                iframeRef,
            },
            derived: {
                getPreviewHtml,
                getCurrentCombinedHtml,
            },
            actions: {
                toggleTheme,
                setShowConfig,
                setShowChatPanel,
                setActiveTab,
                setShowPdfSettings,
                setPdfHeader,
                setPdfFooter,
                setPdfMargins,
                setEditorMode: switchEditorMode,
                setActiveEditorTab,
                setSeparateHtml,
                setSeparateCss,
                setSeparateJs,
                setCombinedCode,
                generatePdf,
                downloadPdf,
                sendAiMessage,
                acceptSuggestion,
                rejectSuggestion,
                setShowSuggestion,
                setOllamaEndpoint,
                setOllamaModel,
            },
        }),
        [
            editorMode,
            combinedCode,
            separateHtml,
            separateCss,
            separateJs,
            activeEditorTab,
            activeTab,
            pdfBlob,
            isGeneratingPdf,
            pdfError,
            showPdfSettings,
            pdfHeader,
            pdfFooter,
            pdfMargins,
            showChatPanel,
            chatMessages,
            isAiLoading,
            aiError,
            suggestion,
            showSuggestion,
            ollamaEndpoint,
            ollamaModel,
            showConfig,
            theme,
            themeInitialized,
            getPreviewHtml,
            getCurrentCombinedHtml,
            toggleTheme,
            switchEditorMode,
            generatePdf,
            downloadPdf,
            sendAiMessage,
            acceptSuggestion,
            rejectSuggestion,
            setPdfMargins,
        ]
    );

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditorStore = () => {
    const ctx = useContext(EditorContext);
    if (!ctx) {
        throw new Error("useEditorStore must be used within EditorProvider");
    }
    return ctx;
};
