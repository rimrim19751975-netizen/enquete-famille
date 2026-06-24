export const createTablesSQL = `
CREATE TABLE IF NOT EXISTS familles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_famille TEXT NOT NULL,

  nom_chef TEXT NOT NULL,
  est_il_vivant TEXT,
  age_chef INTEGER,
  sexe_chef TEXT,
  telephone_chef TEXT,
  situation_familialle TEXT,
  identite_chef TEXT,
  localite_choisir TEXT,
  nouvelle_localite TEXT,
  etat_habitation TEXT,
  a_tu_des_enfants TEXT,
  nbre_enfants INTEGER,

  zone_habitation TEXT,
  aide_gouvernementale TEXT,
  aide_details TEXT,

  photo_famille TEXT,
  gps_lat TEXT,
  gps_lng TEXT,
  gps_alt TEXT,
  gps_acc TEXT,

  id_calcule TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  submitted_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS enfants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  famille_id INTEGER NOT NULL,
  nom_enfant TEXT NOT NULL,
  age_enfant INTEGER,
  sexe_enfant TEXT,
  localite_choisir TEXT,
  nouvelle_localite TEXT,
  situation_familialle TEXT,
  etat_habitation TEXT,
  activite_femme TEXT,
  nom_mere TEXT,
  niveau_scolaire TEXT,
  situation_profes TEXT,
  grade TEXT,
  nni_enfant TEXT,
  telephone_enfant TEXT,
  sante TEXT,
  maladie TEXT,
  a_des_enfants TEXT,
  FOREIGN KEY (famille_id) REFERENCES familles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS petits_enfants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  enfant_id INTEGER NOT NULL,
  nom_enfant TEXT NOT NULL,
  sexe_enfant TEXT,
  age_enfant INTEGER,
  niveau_scolaire TEXT,
  FOREIGN KEY (enfant_id) REFERENCES enfants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT OR IGNORE INTO admin_users (username, password_hash)
VALUES ('admin', 'admin123');
`;
