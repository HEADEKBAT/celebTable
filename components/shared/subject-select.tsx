"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

const subjectOptions = [
  "universal", "weightloss", "hypertension", "enlargement", "potency", "diabetes", "joints",
  "hair", "varicose", "eyesight", "hearing", "prostatitis", "parasites", "cystitis", "snoring",
  "wrinkles", "fungus", "liver", "hemorrhoids", "crypto", "breast", "smoking", "gastritis",
  "valgus", "alcoholism", "psoriasis", "immunity", "rejuvenation", "lungs",
];

interface SubjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

export const SubjectSelect = ({ value, onChange, hasError }: SubjectSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={clsx({ "border-red-500": hasError })}>
        <SelectValue placeholder="Субъект" />
      </SelectTrigger>
      <SelectContent>
        {subjectOptions.map((subject) => (
          <SelectItem key={subject} value={subject}>
            {subject}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
