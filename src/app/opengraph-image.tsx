import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Vinay Kumar Vemula - Full Stack Developer";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #2D1B13 0%, #1A0F0A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(160,82,45,0.4) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(210,105,30,0.3) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "16px 32px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "100px",
              color: "#E2A76F",
              fontSize: "32px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            Portfolio
          </div>
          <h1
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: "#ffffff",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Vinay Kumar Vemula
          </h1>
          <p
            style={{
              fontSize: "48px",
              color: "#C2A38F",
              margin: 0,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            AI-Augmented Full Stack Developer
          </p>
          
          <div style={{ display: "flex", gap: "24px", marginTop: "48px" }}>
            {["React", "Next.js", "TypeScript", "Tailwind CSS", "Firebase"].map((tech) => (
              <div
                key={tech}
                style={{
                  fontSize: "24px",
                  color: "#E6D0BA",
                  background: "rgba(0, 0, 0, 0.3)",
                  padding: "12px 24px",
                  borderRadius: "16px",
                  border: "1px solid rgba(226, 167, 111, 0.2)",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
