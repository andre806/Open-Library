import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Registro de usuário
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const db = await run();
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashPassword,
    });

    // Gera o token JWT
    const token = jwt.sign(
      { _id: result.insertedId, name, email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { _id: result.insertedId, name, email, token },
      { status: 201 }
    );
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || "Error registering user." }, { status: 500 });
  }
}