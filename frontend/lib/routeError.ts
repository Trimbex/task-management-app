import { NextResponse } from "next/server";
import { BackendError } from "@/lib/backendApi";

export function errorResponse(error: unknown, fallback: string) {
  const status = error instanceof BackendError ? error.status : 500;
  const message = error instanceof Error ? error.message : fallback;

  return NextResponse.json({ error: { message } }, { status });
}
