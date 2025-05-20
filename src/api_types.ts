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