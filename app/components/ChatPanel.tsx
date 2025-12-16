"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ChatPanelProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    error: string | null;
}

export default function ChatPanel({
    messages,
    onSendMessage,
    isLoading,
    error,
}: ChatPanelProps) {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput("");
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-zinc-900">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-zinc-500 dark:text-zinc-400 mt-8">
                        <p className="text-sm">
                            Start a conversation with AI to get code suggestions
                        </p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                    message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">
                                    {message.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-200 dark:bg-zinc-800 rounded-lg px-4 py-2">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-600 dark:border-zinc-400 border-t-transparent"></div>
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex justify-start">
                        <div className="bg-red-100 dark:bg-red-900/30 rounded-lg px-4 py-2 max-w-[80%]">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask AI to modify your code..."
                        className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}

