import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

interface PdfHeaderFooter {
    text: string;
    isHtml?: boolean;
    showPageNumber: boolean;
    showDate: boolean;
    alignment: "left" | "center" | "right";
}

interface PdfMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
    unit: "mm" | "in" | "cm";
}

export async function POST(request: NextRequest) {
    try {
        const {
            html,
            header,
            footer,
            margins,
        }: {
            html: string;
            header?: PdfHeaderFooter;
            footer?: PdfHeaderFooter;
            margins?: PdfMargins;
        } = await request.json();

        if (!html || typeof html !== "string") {
            return NextResponse.json(
                { error: "HTML content is required" },
                { status: 400 }
            );
        }

        // Launch puppeteer browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        try {
            const page = await browser.newPage();

            // Set content and wait for it to load
            await page.setContent(html, {
                waitUntil: "networkidle0",
            });

            // Build header template
            const buildHeaderTemplate = (config?: PdfHeaderFooter): string => {
                if (!config) return "";

                // If HTML mode, inject HTML directly (with page number/date if needed)
                if (config.isHtml && config.text) {
                    let htmlContent = config.text;
                    const additionalParts: string[] = [];

                    if (config.showPageNumber) {
                        additionalParts.push(
                            '<span class="pageNumber"></span>'
                        );
                    }
                    if (config.showDate) {
                        const date = new Date().toLocaleDateString();
                        additionalParts.push(date);
                    }

                    if (additionalParts.length > 0) {
                        // Append additional parts to HTML
                        htmlContent += " | " + additionalParts.join(" | ");
                    }

                    return `<div style="font-size: 10px; padding: 10px; width: 100%;">${htmlContent}</div>`;
                }

                // Text mode - use existing logic
                const parts: string[] = [];
                if (config.text) parts.push(config.text);
                if (config.showPageNumber)
                    parts.push('<span class="pageNumber"></span>');
                if (config.showDate) {
                    const date = new Date().toLocaleDateString();
                    parts.push(date);
                }
                const content = parts.join(" | ");
                const alignClass =
                    config.alignment === "left"
                        ? "text-left"
                        : config.alignment === "right"
                        ? "text-right"
                        : "text-center";
                return `<div style="font-size: 10px; padding: 10px; ${
                    alignClass === "text-left"
                        ? "text-align: left;"
                        : alignClass === "text-right"
                        ? "text-align: right;"
                        : "text-align: center;"
                } width: 100%;">${content}</div>`;
            };

            // Build footer template
            const buildFooterTemplate = (config?: PdfHeaderFooter): string => {
                if (!config) return "";

                // If HTML mode, inject HTML directly (with page number/date if needed)
                if (config.isHtml && config.text) {
                    let htmlContent = config.text;
                    const additionalParts: string[] = [];

                    if (config.showPageNumber) {
                        additionalParts.push(
                            'Page <span class="pageNumber"></span> of <span class="totalPages"></span>'
                        );
                    }
                    if (config.showDate) {
                        const date = new Date().toLocaleDateString();
                        additionalParts.push(date);
                    }

                    if (additionalParts.length > 0) {
                        // Append additional parts to HTML
                        htmlContent += " | " + additionalParts.join(" | ");
                    }

                    return `<div style="font-size: 10px; padding: 10px; width: 100%;">${htmlContent}</div>`;
                }

                // Text mode - use existing logic
                const parts: string[] = [];
                if (config.text) parts.push(config.text);
                if (config.showPageNumber)
                    parts.push(
                        'Page <span class="pageNumber"></span> of <span class="totalPages"></span>'
                    );
                if (config.showDate) {
                    const date = new Date().toLocaleDateString();
                    parts.push(date);
                }
                const content = parts.join(" | ");
                const alignClass =
                    config.alignment === "left"
                        ? "text-left"
                        : config.alignment === "right"
                        ? "text-right"
                        : "text-center";
                return `<div style="font-size: 10px; padding: 10px; ${
                    alignClass === "text-left"
                        ? "text-align: left;"
                        : alignClass === "text-right"
                        ? "text-align: right;"
                        : "text-align: center;"
                } width: 100%;">${content}</div>`;
            };

            // #region agent log
            const logData = {
                hasHeader: !!header,
                hasFooter: !!footer,
                headerConfig: header || null,
                footerConfig: footer || null,
                htmlTitle: html.includes('<title>') ? html.match(/<title>(.*?)<\/title>/)?.[1] : null,
            };
            fetch('http://127.0.0.1:7242/ingest/fcb40112-fc24-49d4-b1d2-1f3d848c9195',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generate-pdf/route.ts:161',message:'Before building templates',data:logData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D'})}).catch(()=>{});
            // #endregion
            
            const headerTemplate = buildHeaderTemplate(header);
            const footerTemplate = buildFooterTemplate(footer);

            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/fcb40112-fc24-49d4-b1d2-1f3d848c9195',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generate-pdf/route.ts:164',message:'After building templates',data:{headerTemplate:headerTemplate || 'EMPTY',footerTemplate:footerTemplate || 'EMPTY',headerTemplateLength:headerTemplate?.length || 0,footerTemplateLength:footerTemplate?.length || 0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,E'})}).catch(()=>{});
            // #endregion

            // Use provided margins or defaults (standard 20mm margins)
            const defaultMargins = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
                unit: "mm" as const,
            };
            const pdfMargins = margins || defaultMargins;

            // Format margins as strings with units for Puppeteer
            const formatMargin = (value: number, unit: string): string => {
                return `${value}${unit}`;
            };

            // Generate PDF
            const pdfOptions: Parameters<typeof page.pdf>[0] = {
                format: "A4",
                printBackground: true,
                margin: {
                    top: formatMargin(pdfMargins.top, pdfMargins.unit),
                    right: formatMargin(pdfMargins.right, pdfMargins.unit),
                    bottom: formatMargin(pdfMargins.bottom, pdfMargins.unit),
                    left: formatMargin(pdfMargins.left, pdfMargins.unit),
                },
            };

            // #region agent log
            const beforePdfOptions = {
                hasHeaderTemplate: !!headerTemplate,
                hasFooterTemplate: !!footerTemplate,
                displayHeaderFooter: false,
            };
            fetch('http://127.0.0.1:7242/ingest/fcb40112-fc24-49d4-b1d2-1f3d848c9195',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generate-pdf/route.ts:191',message:'Before setting PDF options',data:beforePdfOptions,timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A,D'})}).catch(()=>{});
            // #endregion
            
            // Evaluate if we have header/footer based on templates
            const hasHeaderTemplate = headerTemplate && headerTemplate.trim() !== "";
            const hasFooterTemplate = footerTemplate && footerTemplate.trim() !== "";
            
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/fcb40112-fc24-49d4-b1d2-1f3d848c9195',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generate-pdf/route.ts:234',message:'Template evaluation',data:{hasHeaderTemplate,hasFooterTemplate,headerTemplateLength:headerTemplate?.length || 0,footerTemplateLength:footerTemplate?.length || 0,htmlTitle:html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || 'NO_TITLE'},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'A,D'})}).catch(()=>{});
            // #endregion
            
            // If we only have footer (no header), remove title from page to prevent default header
            if (!hasHeaderTemplate && hasFooterTemplate) {
                await page.evaluate(() => {
                    if (document.title) {
                        document.title = '';
                    }
                    const titleElement = document.querySelector('title');
                    if (titleElement) {
                        titleElement.textContent = '';
                    }
                });
            }
            
            // Set up header and footer templates
            if (hasHeaderTemplate) {
                // User wants header - set it up
                pdfOptions.displayHeaderFooter = true;
                pdfOptions.headerTemplate = headerTemplate;
            }
            
            if (hasFooterTemplate) {
                // User wants footer - set it up
                pdfOptions.displayHeaderFooter = true;
                pdfOptions.footerTemplate = footerTemplate;
                
                // If we only have footer (no header), we MUST provide an empty header template
                // Otherwise Puppeteer/Chrome will show default header with document title/date
                if (!hasHeaderTemplate) {
                    // Provide an explicit empty header template
                    // This tells Puppeteer we want NO header, not a default one
                    pdfOptions.headerTemplate = '<div></div>';
                }
            }
            
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/fcb40112-fc24-49d4-b1d2-1f3d848c9195',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generate-pdf/route.ts:220',message:'After setting PDF options',data:{displayHeaderFooter:pdfOptions.displayHeaderFooter,hasHeaderTemplate:!!pdfOptions.headerTemplate,hasFooterTemplate:!!pdfOptions.footerTemplate,headerTemplateValue:pdfOptions.headerTemplate?.substring(0,50) || 'NOT_SET',footerTemplateValue:pdfOptions.footerTemplate?.substring(0,50) || 'NOT_SET'},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A,D'})}).catch(()=>{});
            // #endregion

            const pdfBuffer = await page.pdf(pdfOptions);

            await browser.close();

            // Return PDF as response
            return new NextResponse(Buffer.from(pdfBuffer), {
                status: 200,
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": "inline; filename=document.pdf",
                },
            });
        } catch (error) {
            await browser.close();
            throw error;
        }
    } catch (error) {
        console.error("Error generating PDF:", error);
        return NextResponse.json(
            {
                error: "Failed to generate PDF",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
