
-- Create clients table with realistic banking data
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_client text UNIQUE NOT NULL,
  nom text NOT NULL,
  prenom text NOT NULL,
  date_naissance date,
  genre text NOT NULL CHECK (genre IN ('M', 'F')),
  type_personne text NOT NULL CHECK (type_personne IN ('physique', 'morale')),
  profession text,
  secteur_activite text,
  revenu_mensuel numeric(12,2),
  email text,
  telephone text,
  ville text,
  date_ouverture_compte date NOT NULL,
  type_compte text NOT NULL,
  solde_actuel numeric(14,2) DEFAULT 0,
  nombre_transactions_mois integer DEFAULT 0,
  montant_credit_en_cours numeric(14,2) DEFAULT 0,
  nombre_incidents_paiement integer DEFAULT 0,
  anciennete_mois integer DEFAULT 0,
  statut text NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'bloqué')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read clients (role-based filtering in app)
CREATE POLICY "Authenticated users can view clients"
  ON public.clients FOR SELECT TO authenticated
  USING (true);

-- Insert 20 realistic simulated clients
INSERT INTO public.clients (code_client, nom, prenom, date_naissance, genre, type_personne, profession, secteur_activite, revenu_mensuel, email, telephone, ville, date_ouverture_compte, type_compte, solde_actuel, nombre_transactions_mois, montant_credit_en_cours, nombre_incidents_paiement, anciennete_mois, statut) VALUES
('SCB-2024-0001', 'Ngoumou', 'Jean-Pierre', '1985-03-15', 'M', 'physique', 'Ingénieur informatique', 'Technologies', 850000, 'jp.ngoumou@email.cm', '+237 6 99 12 34 56', 'Douala', '2019-06-10', 'Épargne Plus', 4250000, 45, 2500000, 0, 69, 'actif'),
('SCB-2024-0002', 'Fotso', 'Marie-Claire', '1992-07-22', 'F', 'physique', 'Médecin', 'Santé', 1200000, 'mc.fotso@email.cm', '+237 6 77 45 67 89', 'Yaoundé', '2020-01-15', 'Compte Courant', 8750000, 62, 0, 0, 62, 'actif'),
('SCB-2024-0003', 'Kamga', 'Paul', '1978-11-30', 'M', 'physique', 'Commerçant', 'Commerce', 450000, 'p.kamga@email.cm', '+237 6 55 78 90 12', 'Bafoussam', '2017-03-20', 'Compte Courant', 1200000, 28, 1800000, 3, 96, 'actif'),
('SCB-2024-0004', 'Eto''o', 'Sandrine', '1998-02-14', 'F', 'physique', 'Étudiante', 'Éducation', 75000, 's.etoo@email.cm', '+237 6 88 34 56 78', 'Douala', '2023-09-01', 'Compte Jeune', 125000, 8, 0, 0, 18, 'actif'),
('SCB-2024-0005', 'Mbarga', 'Alain', '1970-05-08', 'M', 'physique', 'Directeur Général', 'Industrie', 3500000, 'a.mbarga@email.cm', '+237 6 94 56 78 90', 'Douala', '2010-11-05', 'Premium Gold', 45000000, 120, 15000000, 0, 184, 'actif'),
('SCB-2024-0006', 'Ngono', 'Esther', '2001-08-19', 'F', 'physique', 'Freelance Design', 'Arts & Création', 180000, 'e.ngono@email.cm', '+237 6 72 89 01 23', 'Yaoundé', '2024-01-10', 'Compte Jeune', 85000, 12, 0, 0, 14, 'actif'),
('SCB-2024-0007', 'Tchamba', 'Roger', '1965-12-03', 'M', 'physique', 'Retraité', 'Fonction publique', 250000, 'r.tchamba@email.cm', '+237 6 60 12 34 56', 'Garoua', '2005-07-15', 'Épargne Retraite', 12000000, 5, 0, 0, 248, 'actif'),
('SCB-2024-0008', 'Mbouda', 'Félicité', '1990-04-25', 'F', 'physique', 'Enseignante', 'Éducation', 320000, 'f.mbouda@email.cm', '+237 6 81 45 67 89', 'Bamenda', '2021-08-20', 'Compte Courant', 650000, 18, 500000, 1, 43, 'actif'),
('SCB-2024-0009', 'Atangana', 'Michel', '1988-09-12', 'M', 'physique', 'Agriculteur', 'Agriculture', 200000, 'm.atangana@email.cm', '+237 6 53 78 90 12', 'Ebolowa', '2022-04-01', 'Compte Courant', 380000, 10, 800000, 2, 35, 'actif'),
('SCB-2024-0010', 'Eyinga', 'Diane', '1995-01-07', 'F', 'physique', 'Pharmacienne', 'Santé', 900000, 'd.eyinga@email.cm', '+237 6 76 01 23 45', 'Douala', '2020-11-12', 'Épargne Plus', 6800000, 35, 3000000, 0, 52, 'actif'),
('SCB-2024-0011', 'Société CAMTEL SA', 'CAMTEL', NULL, 'M', 'morale', NULL, 'Télécommunications', 50000000, 'finance@camtel.cm', '+237 2 22 23 40 65', 'Yaoundé', '2012-01-01', 'Compte Entreprise', 250000000, 500, 0, 0, 170, 'actif'),
('SCB-2024-0012', 'ETS Boulangerie du Soleil', 'BS', NULL, 'M', 'morale', NULL, 'Agroalimentaire', 2500000, 'contact@bsoleil.cm', '+237 2 33 42 15 30', 'Douala', '2018-06-15', 'Compte Pro', 4500000, 85, 5000000, 1, 81, 'actif'),
('SCB-2024-0013', 'Nguemo', 'Patrick', '1982-06-20', 'M', 'physique', 'Avocat', 'Juridique', 1500000, 'p.nguemo@email.cm', '+237 6 99 56 78 90', 'Yaoundé', '2015-02-28', 'Premium Gold', 18000000, 55, 0, 0, 133, 'actif'),
('SCB-2024-0014', 'Kouam', 'Brigitte', '2003-11-28', 'F', 'physique', 'Étudiante', 'Éducation', 50000, 'b.kouam@email.cm', '+237 6 85 12 34 56', 'Dschang', '2024-09-15', 'Compte Jeune', 32000, 4, 0, 0, 6, 'actif'),
('SCB-2024-0015', 'Tamba', 'Olivier', '1975-08-14', 'M', 'physique', 'Transporteur', 'Transport', 600000, 'o.tamba@email.cm', '+237 6 70 34 56 78', 'Bertoua', '2016-12-01', 'Compte Courant', 2100000, 40, 3500000, 4, 111, 'actif'),
('SCB-2024-0016', 'Nkoulou', 'Angèle', '1997-03-30', 'F', 'physique', 'Infirmière', 'Santé', 280000, 'a.nkoulou@email.cm', '+237 6 62 56 78 90', 'Kribi', '2023-03-10', 'Compte Courant', 420000, 15, 200000, 0, 24, 'actif'),
('SCB-2024-0017', 'GIC Femmes Unies de Mokolo', 'FUM', NULL, 'F', 'morale', NULL, 'Microfinance', 800000, 'gicfum@email.cm', '+237 2 22 29 15 80', 'Maroua', '2020-05-20', 'Compte Association', 1800000, 25, 1000000, 0, 58, 'actif'),
('SCB-2024-0018', 'Essomba', 'Hervé', '1993-10-05', 'M', 'physique', 'Développeur Web', 'Technologies', 500000, 'h.essomba@email.cm', '+237 6 91 78 90 12', 'Douala', '2022-07-01', 'Compte Courant', 1500000, 30, 0, 0, 32, 'actif'),
('SCB-2024-0019', 'Djomo', 'Carine', '1987-05-18', 'F', 'physique', 'Entrepreneure', 'Commerce', 700000, 'c.djomo@email.cm', '+237 6 58 90 12 34', 'Douala', '2019-09-25', 'Compte Pro', 3200000, 48, 2000000, 0, 66, 'actif'),
('SCB-2024-0020', 'Ndjock', 'Samuel', '2000-07-02', 'M', 'physique', 'Stagiaire', 'Technologies', 100000, 's.ndjock@email.cm', '+237 6 83 01 23 45', 'Yaoundé', '2025-01-05', 'Compte Jeune', 45000, 6, 0, 0, 2, 'actif');
