import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, Archive, ArrowDown, ArrowUp, AtSign, Bell, Box, BriefcaseBusiness,
  ChevronDown, ChevronRight, CircleDot, Clock3, Copy, Download, ExternalLink,
  FileText, Filter, Fingerprint, Folder, Globe2, Hash, Link2, Mail, MapPin,
  Maximize2, Minus, Network, PanelLeft, PanelRight, Plus, Radar, Search,
  Settings2, ShieldCheck, SlidersHorizontal, Tag, Trash2, UserRound, Users,
  X, ZoomIn, ZoomOut
} from 'lucide-react';
import './styles.css';

const initialNodes = [
  { id: 'root', type: 'root', label: 'NORTHSTAR', value: 'Investigation workspace', x: 50, y: 43, meta: 'Investigation', color: '#d2a15c' },
  { id: 'domain', type: 'domain', label: 'northstar-intel.io', value: 'northstar-intel.io', x: 27, y: 23, meta: 'Domain', color: '#d2a15c' },
  { id: 'person', type: 'person', label: 'Elena Voss', value: 'elena.voss@proton.me', x: 76, y: 22, meta: 'Person', color: '#9a8cce' },
  { id: 'handle', type: 'handle', label: '@evoss_ops', value: '@evoss_ops', x: 88, y: 48, meta: 'Handle', color: '#9a8cce' },
  { id: 'ip', type: 'ip', label: '185.72.44.19', value: '185.72.44.19', x: 75, y: 74, meta: 'IP address', color: '#6fa49d' },
  { id: 'org', type: 'org', label: 'Helix Research', value: 'Helix Research GmbH', x: 28, y: 74, meta: 'Organization', color: '#6fa49d' },
  { id: 'mail', type: 'email', label: 'contact@northstar-intel.io', value: 'contact@northstar-intel.io', x: 11, y: 48, meta: 'Email', color: '#a7a0c4' }
];

const initialEdges = [
  ['root', 'domain'], ['root', 'person'], ['root', 'handle'], ['root', 'ip'], ['root', 'org'], ['root', 'mail'], ['person', 'handle'], ['domain', 'mail'], ['domain', 'ip']
];

