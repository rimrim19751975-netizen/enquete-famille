"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, Save, Users, Home, User, Phone, MapPin, Heart, BookOpen, Briefcase, Activity } from "lucide-react";
import { choices, type ChoiceKey } from "@/db/choices";

interface Enfant {
  nom_enfant: string;
  age_enfant: string;
  sexe_enfant: string;
  localite_choisir: string;
  nouvelle_localite: string;
  situation_familialle: string;
  etat_habitation: string;
  activite_femme: string;
  nom_mere: string;
  niveau_scolaire: string;
  situation_profes: string;
  grade: string;
  nni_enfant: string;
  telephone_enfant: string;
  sante: string;
  maladie: string;
  a_des_enfants: string;
  petits_enfants: PetitsEnfants[];
}

interface PetitsEnfants {
  nom_enfant: string;
  sexe_enfant: string;
  age_enfant: string;
  niveau_scolaire: string;
}

interface FormData {
  nom_famille: string;
  nom_chef: string;
  est_il_vivant: string;
  age_chef: string;
  sexe_chef: string;
  telephone_chef: string;
  situation_familialle: string;
  identite_chef: string;
  localite_choisir: string;
  nouvelle_localite: string;
  etat_habitation: string;
  a_tu_des_enfants: string;
  nbre_enfants: string;
  zone_habitation: string;
  aide_gouvernementale: string;
  aide_details: string;
  photo_famille: string;
  gps_lat: string;
  gps_lng: string;
  gps_alt: string;
  gps_acc: string;
  enfants: Enfant[];
}

const initialEnfant = (): Enfant => ({
  nom_enfant: "", age_enfant: "", sexe_enfant: "", localite_choisir: "",
  nouvelle_localite: "", situation_familialle: "", etat_habitation: "",
  activite_femme: "", nom_mere: "", niveau_scolaire: "", situation_profes: "",
  grade: "", nni_enfant: "", telephone_enfant: "", sante: "", maladie: "",
  a_des_enfants: "", petits_enfants: [],
});

const initialPetitEnfant = (): PetitsEnfants => ({
  nom_enfant: "", sexe_enfant: "", age_enfant: "", niveau_scolaire: "",
});

const steps = [
  { id: "famille", label_ar: "معلومات الأسرة", label_fr: "Famille", icon: Home },
  { id: "chef", label_ar: "رب الأسرة", label_fr: "Chef de famille", icon: User },
  { id: "contact", label_ar: "معلومات الاتصال", label_fr: "Contact", icon: Phone },
  { id: "habitation", label_ar: "السكن", label_fr: "Habitation", icon: MapPin },
  { id: "enfants", label_ar: "الأولاد", label_fr: "Enfants", icon: Users },
  { id: "sante", label_ar: "الصحة", label_fr: "Santé", icon: Heart },
  { id: "scolarite", label_ar: "التعليم", label_fr: "Éducation", icon: BookOpen },
  { id: "profession", label_ar: "المهنة", label_fr: "Profession", icon: Briefcase },
  { id: "recap", label_ar: "الملخص", label_fr: "Récapitulatif", icon: Activity },
];

function Select({ value, onChange, choices, label_ar, label_fr }: {
  value: string; onChange: (v: string) => void;
  choices: readonly { value: string; label_ar: string; label_fr: string }[];
  label_ar: string; label_fr: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <span className="ml-1">{label_ar}</span>
        <span className="text-gray-400 text-xs">({label_fr})</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      >
        <option value="">-- اختر / Choisir --</option>
        {choices.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label_ar} - {c.label_fr}
          </option>
        ))}
      </select>
    </div>
  );
}

