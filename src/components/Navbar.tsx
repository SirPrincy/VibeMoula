import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wallet, ReceiptText, PiggyBank, Plus, Settings } from 'lucide-react';

export type Tab = 'dashboard' | 'finance' | 'savings' | 'debt' | 'settings';

interface Props {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onAddClick: () => void;
}

const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onAddClick }) => {
  const tabs = [
    { id: 'dashboard' as Tab, label: 'Tableau', icon: LayoutDashboard },
    { id: 'finance' as Tab, label: 'Finance', icon: Wallet },
    { id: 'savings' as Tab, label: 'Épargne', icon: PiggyBank },
    { id: 'debt' as Tab, label: 'Dettes', icon: ReceiptText },
    { id: 'settings' as Tab, label: 'Réglages', icon: Settings },
  ];

  const renderTab = (tab: { id: Tab, label: string, icon: any }) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`nav-item ${isActive ? 'active' : ''}`}
      >
        <motion.div
          initial={false}
          animate={{ scale: isActive ? 1.1 : 1 }}
          className="icon-wrapper"
        >
          <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        </motion.div>
        <span className="nav-label">{tab.label}</span>
        {isActive && (
          <motion.div
            layoutId="active-pill"
            className="active-pill"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    );
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <div className="nav-logo desktop-only">
          <span className="logo-text">VibeMoula</span>
        </div>
        
        <div className="tabs-wrapper">
          {/* Mobile Layout with central plus - Filter out settings */}
          <div className="mobile-tabs-container">
            {tabs.filter(t => t.id !== 'settings').slice(0, 2).map(renderTab)}
            
            <button className="nav-add-btn" onClick={onAddClick}>
              <Plus size={24} />
            </button>
            
            {tabs.filter(t => t.id !== 'settings').slice(2).map(renderTab)}
          </div>

          {/* Desktop Layout (Standard list with Add button at top) */}
          <div className="desktop-tabs-container desktop-only">
            <button className="sidebar-add-btn" onClick={onAddClick}>
               <Plus size={20} /> Nouveau
            </button>
            
            <div className="sidebar-tabs-list">
              {tabs.map(renderTab)}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .navbar-container {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 30px);
          max-width: 440px;
          z-index: 1000;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 6px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          backdrop-filter: blur(15px);
        }

        .navbar-content {
          width: 100%;
        }

        .tabs-wrapper {
          width: 100%;
        }

        .mobile-tabs-container {
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          align-items: center;
          width: 100%;
        }

        .nav-logo, .desktop-only {
          display: none;
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 0;
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          position: relative;
          transition: color 0.3s ease;
          z-index: 1;
        }

        .nav-item.active {
          color: var(--fg);
        }

        .nav-label {
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .active-pill {
          position: absolute;
          inset: 0;
          background: var(--bg);
          border-radius: 100px;
          z-index: -1;
          border: 1px solid var(--border);
        }

        .nav-add-btn {
          width: 48px;
          height: 48px;
          background: var(--accent);
          color: var(--bg);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s ease;
          margin: 0 5px;
          flex-shrink: 0;
        }

        .nav-add-btn:active {
          transform: scale(0.9);
        }

        /* Desktop Sidebar Styles */
        @media (min-width: 1024px) {
          .desktop-only {
            display: flex;
          }
          .mobile-tabs-container {
            display: none;
          }

          .navbar-container {
            left: 30px;
            top: 30px;
            bottom: 30px;
            transform: none;
            width: 240px;
            max-width: 240px;
            border-radius: 24px;
            padding: 40px 15px;
          }

          .nav-logo {
            display: flex;
            margin-bottom: 40px;
            padding-left: 20px;
          }

          .logo-text {
            font-size: 1.5rem;
            font-weight: 900;
            letter-spacing: -1px;
            color: var(--fg);
          }

          .desktop-tabs-container {
            flex-direction: column;
            width: 100%;
          }

          .sidebar-tabs-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }

          .nav-item {
            flex: none;
            flex-direction: row;
            gap: 15px;
            padding: 14px 20px;
            width: 100%;
            justify-content: flex-start;
            border-radius: 16px;
          }

          .nav-label {
            font-size: 0.95rem;
            text-transform: none;
          }

          .active-pill {
            border-radius: 16px;
          }

          .sidebar-add-btn {
            margin-bottom: 30px;
            background: var(--accent);
            color: var(--bg);
            border: none;
            border-radius: 16px;
            padding: 16px 20px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: transform 0.2s ease, background 0.2s ease;
            width: 100%;
            font-size: 1rem;
          }
          
          .sidebar-add-btn:hover {
            transform: translateY(-2px);
            opacity: 0.9;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
