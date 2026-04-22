export async function nsfwChecker(fileBuffer) {
    const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/Freepik/nsfw_image_detector",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: fileBuffer.toString("base64"),
            }),
        }
    );
    const data = await response.json();
    return data;
}

export function evaluateNSFW(result) {
    const get = (label) =>
        result.find((r) => r.label === label)?.score || 0;

    const neutral = get("neutral");
    const low = get("low");
    const medium = get("medium");
    const high = get("high");


    if (high > 0.3) {
        return {
            status: "BLOCK",
            reason: "Explicit NSFW detected",
        };
    }

    if (medium > 0.3) {
        return {
            status: "REVIEW",
            reason: "Possibly unsafe content",
        };
    }


    if (low > 0.5) {
        return {
            status: "REVIEW",
            reason: "Mildly suspicious content",
        };
    }


    if (neutral > 0.7) {
        return {
            status: "SAFE",
            reason: "Content is safe",
        };
    }

    return {
        status: "REVIEW",
        reason: "Uncertain classification",
    };
}