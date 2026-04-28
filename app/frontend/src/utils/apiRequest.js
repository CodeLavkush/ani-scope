export async function apiRequest(endpoint, method = "GET", body, withCredentials = false) {
    try {
        const response = await fetch(`${endpoint}`, {
            method,
            headers: {
                "content-type": "application/json",
                accept: "application/json",
            },
            credentials: withCredentials ? "include" : "same-origin",
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || `Request failed: ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
}