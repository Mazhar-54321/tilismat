import React, { useMemo, useState } from "react";
import { Box, TextField, Typography, Paper, Stack, Button } from "@mui/material";

// Abjad-e-Kabir map
const ABJAD: Record<string, number> = {
  ا: 1, ب: 2, ج: 3, د: 4, ه: 5, و: 6, ز: 7, ح: 8, ط: 9,
  ي: 10, ك: 20, ل: 30, م: 40, ن: 50, س: 60, ع: 70, ف: 80, ص: 90,
  ق: 100, ر: 200, ش: 300, ت: 400, ث: 500, خ: 600, ذ: 700, ض: 800, ظ: 900, غ: 1000,
};

// Normalize Arabic: remove diacritics, unify letter forms
const normalizeArabic = (text: string) =>
  text
    // remove harakat & Quranic marks
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    // remove tatweel
    .replace(/\u0640/g, "")
    // alif variants → alif
    .replace(/[\u0622\u0623\u0625\u0671]/g, "ا")
    // ta marbuta → heh
    .replace(/\u0629/g, "ه")
    // alif maqsura → ya
    .replace(/\u0649/g, "ي");

function digitSum(n: number) {
  return n
    .toString()
    .split("")
    .reduce((s, d) => s + Number(d), 0);
}

export default function Kanoon1() {
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);

  const calc = useMemo(() => {
    const cleaned = normalizeArabic(input);
    let adad = 0;
    let validCount = 0;

    for (const ch of cleaned) {
      if (ABJAD[ch] !== undefined) {
        adad += ABJAD[ch];
        validCount++;
      }
    }

    const step1 = adad;                 // Abjad total
    const step2 = step1 * step1;        // square
    const step3 = step2 * validCount;   // × valid letters count
    const step4 = digitSum(step3);      // digit sum
    const tilism = step4 * step3;       // final

    return { cleaned, validCount, step1, step2, step3, step4, tilism };
  }, [input]);

  const handleReset = () => {
    setInput("");
    setShowResult(false);
  };

  return (
    <Box dir="rtl" sx={{ p: 3, maxWidth: 720, mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        حسابِ ابجد (مرحلہ وار)
      </Typography>

      <TextField
        fullWidth
        label="براہِ کرم آیت یا اسمِ الٰہی درج کریں"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowResult(true)}
          disabled={!input.trim()}
        >
          حساب لگائیں
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          ری سیٹ کریں
        </Button>
      </Stack>

      {showResult && (
  <Paper sx={{ mt: 3, p: 3 }}>
    <Typography sx={{ mb: 2, fontSize: "1.4rem" }}>
      متن (صاف): <b dir="rtl">{calc.cleaned}</b>
    </Typography>

    <Typography sx={{ fontSize: "1.2rem" }}>
      حروفِ معتبر کی تعداد: <b>{calc.validCount}</b>
    </Typography>

    <Box sx={{ mt: 3 }}>
      <Typography sx={{ fontSize: "1.2rem", mb: 1 }}>
        مرحلہ 1 (عدد/Abjad): <b>{calc.step1.toLocaleString()}</b>
      </Typography>

      <Typography sx={{ fontSize: "1.2rem", mb: 1 }}>
        مرحلہ 2 (خود سے ضرب): <b>{calc.step2.toLocaleString()}</b>
      </Typography>

      <Typography sx={{ fontSize: "1.2rem", mb: 1 }}>
        مرحلہ 3 (× حروف کی تعداد): <b>{calc.step3.toLocaleString()}</b>
      </Typography>

      <Typography sx={{ fontSize: "1.2rem", mb: 1 }}>
        مرحلہ 4 (اعداد کا مجموعہ): <b>{calc.step4}</b>
      </Typography>

      <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold", fontSize: "1.6rem" }}>
        طلسم: <b>{calc.tilism.toLocaleString()}</b>
      </Typography>
    </Box>
  </Paper>
)}

    </Box>
  );
}
