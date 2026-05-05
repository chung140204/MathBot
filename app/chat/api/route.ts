import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json();
    const { messages, imageBase64 } = body;
    let { sessionId } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1].content;
    let isNewSession = false;

    if (!sessionId) {
      isNewSession = true;
      const newTitle = lastUserMessage.substring(0, 50) + (lastUserMessage.length > 50 ? '...' : '');
      const newSession = await prisma.chatSession.create({
        data: {
          userId,
          title: newTitle,
        }
      });
      sessionId = newSession.id;
    }

    const encoder = new TextEncoder();

    const saveToDatabase = async (assistantContent: string) => {
      try {
        await Promise.all([
          prisma.chatMessage.create({
            data: {
              chatSessionId: sessionId,
              role: 'user',
              content: lastUserMessage,
            }
          }),
          prisma.chatMessage.create({
            data: {
              chatSessionId: sessionId,
              role: 'assistant',
              content: assistantContent,
            }
          })
        ]);
        
        await prisma.chatSession.update({
          where: { id: sessionId },
          data: { updatedAt: new Date() }
        });
      } catch (dbError) {
        console.error('Error saving chat to database:', dbError);
      }
    };

    if (!process.env.OPENAI_API_KEY) {
      const stream = new ReadableStream({
        async start(controller) {
          if (isNewSession) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'session', sessionId })}\n\n`));
          }
          const mockText = "Chào bạn! Đây là câu trả lời mẫu từ MathBot. Để sử dụng AI thật, hãy thêm OPENAI_API_KEY vào file .env nhé.\n\nPhần giải bài tập:\n1. Bước 1: Tính đạo hàm...\n2. Bước 2: Kết quả cuối cùng.";
          const words = mockText.split(' ');
          let fullResponse = "";
          for (const word of words) {
            fullResponse += word + ' ';
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: word + ' ' })}\n\n`));
            await new Promise(r => setTimeout(r, 50));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          await saveToDatabase(fullResponse.trim());
        },
      });
      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const systemPrompt = {
      role: 'system' as const,
      content: `Bạn là trợ lý giải toán cho học sinh THPT Việt Nam.

=====================
NGÔN NGỮ (BẮT BUỘC)
=====================

- Chỉ sử dụng tiếng Việt 100%
- Không sử dụng tiếng Anh, tiếng Trung hoặc ký tự lạ
- Nếu lỡ sinh ra từ không phải tiếng Việt → phải tự sửa lại

=====================
FORMAT STREAMING (RẤT QUAN TRỌNG)
=====================

Vì câu trả lời được hiển thị theo dạng streaming (từng phần một), nên phải tuân thủ:

- Không được tạo chuỗi ký tự dễ bị cắt dở gây lỗi
- Không sử dụng HTML (ví dụ: <br>, <div>, ...)
- Không viết công thức LaTeX dài trên cùng dòng với text
- Công thức phải nằm trên dòng riêng

=====================
LATEX (BẮT BUỘC)
=====================

- Tất cả công thức phải dùng LaTeX
- Công thức lớn phải dùng:

$$
...
$$

- Không được đặt tiếng Việt trực tiếp trong công thức
- Nếu cần chữ → dùng \\text{}

Ví dụ đúng:
$$
P(A) = \\frac{\\text{số cách có lợi}}{\\text{tổng số cách}}
$$

=====================
CẤU TRÚC TRẢ LỜI
=====================

Luôn chia rõ:

## 🧠 Lời giải

- Trình bày từng bước
- Mỗi bước cách dòng

## ✅ Kết quả

- Mỗi câu có kết quả riêng
- Công thức đặt riêng dòng

=====================
QUY TẮC QUAN TRỌNG
=====================

- Không viết đoạn văn dài liên tục
- Mỗi ý phải xuống dòng
- Tránh viết quá dài trong một dòng (dễ vỡ khi stream)
- Ưu tiên nhiều dòng ngắn, rõ ràng

=====================
STRICT MODE
=====================

Trước khi trả lời, kiểm tra:

- Có HTML không? → nếu có, loại bỏ
- Có công thức sai format không?
- Có dòng quá dài không (dễ gây lỗi stream)?

Chỉ trả lời khi nội dung sạch, rõ ràng, và an toàn cho streaming.`,
    };

    const isNvidia = !!process.env.NVIDIA_BASE_URL;
    
    // Format messages for OpenAI API (Vision support)
    const apiMessages = [...messages];
    if (imageBase64 && apiMessages.length > 0) {
      const lastIndex = apiMessages.length - 1;
      const lastMsgText = apiMessages[lastIndex].content.replace(`![image](${imageBase64})\n\n`, '');
      apiMessages[lastIndex] = {
        role: 'user',
        content: [
          { type: 'text', text: lastMsgText || "Giải bài tập trong ảnh" },
          { type: 'image_url', image_url: { url: imageBase64 } }
        ]
      };
    }

    const response = await openai.chat.completions.create({
      model: imageBase64 ? 'meta/llama-3.2-90b-vision-instruct' : (process.env.NVIDIA_MODEL || 'gpt-4o'),
      messages: [systemPrompt, ...apiMessages],
      temperature: isNvidia ? 0.2 : 0.3,
      top_p: isNvidia ? 0.7 : undefined,
      max_tokens: 4096,
      stream: true,
      ...(isNvidia && !imageBase64 && {
        // @ts-ignore — NVIDIA-specific params
        extra_body: {
          chat_template_kwargs: { enable_thinking: true },
          reasoning_budget: 16384,
        },
      }),
    });

    const stream = new ReadableStream({
      async start(controller) {
        if (isNewSession) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'session', sessionId })}\n\n`));
        }
        let fullResponse = "";
        let thinkingStarted = false;
        let thinkingDone = false;
        for await (const chunk of response) {
          const delta = chunk.choices[0]?.delta as any;
          const reasoning: string | undefined = delta?.reasoning_content;
          const content: string | undefined = delta?.content;

          if (reasoning) {
            if (!thinkingStarted) {
              thinkingStarted = true;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'thinking_start' })}\n\n`));
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ reasoning })}\n\n`));
          }

          if (content) {
            if (thinkingStarted && !thinkingDone) {
              thinkingDone = true;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'thinking_end' })}\n\n`));
            }
            fullResponse += content;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
        await saveToDatabase(fullResponse);
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
