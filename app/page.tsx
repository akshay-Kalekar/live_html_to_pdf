"use client";

import AppShell from "./components/AppShell";
import { EditorProvider } from "./state/editorStore";

export default function Home() {
    return (
        <EditorProvider>
            <AppShell />
        </EditorProvider>
    );
}
