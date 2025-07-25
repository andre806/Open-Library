import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { run } from '@/lib/mongodb'
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
        const db = await run();
        const body = await req.json()
        const { email, password } = body;
        if (!email || !password) {
            return NextResponse.json({ error: "incorrect email or password " }, { status: 404 })
        }
        const user = await db.collection("users").findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })
        }
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!passwordValid) {
            return NextResponse.json({ error: "invalid password" }, { status: 401 })
        }
        const token = jwt.sign(
            { _id: user._id, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        return NextResponse.json({
            message: "Login successful.",
            token,
            user: { _id: user._id, name: user.name, email: user.email }
        }, { status: 200 });

    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message || "Error while logging in." }, { status: 500 });
    }
}

