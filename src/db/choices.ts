export const choices = {
  ge5fm65: [
    { value: "1", label_ar: "نعم", label_fr: "Oui" },
    { value: "2", label_ar: "متوفي", label_fr: "Décédé" },
  ],
  qd2oj99: [
    { value: "1", label_ar: "ذكر", label_fr: "Masculin" },
    { value: "2", label_ar: "أنثى", label_fr: "Féminin" },
  ],
  zl3br54: [
    { value: "1", label_ar: "متزوج", label_fr: "Marié(e)" },
    { value: "2", label_ar: "أعزب", label_fr: "Célibataire" },
    { value: "3", label_ar: "مطلق", label_fr: "Divorcé(e)" },
    { value: "4", label_ar: "أرمل", label_fr: "Veuf(ve)" },
  ],
  sj12q51: [
    { value: "1", label_ar: "نواذيبو", label_fr: "Nouadhibou" },
    { value: "2", label_ar: "انواكشوط", label_fr: "Nouakchott" },
    { value: "3", label_ar: "كيفة", label_fr: "Kiffa" },
    { value: "4", label_ar: "الزويرات", label_fr: "Zouérate" },
    { value: "5", label_ar: "أطار", label_fr: "Atar" },
    { value: "6", label_ar: "آلاك", label_fr: "Aleg" },
    { value: "7", label_ar: "سيلبابي", label_fr: "Sélibabi" },
    { value: "8", label_ar: "أخرى", label_fr: "Autre" },
  ],
  rb0qz01: [
    { value: "1", label_ar: "مالك", label_fr: "Propriétaire" },
    { value: "2", label_ar: "مستأجر", label_fr: "Locataire" },
    { value: "3", label_ar: "مسكن وظيفي", label_fr: "Logement de fonction" },
    { value: "4", label_ar: "أخرى", label_fr: "Autre" },
  ],
  rz02c88: [
    { value: "1", label_ar: "نعم", label_fr: "Oui" },
    { value: "2", label_ar: "لا", label_fr: "Non" },
  ],
  ss6va75: [
    { value: "1", label_ar: "ذكر", label_fr: "Masculin" },
    { value: "2", label_ar: "أنثى", label_fr: "Féminin" },
  ],
  xa6xg38: [
    { value: "1", label_ar: "ربة بيت", label_fr: "Ménagère" },
    { value: "2", label_ar: "موظفة", label_fr: "Employée" },
    { value: "3", label_ar: "طالبة", label_fr: "Étudiante" },
    { value: "4", label_ar: "بدون نشاط", label_fr: "Sans activité" },
  ],
  od0xx54: [
    { value: "1", label_ar: "بدون", label_fr: "Aucun" },
    { value: "2", label_ar: "ابتدائي", label_fr: "Primaire" },
    { value: "3", label_ar: "ثانوي", label_fr: "Secondaire" },
    { value: "4", label_ar: "جامعي", label_fr: "Universitaire" },
    { value: "5", label_ar: "تكوين مهني", label_fr: "Formation professionnelle" },
  ],
  vv64q02: [
    { value: "1", label_ar: "موظف حكومي", label_fr: "Fonctionnaire" },
    { value: "2", label_ar: "قطاع خاص", label_fr: "Secteur privé" },
    { value: "3", label_ar: "مستقل", label_fr: "Indépendant" },
    { value: "4", label_ar: "عاطل عن العمل", label_fr: "Sans emploi" },
    { value: "5", label_ar: "متقاعد", label_fr: "Retraité" },
  ],
  qt2qa37: [
    { value: "1", label_ar: "مدير", label_fr: "Directeur" },
    { value: "2", label_ar: "رئيس مصلحة", label_fr: "Chef de service" },
    { value: "3", label_ar: "موظف", label_fr: "Employé" },
    { value: "4", label_ar: "عامل", label_fr: "Ouvrier" },
  ],
  zv9ji16: [
    { value: "1", label_ar: "جيدة", label_fr: "Bonne" },
    { value: "2", label_ar: "مريض", label_fr: "Malade" },
  ],
  qt8cj27: [
    { value: "1", label_ar: "مرض مزمن", label_fr: "Maladie chronique" },
    { value: "2", label_ar: "إعاقة", label_fr: "Handicap" },
    { value: "3", label_ar: "مرض مؤقت", label_fr: "Maladie temporaire" },
    { value: "4", label_ar: "أخرى", label_fr: "Autre" },
  ],
  rr7ts22: [
    { value: "1", label_ar: "نعم", label_fr: "Oui" },
    { value: "2", label_ar: "لا", label_fr: "Non" },
  ],
  vo1di40: [
    { value: "1", label_ar: "نعم", label_fr: "Oui" },
    { value: "2", label_ar: "لا", label_fr: "Non" },
  ],
  ix9jo32: [
    { value: "1", label_ar: "ذكر", label_fr: "Masculin" },
    { value: "2", label_ar: "أنثى", label_fr: "Féminin" },
  ],
} as const;

export type ChoiceKey = keyof typeof choices;
