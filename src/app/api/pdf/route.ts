
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const pdfUrl = searchParams.get('url');
        const meta = searchParams.get('meta');
        if (!pdfUrl) {
            return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
        }

        // Baixa o PDF do Supabase Storage
        const pdfRes = await fetch(pdfUrl);
        if (!pdfRes.ok) {
            return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 404 });
        }
        const pdfBytes = new Uint8Array(await pdfRes.arrayBuffer());

        // Carrega o PDF
        const srcDoc = await PDFDocument.load(pdfBytes);
        const totalPages = srcDoc.getPageCount();

        // Se meta=1, retorna só o total de páginas
        if (meta === '1') {
            return NextResponse.json({ totalPages });
        }

        // Gera preview de até 10 páginas
        const previewDoc = await PDFDocument.create();
        const pagesToCopy = Math.min(10, totalPages);
        const copiedPages = await previewDoc.copyPages(srcDoc, Array.from({ length: pagesToCopy }, (_, i) => i));
        copiedPages.forEach((page) => previewDoc.addPage(page));
        const previewBytes = await previewDoc.save();

        return new NextResponse(Buffer.from(previewBytes), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="preview.pdf"',
                'Cache-Control': 'no-store',
            },
        });
    } catch (err: unknown) {
        let details = 'Erro desconhecido';
        if (err instanceof Error) {
            details = err.message;
        } else if (typeof err === 'object' && err && 'message' in err) {
            details = String((err as { message: unknown }).message);
        }
        return NextResponse.json({ error: 'Erro ao gerar preview', details }, { status: 500 });
    }
}
