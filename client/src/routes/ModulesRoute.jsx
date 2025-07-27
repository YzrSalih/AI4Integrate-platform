import React from "react";
import LearningModules from "../pages/LearningModules";
import ChatGPTPractice from '../pages/ChatGPTPractice';

export default function ModulesRoute() {
  return (
    <>
      <LearningModules />
      {/* Diğer route'lar arasında ChatGPT Practice route'u ekleniyor */}
      {/* Örnek olarak: */}
      {/* <Route path="/gpt-practice" element={<ChatGPTPractice />} /> */}
    </>
  );
}