function Input({ value, onChange, label_ar, label_fr, type = "text", placeholder_ar, placeholder_fr, pattern, error }: {
  value: string; onChange: (v: string) => void;
  label_ar: string; label_fr: string;
  type?: string; placeholder_ar?: string; placeholder_fr?: string;
  pattern?: string; error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <span className="ml-1">{label_ar}</span>
        <span className="text-gray-400 text-xs">({label_fr})</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder_fr}
        pattern={pattern}
        className={`w-full border ${error ? "border-red-400" : "border-gray-300"} rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SectionCard({ title_ar, title_fr, icon: Icon, children }: {
  title_ar: string; title_fr: string; icon: any; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <Icon className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-800">
          {title_ar} <span className="text-gray-400 font-normal text-sm">({title_fr})</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

export function FormWizard() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [identifiant, setIdentifiant] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setData] = useState<FormData>({
    nom_famille: "", nom_chef: "", est_il_vivant: "", age_chef: "", sexe_chef: "",
    telephone_chef: "", situation_familialle: "", identite_chef: "", localite_choisir: "",
    nouvelle_localite: "", etat_habitation: "", a_tu_des_enfants: "", nbre_enfants: "",
    zone_habitation: "", aide_gouvernementale: "", aide_details: "",
    photo_famille: "", gps_lat: "", gps_lng: "", gps_alt: "", gps_acc: "",
    enfants: [],
  });

  const update = (field: keyof FormData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const showIf = (cond: boolean) => cond ? {} : { style: { display: "none" } };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!data.nom_famille.match(/^[A-z\u0600-\u065F\u066E-\u06FF ]{2,30}$/))
        newErrors.nom_famille = "2-30 caractères requis";
    }
    if (step === 1) {
      if (!data.nom_chef.match(/^[A-z\u0600-\u065F\u066E-\u06FF ]{2,30}$/))
        newErrors.nom_chef = "2-30 caractères requis";
      if (!data.est_il_vivant) newErrors.est_il_vivant = "Requis";
      if (data.est_il_vivant === "1") {
        const age = parseInt(data.age_chef);
        if (!age || age <= 18 || age > 100) newErrors.age_chef = "Âge entre 18 et 100";
        if (!data.sexe_chef) newErrors.sexe_chef = "Requis";
        if (!data.situation_familialle) newErrors.situation_familialle = "Requis";
        if (!data.identite_chef.match(/^[0-9]{10}$/))
          newErrors.identite_chef = "10 chiffres requis";
      }
    }
    if (step === 2) {
      if (data.telephone_chef && !data.telephone_chef.match(/^[0-9]{8}$/))
        newErrors.telephone_chef = "8 chiffres requis";
      if (!data.localite_choisir) newErrors.localite_choisir = "Requis";
      if (!data.nouvelle_localite) newErrors.nouvelle_localite = "Requis";
    }
    if (step === 3) {
      if (!data.etat_habitation) newErrors.etat_habitation = "Requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addEnfant = () => {
    setData((prev) => ({ ...prev, enfants: [...prev.enfants, initialEnfant()] }));
  };

  const removeEnfant = (idx: number) => {
    setData((prev) => ({ ...prev, enfants: prev.enfants.filter((_, i) => i !== idx) }));
  };

  const updateEnfant = (idx: number, field: keyof Enfant, value: any) => {
    setData((prev) => {
      const enfants = [...prev.enfants];
      enfants[idx] = { ...enfants[idx], [field]: value };
      return { ...prev, enfants };
    });
  };

  const addPetitEnfant = (enfantIdx: number) => {
    setData((prev) => {
      const enfants = [...prev.enfants];
      enfants[enfantIdx] = {
        ...enfants[enfantIdx],
        petits_enfants: [...enfants[enfantIdx].petits_enfants, initialPetitEnfant()],
      };
      return { ...prev, enfants };
    });
  };

  const removePetitEnfant = (enfantIdx: number, peIdx: number) => {
    setData((prev) => {
      const enfants = [...prev.enfants];
      enfants[enfantIdx] = {
        ...enfants[enfantIdx],
        petits_enfants: enfants[enfantIdx].petits_enfants.filter((_, i) => i !== peIdx),
      };
      return { ...prev, enfants };
    });
  };

  const updatePetitEnfant = (enfantIdx: number, peIdx: number, field: keyof PetitsEnfants, value: any) => {
    setData((prev) => {
      const enfants = [...prev.enfants];
      const petits = [...enfants[enfantIdx].petits_enfants];
      petits[peIdx] = { ...petits[peIdx], [field]: value };
      enfants[enfantIdx] = { ...enfants[enfantIdx], petits_enfants: petits };
      return { ...prev, enfants };
    });
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setIdentifiant(result.identifiant);
        setSubmitted(true);
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (e) {
      alert("Erreur de connexion: " + String(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الإرسال بنجاح !</h2>
        <p className="text-gray-500 mb-4">Formulaire soumis avec succès !</p>
        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">معرف الاستمارة / Votre identifiant :</p>
          <p className="text-xl font-bold text-indigo-700 mt-1" dir="ltr">{identifiant}</p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setStep(0); setData({ ...data, nom_famille: "", nom_chef: "", est_il_vivant: "", age_chef: "", sexe_chef: "", telephone_chef: "", situation_familialle: "", identite_chef: "", localite_choisir: "", nouvelle_localite: "", etat_habitation: "", a_tu_des_enfants: "", nbre_enfants: "", zone_habitation: "", aide_gouvernementale: "", aide_details: "", photo_famille: "", gps_lat: "", gps_lng: "", gps_alt: "", gps_acc: "", enfants: [] }); }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          تقديم استمارة جديدة / Nouveau formulaire
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => i <= step && setStep(i)}
              className={`flex flex-col items-center gap-1 min-w-[70px] px-2 ${i <= step ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? "bg-indigo-600 text-white" : i < step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] text-center ${i === step ? "text-indigo-600 font-medium" : "text-gray-400"}`}>
                {s.label_fr}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {step === 0 && (
          <SectionCard title_ar="معلومات عن الأسرة" title_fr="Informations sur la famille" icon={Home}>
            <div className="md:col-span-2">
              <Input
                value={data.nom_famille} onChange={(v) => update("nom_famille", v)}
                label_ar="اسم الأسرة" label_fr="Nom de la grande famille"
                placeholder_ar="اسم الأسرة الكبيرة" placeholder_fr="Nom de la grande famille"
                error={errors.nom_famille}
              />
            </div>
          </SectionCard>
        )}

        {step === 1 && (
          <SectionCard title_ar="معلومات عن رب الأسرة" title_fr="Information sur le chef de famille" icon={User}>
            <div className="md:col-span-2">
              <Input
                value={data.nom_chef} onChange={(v) => update("nom_chef", v)}
                label_ar="اسم رب الأسرة" label_fr="Nom du responsable"
                error={errors.nom_chef}
              />
            </div>
            <Select
              value={data.est_il_vivant} onChange={(v) => update("est_il_vivant", v)}
              choices={choices.ge5fm65}
              label_ar="علي قيد الحياة" label_fr="En vie"
            />
            <div {...showIf(data.est_il_vivant === "1")}>
              <Input
                value={data.age_chef} onChange={(v) => update("age_chef", v)}
                label_ar="عمره" label_fr="Âge" type="number"
                error={errors.age_chef}
              />
            </div>
            <div {...showIf(data.est_il_vivant === "1")}>
              <Select
                value={data.sexe_chef} onChange={(v) => update("sexe_chef", v)}
                choices={choices.qd2oj99}
                label_ar="جنسه" label_fr="Sexe"
              />
            </div>
            <div {...showIf(data.est_il_vivant === "1")}>
              <Select
                value={data.situation_familialle} onChange={(v) => update("situation_familialle", v)}
                choices={choices.zl3br54}
                label_ar="الحالة الاجتماعية" label_fr="Situation familiale"
              />
            </div>
            <div {...showIf(data.est_il_vivant === "1")}>
              <Input
                value={data.identite_chef} onChange={(v) => update("identite_chef", v)}
                label_ar="رقم بطاقة التعريف" label_fr="N° Carte d'identité"
                placeholder_ar="10 أرقام" placeholder_fr="10 chiffres"
                error={errors.identite_chef}
              />
            </div>
            <div className="md:col-span-2" {...showIf(data.est_il_vivant === "2")}>
              <Select
                value={data.localite_choisir} onChange={(v) => update("localite_choisir", v)}
                choices={choices.sj12q51}
                label_ar="القرية (حدد)" label_fr="Localité d'origine"
              />
            </div>
            <div className="md:col-span-2" {...showIf(data.est_il_vivant === "2")}>
              <Input
                value={data.nouvelle_localite} onChange={(v) => update("nouvelle_localite", v)}
                label_ar="القرية الجديدة" label_fr="Nouvelle localité"
              />
            </div>
            <div className="md:col-span-2" {...showIf(data.est_il_vivant === "2")}>
              <Select
                value={data.situation_familialle} onChange={(v) => update("situation_familialle", v)}
                choices={choices.zl3br54}
                label_ar="الحالة الاجتماعية" label_fr="Situation familiale"
              />
            </div>
            <div className="md:col-span-2" {...showIf(data.est_il_vivant === "2")}>
              <Select
                value={data.etat_habitation} onChange={(v) => update("etat_habitation", v)}
                choices={choices.rb0qz01}
                label_ar="حالة المسكن" label_fr="État habitation"
              />
            </div>
          </SectionCard>
        )}

        {step === 2 && (
          <SectionCard title_ar="معلومات الاتصال والسكن" title_fr="Contact et résidence" icon={Phone}>
            <Input
              value={data.telephone_chef} onChange={(v) => update("telephone_chef", v)}
              label_ar="رقم الهاتف" label_fr="Téléphone"
              type="tel" placeholder_ar="8 أرقام" placeholder_fr="8 chiffres"
              error={errors.telephone_chef}
            />
            <div className="md:col-span-2">
              <Select
                value={data.localite_choisir} onChange={(v) => update("localite_choisir", v)}
                choices={choices.sj12q51}
                label_ar="القرية (حدد)" label_fr="Localité d'origine"
              />
            </div>
            <div className="md:col-span-2">
              <Input
                value={data.nouvelle_localite} onChange={(v) => update("nouvelle_localite", v)}
                label_ar="القرية الجديدة (المسكن الحالي)" label_fr="Nouvelle localité (résidence actuelle)"
              />
            </div>
          </SectionCard>
        )}

        {step === 3 && (
          <SectionCard title_ar="السكن" title_fr="Habitation" icon={MapPin}>
            <Select
              value={data.etat_habitation} onChange={(v) => update("etat_habitation", v)}
              choices={choices.rb0qz01}
              label_ar="حالة المسكن" label_fr="État de l'habitation"
            />
          </SectionCard>
        )}

        {step === 4 && (
          <SectionCard title_ar="الأولاد" title_fr="Enfants" icon={Users}>
            <div className="md:col-span-2">
              <Select
                value={data.a_tu_des_enfants} onChange={(v) => update("a_tu_des_enfants", v)}
                choices={choices.rz02c88}
                label_ar="هل لديه أولاد؟" label_fr="A-t-il des enfants ?"
              />
            </div>
            <div {...showIf(data.a_tu_des_enfants === "1")}>
              <Input
                value={data.nbre_enfants} onChange={(v) => update("nbre_enfants", v)}
                label_ar="عدد الأولاد" label_fr="Nombre d'enfants"
                type="number"
              />
            </div>
            <div className="md:col-span-2">
              {(data.a_tu_des_enfants === "1" || data.est_il_vivant === "1") && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">
                      معلومات عن الأولاد / Informations des enfants
                    </h4>
                    <button
                      onClick={addEnfant}
                      className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200"
                    >
                      + إضافة ولد / Ajouter un enfant
                    </button>
                  </div>
                  {data.enfants.map((enfant, ei) => (
                    <div key={ei} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-700">
                          الولد رقم {ei + 1} / Enfant {ei + 1}
                        </h5>
                        <button
                          onClick={() => removeEnfant(ei)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          حذف / Supprimer
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={enfant.nom_enfant} onChange={(v) => updateEnfant(ei, "nom_enfant", v)}
                          label_ar="اسم الولد" label_fr="Nom de l'enfant"
                        />
                        <Input
                          value={enfant.age_enfant} onChange={(v) => updateEnfant(ei, "age_enfant", v)}
                          label_ar="العمر" label_fr="Âge" type="number"
                        />
                        <Select
                          value={enfant.sexe_enfant} onChange={(v) => updateEnfant(ei, "sexe_enfant", v)}
                          choices={choices.ss6va75}
                          label_ar="الجنس" label_fr="Sexe"
                        />
                        <Select
                          value={enfant.situation_familialle} onChange={(v) => updateEnfant(ei, "situation_familialle", v)}
                          choices={choices.zl3br54}
                          label_ar="الحالة الاجتماعية" label_fr="Situation familiale"
                        />
                        <Input
                          value={enfant.nom_mere} onChange={(v) => updateEnfant(ei, "nom_mere", v)}
                          label_ar="اسم الأم" label_fr="Nom de la mère"
                        />
                        <Select
                          value={enfant.niveau_scolaire} onChange={(v) => updateEnfant(ei, "niveau_scolaire", v)}
                          choices={choices.od0xx54}
                          label_ar="المستوى الدراسي" label_fr="Niveau scolaire"
                        />
                        <Select
                          value={enfant.situation_profes} onChange={(v) => updateEnfant(ei, "situation_profes", v)}
                          choices={choices.vv64q02}
                          label_ar="الوضع المهني" label_fr="Situation professionnelle"
                        />
                        {enfant.situation_profes === "1" && (
                          <Select
                            value={enfant.grade} onChange={(v) => updateEnfant(ei, "grade", v)}
                            choices={choices.qt2qa37}
                            label_ar="الدرجة الوظيفية" label_fr="Grade"
                          />
                        )}
                        <Input
                          value={enfant.nni_enfant} onChange={(v) => updateEnfant(ei, "nni_enfant", v)}
                          label_ar="رقم بطاقة التعريف" label_fr="N° carte d'identité"
                          placeholder_ar="10 أرقام" placeholder_fr="10 chiffres"
                        />
                        <Input
                          value={enfant.telephone_enfant} onChange={(v) => updateEnfant(ei, "telephone_enfant", v)}
                          label_ar="رقم الهاتف" label_fr="Téléphone"
                          type="tel" placeholder_ar="8 أرقام" placeholder_fr="8 chiffres"
                        />
                        <Select
                          value={enfant.sante} onChange={(v) => updateEnfant(ei, "sante", v)}
                          choices={choices.zv9ji16}
                          label_ar="الحالة الصحية" label_fr="État de santé"
                        />
                        {enfant.sante === "2" && (
                          <Select
                            value={enfant.maladie} onChange={(v) => updateEnfant(ei, "maladie", v)}
                            choices={choices.qt8cj27}
                            label_ar="نوع المرض" label_fr="Type de maladie"
                          />
                        )}
                        <Select
                          value={enfant.a_des_enfants} onChange={(v) => updateEnfant(ei, "a_des_enfants", v)}
                          choices={choices.vo1di40}
                          label_ar="هل لديه أولاد؟" label_fr="A des enfants ?"
                        />

                        <div className="md:col-span-2">
                          {enfant.a_des_enfants === "1" && (
                            <div className="mt-2 border-t border-gray-200 pt-3">
                              <div className="flex items-center justify-between mb-2">
                                <h6 className="text-sm font-medium text-gray-600">
                                  أولاد الولد / Petits-enfants
                                </h6>
                                <button
                                  onClick={() => addPetitEnfant(ei)}
                                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                                >
                                  + إضافة / Ajouter
                                </button>
                              </div>
                              {enfant.petits_enfants.map((pe, pei) => (
                                <div key={pei} className="bg-white rounded p-3 mb-2 border border-gray-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500">حفيد {pei + 1}</span>
                                    <button
                                      onClick={() => removePetitEnfant(ei, pei)}
                                      className="text-red-400 text-xs hover:text-red-600"
                                    >
                                      حذف
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input value={pe.nom_enfant} onChange={(v) => updatePetitEnfant(ei, pei, "nom_enfant", v)} label_ar="الاسم" label_fr="Nom" />
                                    <Select value={pe.sexe_enfant} onChange={(v) => updatePetitEnfant(ei, pei, "sexe_enfant", v)} choices={choices.ix9jo32} label_ar="الجنس" label_fr="Sexe" />
                                    <Input value={pe.age_enfant} onChange={(v) => updatePetitEnfant(ei, pei, "age_enfant", v)} label_ar="العمر" label_fr="Âge" type="number" />
                                    <Select value={pe.niveau_scolaire} onChange={(v) => updatePetitEnfant(ei, pei, "niveau_scolaire", v)} choices={choices.od0xx54} label_ar="المستوى" label_fr="Niveau" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>
        )}

        {step === 5 && (
          <SectionCard title_ar="الصحة والمساعدة" title_fr="Santé et aide" icon={Heart}>
            <div className="md:col-span-2">
              <Select
                value={data.aide_gouvernementale} onChange={(v) => update("aide_gouvernementale", v)}
                choices={choices.rr7ts22}
                label_ar="هل استفادت الأسرة من أي جهة حكومية أو غيرها؟" label_fr="Aide gouvernementale ?"
              />
            </div>
            {data.aide_gouvernementale === "1" && (
              <div className="md:col-span-2">
                <Input
                  value={data.aide_details} onChange={(v) => update("aide_details", v)}
                  label_ar="ما هي الجهة وماذا قدمت؟" label_fr="Quelle organisation et qu'a-t-elle offert ?"
                />
              </div>
            )}
          </SectionCard>
        )}

        {step === 6 && (
          <SectionCard title_ar="مستوى التعليم" title_fr="Niveau d'éducation" icon={BookOpen}>
            <p className="md:col-span-2 text-gray-500 text-sm">
              تم تضمين المعلومات التعليمية في قسم الأولاد / Les informations scolaires sont incluses dans la section Enfants
            </p>
          </SectionCard>
        )}

        {step === 7 && (
          <SectionCard title_ar="المعلومات المهنية" title_fr="Informations professionnelles" icon={Briefcase}>
            <div className="md:col-span-2">
              <Select
                value={data.zone_habitation} onChange={(v) => update("zone_habitation", v)}
                choices={[
                  { value: "1", label_ar: "حضرية", label_fr: "Urbaine" },
                  { value: "2", label_ar: "ريفية", label_fr: "Rurale" },
                ]}
                label_ar="منطقة السكن" label_fr="Zone d'habitation"
              />
            </div>
            <p className="md:col-span-2 text-gray-500 text-sm">
              المعلومات المهنية للأولاد موجودة في قسم الأولاد / Infos pros des enfants dans la section Enfants
            </p>
          </SectionCard>
        )}

        {step === 8 && (
          <SectionCard title_ar="ملخص الاستمارة" title_fr="Récapitulatif" icon={Activity}>
            <div className="md:col-span-2 space-y-3">
              {[
                { label_ar: "اسم الأسرة", label_fr: "Famille", value: data.nom_famille },
                { label_ar: "رب الأسرة", label_fr: "Chef", value: data.nom_chef },
                { label_ar: "عدد الأولاد", label_fr: "Enfants", value: String(data.enfants.length) },
                { label_ar: "السكن", label_fr: "Habitation", value: choices.rb0qz01.find((c: any) => c.value === data.etat_habitation)?.label_fr || "" },
                { label_ar: "الجهة", label_fr: "Localité", value: choices.sj12q51.find((c: any) => c.value === data.localite_choisir)?.label_fr || "" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">
                    {item.label_ar} <span className="text-xs text-gray-400">({item.label_fr})</span>
                  </span>
                  <span className="font-medium text-gray-800">{item.value || "-"}</span>
                </div>
              ))}
              {data.enfants.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">الأولاد / Enfants :</h4>
                  {data.enfants.map((e, i) => (
                    <div key={i} className="text-sm text-gray-600 py-1">
                      {i + 1}. {e.nom_enfant || "?"} - {e.age_enfant || "?"} ans
                      {e.petits_enfants.length > 0 && ` (${e.petits_enfants.length} أولاد/enfants)`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg ${step === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <ChevronLeft className="w-4 h-4" /> السابق / Précédent
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-1 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              التالي / Suivant <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {submitting ? "جاري الإرسال..." : "إرسال / Soumettre"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
