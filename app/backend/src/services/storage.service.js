import { supabase } from "../config/supabase.js";
import fs from "fs";
import path from "path";

export async function uploadBufferToSupabase(file) {
    try {
        const fileBuffer = file.buffer;
        const ext = file.mimetype.split("/")[1];

        const fileName = `${Date.now()}.${ext}`;

        const { error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(fileName, fileBuffer, {
                contentType: file.mimetype,
            });

        if (error) throw error;

        const { data } = supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .getPublicUrl(fileName);

        return data.publicUrl;

    } catch (error) {
        throw new Error(error.message);
    }
}

export async function uploadPathToSupabase(filePath) {
    try {
        const fileBuffer = fs.readFileSync(filePath);

        const ext = path.extname(filePath).toLowerCase();

        let contentType = "image/jpeg";
        if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".png") contentType = "image/png";
        else if (ext === ".avif") contentType = "image/avif";

        const fileName = `${Date.now()}-${path.basename(filePath)}`;

        const { error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(fileName, fileBuffer, { contentType });

        if (error) throw error;

        const { data } = supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .getPublicUrl(fileName);

        return data.publicUrl;

    } catch (error) {
        throw new Error(error.message);
    }
}