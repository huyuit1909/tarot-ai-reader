import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, cardName, orientation } = body;

    if (!topic || !cardName || !orientation) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `Bạn là bậc thầy Tarot. Hãy phân tích lá bài theo chủ đề được chọn. Trả về định dạng JSON hợp lệ (không chứa blockquote markdown) gồm: {"summary": "...", "analysis": "...", "advice": "...", "affirmation": "..."}.
    
Chủ đề: ${topic}
Lá bài: ${cardName}
Trạng thái: ${orientation === 'Upright' ? 'Xuôi' : 'Ngược'}

Hãy giải nghĩa lá bài này bằng Tiếng Việt, với văn phong sâu sắc và thấu cảm. Đảm bảo kết quả trả về hoàn toàn dưới dạng JSON hợp lệ và không có thêm bất kỳ text nào khác. Hãy tạo ra văn phong phù hợp với từng lá bài mọi thứ thật tự nhiên không cần nịnh bợ hãy chỉ nói sự thật`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonResponse = JSON.parse(cleanText);

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    return NextResponse.json(
      { error: "Không thể giải nghĩa lá bài lúc này. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
