"use client";

import { useState, useEffect, useCallback } from "react";
import { LogIn, Download, Search, ChevronLeft, ChevronRight, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Submission {
  id: number;
  nom_famille: string;
  nom_chef: string;
  est_il_vivant: string;
  age_chef: number;
  sexe_chef: string;
  telephone_chef: string;
  situation_familialle: string;
  identite_chef: string;
  localite_choisir: string;
  nouvelle_localite: string;
  etat_habitation: string;
  a_tu_des_enfants: string;
  nbre_enfants: number;
  zone_habitation: string;
  aide_gouvernementale: string;
  aide_details: string;
  photo_famille: string;
  gps_lat: string;
  gps_lng: string;
  gps_alt: string;
  gps_acc: string;
  id_calcule: string;
  submitted_at: number;
  enfants: any[];
  [key: string]: any;
}

const localityMap: Record<string, { fr: string; ar: string }> = {
  "1": { fr: "Nouadhibou", ar: "نواذيبو" },
  "2": { fr: "Nouakchott", ar: "انواكشوط" },
  "3": { fr: "Kiffa", ar: "كيفة" },
  "4": { fr: "Zouérate", ar: "الزويرات" },
  "5": { fr: "Atar", ar: "أطار" },
  "6": { fr: "Aleg", ar: "آلاك" },
  "7": { fr: "Sélibabi", ar: "سيلبابي" },
  "8": { fr: "Autre", ar: "أخرى" },
};

const choixMap: Record<string, Record<string, { fr: string; ar: string }>> = {
  ge5fm65: { "1": { fr: "Vivant", ar: "نعم" }, "2": { fr: "Décédé", ar: "متوفي" } },
  qd2oj99: { "1": { fr: "Masculin", ar: "ذكر" }, "2": { fr: "Féminin", ar: "أنثى" } },
  zl3br54: { "1": { fr: "Marié(e)", ar: "متزوج" }, "2": { fr: "Célibataire", ar: "أعزب" }, "3": { fr: "Divorcé(e)", ar: "مطلق" }, "4": { fr: "Veuf(ve)", ar: "أرمل" } },
  rb0qz01: { "1": { fr: "Propriétaire", ar: "مالك" }, "2": { fr: "Locataire", ar: "مستأجر" }, "3": { fr: "Logement de fonction", ar: "مسكن وظيفي" }, "4": { fr: "Autre", ar: "أخرى" } },
  rz02c88: { "1": { fr: "Oui", ar: "نعم" }, "2": { fr: "Non", ar: "لا" } },
  ss6va75: { "1": { fr: "Masculin", ar: "ذكر" }, "2": { fr: "Féminin", ar: "أنثى" } },
  od0xx54: { "1": { fr: "Aucun", ar: "بدون" }, "2": { fr: "Primaire", ar: "ابتدائي" }, "3": { fr: "Secondaire", ar: "ثانوي" }, "4": { fr: "Universitaire", ar: "جامعي" }, "5": { fr: "Formation pro.", ar: "تكوين مهني" } },
  vv64q02: { "1": { fr: "Fonctionnaire", ar: "موظف حكومي" }, "2": { fr: "Secteur privé", ar: "قطاع خاص" }, "3": { fr: "Indépendant", ar: "مستقل" }, "4": { fr: "Sans emploi", ar: "عاطل عن العمل" }, "5": { fr: "Retraité", ar: "متقاعد" } },
  zv9ji16: { "1": { fr: "Bonne", ar: "جيدة" }, "2": { fr: "Malade", ar: "مريض" } },
  qt8cj27: { "1": { fr: "Maladie chronique", ar: "مرض مزمن" }, "2": { fr: "Handicap", ar: "إعاقة" }, "3": { fr: "Maladie temporaire", ar: "مرض مؤقت" }, "4": { fr: "Autre", ar: "أخرى" } },
};

function v(val: string | undefined, list: string): string {
  if (!val) return "-";
  return choixMap[list]?.[val]?.fr || val;
}

function va(val: string | undefined, list: string): string {
  if (!val) return "-";
  return choixMap[list]?.[val]?.ar || val;
}

function locFr(val: string): string { return localityMap[val]?.fr || val || "-"; }
function locAr(val: string): string { return localityMap[val]?.ar || val || "-"; }

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const login = () => {
    fetch("/api/submissions", {
      headers: { Authorization: "Basic " + btoa(`${username}:${password}`) },
    }).then((r) => {
      if (r.ok) {
        setAuthenticated(true);
        localStorage.setItem("admin_user", username);
        localStorage.setItem("admin_pass", password);
        fetchData(1);
      } else alert("Identifiants incorrects");
    }).catch(() => alert("Erreur de connexion"));
  };

  const fetchData = (p = page) => {
    setLoading(true);
    const u = localStorage.getItem("admin_user") || username;
    const pw = localStorage.getItem("admin_pass") || password;
    fetch(`/api/submissions?page=${p}&limit=100`, {
      headers: { Authorization: "Basic " + btoa(`${u}:${pw}`) },
    }).then((r) => r.json()).then((result) => {
      if (result.data) { setData(result.data); setTotal(result.total); setPages(result.pages); }
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    const u = localStorage.getItem("admin_user");
    const pw = localStorage.getItem("admin_pass");
    if (u && pw) { setUsername(u); setPassword(pw); setAuthenticated(true); fetchData(1); }
  }, []);

  useEffect(() => { if (authenticated) fetchData(page); }, [page]);

  const getAllData = useCallback(async (): Promise<Submission[]> => {
    const u = localStorage.getItem("admin_user") || username;
    const pw = localStorage.getItem("admin_pass") || password;
    let allData: Submission[] = [];
    let p = 1, totalPages = 1;
    while (p <= totalPages) {
      const r = await fetch(`/api/submissions?page=${p}&limit=100`, {
        headers: { Authorization: "Basic " + btoa(`${u}:${pw}`) },
      });
      const result = await r.json();
      if (result.data) { allData = allData.concat(result.data); totalPages = result.pages; }
      p++;
    }
    return allData;
  }, [username, password]);

  function buildRowsFr(d: Submission[]) {
    return d.map((s) => ({
      ID: s.id,
      Famille: s.nom_famille,
      Chef: s.nom_chef,
      "En vie": v(s.est_il_vivant, "ge5fm65"),
      "Âge": s.age_chef ?? "-",
      Sexe: v(s.sexe_chef, "qd2oj99"),
      Téléphone: s.telephone_chef || "-",
      "Situation fam.": v(s.situation_familialle, "zl3br54"),
      "NID": s.identite_chef || "-",
      Localité: locFr(s.localite_choisir),
      "Nouvelle localité": s.nouvelle_localite || "-",
      Habitation: v(s.etat_habitation, "rb0qz01"),
      Enfants: s.enfants?.length || 0,
      Aide: v(s.aide_gouvernementale, "rz02c88"),
      "Détails aide": s.aide_details || "-",
      ID_Calculé: s.id_calcule,
      Date: s.submitted_at ? new Date(s.submitted_at * 1000).toLocaleDateString() : "-",
    }));
  }

  function buildRowsAr(d: Submission[]) {
    return d.map((s) => ({
      المعرف: s.id,
      الأسرة: s.nom_famille,
      "رب الأسرة": s.nom_chef,
      "على قيد الحياة": va(s.est_il_vivant, "ge5fm65"),
      العمر: s.age_chef ?? "-",
      الجنس: va(s.sexe_chef, "qd2oj99"),
      الهاتف: s.telephone_chef || "-",
      "الحالة الاجتماعية": va(s.situation_familialle, "zl3br54"),
      "رقم التعريف": s.identite_chef || "-",
      القرية: locAr(s.localite_choisir),
      "القرية الجديدة": s.nouvelle_localite || "-",
      "حالة المسكن": va(s.etat_habitation, "rb0qz01"),
      "عدد الأولاد": s.enfants?.length || 0,
      "مساعدة حكومية": va(s.aide_gouvernementale, "rz02c88"),
      "تفاصيل المساعدة": s.aide_details || "-",
      "المعرف المحسوب": s.id_calcule,
      التاريخ: s.submitted_at ? new Date(s.submitted_at * 1000).toLocaleDateString() : "-",
    }));
  }

  async function exportExcelFr() {
    const allData = await getAllData();
    const wb = XLSX.utils.book_new();

    const familles = XLSX.utils.json_to_sheet(buildRowsFr(allData));
    XLSX.utils.book_append_sheet(wb, familles, "Familles");

    const enfantsRows: any[] = [];
    allData.forEach((s) => {
      (s.enfants || []).forEach((e: any) => {
        enfantsRows.push({
          Famille: s.nom_famille,
          Chef: s.nom_chef,
          Enfant: e.nom_enfant,
          Age: e.age_enfant,
          Sexe: v(e.sexe_enfant, "ss6va75"),
          "Situation fam.": v(e.situation_familialle, "zl3br54"),
          "Niveau scolaire": v(e.niveau_scolaire, "od0xx54"),
          "Situation pro.": v(e.situation_profes, "vv64q02"),
          Santé: v(e.sante, "zv9ji16"),
          Maladie: v(e.maladie, "qt8cj27"),
          Téléphone: e.telephone_enfant || "-",
          "A des enfants": v(e.a_des_enfants, "rz02c88"),
          "Petits-enfants": e.petits_enfants?.length || 0,
        });
      });
    });
    if (enfantsRows.length) {
      const enfants = XLSX.utils.json_to_sheet(enfantsRows);
      XLSX.utils.book_append_sheet(wb, enfants, "Enfants");
    }

    XLSX.writeFile(wb, "enquete-famille-fr.xlsx");
  }

  async function exportExcelAr() {
    const allData = await getAllData();
    const wb = XLSX.utils.book_new();

    const familles = XLSX.utils.json_to_sheet(buildRowsAr(allData));
    XLSX.utils.book_append_sheet(wb, familles, "العائلات");

    const enfantsRows: any[] = [];
    allData.forEach((s) => {
      (s.enfants || []).forEach((e: any) => {
        enfantsRows.push({
          الأسرة: s.nom_famille,
          "رب الأسرة": s.nom_chef,
          "اسم الولد": e.nom_enfant,
          العمر: e.age_enfant,
          الجنس: va(e.sexe_enfant, "ss6va75"),
          "الحالة الاجتماعية": va(e.situation_familialle, "zl3br54"),
          "المستوى الدراسي": va(e.niveau_scolaire, "od0xx54"),
          "الوضع المهني": va(e.situation_profes, "vv64q02"),
          "الحالة الصحية": va(e.sante, "zv9ji16"),
          المرض: va(e.maladie, "qt8cj27"),
          الهاتف: e.telephone_enfant || "-",
          "لديه أولاد": va(e.a_des_enfants, "rz02c88"),
          "عدد الأحفاد": e.petits_enfants?.length || 0,
        });
      });
    });
    if (enfantsRows.length) {
      const enfants = XLSX.utils.json_to_sheet(enfantsRows);
      XLSX.utils.book_append_sheet(wb, enfants, "الأولاد");
    }

    XLSX.writeFile(wb, "enquete-famille-ar.xlsx");
  }

  async function exportPDFFr() {
    const allData = await getAllData();
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.text("Enquete Famille - Rapport", 14, 15);
    doc.setFontSize(10);
    doc.text(`Total: ${allData.length} soumissions - ${new Date().toLocaleDateString()}`, 14, 22);

    const headers = ["ID", "Famille", "Chef", "Age", "Sexe", "Sit.fam.", "Localite", "Habitation", "Enfants", "Date"];
    const rows = allData.map((s) => [
      s.id, s.nom_famille, s.nom_chef, s.age_chef ?? "-",
      v(s.sexe_chef, "qd2oj99"), v(s.situation_familialle, "zl3br54"),
      locFr(s.localite_choisir), v(s.etat_habitation, "rb0qz01"),
      s.enfants?.length || 0,
      s.submitted_at ? new Date(s.submitted_at * 1000).toLocaleDateString() : "-",
    ]);

    autoTable(doc, { head: [headers], body: rows, startY: 28, styles: { fontSize: 7 } });
    doc.save("enquete-famille-fr.pdf");
  }

  async function exportPDFAr() {
    const allData = await getAllData();
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(16);
    doc.text("استبيان الأسرة - تقرير", 14, 15);
    doc.setFontSize(10);
    doc.text(`المجموع: ${allData.length} استمارة - ${new Date().toLocaleDateString()}`, 14, 22);

    const headers = ["المعرف", "الأسرة", "رب الأسرة", "العمر", "الجنس", "الحالة", "القرية", "المسكن", "الأولاد", "التاريخ"];
    const rows = allData.map((s) => [
      s.id, s.nom_famille, s.nom_chef, s.age_chef ?? "-",
      va(s.sexe_chef, "qd2oj99"), va(s.situation_familialle, "zl3br54"),
      locAr(s.localite_choisir), va(s.etat_habitation, "rb0qz01"),
      s.enfants?.length || 0,
      s.submitted_at ? new Date(s.submitted_at * 1000).toLocaleDateString() : "-",
    ]);

    autoTable(doc, { head: [headers], body: rows, startY: 28, styles: { fontSize: 7 } });
    doc.save("enquete-famille-ar.pdf");
  }

  async function exportPDFFrDetail() {
    const allData = await getAllData();
    const doc = new jsPDF();

    for (let i = 0; i < allData.length; i++) {
      const s = allData[i];
      if (i > 0) doc.addPage();

      doc.setFontSize(14);
      doc.text(`Famille: ${s.nom_famille}`, 14, 15);
      doc.setFontSize(10);
      doc.text(`Chef: ${s.nom_chef} | ID: ${s.id_calcule}`, 14, 22);
      doc.text(`Localité: ${locFr(s.localite_choisir)} | Habitation: ${v(s.etat_habitation, "rb0qz01")}`, 14, 28);
      doc.text(`Téléphone: ${s.telephone_chef || "-"} | Date: ${s.submitted_at ? new Date(s.submitted_at * 1000).toLocaleDateString() : "-"}`, 14, 34);

      if (s.enfants?.length) {
        autoTable(doc, {
          head: [["#", "Nom", "Age", "Sexe", "Niveau", "Situation pro.", "Santé"]],
          body: s.enfants.map((e: any, idx: number) => [
            idx + 1, e.nom_enfant, e.age_enfant,
            v(e.sexe_enfant, "ss6va75"), v(e.niveau_scolaire, "od0xx54"),
            v(e.situation_profes, "vv64q02"), v(e.sante, "zv9ji16"),
          ]),
          startY: 40,
          styles: { fontSize: 8 },
        });
      }
    }

    doc.save("enquete-famille-detail-fr.pdf");
  }

  async function exportPDFArDetail() {
    const allData = await getAllData();
    const doc = new jsPDF();

    for (let i = 0; i < allData.length; i++) {
      const s = allData[i];
      if (i > 0) doc.addPage();

      doc.setFontSize(14);
      doc.text(`الأسرة: ${s.nom_famille}`, 14, 15);
      doc.setFontSize(10);
      doc.text(`رب الأسرة: ${s.nom_chef} | المعرف: ${s.id_calcule}`, 14, 22);
      doc.text(`القرية: ${locAr(s.localite_choisir)} | المسكن: ${va(s.etat_habitation, "rb0qz01")}`, 14, 28);
      doc.text(`الهاتف: ${s.telephone_chef || "-"} | التاريخ: ${s.submitted_at ? new Date(s.submitted_at * 1000).toLocaleDateString() : "-"}`, 14, 34);

      if (s.enfants?.length) {
        autoTable(doc, {
          head: [["#", "الاسم", "العمر", "الجنس", "المستوى", "الوظيفة", "الصحة"]],
          body: s.enfants.map((e: any, idx: number) => [
            idx + 1, e.nom_enfant, e.age_enfant,
            va(e.sexe_enfant, "ss6va75"), va(e.niveau_scolaire, "od0xx54"),
            va(e.situation_profes, "vv64q02"), va(e.sante, "zv9ji16"),
          ]),
          startY: 40,
          styles: { fontSize: 8 },
        });
      }
    }

    doc.save("enquete-famille-detail-ar.pdf");
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-sm border w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">إدارة / Administration</h1>
          <div className="space-y-4">
            <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <button onClick={login}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> Se connecter
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">Identifiants par défaut : admin / admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl font-bold text-gray-800">لوحة التحكم / Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{total} استمارة / soumissions</span>
              <button onClick={() => { setAuthenticated(false); localStorage.removeItem("admin_user"); localStorage.removeItem("admin_pass"); }}
                className="text-red-500 text-sm hover:text-red-700">تسجيل خروج / Déconnexion</button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-400 font-medium">📥 Export:</span>

            <button onClick={exportExcelFr}
              className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-700 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel FR
            </button>
            <button onClick={exportExcelAr}
              className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-700 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel AR
            </button>

            <button onClick={exportPDFFr}
              className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-rose-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> PDF FR (résumé)
            </button>
            <button onClick={exportPDFAr}
              className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-rose-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> PDF AR (ملخص)
            </button>

            <button onClick={exportPDFFrDetail}
              className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-purple-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> PDF FR (détail)
            </button>
            <button onClick={exportPDFArDetail}
              className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-purple-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> PDF AR (تفصيلي)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-4">
          <input type="text" placeholder="بحث / Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">الأسرة/Famille</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">رب الأسرة/Chef</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">الهاتف/Tél</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">القرية/Localité</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">الأولاد/Enf</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">التاريخ/Date</th>
                </tr>
              </thead>
              <tbody>
                {data.filter((s) => !search || s.nom_famille?.includes(search) || s.nom_chef?.includes(search) || s.id_calcule?.includes(search))
                  .map((s) => (
                    <>
                      <tr key={s.id} onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-3 font-mono text-xs">{s.id}</td>
                        <td className="px-4 py-3 font-medium">{s.nom_famille}</td>
                        <td className="px-4 py-3">{s.nom_chef}</td>
                        <td className="px-4 py-3">{s.telephone_chef || "-"}</td>
                        <td className="px-4 py-3">{locFr(s.localite_choisir)}</td>
                        <td className="px-4 py-3 text-center">{s.enfants?.length || 0}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {s.submitted_at ? new Date(s.submitted_at * 1000).toLocaleDateString() : "-"}
                        </td>
                      </tr>
                      {expanded === s.id && (
                        <tr key={`${s.id}-detail`}>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">معلومات / Infos</h4>
                                <p>Identifiant: {s.id_calcule}</p>
                                <p>Situation: {v(s.situation_familialle, "zl3br54")} / {va(s.situation_familialle, "zl3br54")}</p>
                                <p>Habitation: {v(s.etat_habitation, "rb0qz01")} / {va(s.etat_habitation, "rb0qz01")}</p>
                                <p>Aide: {v(s.aide_gouvernementale, "rz02c88")}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">الأولاد / Enfants</h4>
                                {s.enfants?.length > 0 ? s.enfants.map((e: any, i: number) => (
                                  <p key={i} className="py-0.5">
                                    {i + 1}. {e.nom_enfant} ({e.age_enfant} ans)
                                    {e.petits_enfants?.length > 0 && ` → ${e.petits_enfants.length} petits-enfants`}
                                  </p>
                                )) : <p className="text-gray-400">Aucun</p>}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">إجراءات / Actions</h4>
                                <button onClick={(e) => { e.stopPropagation(); const json = JSON.stringify(s, null, 2); const blob = new Blob([json], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `soumission-${s.id}.json`; a.click(); URL.revokeObjectURL(url); }}
                                  className="text-indigo-600 text-xs hover:underline">📥 Télécharger JSON</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                {data.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    {loading ? "جاري التحميل..." : "لا توجد بيانات / Aucune soumission"}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm text-gray-600">{page} / {pages}</span>
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
