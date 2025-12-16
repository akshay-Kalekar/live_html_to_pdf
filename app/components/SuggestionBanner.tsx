"use client";

import { useEditorStore } from "../state/editorStore";

const SuggestionBanner = () => {
    const {
        state: { showSuggestion, suggestion },
        actions: { setShowSuggestion },
    } = useEditorStore();

    if (!showSuggestion || !suggestion) return null;

    return (
        <div className='border-b border-zinc-200 dark:border-zinc-800 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                    💡 AI suggestion available - Check the chat panel
                </p>
                <button
                    onClick={() => setShowSuggestion(false)}
                    className='text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200'
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default SuggestionBanner;

