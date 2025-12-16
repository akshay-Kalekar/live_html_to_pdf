"use client";

import { useEditorStore } from "../state/editorStore";

const PreviewPane = () => {
    const {
        state: { activeTab, isGeneratingPdf, pdfError, pdfBlob, theme },
        refs: { iframeRef },
        derived: { getPreviewHtml },
        actions: { setActiveTab, generatePdf },
    } = useEditorStore();

    const renderPreview = () => (
        <div className='h-full w-full bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden'>
            <iframe
                ref={iframeRef}
                srcDoc={getPreviewHtml()}
                className='w-full h-full border-0'
                title='Live Preview'
                key={theme}
            />
        </div>
    );

    const renderPdf = () => (
        <div className='w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900/60 '>
            {isGeneratingPdf ? (
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                    <p className='text-zinc-600 dark:text-zinc-400 font-medium'>
                        Generating PDF...
                    </p>
                    <p className='text-sm text-zinc-500 dark:text-zinc-500 mt-2'>
                        This may take a few seconds
                    </p>
                </div>
            ) : pdfError ? (
                <div className='text-center p-6 max-w-md'>
                    <div className='mb-4'>
                        <svg
                            className='mx-auto h-12 w-12 text-red-500'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                        </svg>
                    </div>
                    <p className='text-red-600 dark:text-red-400 mb-2 font-medium'>
                        Error Generating PDF
                    </p>
                    <p className='text-sm text-zinc-600 dark:text-zinc-400 mb-4'>
                        {pdfError}
                    </p>
                    <button
                        onClick={generatePdf}
                        className='px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm'
                    >
                        Try Again
                    </button>
                </div>
            ) : pdfBlob ? (
                <div className='w-full h-full flex flex-col'>
                    <div className='flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-900 flex justify-center'>
                        <iframe
                            src={pdfBlob || undefined}
                            className='w-full max-w-5xl h-full border-0 bg-white'
                            title='PDF Preview'
                            onLoad={(e) => {
                                // Ensure iframe content is loaded
                                const iframe = e.target as HTMLIFrameElement;
                                if (iframe.contentWindow?.location.href === 'about:blank') {
                                    // If still blank, try reloading
                                    if (pdfBlob) {
                                        iframe.src = pdfBlob;
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className='text-center p-6 max-w-md'>
                    <div className='mb-4'>
                        <svg
                            className='mx-auto h-16 w-16 text-zinc-400 dark:text-zinc-600'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={1.5}
                                d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                            />
                        </svg>
                    </div>
                    <p className='text-zinc-600 dark:text-zinc-400 mb-2 font-medium'>
                        No PDF Generated Yet
                    </p>
                    <p className='text-sm text-zinc-500 dark:text-zinc-500 mb-6'>
                        Click &quot;Generate PDF&quot; to create and preview
                        your PDF document
                    </p>
                    <button
                        onClick={generatePdf}
                        className='px-6 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md'
                    >
                        Generate PDF
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className='h-full flex flex-col bg-white dark:bg-zinc-900'>
            <div className='flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 sm:px-4'>
                <div className='flex'>
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === "preview"
                                ? "text-black dark:text-zinc-50 border-b-2 border-blue-500"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50"
                        }`}
                    >
                        Live Preview
                    </button>
                    <button
                        onClick={() => setActiveTab("pdf")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === "pdf"
                                ? "text-black dark:text-zinc-50 border-b-2 border-blue-500"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50"
                        }`}
                    >
                        PDF Preview
                    </button>
                </div>
            </div>
            <div className='flex-1 relative overflow-hidden  bg-zinc-50 dark:bg-zinc-900'>
                {activeTab === "preview" ? renderPreview() : renderPdf()}
            </div>
        </div>
    );
};

export default PreviewPane;
