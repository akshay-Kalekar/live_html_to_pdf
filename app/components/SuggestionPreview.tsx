"use client";

interface SuggestionPreviewProps {
    currentCode: string;
    suggestedCode: string;
    onAccept: () => void;
    onReject: () => void;
}

export default function SuggestionPreview({
    currentCode,
    suggestedCode,
    onAccept,
    onReject,
}: SuggestionPreviewProps) {
    // Simple diff visualization
    const currentLines = currentCode.split("\n");
    const suggestedLines = suggestedCode.split("\n");
    const maxLines = Math.max(currentLines.length, suggestedLines.length);

    return (
        <div className="h-full flex flex-col bg-white dark:bg-zinc-900">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Code Suggestion
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Review the suggested changes below
                </p>
            </div>
            <div className="flex-1 overflow-auto p-4">
                <div className="space-y-2">
                    {Array.from({ length: Math.min(maxLines, 50) }).map(
                        (_, index) => {
                            const currentLine = currentLines[index] || "";
                            const suggestedLine = suggestedLines[index] || "";
                            const isDifferent = currentLine !== suggestedLine;

                            if (!isDifferent && !suggestedLine) return null;

                            return (
                                <div
                                    key={index}
                                    className="flex gap-2 text-xs font-mono"
                                >
                                    <div className="flex-1">
                                        {isDifferent && currentLine && (
                                            <div className="bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">
                                                <span className="text-red-600 dark:text-red-400">
                                                    - {currentLine}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        {isDifferent && suggestedLine && (
                                            <div className="bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                                                <span className="text-green-600 dark:text-green-400">
                                                    + {suggestedLine}
                                                </span>
                                            </div>
                                        )}
                                        {!isDifferent && suggestedLine && (
                                            <div className="px-2 py-1 text-zinc-600 dark:text-zinc-400">
                                                {suggestedLine}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                    )}
                    {maxLines > 50 && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center py-2">
                            ... and {maxLines - 50} more lines
                        </p>
                    )}
                </div>
            </div>
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                <button
                    onClick={onAccept}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                    Accept
                </button>
                <button
                    onClick={onReject}
                    className="flex-1 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-medium"
                >
                    Reject
                </button>
            </div>
        </div>
    );
}

