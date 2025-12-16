"use client";

import Editor from "@monaco-editor/react";
import { useEditorStore } from "../state/editorStore";

const EditorPane = () => {
    const {
        state: {
            editorMode,
            combinedCode,
            separateHtml,
            separateCss,
            separateJs,
            activeEditorTab,
        },
        actions: {
            setEditorMode,
            setCombinedCode,
            setSeparateHtml,
            setSeparateCss,
            setSeparateJs,
            setActiveEditorTab,
        },
    } = useEditorStore();

    return (
        <div className='h-full flex flex-col bg-zinc-900'>
            <div className='px-4 py-2 border-b border-zinc-700 bg-zinc-800 flex items-center justify-between'>
                <span className='text-sm font-medium text-zinc-300'>
                    Editor
                </span>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => setEditorMode("combined")}
                        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                            editorMode === "combined"
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                        }`}
                    >
                        Combined
                    </button>
                    <button
                        onClick={() => setEditorMode("separate")}
                        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                            editorMode === "separate"
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                        }`}
                    >
                        Separate
                    </button>
                </div>
            </div>
            {editorMode === "combined" ? (
                <div className='flex-1'>
                    <Editor
                        height='100%'
                        defaultLanguage='html'
                        language='html'
                        value={combinedCode}
                        onChange={(value) => setCombinedCode(value || "")}
                        theme='vs-dark'
                        options={{
                            minimap: { enabled: true },
                            fontSize: 14,
                            wordWrap: "on",
                            automaticLayout: true,
                            tabSize: 2,
                        }}
                    />
                </div>
            ) : (
                <div className='flex-1 flex flex-col'>
                    <div className='flex border-b border-zinc-700 bg-zinc-800'>
                        <button
                            onClick={() => setActiveEditorTab("html")}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                activeEditorTab === "html"
                                    ? "bg-zinc-900 text-zinc-100 border-b-2 border-blue-500"
                                    : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            HTML
                        </button>
                        <button
                            onClick={() => setActiveEditorTab("css")}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                activeEditorTab === "css"
                                    ? "bg-zinc-900 text-zinc-100 border-b-2 border-blue-500"
                                    : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            CSS
                        </button>
                        <button
                            onClick={() => setActiveEditorTab("js")}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                activeEditorTab === "js"
                                    ? "bg-zinc-900 text-zinc-100 border-b-2 border-blue-500"
                                    : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            JavaScript
                        </button>
                    </div>
                    <div className='flex-1'>
                        {activeEditorTab === "html" && (
                            <Editor
                                height='100%'
                                defaultLanguage='html'
                                language='html'
                                value={separateHtml}
                                onChange={(value) => setSeparateHtml(value || "")}
                                theme='vs-dark'
                                options={{
                                    minimap: { enabled: true },
                                    fontSize: 14,
                                    wordWrap: "on",
                                    automaticLayout: true,
                                    tabSize: 2,
                                }}
                            />
                        )}
                        {activeEditorTab === "css" && (
                            <Editor
                                height='100%'
                                defaultLanguage='css'
                                language='css'
                                value={separateCss}
                                onChange={(value) => setSeparateCss(value || "")}
                                theme='vs-dark'
                                options={{
                                    minimap: { enabled: true },
                                    fontSize: 14,
                                    wordWrap: "on",
                                    automaticLayout: true,
                                    tabSize: 2,
                                }}
                            />
                        )}
                        {activeEditorTab === "js" && (
                            <Editor
                                height='100%'
                                defaultLanguage='javascript'
                                language='javascript'
                                value={separateJs}
                                onChange={(value) => setSeparateJs(value || "")}
                                theme='vs-dark'
                                options={{
                                    minimap: { enabled: true },
                                    fontSize: 14,
                                    wordWrap: "on",
                                    automaticLayout: true,
                                    tabSize: 2,
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorPane;

