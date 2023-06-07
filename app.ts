import { JSONRPCServer } from "json-rpc-2.0";
import { createServer } from "http";

const rpc = new JSONRPCServer();

rpc.addMethod("meow", (params, serverParams) => {
  console.log("doing something important...");

  return "meow";
});

const server = createServer((req, res) => {
  const { url, method } = req;

  if (url === "/json-rpc" && method === "POST") {
    const data: Buffer[] = [];

    req.on("data", (chunk) => {
      data.push(chunk);
    });

    return req.on("end", async () => {
      const parsed = Buffer.concat(data).toString();

      const response = await rpc.receiveJSON(parsed);

      if (response) {
        res.writeHead(200, {
          "content-type": "application/json",
        });

        res.end(JSON.stringify(response));
      } else {
        res.writeHead(204);
        res.end();
      }
    });
  }

  res.writeHead(400);
  res.end();
});

server.listen(8080);
