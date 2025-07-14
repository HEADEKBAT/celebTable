"use client";

import clsx from "clsx";

interface SubjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

const subjectOptions = [
  "universal", "weightloss", "hypertension", "enlargement", "potency", "diabetes", "joints",
  "hair", "varicose", "eyesight", "hearing", "prostatitis", "parasites", "cystitis", "snoring",
  "wrinkles", "fungus", "liver", "hemorrhoids", "crypto", "breast", "smoking", "gastritis",
  "valgus", "alcoholism", "psoriasis", "immunity", "rejuvenation", "lungs",
];

export const SubjectSelect = ({ value, onChange, hasError }: SubjectSelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        "w-full border rounded px-3 py-2",
        hasError && "border-red-500"
      )}
    >
      <option value="" disabled>
        Субъект
      </option>
      {subjectOptions.map((subject) => (
        <option key={subject} value={subject}>
          {subject}
        </option>
      ))}
    </select>
  );
};
