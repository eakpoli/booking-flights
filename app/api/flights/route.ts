import { NextRequest, NextResponse } from "next/server";
import { getFlightOffers } from "@/lib/amadeus";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const originLocationCode = searchParams.get("from");
  const destinationLocationCode = searchParams.get("to");
  const departureDate = searchParams.get("date");
  const adults = searchParams.get("adults") || "1";

  if (!originLocationCode || !destinationLocationCode || !departureDate) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const response = await getFlightOffers({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      max: 10,
      currencyCode: "EUR",
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("API error:", error.response?.data || error);
    return NextResponse.json(
      {
        error: "Failed to fetch flights",
        details: error.response?.data?.errors || error.message,
      },
      { status: 500 }
    );
  }
}
