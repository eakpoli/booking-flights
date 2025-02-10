import { NextResponse } from "next/server";
import { getFlightDestinations } from "@/lib/amadeus";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const maxPrice = searchParams.get("maxPrice");
  const nonStop = searchParams.get("nonStop") === "true";

  if (!origin) {
    return NextResponse.json(
      { error: "Origin is required" },
      { status: 400 }
    );
  }

  try {
    const response = await getFlightDestinations({
      origin,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      nonStop,
      currencyCode: "EUR",
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("API error:", error.response?.data || error);
    return NextResponse.json(
      { 
        error: "Failed to fetch destinations",
        details: error.response?.data?.errors || error.message 
      }, 
      { status: 500 }
    );
  }
}