export type HealthResponse = {
  status: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getHealth(): Promise<HealthResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${API_URL}/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Health request failed: ${response.status}`);
  }

  return response.json() as Promise<HealthResponse>;
}
