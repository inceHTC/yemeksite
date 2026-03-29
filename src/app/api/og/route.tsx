import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Bebek Tarifi";
  const age = searchParams.get("age") ?? "";
  const imageUrl = searchParams.get("image") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #FAFAF8 0%, #FFF5F5 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 107, 107, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(78, 205, 196, 0.08)",
          }}
        />

        {/* Content layout */}
        <div style={{ display: "flex", flex: 1, padding: "60px" }}>
          {/* Left: text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
              paddingRight: imageUrl ? "60px" : "0",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#FF6B6B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                🥣
              </div>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#FF6B6B",
                  letterSpacing: "-0.5px",
                }}
              >
                Tok Bebek
              </span>
            </div>

            {/* Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {age && (
                <div
                  style={{
                    display: "inline-flex",
                    background: "rgba(255, 107, 107, 0.12)",
                    borderRadius: "999px",
                    padding: "8px 20px",
                    width: "fit-content",
                  }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#FF6B6B",
                    }}
                  >
                    {age} Aylık Bebek
                  </span>
                </div>
              )}
              <div
                style={{
                  fontSize: title.length > 30 ? "52px" : "64px",
                  fontWeight: "800",
                  color: "#2D3436",
                  lineHeight: "1.1",
                  letterSpacing: "-1px",
                }}
              >
                {title}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                fontSize: "18px",
                color: "#636e72",
              }}
            >
              tokbebek.com.tr • Bebek Yemekleri Tarifleri
            </div>
          </div>

          {/* Right: image */}
          {imageUrl && (
            <div
              style={{
                width: "340px",
                height: "340px",
                borderRadius: "32px",
                overflow: "hidden",
                flexShrink: 0,
                alignSelf: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title}
                width={340}
                height={340}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
