import type {
  AIVideoProvider,
  VideoGenerationParams,
  VideoTaskResponse,
} from "../types";
import {
  getProviderConfig,
  getProviderModelId,
  transformParamsForProvider,
} from "../model-mapping";

export class VolcengineProvider implements AIVideoProvider {
  name = "volcengine";
  supportImageToVideo = true;
  private apiKey: string;
  private baseUrl = "https://ark.cn-beijing.volces.com/api/v3";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createTask(params: VideoGenerationParams): Promise<VideoTaskResponse> {
    const internalModelId = params.model || "seedance-2.0";
    const providerConfig = getProviderConfig(internalModelId, "volcengine");
    
    // Default model ID if not found in mapping
    const providerModelId = getProviderModelId(internalModelId, "volcengine", params);

    // Transform parameters specifically for Volcengine
    const body: Record<string, any> = {
      model: providerModelId,
      ...this.mapParamsToVolcengine(params),
    };

    console.log("Volcengine API Request Body:", JSON.stringify(body, null, 2));

    const response = await fetch(`${this.baseUrl}/visual/video_generation/tasks/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    if (!responseText) {
      throw new Error(`Volcengine API returned an empty response (Status: ${response.status})`);
    }

    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Volcengine API returned invalid JSON: ${responseText.substring(0, 100)}...`);
    }

    console.log("Volcengine API Response:", JSON.stringify(result));

    if (!response.ok || result.error) {
      throw new Error(result.error?.message || result.message || `Volcengine API error (${response.status})`);
    }

    if (!result.id) {
      throw new Error("Volcengine task creation failed, no task ID returned. Result: " + JSON.stringify(result));
    }

    return {
      taskId: result.id,
      provider: "volcengine",
      status: "pending",
      raw: result,
    };
  }

  async getTaskStatus(taskId: string): Promise<VideoTaskResponse> {
    const response = await fetch(
      `${this.baseUrl}/visual/video_generation/tasks/get?task_id=${taskId}`,
      { 
        headers: { 
          Authorization: `Bearer ${this.apiKey}` 
        } 
      }
    );

    const responseText = await response.text();
    if (!responseText) {
      throw new Error(`Volcengine Status API returned an empty response (Status: ${response.status})`);
    }

    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Volcengine Status API returned invalid JSON: ${responseText.substring(0, 100)}...`);
    }

    if (!response.ok || result.error) {
      throw new Error(result.error?.message || result.message || `Volcengine Status API error (${response.status})`);
    }

    const status = this.mapStatus(result.status);
    let videoUrl = result.content?.video_url;

    return {
      taskId: result.id,
      provider: "volcengine",
      status,
      videoUrl,
      error: result.error
        ? { code: result.error.code || "TASK_FAILED", message: result.error.message }
        : undefined,
      raw: result,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseCallback(payload: any): VideoTaskResponse {
    // Volcengine uses the same structure in polling and callbacks
    const status = this.mapStatus(payload.status);
    return {
      taskId: payload.id,
      provider: "volcengine",
      status,
      videoUrl: payload.content?.video_url,
      error: payload.error
        ? { code: payload.error.code, message: payload.error.message }
        : undefined,
      raw: payload,
    };
  }

  private mapStatus(status: string): VideoTaskResponse["status"] {
    const map: Record<string, VideoTaskResponse["status"]> = {
      pending: "pending",
      running: "processing",
      succeeded: "completed",
      failed: "failed",
      canceled: "failed",
    };
    return map[status.toLowerCase()] || "pending";
  }

  private mapParamsToVolcengine(params: VideoGenerationParams): Record<string, any> {
    const content: any[] = [
      {
        type: "text",
        text: params.prompt,
      }
    ];

    // Start/End Frames
    if (params.firstFrameUrl) {
      content.push({
        type: "image_url",
        image_url: { url: params.firstFrameUrl },
        role: "first_frame"
      });
    }
    if (params.lastFrameUrl) {
      content.push({
        type: "image_url",
        image_url: { url: params.lastFrameUrl },
        role: "last_frame"
      });
    }

    // Reference Images
    if (params.referenceImageUrls && params.referenceImageUrls.length > 0) {
      params.referenceImageUrls.forEach(url => {
        content.push({
          type: "image_url",
          image_url: { url },
          role: "reference_image"
        });
      });
    } else if (params.imageUrl && !params.firstFrameUrl) {
      // Use imageUrl as reference only if not already used as first frame
      content.push({
        type: "image_url",
        image_url: { url: params.imageUrl },
        role: "reference_image"
      });
    }

    // Reference Videos (New)
    if (params.videoUrls && params.videoUrls.length > 0) {
      params.videoUrls.forEach(url => {
        content.push({
          type: "video_url",
          video_url: { url },
          role: "reference_video"
        });
      });
    }

    return {
      content,
      generate_audio: params.generateAudio ?? true,
      ratio: this.normalizeRatio(params.aspectRatio),
      duration: params.duration || 5,
      watermark: !params.removeWatermark,
      callback_url: params.callbackUrl,
    };
  }

  private normalizeRatio(ratio?: string): string {
    const validRatios = ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"];
    if (ratio && validRatios.includes(ratio)) return ratio;
    return "16:9";
  }
}

function isModelMappingAvailable(internalId: string): boolean {
    return ["seedance-2.0", "seedance-2.0-cn", "seedance-1.5-pro"].includes(internalId);
}
