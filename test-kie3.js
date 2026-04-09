const apiKey = process.env.KIE_API_KEY || "your-kie-api-key";

async function test() {
  const payload = {
    model: "bytedance/seedance-1.5-pro",
    input: {
      prompt: "A beautiful scenery",
      aspect_ratio: "16:9",
      input_urls: ["blob:http://localhost:3000/1234"]
    }
  };

  console.log("Sending payload:", JSON.stringify(payload));
  const res = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  console.log(res.status);
  console.log(await res.text());
}
test();
