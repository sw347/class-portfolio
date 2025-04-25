export default async function handler(req, res) {
  const targetUrl =
    "http://222.110.147.50:5161" + req.url.replace("/api/proxy", "");

  try {
    const proxyRes = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: "222.110.147.50",
      },
      body:
        req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    });

    const contentType = proxyRes.headers.get("content-type");
    res.status(proxyRes.status);
    res.setHeader("Content-Type", contentType);

    const body = await proxyRes.text();
    res.send(body);
  } catch (error) {
    res.status(500).json({ error: "Proxy failed", details: error.message });
  }
}
