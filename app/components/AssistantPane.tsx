"use client";

import ChatPanel from "./ChatPanel";
import SuggestionPreview from "./SuggestionPreview";
import { useEditorStore } from "../state/editorStore";

const AssistantPane = () => {
    const {
        state: { showSuggestion, suggestion, chatMessages, isAiLoading, aiError },
        derived: { getCurrentCombinedHtml },
        actions: {
            acceptSuggestion,
            rejectSuggestion,
            sendAiMessage,
            setShowSuggestion,
        },
    } = useEditorStore();

    const renderContent = () => {
        if (showSuggestion && suggestion) {
            return (
                <SuggestionPreview
                    currentCode={getCurrentCombinedHtml()}
                    suggestedCode={suggestion}
                    onAccept={acceptSuggestion}
                    onReject={rejectSuggestion}
                />
            );
        }

        return (
            <ChatPanel
                messages={chatMessages}
                onSendMessage={sendAiMessage}
                isLoading={isAiLoading}
                error={aiError}
            />
        );
    };

    return (
        <div className='h-full flex flex-col'>
            <div className='px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-purple-600 dark:bg-purple-700'>
                <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-white'>
                        AI Assistant
                    </span>
                    {showSuggestion && suggestion && (
                        <button
                            onClick={() => setShowSuggestion(true)}
                            className='text-xs px-2 py-1 bg-yellow-500 text-yellow-900 rounded hover:bg-yellow-400 transition-colors'
                        >
                            View Suggestion
                        </button>
                    )}
                </div>
            </div>
            <div className='flex-1 overflow-hidden'>{renderContent()}</div>
        </div>
    );
};

export default AssistantPane;

