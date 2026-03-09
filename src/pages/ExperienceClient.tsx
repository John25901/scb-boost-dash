import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { MessageSquare, ThumbsUp, ThumbsDown, Meh, Star } from "lucide-react";

const sentimentData = [
  { mois: "Jan", positif: 62, neutre: 25, négatif: 13 },
  { mois: "Fév", positif: 64, neutre: 24, négatif: 12 },
  { mois: "Mar", positif: 60, neutre: 26, négatif: 14 },
  { mois: "Avr", positif: 67, neutre: 22, négatif: 11 },
  { mois: "Mai", positif: 70, neutre: 21, négatif: 9 },
  { mois: "Juin", positif: 72, neutre: 20, négatif: 8 },
  { mois: "Juil", positif: 74, neutre: 18, négatif: 8 },
  { mois: "Août", positif: 71, neutre: 20, négatif: 9 },
  { mois: "Sep", positif: 76, neutre: 17, négatif: 7 },
  { mois: "Oct", positif: 78, neutre: 16, négatif: 6 },
  { mois: "Nov", positif: 80, neutre: 14, négatif: 6 },
  { mois: "Déc", positif: 83, neutre: 12, négatif: 5 },
];

const touchpointData = [
  { canal: "Agence", satisfaction: 82 },
  { canal: "Mobile", satisfaction: 91 },
  { canal: "Web", satisfaction: 87 },
  { canal: "USSD", satisfaction: 68 },
  { canal: "Call Center", satisfaction: 75 },
];

const feedbacks = [
  { client: "M. Ngoumou", note: 5, message: "Service mobile rapide et fiable, très satisfait.", date: "08 Mars 2026" },
  { client: "Mme Fotso", note: 4, message: "Bonne expérience en agence, mais attente un peu longue.", date: "07 Mars 2026" },
  { client: "M. Kamga", note: 2, message: "Le canal USSD est trop lent, besoin d'amélioration.", date: "06 Mars 2026" },
  { client: "Mme Eto'o", note: 5, message: "Ouverture de compte en ligne très fluide !", date: "05 Mars 2026" },
];

const ExperienceClient = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Expérience Client</h1>
      <p className="text-xs text-muted-foreground">Analyse du sentiment, parcours client & feedback — NLP & Big Data</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {[
        { label: "Sentiment Positif", value: "83%", icon: ThumbsUp, color: "text-kpi-positive" },
        { label: "Sentiment Neutre", value: "12%", icon: Meh, color: "text-kpi-warning" },
        { label: "Sentiment Négatif", value: "5%", icon: ThumbsDown, color: "text-kpi-negative" },
        { label: "CSAT Moyen", value: "4.2/5", icon: Star, color: "text-primary" },
      ].map((s) => (
        <Card key={s.label} className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
            <s.icon size={20} className={s.color} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-lg font-display font-bold text-card-foreground">{s.value}</p>
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-5 col-span-2">
        <h3 className="font-display font-semibold text-card-foreground mb-1">Analyse de Sentiment (NLP)</h3>
        <p className="text-xs text-muted-foreground mb-4">Distribution mensuelle des sentiments — modèle BERT fine-tuné</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={sentimentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
            <XAxis dataKey="mois" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" unit="%" />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="positif" stackId="1" stroke="hsl(160, 60%, 45%)" fill="hsl(160, 60%, 45%)" fillOpacity={0.6} />
            <Area type="monotone" dataKey="neutre" stackId="1" stroke="hsl(35, 92%, 55%)" fill="hsl(35, 92%, 55%)" fillOpacity={0.6} />
            <Area type="monotone" dataKey="négatif" stackId="1" stroke="hsl(0, 72%, 51%)" fill="hsl(0, 72%, 51%)" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-card-foreground mb-1">Satisfaction par Point de Contact</h3>
        <p className="text-xs text-muted-foreground mb-4">Score CSAT par canal (%)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={touchpointData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" unit="%" />
            <YAxis dataKey="canal" type="category" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" width={80} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="satisfaction" radius={[0, 6, 6, 0]} barSize={18} fill="hsl(215, 80%, 28%)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={16} className="text-primary" />
        <h3 className="font-display font-semibold text-card-foreground">Feedback Clients Récents</h3>
      </div>
      <div className="space-y-3">
        {feedbacks.map((f, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {f.client.split(" ")[1]?.[0] || f.client[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-card-foreground">{f.client}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={10} className={s < f.note ? "text-kpi-warning fill-kpi-warning" : "text-muted-foreground"} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{f.message}</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{f.date}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default ExperienceClient;
