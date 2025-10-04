import {
  CircleDollarSign,
  Gift,
  Blocks,
  Beef,
  Bus,
  ShoppingCart,
  NotebookPen,
  Gamepad2,
  HeartPulse,
} from "lucide-react";

export const INCOME_CATEGORIES = [
  {
    value: "salary",
    label: "Salary",
    icon: <CircleDollarSign />,
  },
  {
    value: "gift",
    label: "Gift",
    icon: <Gift />,
  },
  {
    value: "other",
    label: "Other",
    icon: <Blocks />,
  },
];

export const EXPENSE_CATEGORIES = [
  {
    value: "food",
    label: "Food",
    icon: <Beef />,
  },
  {
    value: "transport",
    label: "Transport",
    icon: <Bus />,
  },
  {
    value: "shopping",
    label: "Shopping",
    icon: <ShoppingCart />,
  },
  {
    value: "health",
    label: "Health",
    icon: <HeartPulse />,
  },
  {
    value: "education",
    label: "Education",
    icon: <NotebookPen />,
  },
  {
    value: "entertainment",
    label: "Entertainment",
    icon: <Gamepad2 />,
  },
  {
    value: "other",
    label: "Other",
    icon: <Blocks />,
  },
];
