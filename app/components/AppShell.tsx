"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import HeaderBar from "./HeaderBar";
import ConfigPanel from "./ConfigPanel";
import SuggestionBanner from "./SuggestionBanner";
import PdfSettingsPanel from "./PdfSettingsPanel";
import EditorPane from "./EditorPane";
import PreviewPane from "./PreviewPane";
import AssistantPane from "./AssistantPane";
import { useEditorStore } from "../state/editorStore";

const AppShell = () => {
    const {
        state: { showChatPanel },
    } = useEditorStore();

    return (
        <div className='flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black'>
            <HeaderBar />
            <ConfigPanel />
            <SuggestionBanner />
            <PdfSettingsPanel />

            <PanelGroup
                direction='horizontal'
                className='flex-1 bg-zinc-100 dark:bg-zinc-950'
                style={{ gap: "0.25rem" }}
            >
                <Panel defaultSize={showChatPanel ? 42 : 50} minSize={28}>
                    <EditorPane />
                </Panel>
                <PanelResizeHandle className='w-3 rounded-md bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-col-resize border border-transparent hover:border-blue-200 dark:hover:border-blue-800' />
                <Panel defaultSize={showChatPanel ? 33 : 50} minSize={30}>
                    <PreviewPane />
                </Panel>
                {showChatPanel && (
                    <>
                        <PanelResizeHandle className='w-3 rounded-md bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-col-resize border border-transparent hover:border-blue-200 dark:hover:border-blue-800' />
                        <Panel defaultSize={30} minSize={20}>
                            <AssistantPane />
                        </Panel>
                    </>
                )}
            </PanelGroup>
        </div>
    );
};

export default AppShell;
