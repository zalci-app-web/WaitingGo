import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            color: "#fff",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px" }}>
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
             </svg>
          </div>
          <h1 style={{ fontSize: "64px", fontWeight: "bold", color: "#22d3ee", marginBottom: "20px" }}>
            WaitingGo
          </h1>
          <p style={{ fontSize: "36px", color: "#a1a1aa" }}>
            タップしてコンパスを起動し、合流相手の方向へ向かおう
          </p>
          {lat && lon && (
            <p style={{ fontSize: "24px", color: "#52525b", marginTop: "20px" }}>
              Target: {Number(lat).toFixed(4)}, {Number(lon).toFixed(4)}
            </p>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
