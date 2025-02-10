import axios from "axios";
import qs from "qs";

const baseUrl = "https://test.api.amadeus.com/v2";

export async function generateAccessToken() {
  const data = qs.stringify({
    grant_type: "client_credentials",
    client_id: process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET,
  });

  try {
    const response = await axios({
      method: "post",
      url: `https://test.api.amadeus.com/v1/security/oauth2/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
}

export async function getFlightOffers(params: any) {
  const accessToken = await generateAccessToken();
  const queryString = new URLSearchParams(params).toString();
  const url = `${baseUrl}/shopping/flight-offers?${queryString}`;

  console.log("url :>> ", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log({ response, url, accessToken });

    if (!response.ok) {
      throw new Error(`Error fetching flight offers: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getFlightDestinations(params: any) {
  const accessToken = await generateAccessToken();

  try {
    const response = await axios({
      method: "get",
      url: `${baseUrl}/shopping/flight-destinations`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching flight destinations:", error);
    throw error;
  }
}
