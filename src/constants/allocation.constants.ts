import { PiggyBank, Book, Gamepad2, TrendingUp, Heart, ListCheck } from "lucide-react";

export const ALLOCATION_METHOD_KEY = {
  SIX_JAR:  "six_jar",
  THREE_JAR: "three_jar",
  ZERO_BASED: "zero_based"
}
export const DEFAULT_ALLOCATION_METHODS = [
  {
    key:ALLOCATION_METHOD_KEY.SIX_JAR,
    label: "6 Jar Method",
    description:
      "A budgeting method that divides income into six categories: Necessities, Savings, Education, Play, Long-term Savings for Spending, and Give.",
  },
  {
    key: ALLOCATION_METHOD_KEY.THREE_JAR,
    label: "50/30/20 Rule",
    description:
      "A budgeting method that allocates 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.",
  },
  {
    key: ALLOCATION_METHOD_KEY.ZERO_BASED,
    label: "Zero-Based Budgeting",
    description:
      "A budgeting method where every dollar of income is allocated to expenses, savings, or debt repayment, leaving a zero balance at the end of the month.",
  },
];

export const SIX_JAR_METHOD = {
  needs: {
    label: "Necessities",
    description: "Essential expenses like housing, food, and utilities.",
    color: "bg-blue-500",
    icon: ListCheck,
    iconKey: "ListCheck",
  },
  savings: {
    label: "Savings",
    description: "Funds set aside for future needs or emergencies.",
    color: "bg-green-500",
    icon: PiggyBank,
    iconKey: "PiggyBank",
  },
  education: {
    label: "Education",
    description: "Investments in personal or professional development.",
    color: "bg-yellow-500",
    icon: Book,
    iconKey: "Book",
  },
  play: {
    label: "Play",
    description: "Discretionary spending for leisure and entertainment.",
    color: "bg-purple-500",
    icon: Gamepad2,
    iconKey: "Gamepad2",
  },
  investment: {
    label: "Long-term Savings",
    description: "Funds allocated for long-term financial goals or investments.",
    color: "bg-orange-500",
    icon: TrendingUp,
    iconKey: "TrendingUp",
  },
  give: {
    label: "Give",
    description: "Charitable donations or gifts to others.",
    color: "bg-red-500",
    icon: Heart,
    iconKey: "Heart",
  },
};
export const THREE_JAR_METHOD = {
  needs: {
    label: "Necessities",
    description: "Essential expenses like housing, food, and utilities.",
    color: "bg-blue-500",
    icon: ListCheck,
    iconKey: "ListCheck",
  },
  savings: {
    label: "Savings",
    description: "Funds set aside for future needs or emergencies.",
    color: "bg-green-500",
    icon: PiggyBank,
    iconKey: "PiggyBank",
  },
  wants: {
    label: "Wants",
    description: "Discretionary spending for leisure and entertainment.",
    color: "bg-yellow-500",
    icon: Book,
    iconKey: "Book",
  },
};

export const BUDGET_TYPE_LABELS: Record<string, string> = {
  six_jar: "6 Jar Method",
  three_jar: "50/30/20 Rule",
  zero_based: "Zero-Based",
};
