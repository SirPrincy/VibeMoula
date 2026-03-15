import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Info, Database } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../types';

interface Props {
  theme: string;
  onToggleTheme: () => void;
  onExport: () => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
  onResetData: () => void;
}

const SettingsView: React.FC<Props> = ({ 
  theme, 
  onToggleTheme, 
  onExport,
  currency,
  onCurrencyChange,
  onResetData
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '30px' }}>Réglages</h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Theme Setting */}
        <div style={{ 
          background: 'var(--card-bg)', 
          padding: '25px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'var(--bg)', padding: '10px', borderRadius: '12px', color: 'var(--accent)' }}>
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>Apparence</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>
                {theme === 'light' ? 'Mode Clair' : 'Mode Sombre'} actif
              </p>
            </div>
          </div>
          <button 
            onClick={onToggleTheme}
            style={{ 
              background: 'var(--bg)', 
              border: '1px solid var(--border)', 
              padding: '10px 20px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              color: 'var(--fg)',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            Changer
          </button>
        </div>

        {/* Currency Setting */}
        <div style={{ 
          background: 'var(--card-bg)', 
          padding: '25px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'var(--bg)', padding: '10px', borderRadius: '12px', color: 'var(--accent)' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>$</span>
            </div>
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>Devise Dashboard</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Format d'affichage global</p>
            </div>
          </div>
          <select 
            value={currency} 
            onChange={e => onCurrencyChange(e.target.value)}
            style={{ width: '100px', padding: '10px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', textAlign: 'center', fontWeight: 800, outline: 'none' }}
          >
            {SUPPORTED_CURRENCIES.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>

        {/* Data Persistence */}
        <div style={{ 
          background: 'var(--card-bg)', 
          padding: '25px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{ background: 'var(--bg)', padding: '10px', borderRadius: '12px', color: 'var(--accent)' }}>
              <Database size={20} />
            </div>
            <p style={{ fontWeight: 700, margin: 0 }}>Données & Stockage</p>
          </div>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            <button 
              onClick={onExport}
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '16px', 
                border: '1px solid var(--border)', 
                background: 'var(--bg)',
                color: 'var(--fg)',
                fontWeight: 700,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <Info size={18} /> Exporter les données (JSON)
            </button>
          </div>
        </div>
        
        {/* Dangerous Zone */}
        <div style={{ 
          background: 'rgba(255, 59, 48, 0.05)', 
          padding: '25px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid rgba(255, 59, 48, 0.2)',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255, 59, 48, 0.1)', padding: '10px', borderRadius: '12px', color: '#FF3B30' }}>
              <Database size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 700, margin: 0, color: '#FF3B30' }}>Zone de Danger</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Actions irréversibles</p>
            </div>
          </div>
          
          <button 
            onClick={onResetData}
            style={{ 
              width: '100%', 
              padding: '15px', 
              borderRadius: '16px', 
              border: 'none', 
              background: '#FF3B30',
              color: 'white',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(255, 59, 48, 0.2)'
            }}
          >
            Réinitialiser toutes les données
          </button>
        </div>

        {/* About */}
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: 'var(--muted)',
          fontSize: '0.8rem'
        }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 700 }}>VibeMoula V4.0</p>
          <p style={{ margin: 0 }}>Fait avec ❤️ pour sirprincy</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsView;
