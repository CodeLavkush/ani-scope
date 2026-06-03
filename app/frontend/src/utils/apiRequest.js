export const apiRequest = async (url, method = "GET", data = null, withAuth = false, isFormData = false) => {
    try {
        const options = {
            method,
            credentials: withAuth ? "include" : "same-origin",
            headers: {},
        };

        if (data) {
            if (isFormData) {
                options.body = data;
                // ❗ DO NOT set Content-Type for FormData
            } else {
                options.headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(data);
            }
        }

        const response = await fetch(url, options);

        let parsedData;

        try {
            parsedData = await response.json();
        } catch {
            const text = await response.text();
            throw new Error(text || "Invalid JSON response from server");
        }

        if (!response.ok) {
            throw new Error(parsedData?.message || `Request failed: ${response.status}`);
        }

        return parsedData;

    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};