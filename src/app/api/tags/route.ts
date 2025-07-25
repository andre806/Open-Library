import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        let tags = body.tags;
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return NextResponse.json({ error: "tags array is required" }, { status: 400 });
        }
        // Normaliza para minúsculas e remove espaços extras
        tags = tags.map((t: string) => t.trim().toLowerCase()).filter((t: string) => t.length > 0);
        // Busca tags já existentes (case-insensitive)
        const { data: existing, error: fetchError } = await supabase
            .from("tags")
            .select("name")
            .in("name", tags);
        if (fetchError) {
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }
        const existingNames = (existing || []).map((t) => t.name.toLowerCase());
        // Filtra só as que não existem
        const newTags = tags.filter((t: string) => !existingNames.includes(t));
        if (newTags.length === 0) {
            return NextResponse.json({ message: "No new tags to create." }, { status: 200 });
        }
        // Insere as novas tags
        const insertObjs = newTags.map((name: string) => ({ name }));
        const { data: inserted, error: insertError } = await supabase
            .from("tags")
            .insert(insertObjs)
            .select();
        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
        return NextResponse.json({ message: "tags created", created: inserted }, { status: 201 });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message || "error creating tags" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("tags")
            .select("*")
            .order("name");
        if (error) {
            return NextResponse.json({ error: error.message || "error fetching tags" }, { status: 500 });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message || "error fetching tags" }, { status: 500 });
    }
}