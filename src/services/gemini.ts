import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ReceiptData } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function parseReceiptImage(imageFile: File): Promise<ReceiptData> {
    if (!API_KEY) {
        throw new Error("Missing Gemini API Key");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    IMPORTANT: First verify this image is a receipt or bill from a restaurant, store, or business.
    If this is NOT a receipt/bill (e.g., random photo, document, meme, etc.), respond with:
    {"isReceipt": false}

    If it IS a valid receipt/bill, analyze it and extract the following data in strict JSON format:
    {
      "isReceipt": true,
      "items": [
        {
          "description": "Item Name",
          "price": 8.99,
          "originalPrice": 10.99,
          "discount": 2.00
        }
      ],
      "subtotal": 8.99,
      "tax": 1.00,
      "tip": 2.00,
      "total": 11.99
    }

    Rules:
    1. ONLY process images that are clearly receipts or bills with itemized purchases.
    2. Extract all line items.
    3. If an item has a discount/coupon/savings listed below it or associated with it:
       - Calculate the final "price" = original price - discount.
       - Set "originalPrice" to the listed price.
       - Set "discount" to the discount amount (positive number).
    4. If no discount, just set "price" and omit "originalPrice"/"discount".
    5. Do not list discounts as separate items. Merge them into the parent item.
    6. Ignore "Thank You" or other non-item text.
    7. Ensure all numbers are floats.
    `;

    // Convert file to base64
    const base64Data = await fileToGenerativePart(imageFile);

    try {
        const result = await model.generateContent([prompt, base64Data]);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini Raw Response:", text); // Debug log

        // Clean up markdown code blocks and other formatting
        let jsonString = text.trim();

        // Remove markdown code blocks (various formats)
        jsonString = jsonString.replace(/```json\s*/gi, "");
        jsonString = jsonString.replace(/```\s*/g, "");

        // Try to extract JSON if there's text before/after
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        }

        jsonString = jsonString.trim();

        try {
            const data = JSON.parse(jsonString);

            // Validate the structure
            if (!data || typeof data !== 'object') {
                throw new Error("Invalid response structure");
            }

            // Check if it's actually a receipt
            if (data.isReceipt === false) {
                throw new Error("This doesn't appear to be a receipt or bill. Please scan a valid receipt.");
            }

            // Ensure items array exists
            if (!Array.isArray(data.items)) {
                console.warn("No items array found, initializing empty array");
                data.items = [];
            }

            // Validate and clean items
            const validItems = data.items
                .filter((item: any) => {
                    // Item must have a description and a valid price
                    return item &&
                           typeof item.description === 'string' &&
                           item.description.trim() !== '' &&
                           typeof item.price === 'number' &&
                           !isNaN(item.price) &&
                           item.price >= 0;
                })
                .map((item: any) => ({
                    description: item.description.trim(),
                    price: parseFloat(item.price.toFixed(2)),
                    originalPrice: item.originalPrice ? parseFloat(item.originalPrice.toFixed(2)) : undefined,
                    discount: item.discount ? parseFloat(item.discount.toFixed(2)) : undefined,
                    id: crypto.randomUUID(),
                    assignedTo: []
                }));

            return {
                items: validItems,
                subtotal: typeof data.subtotal === 'number' ? parseFloat(data.subtotal.toFixed(2)) : 0,
                tax: typeof data.tax === 'number' ? parseFloat(data.tax.toFixed(2)) : 0,
                tip: typeof data.tip === 'number' ? parseFloat(data.tip.toFixed(2)) : 0,
                total: typeof data.total === 'number' ? parseFloat(data.total.toFixed(2)) : 0
            };
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Failed JSON string:", jsonString);
            throw new Error("Could not read the receipt clearly. Please try again with better lighting.");
        }
    } catch (error: any) {
        console.error("Error parsing receipt:", error);
        // If it's already a user-friendly message, keep it
        if (error.message?.includes("doesn't appear to be a receipt") ||
            error.message?.includes("Could not read") ||
            error.message?.includes("Missing Gemini API Key")) {
            throw error;
        }
        throw new Error("Something went wrong. Please try scanning again.");
    }
}

async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result?.toString().split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise as string,
            mimeType: file.type,
        },
    };
}
