import { getHealth } from "@/lib/api";

export default async function Home() {
  let backendStatus: string;

  try {
    const health = await getHealth();
    backendStatus = health.status;
  } catch (error) {
    console.error("Unable to connect to the backend:", error);
    backendStatus = "unavailable";
  }

  return (
    <main>
      <h1>Document Requirements Analyzer</h1>
      <p>Backend status: {backendStatus}</p>
    </main>
  );
}
