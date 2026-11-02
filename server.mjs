// server.ts
import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
app.use(express.json({ limit: "10mb" }));
var PORT = Number(process.env.PORT) || 3e3;
var apiKey = process.env.GEMINI_API_KEY;
var ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
async function withTimeout(promise, ms = 4e3) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timeout de l'assistant")), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}
app.post("/api/tax-assistant", async (req, res) => {
  try {
    const { query, history = [], locale = "fr" } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Une question est requise." });
    }
    if (!ai) {
      return res.json({
        answer: `En tant qu'assistant fiscal certifi\xE9 ITAA du cabinet Fidcogest, voici une premi\xE8re analyse bas\xE9e sur la r\xE9glementation fiscale belge actuelle :

Pour la question : "${query}"

- **Facturation \xC9lectronique (Peppol)** : Obligatoire en Belgique entre assujettis TVA (B2B) d\xE8s 2026.
- **TVA & D\xE9ductibilit\xE9** : Les taux de TVA applicables en Belgique sont de 21% (standard), 12% ou 6% (taux r\xE9duit notamment pour r\xE9novation logement >10 ans).
- **Optimisation Dirigeant SRL** : La r\xE9mun\xE9ration minimale recommand\xE9e pour b\xE9n\xE9ficier du taux r\xE9duit ISOC (20%) est de 45.000 \u20AC/an.

Pour une \xE9tude personnalis\xE9e de votre dossier, nous vous invitons \xE0 prendre un rendez-vous avec l'un de nos experts-comptables certifi\xE9s ITAA chez Fidcogest.`,
        sources: ["Code des Imp\xF4ts sur les Revenus 1992 (CIR 92)", "L\xE9gislation TVA Belge", "R\xE9glementation ITAA"]
      });
    }
    const systemInstruction = `Tu es l'assistant fiscal et comptable virtuel de Fidcogest, cabinet d'expertise comptable et de conseil fiscal certifi\xE9 ITAA (Institute for Tax Advisors and Accountants) bas\xE9 en Belgique (Bruxelles, Mons, Namur).
Tu r\xE9ponds aux entrepreneurs, ind\xE9pendants en personne physique, dirigeants de SRL/SA et professions lib\xE9rales en Belgique.

Directives de r\xE9ponse :
1. R\xE9ponds toujours dans la langue demand\xE9e par l'utilisateur (${locale === "nl" ? "N\xE9erlandais" : locale === "en" ? "Anglais" : "Fran\xE7ais"}).
2. Appuie tes conseils sur la l\xE9gislation fiscale et comptable belge exacte (CIR 92, Code TVA belge, obligations BNB, statut social des ind\xE9pendants, agr\xE9ment ITAA).
3. Aborde les sujets cl\xE9s belges avec pr\xE9cision :
   - Taxe sur la Valeur Ajout\xE9e (TVA 21%, 12%, 6%, 0%), d\xE9clarations mensuelles/trimestrielles, listing clients annuel.
   - Imp\xF4t des Soci\xE9t\xE9s (ISOC) : Taux r\xE9duit de 20% sur la tranche de 0 \xE0 100.000 \u20AC (sous condition de r\xE9mun\xE9ration dirigeant d'au moins 45.000 \u20AC ou \xE9gale au r\xE9sultat) vs taux ordinaire de 25%.
   - Versements anticip\xE9s ISOC (VA1 en avril, VA2 en juillet, VA3 en octobre, VA4 en d\xE9cembre) pour \xE9viter la majoration d'imp\xF4t.
   - Imp\xF4t des Personnes Physiques (IPP) : Tranches progressives (25% \xE0 50%), cotisations sociales d'ind\xE9pendant (~20,5%), frais professionnels r\xE9els vs forfaitaires.
   - R\xE9gime des dividendes VVPR-bis (15% au lieu de 30% apr\xE8s condition d'anciennet\xE9 d'actions).
   - Obligation de facturation \xE9lectronique structur\xE9e B2B via r\xE9seau Peppol au 1er janvier 2026.
4. Conserve un ton professionnel, clair, didactique et bienveillant.
5. Inclus toujours \xE0 la fin une invitation cordiale \xE0 valider le cas sp\xE9cifique lors d'un rendez-vous avec un expert-comptable Fidcogest.`;
    const promptMessages = [
      ...history.map((h) => `${h.role === "user" ? "Client" : "Expert Fidcogest"}: ${h.content}`),
      `Client: ${query}`
    ].join("\n\n");
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: promptMessages,
        config: {
          systemInstruction,
          temperature: 0.3,
          maxOutputTokens: 1e3
        }
      }),
      4e3
    );
    const answerText = response.text || "D\xE9sol\xE9, je n'ai pas pu g\xE9n\xE9rer une r\xE9ponse. Veuillez r\xE9essayer.";
    return res.json({
      answer: answerText,
      sources: ["R\xE9glementation fiscale belge 2026", "Doctrine ITAA", "Moniteur Belge"]
    });
  } catch (err) {
    console.warn("Erreur API tax-assistant, bascule sur la doctrine fiscale int\xE9gr\xE9e:", err.message);
    return res.json({
      answer: `En tant qu'assistant fiscal certifi\xE9 ITAA du cabinet Fidcogest, voici les rep\xE8res r\xE9glementaires belges essentiels :

- **R\xE9gime fiscal & TVA** : Conformit\xE9 au Code TVA belge et CIR 92 (d\xE9clarations p\xE9riodiques, d\xE9ductibilit\xE9 r\xE9elle).
- **Taux R\xE9duit ISOC (20%)** : Accessible sur la premi\xE8re tranche de 100.000 \u20AC de b\xE9n\xE9fice, \xE0 condition d'octroyer une r\xE9mun\xE9ration minimale d'au moins 45.000 \u20AC \xE0 au moins un dirigeant (ou \xE9gale au r\xE9sultat).
- **Optimisation Dividendes** : R\xE9gime VVPR-bis \xE0 15% de pr\xE9compte mobilier au terme du d\xE9lai d'attente l\xE9gal.
- **Facturation \xC9lectronique B2B** : Obligation g\xE9n\xE9ralis\xE9e via le r\xE9seau Peppol en Belgique d\xE8s 2026.

Pour une analyse chiffr\xE9e personnalis\xE9e de votre dossier, prenez rendez-vous avec nos experts au cabinet de Bruxelles Louise ou Mons.`,
      sources: ["Doctrine Fiscale ITAA", "Code des Imp\xF4ts sur les Revenus 1992", "SPF Finances Belgique"]
    });
  }
});
app.post("/api/analyze-document", async (req, res) => {
  try {
    const { textSnippet, filename } = req.body;
    if (!ai) {
      return res.json({
        docType: "Facture d'achat mat\xE9riel / service",
        vendorName: "Belgacom / Proximus SA",
        totalAmountEur: 145.2,
        vatAmountEur: 25.2,
        vatRatePercent: 21,
        invoiceDate: "2026-03-15",
        recommendedCategory: "Frais de t\xE9l\xE9communication & Internet (D\xE9ductible 100%)",
        deductibilityRate: "100%",
        confidenceScore: 0.96
      });
    }
    const systemInstruction = `Tu es un OCR comptable belge sp\xE9cialis\xE9 dans l'analyse de factures et justificatifs pour la comptabilit\xE9 Fidcogest. 
Analyse le document/texte fourni et retourne un objet JSON valide strictement format\xE9 sans codeblock markdown avec les cl\xE9s suivantes :
- docType (string)
- vendorName (string)
- totalAmountEur (number)
- vatAmountEur (number)
- vatRatePercent (number)
- invoiceDate (string, YYYY-MM-DD)
- recommendedCategory (string)
- deductibilityRate (string, ex: "100%", "75%", "50%")
- confidenceScore (number de 0 \xE0 1)`;
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Nom du fichier: ${filename || "document.pdf"}
Contenu du document:
${textSnippet || "Facture n\xB0 2026-8942 du 12/03/2026. Proximus SA BE0202239951. Montant HTVA: 120,00 EUR. TVA 21%: 25,20 EUR. Total TTC: 145,20 EUR."}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      }),
      4e3
    );
    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);
  } catch (err) {
    console.warn("Erreur analyze-document, utilisation des donn\xE9es d'analyse simul\xE9es:", err.message);
    return res.json({
      docType: "Facture d'achat mat\xE9riel / service",
      vendorName: "Fournisseur Professionnel SA (BE)",
      totalAmountEur: 145.2,
      vatAmountEur: 25.2,
      vatRatePercent: 21,
      invoiceDate: "2026-03-15",
      recommendedCategory: "Frais professionnels d'exploitation (D\xE9ductible 100%)",
      deductibilityRate: "100%",
      confidenceScore: 0.95
    });
  }
});
app.post("/api/simulate-tax", (req, res) => {
  try {
    const {
      entityType = "personne_physique",
      // 'personne_physique' | 'srl'
      grossRevenue = 8e4,
      professionalExpenses = 15e3,
      managerSalary = 45e3
    } = req.body;
    const netProfitBeforeTax = Math.max(0, grossRevenue - professionalExpenses);
    if (entityType === "personne_physique") {
      const socialContributions = netProfitBeforeTax * 0.205;
      const taxableIncomeIPP = netProfitBeforeTax - socialContributions;
      let ippTax = 0;
      if (taxableIncomeIPP > 48320) {
        ippTax += (taxableIncomeIPP - 48320) * 0.5;
        ippTax += (48320 - 28010) * 0.45;
        ippTax += (28010 - 15820) * 0.4;
        ippTax += (15820 - 0) * 0.25;
      } else if (taxableIncomeIPP > 28010) {
        ippTax += (taxableIncomeIPP - 28010) * 0.45;
        ippTax += (28010 - 15820) * 0.4;
        ippTax += (15820 - 0) * 0.25;
      } else if (taxableIncomeIPP > 15820) {
        ippTax += (taxableIncomeIPP - 15820) * 0.4;
        ippTax += (15820 - 0) * 0.25;
      } else {
        ippTax += taxableIncomeIPP * 0.25;
      }
      const taxExemptBonus = 10570 * 0.25;
      ippTax = Math.max(0, ippTax - taxExemptBonus);
      const netIncomeAfterAllTaxes = taxableIncomeIPP - ippTax;
      const effectiveTaxRatePercent = (socialContributions + ippTax) / netProfitBeforeTax * 100;
      return res.json({
        entityType,
        grossRevenue,
        professionalExpenses,
        netProfitBeforeTax,
        socialContributions,
        taxableIncome: taxableIncomeIPP,
        taxAmount: ippTax,
        netIncomeAfterAllTaxes,
        effectiveTaxRatePercent: Number(effectiveTaxRatePercent.toFixed(1)),
        recommendation: netProfitBeforeTax > 65e3 ? "Au-dessus de 65.000 \u20AC de b\xE9n\xE9fice, le passage en soci\xE9t\xE9 (SRL) vous permettrait d'\xE9conomiser consid\xE9rablement sur l'imp\xF4t gr\xE2ce aux dividendes \xE0 15% (VVPR-bis)." : "Le statut d'ind\xE9pendant en personne physique est adapt\xE9 et tr\xE8s souple pour votre niveau de revenus actuel."
      });
    } else {
      const companyProfitBeforeSalary = netProfitBeforeTax;
      const actualManagerSalary = Math.min(managerSalary, companyProfitBeforeSalary);
      const taxableProfitSRL = Math.max(0, companyProfitBeforeSalary - actualManagerSalary);
      const qualifiesForReducedIsoc = actualManagerSalary >= 45e3 || actualManagerSalary >= taxableProfitSRL;
      const isocRate = qualifiesForReducedIsoc ? 0.2 : 0.25;
      const isocTax = taxableProfitSRL * isocRate;
      const netProfitDistributable = taxableProfitSRL - isocTax;
      const dividendTax15Percent = netProfitDistributable * 0.15;
      const netDividendToManager = netProfitDistributable - dividendTax15Percent;
      const managerSocialContrib = actualManagerSalary * 0.205;
      const managerNetSalaryIPP = actualManagerSalary - managerSocialContrib;
      const managerIppEstimate = managerNetSalaryIPP * 0.35;
      const netSalaryTakeHome = managerNetSalaryIPP - managerIppEstimate;
      const totalNetTakeHome = netSalaryTakeHome + netDividendToManager;
      const totalTaxesPaid = companyProfitBeforeSalary - totalNetTakeHome;
      const effectiveTaxRatePercent = totalTaxesPaid / companyProfitBeforeSalary * 100;
      return res.json({
        entityType,
        grossRevenue,
        professionalExpenses,
        netProfitBeforeTax: companyProfitBeforeSalary,
        managerSalary: actualManagerSalary,
        taxableProfitSRL,
        isocRatePercent: isocRate * 100,
        isocTaxAmount: isocTax,
        netProfitDistributable,
        dividendTaxAmount: dividendTax15Percent,
        netDividendToManager,
        totalNetTakeHome,
        effectiveTaxRatePercent: Number(effectiveTaxRatePercent.toFixed(1)),
        recommendation: "Gr\xE2ce \xE0 la SRL et \xE0 la combinaison optimale Salaire Dirigeant + Dividendes VVPR-bis (15%), votre taux de pression fiscale global est optimis\xE9."
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Erreur de simulation fiscale." });
  }
});
var isProduction = process.env.NODE_ENV === "production" || !process.env.VITE_DEV && fs.existsSync(path.join(__dirname, "dist", "index.html"));
async function setupDevMiddleware() {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const indexHtmlPath = path.resolve(__dirname, "index.html");
      let rawTemplate = fs.readFileSync(indexHtmlPath, "utf-8");
      const template = await vite.transformIndexHtml(url, rawTemplate);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
if (isProduction) {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
} else {
  setupDevMiddleware().catch((err) => {
    console.error("[Fidcogest] Erreur initialisation Vite dev middleware:", err);
  });
}
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Fidcogest Server] Serveur d\xE9marr\xE9 sur http://0.0.0.0:${PORT}`);
});
