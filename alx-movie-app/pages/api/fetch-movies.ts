// pages/api/fetch-movies.ts
import { MoviesProps } from "@/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const key = process.env.MOVIE_API_KEY;
    if (!key) {
      console.error("Missing MOVIE_API_KEY in process.env");
      return res.status(500).json({ message: "Server misconfiguration: missing API key" });
    }

    // build query params safely
    const { year, page = 1, genre } = req.body ?? {};
    const date = new Date();
    const params = new URLSearchParams({
      year: String(year || date.getFullYear()),
      sort: "year.decr",
      limit: "12",
      page: String(page),
    });
    if (genre) params.append("genre", String(genre));

    const url = `https://moviesdatabase.p.rapidapi.com/titles?${params.toString()}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
        "Accept": "application/json",
      },
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "<unable to read body>");
      console.error(`RapidAPI fetch failed: status=${resp.status}, body=${text.slice(0, 400)}`);
      return res.status(502).json({
        message: "Failed to fetch movies from upstream",
        upstreamStatus: resp.status,
        upstreamBodySnippet: text.slice(0, 400),
      });
    }

    const moviesResponse = await resp.json();
    const movies: MoviesProps[] = moviesResponse.results ?? [];

    return res.status(200).json({ movies });
  } catch (err) {
    console.error("Error in /api/fetch-movies:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}