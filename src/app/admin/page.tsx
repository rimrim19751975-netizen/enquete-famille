"use client";

import { useState, useEffect } from "react";
import { LogIn, Download, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Submission {
  id: number;
  nom_famille: string;
  nom_chef: string;
  telephone_chef: string;
  localite_choisir: string;
  id_calcule: string;
  submitted_at: number;
  enfants: any[];
  [key: string]: any;
}

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

  const login = async () => {
    try {
      const res = await fetch("/api/submissions", {
        headers: { Authorization: "Basic " + btoa(`${username}:${password}`) },
      });
      if (res.ok) {
        setAuthenticated(true);
        localStorage.setItem("admin_user", username);
        localStorage.setItem("admin_pass", password);
        fetchData();
      } else {
        alert("Identifiants incorrects");
      }
    } catch {
      alert("Erreur de connexion");
    }
  };

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const u = localStorage.getItem("admin_user") || username;
      const pw = localStorage.getItem("admin_pass") || password;
      const res = await fetch(`/api/submissions?page=${p}&limit=20`, {
        headers: { Authorization: "Basic " + btoa(`${u}:${pw}`) },
      });
      const result = await res.json();
      if (result.data) {
        setData(result.data);
        setTotal(result.total);
        setPages(result.pages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const u = localStorage.getItem("admin_user");
    const pw = localStorage.getItem("admin_pass");
    if (u && pw) {
      setUsername(u);
      setPassword(pw);
      setAuthenticated(true);
      fetchData(1);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchData(page);
  }, [page]);

  const getLocalityLabel = (val: string) => {
    const map: Record<string, string> = {
      "1": "Nouadhibou", "2": "Nouakchott", "3": "Kiffa",
      "4": "Zouérate", "5": "Atar", "6": "Aleg", "7": "Sélibabi", "8": "Autre",
    };
    return map[val] || val;
  };

  const exportCSV = () => {
    const headers = ["ID", "Famille", "Chef", "Téléphone", "Localité", "Enfants", "Date"];
    const rows = data.map((s) => [
      s.id, s.nom_famille, s.nom_chef, s.telephone_chef || "",
      getLocalityLabel(s.localite_choisir), s.enfants?.length || 0,
      new Date((s.submitted_at || 0) * 1000).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enquete-famille.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-sm border w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">إدارة / Administration</h1>
          <div className="space-y-4">
            <input
              type="text" placeholder="Nom d'utilisateur"
              value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="password" placeholder="Mot de passe"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <button
              onClick={login}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Se connecter
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Identifiants par défaut : admin / admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            لوحة التحكم / Admin Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{total} استمارة / soumissions</span>
            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={() => { setAuthenticated(false); localStorage.removeItem("admin_user"); localStorage.removeItem("admin_pass"); }}
              className="text-red-500 text-sm hover:text-red-700"
            >
              تسجيل خروج / Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="بحث / Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2"
          />
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
                {data
                  .filter((s) => !search || s.nom_famille?.includes(search) || s.nom_chef?.includes(search) || s.id_calcule?.includes(search))
                  .map((s) => (
                    <>
                      <tr
                        key={s.id}
                        onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-4 py-3 font-mono text-xs">{s.id}</td>
                        <td className="px-4 py-3 font-medium">{s.nom_famille}</td>
                        <td className="px-4 py-3">{s.nom_chef}</td>
                        <td className="px-4 py-3">{s.telephone_chef || "-"}</td>
                        <td className="px-4 py-3">{getLocalityLabel(s.localite_choisir)}</td>
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
                                <p>Situation fam.: {s.situation_familialle}</p>
                                <p>Habitation: {s.etat_habitation}</p>
                                <p>Aide: {s.aide_gouvernementale === "1" ? "Oui" : "Non"}</p>
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
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const json = JSON.stringify(s, null, 2);
                                    const blob = new Blob([json], { type: "application/json" });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `soumission-${s.id}.json`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                  }}
                                  className="text-indigo-600 text-xs hover:underline"
                                >
                                  📥 Télécharger JSON
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      {loading ? "جاري التحميل..." : "لا توجد بيانات / Aucune soumission"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              {page} / {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
