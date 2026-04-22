import { supabase } from "../config/supabase.js";

export const uploadToSupabase = async (file) => {
    const fileName = `posters/${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
        .from("posters") // bucket name
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) {
        throw new Error(error.message);
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
        .from("posters")
        .getPublicUrl(fileName);

    return publicUrl.publicUrl;
};