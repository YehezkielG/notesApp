export async function POST(request: Request) {
  const { text } = await request.json();

  const res = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  return Response.json({ emotion: data.emotion });
}
