const apiKey = process.env.KIE_API_KEY || "your-kie-api-key";

async function testAspect(aspect) {
  const payload = {
    model: "bytedance/seedance-2",
    input: {
      prompt: "A beautiful scenery",
      aspect_ratio: aspect,
      resolution: "720p",
      duration: "5",
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
  console.log(`Aspect ${aspect} (string duration):`, await res.text());
}
main();
async function main() {
  await testAspect("16:9");
}
