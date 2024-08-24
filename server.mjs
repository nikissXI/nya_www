import { launchEditorMiddleware } from "@react-dev-inspector/middleware";
import { createServer } from "http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const middlewares = [
        launchEditorMiddleware,
        (req, res) => {
          return handle(req, res);
        },
      ];

      const middlewarePipeline = middlewares.reduceRight(
        (next, middleware) => {
          return () => {
            middleware(req, res, next);
          };
        },
        () => {}
      );

      middlewarePipeline();
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
