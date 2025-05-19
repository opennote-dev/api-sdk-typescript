import type { VideoCreateRequestOptions, VideoCreateResponse, VideoStatusAPIResponse } from "./api_types";

const OPENNOTE_BASE_URL = "https://api-video.opennote.me";

class VideoClient {
    constructor(private readonly apiKey: string, private readonly baseUrl: string = OPENNOTE_BASE_URL) {}

    async make({
        sections = 5,
        model = "feynman2",
        messages,
        script,
    }: VideoCreateRequestOptions): Promise<VideoCreateResponse> {
        if (!messages && !script) {
            throw new Error("Either messages or script must be provided");
        }

        const response = await fetch(`${this.baseUrl}/video/make`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                sections,
                model,
                messages,
                script,
            }),
        });

        return response.json();
    }

    async status(videoId: string): Promise<VideoStatusAPIResponse> {
        const response = await fetch(`${this.baseUrl}/video/status/${videoId}`);
        return response.json();
    }
}

class OpennoteVideoClient {
    video: VideoClient;

    constructor(apiKey: string, baseUrl: string = OPENNOTE_BASE_URL) {
        if (!apiKey) {
            throw new Error("API key is required");
        }

        this.video = new VideoClient(apiKey, baseUrl);
    }
}

export { OpennoteVideoClient };

