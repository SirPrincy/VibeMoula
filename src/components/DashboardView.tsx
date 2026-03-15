import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';
import TrendChart from './TrendChart';
import { formatCurrency } from '../utils/format';

interface Props {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactions: any[];
  currency: string;
}

const DashboardView: React.FC<Props> = ({ totalBalance, totalIncome, totalExpenses, transactions, currency }) => {
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '30px' }}>Analyses</h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        <section 
          className="dashboard-stack" 
          style={{ 
            background: 'var(--card-bg)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '10px', 
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div className="stat-block" style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
            <span className="label" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>
              Solde Actuel
            </span>
            <p className="value" style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.1 }}>
              {formatCurrency(totalBalance, currency)}
            </p>
            <TrendChart data={transactions.map(t => (t.type === 'income' ? 1 : -1) * t.amount)} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div className="stat-block" style={{ borderRight: '1px solid var(--border)', padding: '15px 20px' }}>
              <span className="label" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}>
                Entrées
              </span>
              <p className="value" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--positive)' }}>
                {formatCurrency(totalIncome, currency)}
              </p>
            </div>
            <div className="stat-block" style={{ padding: '15px 20px' }}>
              <span className="label" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}>
                Sorties
              </span>
              <p className="value" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--negative)' }}>
                {formatCurrency(totalExpenses, currency)}
              </p>
            </div>
          </div>
        </section>

        <div style={{ 
          background: 'var(--card-bg)', 
          padding: '25px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ background: 'var(--bg)', padding: '15px', borderRadius: '20px', color: 'var(--accent)' }}>
            <PieChart size={30} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Taux d'Épargne Global</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{savingsRate.toFixed(1)}%</p>
          </div>
        </div>

        <div style={{ 
          background: 'var(--card-bg)', 
          padding: '25px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Comparaison</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', height: '100%' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalIncome / ((totalIncome + totalExpenses) || 1)) * 100}%` }}
                    style={{ height: '100%', background: 'var(--positive)' }} 
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalExpenses / ((totalIncome + totalExpenses) || 1)) * 100}%` }}
                    style={{ height: '100%', background: 'var(--negative)', opacity: 0.8 }} 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', fontWeight: 700 }}>
                 <span style={{ color: 'var(--positive)' }}>INCOME</span>
                 <span style={{ color: 'var(--negative)' }}>EXPENSES</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
