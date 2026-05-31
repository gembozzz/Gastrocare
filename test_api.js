

async function test() {
    try {
        const response = await fetch("https://canopus77-gastrocare.hf.space/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Halo\n\n(Instruksi: Tolong jawab dalam Bahasa Indonesia)",
                history_prediction: {
                  prediksi: "",
                  kepercayaan: "",
                  top3: [],
                  semua_probabilitas: {},
                  gejala_input: {},
                  peringatan: ""
                }
            })
        });
        
        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Response text:", text);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
