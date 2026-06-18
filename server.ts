import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI Assistant answers will default to informative mock mode.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

const app = express();
app.use(express.json());

const PORT = 3000;

// API Route: Intelligent Chat Assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    const systemInstruction = 
      "Você é o Assistente Virtual da Milene Torres (Contadora Especialista em MEI). " +
      "Seu objetivo é ajudar microempreendedores individuais com dúvidas comuns sobre MEI (abertura, guias DAS atrasadas, DASN-SIMEI, nota fiscal, alteração de dados, baixas e obrigações). " +
      "Responda sempre com simpatia, empatia e profissionalismo, em português do Brasil. " +
      "Use formatação clara em Markdown (com negritos e tópicos quando útil). " +
      "Sempre explique de forma simples e direta, sem jargões desnecessários, e enfatize os benefícios de regularizar o CNPJ (como aposentadoria, auxílio-doença, emissão de notas e credibilidade empresarial). " +
      "Crucial: finalize com um lembrete caloroso de que o usuário pode falar diretamente com a Milene Torres pelo WhatsApp (71 98280-7972) clicando no botão de contato direto presente na página para resolver tudo de forma rápida e 100% segura.";

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback response matches friendly assistant tone if no key
      return res.json({
        text: `Olá! Eu sou o Assistente Virtual da **Milene Torres**. Atualmente, estou em modo de demonstração. 

Furar as obrigações do MEI ou deixar guias DAS em atraso pode gerar multas e cancelamento de benefícios previdenciários. Para qualquer suporte com abertura, declaração anual, guias em atraso ou emissão de notas fiscais, você pode falar diretamente com a Milene!
        
Deseja falar diretamente com ela agora? Clique no botão **Falar com a Milene no WhatsApp** ao lado, ou salve o número: **(71) 98280-7972**.`
      });
    }

    const ai = getGeminiClient();
    
    // Format history for @google/genai SDK
    // The format should be contents array. Each element has role and parts.
    // e.g. contents: [{ role: 'user', parts: [{ text: '...' }] }]
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((h: { role: 'user' | 'model'; text: string }) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }
    
    // Append current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Desculpe, não consegui processar sua resposta no momento.";
    res.json({ text: replyText });

  } catch (error: any) {
    console.error("Erro na API de Chat:", error);
    res.status(500).json({ 
      error: "Desculpe, ocorreu um erro ao se comunicar com o assistente.", 
      details: error.message 
    });
  }
});

// Configure Vite or Static Assets based on Environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Iniciando em ambiente de Desenvolvimento (com Vite Middleware)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Iniciando em ambiente de Produção...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Porta de escuta do servidor ativa: http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Erro ao inicializar o servidor Express:", err);
});
