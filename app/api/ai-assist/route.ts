import { NextRequest, NextResponse } from "next/server";

interface OllamaRequest {
  message: string;
  currentCode: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  endpoint?: string;
  model?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OllamaRequest = await request.json();
    const { message, currentCode, conversationHistory = [], endpoint = "http://localhost:11434", model = "llama3.2:3b" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build conversation context
    const systemPrompt = `You are a helpful AI assistant that helps users modify HTML, CSS, and JavaScript code. 
You should provide code suggestions based on user requests. 
Always return ONLY the complete, updated HTML code (including any CSS in <style> tags and JavaScript in <script> tags).
Do not include explanations or markdown formatting - just return the raw HTML code.
The user's current code is:
\`\`\`html
${currentCode}
\`\`\`

Based on the user's request, provide the modified HTML code.`;

    // Prepare messages for Ollama
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    // Call Ollama API
    const ollamaResponse = await fetch(`${endpoint}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      let errorMessage = `Ollama API error: ${ollamaResponse.status} - ${errorText}`;
      
      // Provide helpful error message for model not found
      if (ollamaResponse.status === 404 && errorText.includes("not found")) {
        errorMessage += `\n\nTip: Make sure the model "${model}" is installed. You can install it by running:\n  ollama pull ${model}\n\nOr use a different model that's already installed.`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await ollamaResponse.json();

    // Extract the assistant's response
    const suggestedCode = data.message?.content || data.response || "";

    // Clean up the response (remove markdown code blocks if present)
    let cleanedCode = suggestedCode.trim();
    if (cleanedCode.startsWith("```html")) {
      cleanedCode = cleanedCode.replace(/^```html\n?/, "").replace(/\n?```$/, "");
    } else if (cleanedCode.startsWith("```")) {
      cleanedCode = cleanedCode.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    return NextResponse.json({
      suggestedCode: cleanedCode,
      message: data.message?.content || suggestedCode,
    });
  } catch (error) {
    console.error("Error calling Ollama:", error);
    
    // Check if it's a connection error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error: "Cannot connect to Ollama. Make sure Ollama is running and the endpoint is correct.",
          details: error instanceof Error ? error.message : "Connection error",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to get AI assistance",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

