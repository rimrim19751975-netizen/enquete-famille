"use client";

import { FormWizard } from "@/components/FormWizard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            استبيان الأسرة / Enquête Famille
          </h1>
          <p className="text-gray-600">
            من فضلك املأ جميع المعلومات المطلوبة / Veuillez remplir toutes les informations requises
          </p>
        </div>
        <FormWizard />
      </div>
    </main>
  );
}
