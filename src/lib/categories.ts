export interface SubCategory {
  id: string;
  name: string;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  subCategories: SubCategory[];
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    id: 'income',
    name: 'Revenus',
    icon: '💰',
    color: '#10b981', // emerald-500
    type: 'income',
    subCategories: [
      { id: 'salary', name: 'Salaire' },
      { id: 'freelance', name: 'Freelance' },
      { id: 'investments', name: 'Investissements' },
      { id: 'gifts', name: 'Cadeaux' },
      { id: 'other_income', name: 'Autre' },
    ],
  },
  {
    id: 'housing',
    name: 'Logement',
    icon: '🏠',
    color: '#3b82f6', // blue-500
    type: 'expense',
    subCategories: [
      { id: 'rent', name: 'Loyer' },
      { id: 'utilities', name: 'Services (Eau, Elec)' },
      { id: 'maintenance', name: 'Maintenance' },
      { id: 'insurance_home', name: 'Assurance' },
    ],
  },
  {
    id: 'food',
    name: 'Alimentation',
    icon: '🍔',
    color: '#f59e0b', // amber-500
    type: 'expense',
    subCategories: [
      { id: 'groceries', name: 'Courses' },
      { id: 'restaurants', name: 'Restaurants' },
      { id: 'snacks', name: 'Snacks/Café' },
    ],
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: '🚗',
    color: '#ef4444', // red-500
    type: 'expense',
    subCategories: [
      { id: 'fuel', name: 'Carburant' },
      { id: 'taxi', name: 'Taxi/Uber' },
      { id: 'public_transport', name: 'Transports publics' },
      { id: 'maintenance_car', name: 'Entretien auto' },
    ],
  },
  {
    id: 'subscriptions',
    name: 'Abonnements',
    icon: '📱',
    color: '#8b5cf6', // violet-500
    type: 'expense',
    subCategories: [
      { id: 'streaming', name: 'Streaming (Netflix, Spotify)' },
      { id: 'software', name: 'Logiciels' },
      { id: 'phone', name: 'Téléphone/Internet' },
      { id: 'gym', name: 'Sport/Gym' },
    ],
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: '#ec4899', // pink-500
    type: 'expense',
    subCategories: [
      { id: 'clothes', name: 'Vêtements' },
      { id: 'electronics', name: 'Électronique' },
      { id: 'home_goods', name: 'Maison' },
      { id: 'gifts_shopping', name: 'Cadeaux' },
    ],
  },
  {
    id: 'leisure',
    name: 'Loisirs',
    icon: '🎮',
    color: '#06b6d4', // cyan-500
    type: 'expense',
    subCategories: [
      { id: 'games', name: 'Jeux' },
      { id: 'cinema', name: 'Cinéma' },
      { id: 'sports_events', name: 'Événements sportifs' },
      { id: 'travel', name: 'Voyage' },
    ],
  },
  {
    id: 'health',
    name: 'Santé',
    icon: '🏥',
    color: '#f43f5e', // rose-500
    type: 'expense',
    subCategories: [
      { id: 'doctor', name: 'Docteur' },
      { id: 'medicine', name: 'Médicaments' },
      { id: 'insurance_health', name: 'Mutuelle' },
      { id: 'dentist', name: 'Dentiste' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '📈',
    color: '#64748b', // slate-500
    type: 'expense',
    subCategories: [
      { id: 'savings', name: 'Épargne' },
      { id: 'investments_exp', name: 'Investissements' },
      { id: 'debts', name: 'Dettes/Prêts' },
      { id: 'bank_fees', name: 'Frais bancaires' },
    ],
  },
  {
    id: 'other',
    name: 'Autre',
    icon: '📁',
    color: '#94a3b8', // slate-400
    type: 'expense',
    subCategories: [
      { id: 'miscellaneous', name: 'Divers' },
      { id: 'emergency', name: 'Urgence' },
    ],
  },
];

export const getCategoryById = (id: string) => CATEGORY_DEFINITIONS.find(c => c.id === id);
export const getSubCategoryById = (catId: string, subId: string) => 
  getCategoryById(catId)?.subCategories.find(s => s.id === subId);
