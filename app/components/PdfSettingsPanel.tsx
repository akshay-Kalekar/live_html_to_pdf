"use client";

import { useState, useEffect, useRef } from "react";
import { Alignment, PdfSectionConfig, PdfMargins } from "../types/editor";
import { useEditorStore } from "../state/editorStore";

const PdfSettingsPanel = () => {
    const {
        state: { showPdfSettings, pdfHeader, pdfFooter, pdfMargins },
        actions: {
            setShowPdfSettings,
            setPdfHeader,
            setPdfFooter,
            setPdfMargins,
        },
    } = useEditorStore();

    // Track previous modal state to detect when it opens
    const prevShowPdfSettingsRef = useRef(showPdfSettings);

    // Local state for temporary edits - initialize from store
    const [localHeader, setLocalHeader] = useState<PdfSectionConfig>(pdfHeader);
    const [localFooter, setLocalFooter] = useState<PdfSectionConfig>(pdfFooter);
    const [localMargins, setLocalMargins] = useState<PdfMargins>(pdfMargins);

    // Tab state for left panel
    const [activeTab, setActiveTab] = useState<"margins" | "header" | "footer">(
        "margins"
    );

    // Sync local state with store when modal opens
    // This effect syncs external store state to local component state when the modal opens.
    // This is a valid use case: we need to initialize local editing state from store values
    // when the modal transitions from closed to open, allowing users to edit without
    // immediately modifying the store (changes only apply on Save).
    useEffect(() => {
        if (showPdfSettings && !prevShowPdfSettingsRef.current) {
            setLocalHeader(pdfHeader);
            setLocalFooter(pdfFooter);
            setLocalMargins(pdfMargins);
        }
        prevShowPdfSettingsRef.current = showPdfSettings;
        // Note: The linter warns about setState in effects, but this is intentional
        // to sync external store state to local state when modal opens
    }, [showPdfSettings, pdfHeader, pdfFooter, pdfMargins]);

    const handleSave = () => {
        setPdfHeader(localHeader);
        setPdfFooter(localFooter);
        setPdfMargins(localMargins);
        setShowPdfSettings(false);
    };

    const handleCancel = () => {
        // Reset to store values
        setLocalHeader(pdfHeader);
        setLocalFooter(pdfFooter);
        setLocalMargins(pdfMargins);
        setShowPdfSettings(false);
    };

    if (!showPdfSettings) return null;

    const renderAlignmentButtons = (
        current: Alignment,
        onChange: (value: Alignment) => void
    ) => (
        <div className='flex gap-2'>
            {(["left", "center", "right"] as const).map((align) => (
                <button
                    key={align}
                    onClick={() => onChange(align)}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        current === align
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-300"
                    }`}
                >
                    {align === "left" && "← "}
                    {align === "center" && "↔ "}
                    {align === "right" && "→ "}
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
            ))}
        </div>
    );

    return (
        <div className='fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-6'>
            <div className='relative w-full max-w-6xl rounded-lg bg-zinc-50 border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh]'>
                <div className='sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50 rounded-t-lg'>
                    <h3 className='text-lg font-semibold text-zinc-900'>
                        PDF Header & Footer Settings
                    </h3>
                    <button
                        onClick={handleCancel}
                        className='text-zinc-600 hover:text-black'
                        aria-label='Close PDF settings'
                    >
                        ✕
                    </button>
                </div>
                <div className='flex-1 overflow-y-auto flex flex-col min-h-0'>
                    <div className='flex flex-row gap-6 p-4 sm:p-6 flex-1 min-h-0'>
                        {/* Left Panel - Settings */}
                        <div className='flex-1 flex flex-col min-w-0 min-h-0'>
                            {/* Tab Navigation */}
                            <div className='flex-shrink-0 border-b border-zinc-200 bg-zinc-50'>
                                <div className='flex'>
                                    <button
                                        onClick={() => setActiveTab("margins")}
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                                            activeTab === "margins"
                                                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                                                : "text-zinc-600 hover:text-zinc-900"
                                        }`}
                                    >
                                        📐 Margins
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("header")}
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                                            activeTab === "header"
                                                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                                                : "text-zinc-600 hover:text-zinc-900"
                                        }`}
                                    >
                                        📄 Header
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("footer")}
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                                            activeTab === "footer"
                                                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                                                : "text-zinc-600 hover:text-zinc-900"
                                        }`}
                                    >
                                        📋 Footer
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
                                {/* Margins Section */}
                                {activeTab === "margins" && (
                                    <div className='bg-white border border-zinc-200 rounded-lg p-5 shadow-sm transition-shadow hover:shadow-md'>
                                        <h4 className='text-base font-semibold text-zinc-900 mb-4 flex items-center gap-2'>
                                            <span className='text-blue-600'>
                                                📐
                                            </span>
                                            Page Margins
                                        </h4>

                                        {/* Margin inputs with visual layout */}
                                        <div className='mb-4'>
                                            <div className='grid grid-cols-2 gap-3 mb-3'>
                                                {/* Top */}
                                                <div className='space-y-1.5'>
                                                    <label className='text-xs font-medium text-zinc-600 flex items-center gap-1.5'>
                                                        <span>↑</span>
                                                        <span className='capitalize'>
                                                            Top
                                                        </span>
                                                    </label>
                                                    <input
                                                        type='number'
                                                        min={0}
                                                        max={
                                                            localMargins.unit ===
                                                            "mm"
                                                                ? 50
                                                                : 5
                                                        }
                                                        step='0.1'
                                                        value={localMargins.top}
                                                        onChange={(e) => {
                                                            const value =
                                                                Math.max(
                                                                    0,
                                                                    Math.min(
                                                                        localMargins.unit ===
                                                                            "mm"
                                                                            ? 50
                                                                            : 5,
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 0
                                                                    )
                                                                );
                                                            setLocalMargins({
                                                                ...localMargins,
                                                                top: value,
                                                            });
                                                        }}
                                                        className='w-full px-4 py-2.5 text-sm border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow'
                                                    />
                                                </div>

                                                {/* Right */}
                                                <div className='space-y-1.5'>
                                                    <label className='text-xs font-medium text-zinc-600 flex items-center gap-1.5'>
                                                        <span>→</span>
                                                        <span className='capitalize'>
                                                            Right
                                                        </span>
                                                    </label>
                                                    <input
                                                        type='number'
                                                        min={0}
                                                        max={
                                                            localMargins.unit ===
                                                            "mm"
                                                                ? 50
                                                                : 5
                                                        }
                                                        step='0.1'
                                                        value={
                                                            localMargins.right
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                Math.max(
                                                                    0,
                                                                    Math.min(
                                                                        localMargins.unit ===
                                                                            "mm"
                                                                            ? 50
                                                                            : 5,
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 0
                                                                    )
                                                                );
                                                            setLocalMargins({
                                                                ...localMargins,
                                                                right: value,
                                                            });
                                                        }}
                                                        className='w-full px-4 py-2.5 text-sm border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow'
                                                    />
                                                </div>

                                                {/* Bottom */}
                                                <div className='space-y-1.5'>
                                                    <label className='text-xs font-medium text-zinc-600 flex items-center gap-1.5'>
                                                        <span>↓</span>
                                                        <span className='capitalize'>
                                                            Bottom
                                                        </span>
                                                    </label>
                                                    <input
                                                        type='number'
                                                        min={0}
                                                        max={
                                                            localMargins.unit ===
                                                            "mm"
                                                                ? 50
                                                                : 5
                                                        }
                                                        step='0.1'
                                                        value={
                                                            localMargins.bottom
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                Math.max(
                                                                    0,
                                                                    Math.min(
                                                                        localMargins.unit ===
                                                                            "mm"
                                                                            ? 50
                                                                            : 5,
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 0
                                                                    )
                                                                );
                                                            setLocalMargins({
                                                                ...localMargins,
                                                                bottom: value,
                                                            });
                                                        }}
                                                        className='w-full px-4 py-2.5 text-sm border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow'
                                                    />
                                                </div>

                                                {/* Left */}
                                                <div className='space-y-1.5'>
                                                    <label className='text-xs font-medium text-zinc-600 flex items-center gap-1.5'>
                                                        <span>←</span>
                                                        <span className='capitalize'>
                                                            Left
                                                        </span>
                                                    </label>
                                                    <input
                                                        type='number'
                                                        min={0}
                                                        max={
                                                            localMargins.unit ===
                                                            "mm"
                                                                ? 50
                                                                : 5
                                                        }
                                                        step='0.1'
                                                        value={
                                                            localMargins.left
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                Math.max(
                                                                    0,
                                                                    Math.min(
                                                                        localMargins.unit ===
                                                                            "mm"
                                                                            ? 50
                                                                            : 5,
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 0
                                                                    )
                                                                );
                                                            setLocalMargins({
                                                                ...localMargins,
                                                                left: value,
                                                            });
                                                        }}
                                                        className='w-full px-4 py-2.5 text-sm border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow'
                                                    />
                                                </div>
                                            </div>

                                            {/* Inline unit selector */}
                                            <div className='flex items-center gap-2'>
                                                <label className='text-xs font-medium text-zinc-600 whitespace-nowrap'>
                                                    Unit:
                                                </label>
                                                <select
                                                    value={localMargins.unit}
                                                    onChange={(e) => {
                                                        const newUnit = e.target
                                                            .value as
                                                            | "mm"
                                                            | "cm";
                                                        // Convert values when unit changes
                                                        const conversionFactor =
                                                            localMargins.unit ===
                                                                "mm" &&
                                                            newUnit === "cm"
                                                                ? 0.1
                                                                : localMargins.unit ===
                                                                      "cm" &&
                                                                  newUnit ===
                                                                      "mm"
                                                                ? 10
                                                                : 1;

                                                        setLocalMargins({
                                                            top: Math.min(
                                                                localMargins.top *
                                                                    conversionFactor,
                                                                newUnit === "mm"
                                                                    ? 50
                                                                    : 5
                                                            ),
                                                            right: Math.min(
                                                                localMargins.right *
                                                                    conversionFactor,
                                                                newUnit === "mm"
                                                                    ? 50
                                                                    : 5
                                                            ),
                                                            bottom: Math.min(
                                                                localMargins.bottom *
                                                                    conversionFactor,
                                                                newUnit === "mm"
                                                                    ? 50
                                                                    : 5
                                                            ),
                                                            left: Math.min(
                                                                localMargins.left *
                                                                    conversionFactor,
                                                                newUnit === "mm"
                                                                    ? 50
                                                                    : 5
                                                            ),
                                                            unit: newUnit,
                                                        });
                                                    }}
                                                    className='flex-1 px-4 py-2.5 text-sm border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow'
                                                >
                                                    <option value='mm'>
                                                        Millimeters (mm)
                                                    </option>
                                                    <option value='cm'>
                                                        Centimeters (cm)
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Header Settings */}
                                {activeTab === "header" && (
                                    <div className='bg-white border border-zinc-200 rounded-lg p-5 shadow-sm transition-shadow hover:shadow-md'>
                                        <h4 className='text-base font-semibold text-zinc-900 mb-5 flex items-center gap-2'>
                                            <span className='text-blue-600'>
                                                📄
                                            </span>
                                            Header
                                        </h4>

                                        <div className='space-y-5'>
                                            {/* Input Mode Toggle */}
                                            <div>
                                                <label className='block text-sm font-medium text-zinc-700 mb-3'>
                                                    Input Mode
                                                </label>
                                                <div className='flex gap-2'>
                                                    <button
                                                        onClick={() =>
                                                            setLocalHeader({
                                                                ...localHeader,
                                                                isHtml: false,
                                                            })
                                                        }
                                                        className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                            !localHeader.isHtml
                                                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-300"
                                                        }`}
                                                    >
                                                        Text
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setLocalHeader({
                                                                ...localHeader,
                                                                isHtml: true,
                                                            })
                                                        }
                                                        className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                            localHeader.isHtml
                                                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-300"
                                                        }`}
                                                    >
                                                        HTML
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content Input */}
                                            <div>
                                                <label className='block text-sm font-medium text-zinc-700 mb-2'>
                                                    {localHeader.isHtml
                                                        ? "Header HTML"
                                                        : "Header Text"}
                                                </label>
                                                {localHeader.isHtml ? (
                                                    <textarea
                                                        value={localHeader.text}
                                                        onChange={(e) =>
                                                            setLocalHeader({
                                                                ...localHeader,
                                                                text: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        placeholder='<div style="text-align: center;">Header Content</div>'
                                                        rows={4}
                                                        className='w-full px-4 py-2.5 text-sm font-mono border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow resize-none'
                                                    />
                                                ) : (
                                                    <input
                                                        type='text'
                                                        value={localHeader.text}
                                                        onChange={(e) =>
                                                            setLocalHeader({
                                                                ...localHeader,
                                                                text: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        placeholder='Enter header text (e.g., Document Title)'
                                                        className='w-full px-4 py-2.5 text-sm border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow'
                                                    />
                                                )}
                                            </div>

                                            {/* Alignment */}
                                            <div>
                                                <label className='block text-sm font-medium text-zinc-700 mb-3'>
                                                    Alignment
                                                </label>
                                                {renderAlignmentButtons(
                                                    localHeader.alignment,
                                                    (value) =>
                                                        setLocalHeader({
                                                            ...localHeader,
                                                            alignment: value,
                                                        })
                                                )}
                                            </div>

                                            {/* Options */}
                                            <div className='bg-zinc-50 rounded-lg p-4 space-y-3 border border-zinc-200'>
                                                <label className='flex items-center gap-3 text-sm text-zinc-700 cursor-pointer group'>
                                                    <input
                                                        type='checkbox'
                                                        checked={
                                                            localHeader.showPageNumber
                                                        }
                                                        onChange={(e) =>
                                                            setLocalHeader({
                                                                ...localHeader,
                                                                showPageNumber:
                                                                    e.target
                                                                        .checked,
                                                            })
                                                        }
                                                        className='w-5 h-5 text-blue-600 border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all'
                                                    />
                                                    <span className='group-hover:text-zinc-900 transition-colors'>
                                                        Show Page Number
                                                    </span>
                                                </label>
                                                <label className='flex items-center gap-3 text-sm text-zinc-700 cursor-pointer group'>
                                                    <input
                                                        type='checkbox'
                                                        checked={
                                                            localHeader.showDate
                                                        }
                                                        onChange={(e) =>
                                                            setLocalHeader({
                                                                ...localHeader,
                                                                showDate:
                                                                    e.target
                                                                        .checked,
                                                            })
                                                        }
                                                        className='w-5 h-5 text-blue-600 border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all'
                                                    />
                                                    <span className='group-hover:text-zinc-900 transition-colors'>
                                                        Show Date
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Footer Settings */}
                                {activeTab === "footer" && (
                                    <div className='bg-white border border-zinc-200 rounded-lg p-5 shadow-sm transition-shadow hover:shadow-md'>
                                        <h4 className='text-base font-semibold text-zinc-900 mb-5 flex items-center gap-2'>
                                            <span className='text-blue-600'>
                                                📋
                                            </span>
                                            Footer
                                        </h4>

                                        <div className='space-y-5'>
                                            {/* Input Mode Toggle */}
                                            <div>
                                                <label className='block text-sm font-medium text-zinc-700 mb-3'>
                                                    Input Mode
                                                </label>
                                                <div className='flex gap-2'>
                                                    <button
                                                        onClick={() =>
                                                            setLocalFooter({
                                                                ...localFooter,
                                                                isHtml: false,
                                                            })
                                                        }
                                                        className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                            !localFooter.isHtml
                                                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-300"
                                                        }`}
                                                    >
                                                        Text
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setLocalFooter({
                                                                ...localFooter,
                                                                isHtml: true,
                                                            })
                                                        }
                                                        className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                            localFooter.isHtml
                                                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-300"
                                                        }`}
                                                    >
                                                        HTML
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content Input */}
                                            <div>
                                                <label className='block text-sm font-medium text-zinc-700 mb-2'>
                                                    {localFooter.isHtml
                                                        ? "Footer HTML"
                                                        : "Footer Text"}
                                                </label>
                                                {localFooter.isHtml ? (
                                                    <textarea
                                                        value={localFooter.text}
                                                        onChange={(e) =>
                                                            setLocalFooter({
                                                                ...localFooter,
                                                                text: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        placeholder='<div style="text-align: center;">Footer Content</div>'
                                                        rows={4}
                                                        className='w-full px-4 py-2.5 text-sm font-mono border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow resize-none'
                                                    />
                                                ) : (
                                                    <input
                                                        type='text'
                                                        value={localFooter.text}
                                                        onChange={(e) =>
                                                            setLocalFooter({
                                                                ...localFooter,
                                                                text: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        placeholder='Enter footer text (e.g., Company Name)'
                                                        className='w-full px-4 py-2.5 text-sm border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow'
                                                    />
                                                )}
                                            </div>

                                            {/* Alignment */}
                                            <div>
                                                <label className='block text-sm font-medium text-zinc-700 mb-3'>
                                                    Alignment
                                                </label>
                                                {renderAlignmentButtons(
                                                    localFooter.alignment,
                                                    (value) =>
                                                        setLocalFooter({
                                                            ...localFooter,
                                                            alignment: value,
                                                        })
                                                )}
                                            </div>

                                            {/* Options */}
                                            <div className='bg-zinc-50 rounded-lg p-4 space-y-3 border border-zinc-200'>
                                                <label className='flex items-center gap-3 text-sm text-zinc-700 cursor-pointer group'>
                                                    <input
                                                        type='checkbox'
                                                        checked={
                                                            localFooter.showPageNumber
                                                        }
                                                        onChange={(e) =>
                                                            setLocalFooter({
                                                                ...localFooter,
                                                                showPageNumber:
                                                                    e.target
                                                                        .checked,
                                                            })
                                                        }
                                                        className='w-5 h-5 text-blue-600 border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all'
                                                    />
                                                    <span className='group-hover:text-zinc-900 transition-colors'>
                                                        Show Page Number
                                                    </span>
                                                </label>
                                                <label className='flex items-center gap-3 text-sm text-zinc-700 cursor-pointer group'>
                                                    <input
                                                        type='checkbox'
                                                        checked={
                                                            localFooter.showDate
                                                        }
                                                        onChange={(e) =>
                                                            setLocalFooter({
                                                                ...localFooter,
                                                                showDate:
                                                                    e.target
                                                                        .checked,
                                                            })
                                                        }
                                                        className='w-5 h-5 text-blue-600 border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all'
                                                    />
                                                    <span className='group-hover:text-zinc-900 transition-colors'>
                                                        Show Date
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel - Preview */}
                        <div className='flex-1 min-w-0 flex flex-col min-h-0'>
                            <div className='flex-1 flex flex-col p-4 bg-white border border-zinc-200 rounded-md min-h-0'>
                                <h5 className='text-xs font-semibold text-zinc-600 mb-3 flex-shrink-0'>
                                    Preview
                                </h5>
                                <div className='flex-1 overflow-y-auto text-xs text-zinc-500 space-y-2 min-h-0'>
                                    {localHeader.isHtml && localHeader.text ? (
                                        <div className='py-1 border-b border-zinc-200 space-y-1'>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: localHeader.text,
                                                }}
                                            />
                                            {(localHeader.showPageNumber ||
                                                localHeader.showDate) && (
                                                <div className='text-[11px] text-zinc-500'>
                                                    {[
                                                        localHeader.showPageNumber
                                                            ? "Page 1"
                                                            : null,
                                                        localHeader.showDate
                                                            ? new Date().toLocaleDateString()
                                                            : null,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" • ")}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            className={`py-1 border-b border-zinc-200 ${
                                                localHeader.alignment === "left"
                                                    ? "text-left"
                                                    : localHeader.alignment ===
                                                      "right"
                                                    ? "text-right"
                                                    : "text-center"
                                            }`}
                                        >
                                            {localHeader.text ||
                                                (localHeader.showPageNumber
                                                    ? "Page 1"
                                                    : "") ||
                                                (localHeader.showDate
                                                    ? new Date().toLocaleDateString()
                                                    : "") ||
                                                "Header preview"}
                                        </div>
                                    )}
                                    <div className='h-3/4 p-4 text-zinc-400'>
                                        Document content area
                                    </div>
                                    {localFooter.isHtml && localFooter.text ? (
                                        <div className='bottom-0 py-1 border-t border-zinc-200 space-y-1'>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: localFooter.text,
                                                }}
                                            />
                                            {(localFooter.showPageNumber ||
                                                localFooter.showDate) && (
                                                <div className='text-[11px] text-zinc-500'>
                                                    {[
                                                        localFooter.showPageNumber
                                                            ? "Page 1 of 1"
                                                            : null,
                                                        localFooter.showDate
                                                            ? new Date().toLocaleDateString()
                                                            : null,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" • ")}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            className={`py-1 border-t border-zinc-200 ${
                                                localFooter.alignment === "left"
                                                    ? "text-left"
                                                    : localFooter.alignment ===
                                                      "right"
                                                    ? "text-right"
                                                    : "text-center"
                                            }`}
                                        >
                                            {localFooter.text ||
                                                (localFooter.showPageNumber
                                                    ? "Page 1 of 1"
                                                    : "") ||
                                                (localFooter.showDate
                                                    ? new Date().toLocaleDateString()
                                                    : "") ||
                                                "Footer preview"}
                                        </div>
                                    )}
                                    <div className='pt-2 text-[11px] text-zinc-500 flex items-center gap-2'>
                                        <span className='inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 border border-zinc-200'>
                                            <span className='font-semibold text-zinc-700'>
                                                Margins
                                            </span>
                                            <span>
                                                {localMargins.top}/
                                                {localMargins.right}/
                                                {localMargins.bottom}/
                                                {localMargins.left}{" "}
                                                {localMargins.unit}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer with Save and Cancel buttons */}
                <div className='sticky bottom-0 flex items-center justify-end gap-3 px-4 py-3 border-t border-zinc-200 bg-zinc-50 rounded-b-lg'>
                    <button
                        onClick={handleCancel}
                        className='px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-200 hover:bg-zinc-300 rounded-md transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors'
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PdfSettingsPanel;
