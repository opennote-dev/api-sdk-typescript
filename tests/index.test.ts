import { OpennoteVideoClient } from "../src";

const client = new OpennoteVideoClient("sk-1234567890");

const video = await client.video.make({
    sections: 5,
    model: "feynman2",
    messages: [{ role: "user", content: "Hello, world!" }],
});

console.log(video);