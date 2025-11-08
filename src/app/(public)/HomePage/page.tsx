import type { Metadata } from "next";
import HomePage from "./homePage";

export const metadata: Metadata = {
  title: "Pomodoro | Início",
  description: "Gerencie ciclos de foco com o Pomodoro Project.",
};

export default function Page() {
  return <HomePage />;
}
