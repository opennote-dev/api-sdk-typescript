
const OPENNOTE_BASE_URL = "https://api-video.opennote.me";

// VIDEO CREATION TYPES 

type VideoCreateRequestOptions = {
    sections?: number;
    model?: "feynman2" | string;
    messages?: { role: string; content: string }[];
    script?: string[];
}

type VideoCreateResponse = {
    video_id: string
    timestamp: string
    creation_success: boolean
    api_version: string
}

// VIDEO STATUS TYPES 

type Source = {
    url: string; 
    content: string;
}

type VideoAPIResponseData = {
    video_url: string
    transcript: string
    sources: Source[]
}

type OpennoteUsage = {
    total_tokens_used: number;
    total_input_tokens: number;
    total_output_tokens: number;
    search_credits_used: number;
    cost: number;
}

type VideoAPIResponse = {
    success: boolean;
    data: VideoAPIResponseData;
    model: string;
    usage: OpennoteUsage;
    timestamp: string;
}

type VideoStatusAPIResponse = {
    status: "pending" | "success" | "not_found";
    total_sections: number;
    completed_sections: number;
    video_id: string;
    response: VideoAPIResponse | null;
}

// EXPORTS

export type { VideoCreateRequestOptions, VideoCreateResponse, VideoAPIResponse, VideoStatusAPIResponse };

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

