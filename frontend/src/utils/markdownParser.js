export function parseMarkdown(text) {
  if (!text) return { __html: "" };

  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Headings
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Lists
  html = html.replace(/^- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*?<\/li>\n?)+/g, "<ul style='margin-left:20px; list-style-type:disc;'>$&</ul>");

  // Line breaks
  html = html.replace(/\n\n+/g, "</p><p style='margin-bottom:12px;'>");
  html = html.replace(/\n/g, "<br/>");
  html = html.replace(/<ul><br\/>/g, "<ul>");
  html = html.replace(/<\/li><br\/>/g, "</li>");

  return { __html: `<div class="markdown-content">${html}</div>` };
}
