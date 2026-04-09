const apiKey = process.env.KIE_API_KEY || "your-kie-api-key";

async function testAspect(aspect) {
  const payload = {
    model: "bytedance/seedance-1.5-pro",
    input: {
      prompt: "A beautiful scenery",
      aspect_ratio: aspect,
      resolution: "720p",
      duration: 4,
      generate_audio: true
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
  console.log(`Aspect ${aspect}:`, await res.text());
}

async function main() {
  await testAspect("16:9");
  await testAspect("9:16");
  await testAspect("21:9");
}
main();
