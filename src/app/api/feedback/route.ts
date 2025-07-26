
import { run } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // Exige token JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não enviado." }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Token inválido ou expirado." }, { status: 401 });
    }
    const db = await run();
    const body = await req.json();
    const { owner, comment, stars } = body;

    // Insere o feedback no MongoDB
    const result = await db.collection("feedbacks").insertOne({ owner, comment, stars });

    return NextResponse.json({
      message: "Feedback sent successfully!",
      insertedId: result.insertedId,
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message || "An error occurred while sending feedback" },
      { status: 400 }
    );
  }
}
export async function GET(){
  const db = await run();
  const feedbacks = await db.collection("feedbacks").find().toArray()
  return NextResponse.json(feedbacks)

}