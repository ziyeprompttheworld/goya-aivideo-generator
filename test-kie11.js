const apiKey = process.env.KIE_API_KEY || "your-kie-api-key";

async function testAspect() {
  const payload = {
    model: "bytedance/seedance-2",
    input: {
      prompt: "A beautiful scenery",
      aspect_ratio: "9:16",
      resolution: "720p",
      duration: 5,
      reference_image_urls: ["http://localhost:3000/uploads/test.jpg"]
    }
  };

  const res = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  console.log(`Localhost image:`, await res.text());
}
testAspect();
