"use client";

import { useEditorStore } from "../state/editorStore";

const ConfigPanel = () => {
    const {
        state: { showConfig, ollamaEndpoint, ollamaModel },
        actions: { setShowConfig, setOllamaEndpoint, setOllamaModel },
    } = useEditorStore();

    if (!showConfig) return null;

    return (
        <div className='border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3'>
            <div className='flex items-center gap-4'>
                <div className='flex-1'>
                    <label className='block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1'>
                        Ollama Endpoint
                    </label>
                    <input
                        type='text'
                        value={ollamaEndpoint}
                        onChange={(e) => setOllamaEndpoint(e.target.value)}
                        placeholder='http://localhost:11434'
                        className='w-full px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <div className='flex-1'>
                    <label className='block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1'>
                        Model
                    </label>
                    <input
                        type='text'
                        value={ollamaModel}
                        onChange={(e) => setOllamaModel(e.target.value)}
                        placeholder='llama3.2'
                        className='w-full px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <button
                    onClick={() => setShowConfig(false)}
                    className='px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50'
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default ConfigPanel;

