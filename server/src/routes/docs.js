import { Hono } from "hono";
import { readFile } from "node:fs/promises";
import path from "node:path";

const specPath = path.join(process.cwd(), "openapi", "exodia.yaml");

const swaggerPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Exodia API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/docs/openapi/exodia.yaml',
          dom_id: '#swagger-ui',
          presets: [SwaggerUIBundle.presets.apis],
        });
      };
    </script>
  </body>
</html>`;

/**
 * docsRoutes serves the Swagger UI shell and exposes the raw OpenAPI spec so
 * clients can inspect the Exodia API surface.
 */
export const docsRoutes = new Hono();

docsRoutes.get("/", (c) => c.html(swaggerPage));

docsRoutes.get("/openapi/exodia.yaml", async (c) => {
  const contents = await readFile(specPath, "utf-8");
  return c.text(contents, 200, {
    "Content-Type": "application/yaml; charset=utf-8",
  });
});
