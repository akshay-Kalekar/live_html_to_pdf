export type EditorMode = "combined" | "separate";

export type EditorTab = "html" | "css" | "js";

export type PreviewTab = "preview" | "pdf";

export type ThemeMode = "light" | "dark";

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export type Alignment = "left" | "center" | "right";

export interface PdfSectionConfig {
    text: string;
    isHtml: boolean;
    showPageNumber: boolean;
    showDate: boolean;
    alignment: Alignment;
}

export type PdfMarginUnit = "mm" | "in" | "cm";

export interface PdfMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
    unit: PdfMarginUnit;
}

