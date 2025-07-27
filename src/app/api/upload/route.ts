import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const config = {
  api: { bodyParser: false },
};

export async function POST(request: NextRequest) {
  try {

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const cover = formData.get("capa") as File | null; // novo campo capa
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const owner_id = formData.get("owner_id") as string;
    // Recebe as tags como string e converte para array (espera JSON.stringify no frontend)
    const tagsRaw = formData.get("tags") as string;
    let tags: string[] = [];
    if (tagsRaw) {
      try {
        tags = JSON.parse(tagsRaw);
      } catch {
        tags = [];
      }
    }
    console.log("[UPLOAD] tags recebidas:", tags, "tipo:", Array.isArray(tags) ? "array" : typeof tags);

    if (!file) {
      return NextResponse.json({ error: "File is missing." }, { status: 400 });
    }

    // Upload do PDF
    const arrayBuffer = await file.arrayBuffer();
    const filename = file.name;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("pdfs")
      .upload(filename, new Blob([arrayBuffer]), {
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) {
      console.error("Supabase upload error:", storageError);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    // Upload da capa (se enviada), senão salva null
    let coverUrl: string | null = null;
    if (cover) {
      const coverBuffer = await cover.arrayBuffer();
      const coverFilename = `cover_${Date.now()}_${cover.name}`;
      const { data: coverData, error: coverError } = await supabase.storage
        .from("pdfs")
        .upload(coverFilename, new Blob([coverBuffer]), {
          cacheControl: "3600",
          upsert: false,
        });
      if (coverError) {
        console.error("Supabase cover upload error:", coverError);
        return NextResponse.json({ error: coverError.message }, { status: 500 });
      }
      // Monta a URL pública da capa
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      coverUrl = coverData?.path && supabaseUrl
        ? `${supabaseUrl}/storage/v1/object/public/pdfs/${coverData.path}`
        : null;
    } else {
      coverUrl = null;
    }

    // Salva metadados na tabela 'pdfs', incluindo tags e capa
    const { data: dbData, error: dbError } = await supabase
      .from("pdfs")
      .insert([
        {
          title,
          description,
          owner_id,
          path: storageData?.path,
          filename,
          tags,
          capa: coverUrl, // salva a url da capa
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Supabase DB insert error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "PDF uploaded and metadata saved successfully!",
      path: storageData?.path,
      pdf: dbData,
    });
  } catch (err) {
    const error = err as Error;
    console.error("API error:", err);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("pdfs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message || "Error fetching books" }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}