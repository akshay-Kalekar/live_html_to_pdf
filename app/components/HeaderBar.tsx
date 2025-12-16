"use client";

import { useEditorStore } from "../state/editorStore";

const HeaderBar = () => {
    const {
        state: { showConfig, showChatPanel, isGeneratingPdf, pdfBlob },
        actions: {
            setShowConfig,
            setShowChatPanel,
            setShowPdfSettings,
            generatePdf,
            downloadPdf,
        },
    } = useEditorStore();

    return (
        <div className='border-b border-zinc-200 bg-white/95 px-4 py-3 flex items-center justify-between backdrop-blur-sm sticky top-0 z-30'>
            <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-semibold text-black'>
                    HTML Editor with Live Preview & PDF Export
                </h1>
                <span className='hidden sm:inline text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100'>
                    Live
                </span>
            </div>
            <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                <button
                    onClick={() => setShowConfig(!showConfig)}
                    className='px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-black border border-zinc-300 rounded-md hover:bg-zinc-100 transition-colors'
                >
                    ⚙️ Config
                </button>
                <button
                    onClick={() => setShowChatPanel(!showChatPanel)}
                    className='px-3 py-1.5 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
                >
                    {showChatPanel ? "Hide" : "Show"} AI Assistant
                </button>
                <div className='hidden sm:block h-6 w-px bg-zinc-200' />
                <button
                    onClick={() => setShowPdfSettings(true)}
                    className='px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-black border border-zinc-300 rounded-md hover:bg-zinc-100 transition-colors flex items-center gap-2'
                >
                    <span>PDF Settings</span>
                </button>
                <button
                    onClick={downloadPdf}
                    disabled={!pdfBlob}
                    className='px-3 py-1.5 text-sm font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md flex items-center gap-2'
                    title={
                        pdfBlob
                            ? "Download latest generated PDF"
                            : "Generate a PDF first"
                    }
                >
                    <svg
                        className='w-4 h-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                        />
                    </svg>
                    <span>Download PDF</span>
                </button>
                <button
                    onClick={generatePdf}
                    disabled={isGeneratingPdf}
                    className='px-3 sm:px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md flex items-center gap-2'
                >
                    {isGeneratingPdf ? (
                        <>
                            <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent' />
                            <span>Generating…</span>
                        </>
                    ) : (
                        <>
                            <svg
                                className='w-4 h-4'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                />
                            </svg>
                            <span>Generate PDF</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default HeaderBar;

