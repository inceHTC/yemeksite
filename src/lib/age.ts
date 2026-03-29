export interface BabyAge {
  totalMonths: number;
  months: number;
  days: number;
  stage: AgeStage;
  label: string; // "8 ay 12 gün"
}

export type AgeStage =
  | "newborn"      // 0-3 ay
  | "first-foods"  // 4-6 ay
  | "explorer"     // 6-8 ay
  | "adventurer"   // 9-12 ay
  | "toddler-1"    // 12-18 ay
  | "toddler-2"    // 18-24 ay
  | "toddler-3";   // 24-36 ay

export function computeAge(birthDateStr: string | null): BabyAge | null {
  if (!birthDateStr) return null;

  const birth = new Date(birthDateStr);
  const today = new Date();

  if (isNaN(birth.getTime()) || birth > today) return null;

  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());

  const dayOfMonth = today.getDate();
  const birthDay = birth.getDate();

  if (dayOfMonth < birthDay) {
    months -= 1;
  }

  const lastMonthDate = new Date(today.getFullYear(), today.getMonth(), birthDay);
  if (dayOfMonth < birthDay) {
    const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, birthDay);
    const days = Math.floor(
      (today.getTime() - prevMonth.getTime()) / (1000 * 60 * 60 * 24)
    );
    return buildAge(months, days);
  }

  const days = Math.floor(
    (today.getTime() - lastMonthDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return buildAge(months, days);
}

function buildAge(months: number, days: number): BabyAge {
  const stage = getStage(months);
  const label = formatAgeLabel(months, days);

  return { totalMonths: months, months, days, stage, label };
}

function getStage(months: number): AgeStage {
  if (months < 4) return "newborn";
  if (months < 6) return "first-foods";
  if (months < 9) return "explorer";
  if (months < 12) return "adventurer";
  if (months < 18) return "toddler-1";
  if (months < 24) return "toddler-2";
  return "toddler-3";
}

function formatAgeLabel(months: number, days: number): string {
  if (months === 0) return `${days} gün`;
  if (days === 0) return `${months} ay`;
  return `${months} ay ${days} gün`;
}

export const STAGE_LABELS: Record<AgeStage, string> = {
  newborn: "Yenidoğan",
  "first-foods": "İlk Tatlar (4-6 ay)",
  explorer: "Kaşif (6-9 ay)",
  adventurer: "Maceracı (9-12 ay)",
  "toddler-1": "Küçük Gezgin (12-18 ay)",
  "toddler-2": "Keşifçi (18-24 ay)",
  "toddler-3": "Büyük Çocuk (24-36 ay)",
};

export const STAGE_AGE_RANGE: Record<AgeStage, [number, number]> = {
  newborn: [0, 3],
  "first-foods": [4, 5],
  explorer: [6, 8],
  adventurer: [9, 11],
  "toddler-1": [12, 17],
  "toddler-2": [18, 23],
  "toddler-3": [24, 36],
};
