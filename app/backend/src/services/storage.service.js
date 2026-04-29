import { supabase } from "../config/supabase.js";
import { Buffer } from "buffer";

async function uploadToSupabase(buffer, fileName, contentType) {
    const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, buffer, {
            contentType,
            upsert: true,
        });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(fileName);

    return data.publicUrl;
}

export async function uploadBufferToSupabase(file) {
    if (!file?.buffer) {
        throw new Error("Invalid file buffer");
    }

    const buffer = file.buffer;

    const ext = file.mimetype?.split("/")[1] || "jpg";
    const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${ext}`;

    return uploadToSupabase(buffer, fileName, file.mimetype);
}

export async function uploadBase64ToSupabase(base64, prefix = "img") {
    if (!base64) {
        throw new Error("Invalid base64 data");
    }

    const buffer = Buffer.from(base64, "base64");

    const fileName = `${Date.now()}-${prefix}.webp`;

    return uploadToSupabase(buffer, fileName, "image/webp");
}