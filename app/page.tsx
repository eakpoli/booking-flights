"use client";

import { useState } from "react";
import { Search, Plane, Calendar, MapPin, Loader2, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  generateAccessToken,
  getFlightDestinations,
  getFlightOffers,
} from "@/lib/amadeus";

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: new Date(),
  });
  const [inspirationParams, setInspirationParams] = useState({
    origin: "",
    maxPrice: "",
    nonStop: false,
  });
  const [flights, setFlights] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getFlightOffers({
        originLocationCode: searchParams.from,
        destinationLocationCode: searchParams.to,
        departureDate: format(searchParams.date, "yyyy-MM-dd"),
      });

      console.log(response);

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }

      const data = await response.json();
      setFlights(data);
    } catch (err) {
      setError("Une erreur s'est produite lors de la recherche des vols");
    } finally {
      setLoading(false);
    }
  };

  const handleInspirationSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/flight-inspiration?origin=${inspirationParams.origin}&maxPrice=${inspirationParams.maxPrice}&nonStop=${inspirationParams.nonStop}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch destinations");
      }

      const data = await response.json();
      setDestinations(data);
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de la recherche des destinations"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80"
            alt="Hero background"
            className="w-full h-full object-cover opacity-20"
            layout="fill"
          />
        </div>
        <div className="relative max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Trouvez les meilleurs vols au meilleur prix
          </h1>

          {/* Search Tabs */}
          <Card className="p-6 shadow-lg">
            <Tabs defaultValue="search" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Recherche de vol</TabsTrigger>
                <TabsTrigger value="inspiration">
                  Inspiration voyage
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Départ (ex: CDG)"
                      className="pl-10"
                      value={searchParams.from}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          from: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Destination (ex: JFK)"
                      className="pl-10"
                      value={searchParams.to}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          to: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <DatePicker
                      date={searchParams.date}
                      setDate={(date) =>
                        setSearchParams({
                          ...searchParams,
                          date: date || new Date(),
                        })
                      }
                    />
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    {loading ? "Recherche..." : "Rechercher"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="inspiration">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Ville de départ (ex: PAR)"
                      className="pl-10"
                      value={inspirationParams.origin}
                      onChange={(e) =>
                        setInspirationParams({
                          ...inspirationParams,
                          origin: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Budget maximum (€)"
                      value={inspirationParams.maxPrice}
                      onChange={(e) =>
                        setInspirationParams({
                          ...inspirationParams,
                          maxPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleInspirationSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Globe className="mr-2 h-4 w-4" />
                    )}
                    {loading ? "Recherche..." : "Découvrir"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {flights.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              Résultats de recherche
            </h2>
            <div className="grid gap-6">
              {flights.map((flight: any) => (
                <Card key={flight.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Plane className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {flight.itineraries[0].segments[0].carrierCode}
                        </h3>
                        <div className="flex items-center space-x-8 mt-2">
                          <div>
                            <p className="text-lg font-semibold">
                              {flight.itineraries[0].segments[0].departure.at.slice(
                                11,
                                16
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {
                                flight.itineraries[0].segments[0].departure
                                  .iataCode
                              }
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-[2px] w-16 bg-gray-300"></div>
                            <Plane className="h-4 w-4 text-gray-400" />
                            <div className="h-[2px] w-16 bg-gray-300"></div>
                          </div>
                          <div>
                            <p className="text-lg font-semibold">
                              {flight.itineraries[0].segments[0].arrival.at.slice(
                                11,
                                16
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {
                                flight.itineraries[0].segments[0].arrival
                                  .iataCode
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {flight.price.total}€
                      </p>
                      <p className="text-sm text-gray-500">
                        {flight.itineraries[0].duration
                          .replace("PT", "")
                          .toLowerCase()}
                      </p>
                      <Button className="mt-2">Réserver</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {destinations.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              Destinations suggérées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination: any) => (
                <Card key={destination.destination} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {destination.destination}
                        </h3>
                        <p className="text-sm text-gray-500">
                          à partir de {destination.price.total}€
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSearchParams({
                        ...searchParams,
                        from: inspirationParams.origin,
                        to: destination.destination,
                      });
                    }}
                  >
                    Voir les vols
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