const nodeIcon = (type, size = 15) => {
  const icons = { root: Radar, domain: Globe2, person: UserRound, handle: AtSign, ip: Network, org: BriefcaseBusiness, email: Mail, phone: Hash, document: FileText };
  const Icon = icons[type] || CircleDot;
  return <Icon size={size} strokeWidth={1.7} />;
};

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedId, setSelectedId] = useState('root');
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState('Graph');
  const [zoom, setZoom] = useState(100);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [eventsOpen, setEventsOpen] = useState(true);
  const [toast, setToast] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [screen, setScreen] = useState('home');
  const [videoEnded, setVideoEnded] = useState(false);
  const selected = nodes.find((node) => node.id === selectedId) || nodes[0];
  const filteredNodes = nodes.filter((node) => `${node.label} ${node.value} ${node.meta}`.toLowerCase().includes(query.toLowerCase()));

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  const addBranch = () => {
    const id = `node-${Date.now()}`;
    const nextType = nodes.length % 2 ? 'document' : 'phone';
    const nextNode = {
      id, type: nextType, label: nextType === 'document' ? 'New evidence' : '+49 30 8821 4050',
      value: nextType === 'document' ? 'Unclassified source' : '+49 30 8821 4050',
      x: Math.max(8, Math.min(92, selected.x + (selected.x < 55 ? 19 : -19))),
      y: Math.max(12, Math.min(87, selected.y + (selected.y < 48 ? 18 : -18))),
      meta: nextType === 'document' ? 'Document' : 'Phone', color: nextType === 'document' ? '#b98b66' : '#779eb2'
    };
    setNodes((current) => [...current, nextNode]);
    setEdges((current) => [...current, [selected.id, id]]);
    setSelectedId(id);
    notify('Ветка добавлена');
  };

  const removeSelected = () => {
    if (selected.id === 'root') return notify('Корневой узел нельзя удалить');
    setNodes((current) => current.filter((node) => node.id !== selected.id));
    setEdges((current) => current.filter(([from, to]) => from !== selected.id && to !== selected.id));
    setSelectedId('root');
    notify('Узел удалён');
  };

  if (screen === 'home') {
    return (
      <div className={`home-screen ${videoEnded ? 'video-ended' : ''}`}>
        <video className="home-video" autoPlay muted playsInline onEnded={() => setVideoEnded(true)}>
          <source src="/intro.mp4" type="video/mp4" />
        </video>
        <div className="home-video-shade" />
        <div className="home-content">
          <div className="home-brand"><div className="brand-mark"><Radar size={22} /></div><span>SHADOWGRAPH</span></div>
          <div className="home-rule" />
          <p className="home-kicker">OSINT INVESTIGATION WORKSPACE</p>
          <h1>Trace what<br />others miss.</h1>
          <p className="home-description">A focused environment for mapping entities, relationships and evidence.</p>
          <div className="home-actions">
            <button className="home-primary" onClick={() => setScreen('graph')}><Plus size={17} /> Create case</button>
            <button className="home-secondary" onClick={() => setScreen('graph')}><Folder size={16} /> Open case</button>
          </div>
          <button className="home-settings" onClick={() => setScreen('settings')}><Settings2 size={15} /> Settings</button>
        </div>
        <div className="home-footer"><span>SHADOWGRAPH / PRIVATE INVESTIGATION TOOL</span><span>v0.1.0-alpha</span></div>
      </div>
    );
  }

  if (screen === 'settings') {
    return (
      <div className="settings-screen">
        <header className="settings-header"><button className="settings-brand" onClick={() => setScreen('home')}><div className="brand-mark"><Radar size={18} /></div><span>SHADOWGRAPH</span></button><span className="settings-caption">APPLICATION SETTINGS</span></header>
        <main className="settings-main">
          <button className="back-button" onClick={() => setScreen('home')}><ArrowDown size={15} /> Back to start</button>
          <p className="home-kicker">CONFIGURATION</p>
          <h1>Settings</h1>
          <div className="settings-list">
            <div className="settings-row"><span><strong>Appearance</strong><small>Interface contrast and workspace theme</small></span><button className="settings-control" onClick={() => setIsDark((value) => !value)}>{isDark ? 'Dark' : 'Light'} <CircleDot size={13} /></button></div>
            <div className="settings-row"><span><strong>Background video</strong><small>Play the intro motion on application launch</small></span><span className="settings-status">Enabled</span></div>
            <div className="settings-row"><span><strong>Application version</strong><small>ShadowGraph investigation workspace</small></span><span className="settings-status">0.1.0-alpha</span></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`app-shell ${isDark ? '' : 'soft-mode'}`}>
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark"><Radar size={18} /></div><span>SHADOWGRAPH</span><small>OSINT GRAPH</small></div>
        <div className="workspace-select"><span className="status-dot" /> NORTHSTAR / investigation <ChevronDown size={14} /></div>
        <div className="top-actions">
          <button className="icon-button" title="Уведомления"><Bell size={16} /><i /></button>
          <button className="icon-button" title="Настройки" onClick={() => notify('Настройки доступны в рабочем пространстве')}><Settings2 size={16} /></button>
          <div className="avatar">AV</div>
        </div>
      </header>

      <div className="subbar">
        <nav className="view-tabs" aria-label="Режимы представления">
          {['Graph', 'Timeline', 'Table'].map((view) => <button key={view} className={activeView === view ? 'active' : ''} onClick={() => setActiveView(view)}>{view === 'Graph' ? <Network size={14} /> : view === 'Timeline' ? <Clock3 size={14} /> : <Archive size={14} />}{view}</button>)}
        </nav>
        <div className="sub-actions"><span className="sync-label"><span className="live-dot" /> Live sync</span><button title="Экспорт" onClick={() => notify('Экспорт подготовлен')}><Download size={15} /> Export</button><button title="Фильтры"><SlidersHorizontal size={15} /> Filters <span className="filter-count">3</span></button></div>
      </div>

      <main className="workspace">
        {showLeft && <aside className="sidebar left-sidebar">
          <div className="panel-heading"><div><span className="eyebrow">Workspace</span><h2>Objects <span>{nodes.length}</span></h2></div><button className="ghost-icon" title="Свернуть панель" onClick={() => setShowLeft(false)}><PanelLeft size={16} /></button></div>
          <div className="search-box"><Search size={15} /><input placeholder="Search objects" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>/</kbd></div>
          <div className="object-list">{filteredNodes.map((node) => <button className={`object-row ${selectedId === node.id ? 'selected' : ''}`} key={node.id} onClick={() => setSelectedId(node.id)}><span className="type-icon" style={{ color: node.color }}>{nodeIcon(node.type)}</span><span className="row-copy"><strong>{node.label}</strong><small>{node.meta}</small></span><span className="row-count">{node.id === 'root' ? '9' : edges.filter((edge) => edge.includes(node.id)).length}</span></button>)}</div>
          <div className="sidebar-footer"><button onClick={() => notify('Импорт источника недоступен в демо')}><Plus size={15} /> Add object</button><button className="ghost-icon" title="Фильтровать список"><Filter size={15} /></button></div>
        </aside>}

        <section className="canvas-panel">
          <div className="canvas-toolbar"><div className="canvas-title"><span className="eyebrow">Canvas / 01</span><strong>Northstar network</strong></div><div className="canvas-tools"><button className="ghost-icon" title="Центрировать граф" onClick={() => notify('Граф центрирован')}><Maximize2 size={15} /></button><span className="divider" /><button className="ghost-icon" title="Уменьшить" onClick={() => setZoom((value) => Math.max(50, value - 10))}><ZoomOut size={15} /></button><span className="zoom-value">{zoom}%</span><button className="ghost-icon" title="Увеличить" onClick={() => setZoom((value) => Math.min(150, value + 10))}><ZoomIn size={15} /></button><span className="divider" /><button className="ghost-icon" title="Переключить боковую панель" onClick={() => setShowRight((value) => !value)}><PanelRight size={15} /></button></div></div>
          <div className="graph-stage" style={{ '--graph-scale': zoom / 100 }}>
            <div className="grid-overlay" />
            <svg className="edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{edges.map(([fromId, toId]) => { const from = nodes.find((node) => node.id === fromId); const to = nodes.find((node) => node.id === toId); if (!from || !to) return null; return <line key={`${fromId}-${toId}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={from.id === selectedId || to.id === selectedId ? 'edge-active' : ''} />; })}</svg>
            {nodes.map((node) => <button key={node.id} className={`graph-node ${node.id === selectedId ? 'active' : ''} ${node.type === 'root' ? 'root-node' : ''}`} style={{ left: `${node.x}%`, top: `${node.y}%`, '--node-color': node.color }} onClick={() => setSelectedId(node.id)}><span className="node-symbol">{nodeIcon(node.type, node.type === 'root' ? 18 : 15)}</span><span className="node-label">{node.label}</span><span className="node-meta">{node.meta}</span>{node.id === selectedId && <span className="node-handle handle-top" />}</button>)}
            <div className="canvas-hint"><span className="mouse-icon">⌘</span> Drag to pan <span className="hint-separator">·</span> Scroll to zoom</div>
          </div>
          <div className="minimap"><div className="mini-grid" />{nodes.map((node) => <span key={node.id} style={{ left: `${node.x}%`, top: `${node.y}%`, background: node.color }} />)}</div>
          {eventsOpen && <div className="event-strip"><div className="event-head"><span><Activity size={14} /> Recent activity</span><button onClick={() => setEventsOpen(false)} title="Скрыть события"><ChevronDown size={15} /></button></div><div className="events"><div><span className="event-marker green" /><strong>Source scan completed</strong><small>northstar-intel.io · 2m ago</small></div><div><span className="event-marker blue" /><strong>New relation found</strong><small>Elena Voss ↔ @evoss_ops · 11m ago</small></div><div><span className="event-marker amber" /><strong>Manual note added</strong><small>Analyst workspace · 18m ago</small></div></div></div>}
          {!eventsOpen && <button className="events-reopen" onClick={() => setEventsOpen(true)}><ArrowUp size={14} /> Activity</button>}
        </section>

        {showRight && <aside className="sidebar right-sidebar">
          <div className="panel-heading"><div><span className="eyebrow">Inspector</span><h2>Object details</h2></div><button className="ghost-icon" title="Свернуть панель" onClick={() => setShowRight(false)}><PanelRight size={16} /></button></div>
          <div className="inspector-content"><div className="selected-symbol" style={{ color: selected.color }}>{nodeIcon(selected.type, 26)}</div><div className="selected-title"><span className="eyebrow">{selected.meta}</span><h1>{selected.label}</h1><button className="copy-button" onClick={() => { navigator.clipboard?.writeText(selected.value); notify('Значение скопировано'); }}><Copy size={13} /> Copy value</button></div><div className="confidence"><span>Confidence score</span><strong>92%</strong><div className="confidence-bar"><i /></div></div><div className="detail-section"><span className="section-label">Properties</span><dl><dt>Value</dt><dd>{selected.value}</dd><dt>First seen</dt><dd>14 Mar 2024, 09:42 UTC</dd><dt>Last seen</dt><dd>Today, 16:08 UTC</dd><dt>Sources</dt><dd><span className="source-badge"><Globe2 size={12} /> 4 sources</span></dd></dl></div><div className="detail-section"><span className="section-label">Tags</span><div className="tag-list"><span>priority</span><span>verified</span><button title="Добавить тег"><Plus size={13} /></button></div></div><div className="detail-section connections"><span className="section-label">Connections <b>{edges.filter((edge) => edge.includes(selected.id)).length}</b></span>{edges.filter((edge) => edge.includes(selected.id)).slice(0, 4).map(([fromId, toId]) => { const linked = nodes.find((node) => node.id === (fromId === selected.id ? toId : fromId)); return <button className="connection-row" key={linked?.id} onClick={() => linked && setSelectedId(linked.id)}><span style={{ color: linked?.color }}>{nodeIcon(linked?.type)}</span><span><strong>{linked?.label}</strong><small>{linked?.meta}</small></span><ChevronRight size={14} /></button>; })}</div></div>
          <div className="inspector-footer"><button className="primary-action" onClick={addBranch}><Plus size={15} /> Add branch</button><button className="danger-button" onClick={removeSelected} title="Удалить выбранный объект"><Trash2 size={15} /></button></div>
        </aside>}
        {!showLeft && <button className="panel-reopen left-reopen" onClick={() => setShowLeft(true)} title="Открыть объекты"><PanelLeft size={16} /></button>}
        {!showRight && <button className="panel-reopen right-reopen" onClick={() => setShowRight(true)} title="Открыть инспектор"><PanelRight size={16} /></button>}
      </main>
      <footer className="statusbar"><span><span className="live-dot" /> Connected</span><span>Last sync: just now</span><span className="status-spacer" /><button onClick={() => setIsDark((value) => !value)}><CircleDot size={12} /> {isDark ? 'Dark mode' : 'Light mode'}</button><span>v0.1.0-alpha</span></footer>
      {toast && <div className="toast"><ShieldCheck size={15} /> {toast}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
