export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          anciennete_mois: number | null
          canal_principal: string | null
          code_client: string
          commentaire_nps: string | null
          created_at: string
          date_naissance: string | null
          date_ouverture_compte: string
          derniere_transaction_jours: number | null
          duree_onboarding_minutes: number | null
          email: string | null
          frequence_momo_mensuel: number | null
          genre: string
          id: string
          montant_credit_en_cours: number | null
          nom: string
          nombre_incidents_paiement: number | null
          nombre_transactions_mois: number | null
          prenom: string
          profession: string | null
          ratio_momo_vs_bancaire: number | null
          revenu_mensuel: number | null
          risque_churn: number | null
          score_comportemental: number | null
          score_nps: number | null
          secteur_activite: string | null
          secteur_informel: boolean | null
          segment_rfm: string | null
          solde_actuel: number | null
          stabilite_revenus_6mois: number | null
          statut: string
          telephone: string | null
          type_compte: string
          type_personne: string
          ville: string | null
          volume_momo_mensuel: number | null
        }
        Insert: {
          anciennete_mois?: number | null
          canal_principal?: string | null
          code_client: string
          commentaire_nps?: string | null
          created_at?: string
          date_naissance?: string | null
          date_ouverture_compte: string
          derniere_transaction_jours?: number | null
          duree_onboarding_minutes?: number | null
          email?: string | null
          frequence_momo_mensuel?: number | null
          genre: string
          id?: string
          montant_credit_en_cours?: number | null
          nom: string
          nombre_incidents_paiement?: number | null
          nombre_transactions_mois?: number | null
          prenom: string
          profession?: string | null
          ratio_momo_vs_bancaire?: number | null
          revenu_mensuel?: number | null
          risque_churn?: number | null
          score_comportemental?: number | null
          score_nps?: number | null
          secteur_activite?: string | null
          secteur_informel?: boolean | null
          segment_rfm?: string | null
          solde_actuel?: number | null
          stabilite_revenus_6mois?: number | null
          statut?: string
          telephone?: string | null
          type_compte: string
          type_personne: string
          ville?: string | null
          volume_momo_mensuel?: number | null
        }
        Update: {
          anciennete_mois?: number | null
          canal_principal?: string | null
          code_client?: string
          commentaire_nps?: string | null
          created_at?: string
          date_naissance?: string | null
          date_ouverture_compte?: string
          derniere_transaction_jours?: number | null
          duree_onboarding_minutes?: number | null
          email?: string | null
          frequence_momo_mensuel?: number | null
          genre?: string
          id?: string
          montant_credit_en_cours?: number | null
          nom?: string
          nombre_incidents_paiement?: number | null
          nombre_transactions_mois?: number | null
          prenom?: string
          profession?: string | null
          ratio_momo_vs_bancaire?: number | null
          revenu_mensuel?: number | null
          risque_churn?: number | null
          score_comportemental?: number | null
          score_nps?: number | null
          secteur_activite?: string | null
          secteur_informel?: boolean | null
          segment_rfm?: string | null
          solde_actuel?: number | null
          stabilite_revenus_6mois?: number | null
          statut?: string
          telephone?: string | null
          type_compte?: string
          type_personne?: string
          ville?: string | null
          volume_momo_mensuel?: number | null
        }
        Relationships: []
      }
      nps_responses: {
        Row: {
          canal: string | null
          client_id: string
          commentaire: string | null
          created_at: string
          created_by: string | null
          id: string
          score: number
          sentiment: string | null
          sentiment_score: number | null
        }
        Insert: {
          canal?: string | null
          client_id: string
          commentaire?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          score: number
          sentiment?: string | null
          sentiment_score?: number | null
        }
        Update: {
          canal?: string | null
          client_id?: string
          commentaire?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          score?: number
          sentiment?: string | null
          sentiment_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nps_responses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "data_engineer"
        | "data_scientist"
        | "metier"
        | "conformite"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "data_engineer",
        "data_scientist",
        "metier",
        "conformite",
      ],
    },
  },
} as const
