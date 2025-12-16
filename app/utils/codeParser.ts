/**
 * Extracts CSS and JavaScript from a combined HTML string
 */
export function extractCodeFromHtml(html: string): {
    html: string;
    css: string;
    js: string;
} {
    // Default values
    let extractedHtml = html;
    let extractedCss = "";
    let extractedJs = "";

    try {
        // Extract CSS from <style> tags
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        const styleMatches = html.matchAll(styleRegex);
        const cssParts: string[] = [];
        
        for (const match of styleMatches) {
            if (match[1]) {
                cssParts.push(match[1].trim());
            }
        }
        extractedCss = cssParts.join("\n\n");

        // Remove <style> tags from HTML
        extractedHtml = extractedHtml.replace(styleRegex, "");

        // Extract JavaScript from <script> tags
        const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
        const scriptMatches = html.matchAll(scriptRegex);
        const jsParts: string[] = [];
        
        for (const match of scriptMatches) {
            if (match[1]) {
                jsParts.push(match[1].trim());
            }
        }
        extractedJs = jsParts.join("\n\n");

        // Remove <script> tags from HTML
        extractedHtml = extractedHtml.replace(scriptRegex, "");

        // Clean up extra whitespace
        extractedHtml = extractedHtml.trim();
    } catch (error) {
        console.error("Error extracting code from HTML:", error);
    }

    return {
        html: extractedHtml,
        css: extractedCss,
        js: extractedJs,
    };
}

/**
 * Combines separate HTML, CSS, and JS into a single HTML document
 */
export function combineCodeToHtml(
    html: string,
    css: string,
    cssInHead: boolean = true
): string {
    let combinedHtml = html;

    try {
        // Ensure we have basic HTML structure
        if (!combinedHtml.includes("<!DOCTYPE") && !combinedHtml.includes("<html")) {
            combinedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
${combinedHtml}
</body>
</html>`;
        }

        // Add CSS to <head> if provided
        if (css && css.trim()) {
            const cssBlock = `    <style>
${css
    .split("\n")
    .map((line) => `        ${line}`)
    .join("\n")}
    </style>`;

            if (combinedHtml.includes("</head>")) {
                combinedHtml = combinedHtml.replace("</head>", `${cssBlock}\n</head>`);
            } else if (combinedHtml.includes("<head>")) {
                combinedHtml = combinedHtml.replace("<head>", `<head>\n${cssBlock}`);
            } else if (combinedHtml.includes("<body>")) {
                combinedHtml = combinedHtml.replace("<body>", `<head>\n${cssBlock}\n</head>\n<body>`);
            } else {
                // Add before </html> or at the end
                if (combinedHtml.includes("</html>")) {
                    combinedHtml = combinedHtml.replace("</html>", `</head>\n<body>\n</body>\n</html>`);
                    combinedHtml = combinedHtml.replace("</head>", `${cssBlock}\n</head>`);
                }
            }
        }

        // Add JavaScript before </body> or </html> if provided
        // Note: JS will be added by the caller using addJavaScriptToHtml
    } catch (error) {
        console.error("Error combining code to HTML:", error);
    }

    return combinedHtml;
}

/**
 * Adds JavaScript to an HTML document
 */
export function addJavaScriptToHtml(html: string, js: string): string {
    if (!js || !js.trim()) {
        return html;
    }

    try {
        const jsBlock = `    <script>
${js
    .split("\n")
    .map((line) => `        ${line}`)
    .join("\n")}
    </script>`;

        if (html.includes("</body>")) {
            return html.replace("</body>", `${jsBlock}\n</body>`);
        } else if (html.includes("</html>")) {
            return html.replace("</html>", `${jsBlock}\n</html>`);
        } else {
            // Append at the end
            return `${html}\n${jsBlock}`;
        }
    } catch (error) {
        console.error("Error adding JavaScript to HTML:", error);
        return html;
    }
}

/**
 * Gets the final combined HTML for preview/PDF
 */
export function getCombinedHtml(
    mode: "combined" | "separate",
    combinedCode: string,
    htmlCode: string,
    cssCode: string,
    jsCode: string
): string {
    if (mode === "combined") {
        return combinedCode;
    } else {
        // Combine separate codes
        let combined = combineCodeToHtml(htmlCode, cssCode);
        combined = addJavaScriptToHtml(combined, jsCode);
        return combined;
    }
}

