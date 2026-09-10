const API_URL = "http://localhost:8080/api/movements";

export async function getMovements(from, to, type) {

    const params = new URLSearchParams();

    params.append("from", from);
    params.append("to", to);

    if (type !== "ALL") {
        params.append("type", type);
    }

    const response = await fetch(
        `${API_URL}?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch movements");
    }

    return response.json();
}