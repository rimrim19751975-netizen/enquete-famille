import { NextRequest, NextResponse } from "next/server";
import { getClient, ensureDatabase } from "@/db";

export async function POST(req: NextRequest) {
  try {
    await ensureDatabase();
    const body = await req.json();

    const {
      nom_famille, nom_chef, est_il_vivant, age_chef, sexe_chef,
      telephone_chef, situation_familialle, identite_chef, localite_choisir,
      nouvelle_localite, etat_habitation, a_tu_des_enfants, nbre_enfants,
      zone_habitation, aide_gouvernementale, aide_details,
      photo_famille, gps_lat, gps_lng, gps_alt, gps_acc, enfants,
    } = body;

    const idCalcule = [
      (nom_famille || "").substring(0, 30),
      (nom_chef || "").substring(0, 30),
      (telephone_chef || "").substring(0, 8),
    ].join("_");

    const result = await getClient().execute({
      sql: `INSERT INTO familles (
        nom_famille, nom_chef, est_il_vivant, age_chef, sexe_chef,
        telephone_chef, situation_familialle, identite_chef, localite_choisir,
        nouvelle_localite, etat_habitation, a_tu_des_enfants, nbre_enfants,
        zone_habitation, aide_gouvernementale, aide_details,
        photo_famille, gps_lat, gps_lng, gps_alt, gps_acc, id_calcule
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        nom_famille, nom_chef, est_il_vivant, age_chef, sexe_chef,
        telephone_chef, situation_familialle, identite_chef, localite_choisir,
        nouvelle_localite, etat_habitation, a_tu_des_enfants, nbre_enfants,
        zone_habitation, aide_gouvernementale, aide_details,
        photo_famille, gps_lat, gps_lng, gps_alt, gps_acc, idCalcule,
      ],
    });

    const familleId = Number(result.lastInsertRowid);

    if (Array.isArray(enfants)) {
      for (const e of enfants) {
        const enfantResult = await getClient().execute({
          sql: `INSERT INTO enfants (
            famille_id, nom_enfant, age_enfant, sexe_enfant,
            localite_choisir, nouvelle_localite, situation_familialle,
            etat_habitation, activite_femme, nom_mere, niveau_scolaire,
            situation_profes, grade, nni_enfant, telephone_enfant,
            sante, maladie, a_des_enfants
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            familleId, e.nom_enfant, e.age_enfant, e.sexe_enfant,
            e.localite_choisir, e.nouvelle_localite, e.situation_familialle,
            e.etat_habitation, e.activite_femme, e.nom_mere, e.niveau_scolaire,
            e.situation_profes, e.grade, e.nni_enfant, e.telephone_enfant,
            e.sante, e.maladie, e.a_des_enfants,
          ],
        });

        const enfantId = Number(enfantResult.lastInsertRowid);

        if (Array.isArray(e.petits_enfants)) {
          for (const pe of e.petits_enfants) {
            await getClient().execute({
              sql: `INSERT INTO petits_enfants (
                enfant_id, nom_enfant, sexe_enfant, age_enfant, niveau_scolaire
              ) VALUES (?, ?, ?, ?, ?)`,
              args: [enfantId, pe.nom_enfant, pe.sexe_enfant, pe.age_enfant, pe.niveau_scolaire],
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, id: familleId, identifiant: idCalcule });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
