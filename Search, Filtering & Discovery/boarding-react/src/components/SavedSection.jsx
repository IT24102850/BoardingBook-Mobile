import { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';

function getSaved() { try { return JSON.parse(localStorage.getItem('bbsl_v2') || '[]'); } catch { return []; } }
function setSaved(a) { localStorage.setItem('bbsl_v2', JSON.stringify(a)); }

export default function SavedSection({ filters, onApplySaved }) {
    const toast = useToast();
    const [savedList, setSavedList] = useState([]);
    const [saveName, setSaveName] = useState('');

    useEffect(() => { setSavedList(getSaved()); }, []);

    function handleApply(id) {
        const s = savedList.find(x => x.id === id);
        if (!s) return;
        onApplySaved(s.snap);
        document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
        toast('✅ Applied!', 'success');
    }

    function handleSave() {
        if (!saveName.trim()) return toast('⚠️ Enter name', 'error');
        const list = getSaved();
        list.push({ id: Date.now(), name: saveName.trim(), snap: { ...filters, facs: [...filters.facs] } });
        setSaved(list); setSavedList(list); setSaveName('');
        toast('🔖 Saved!', 'success');
    }

    return (
        <section className="saved-section" id="saved">
            <div className="container">
                <h2 className="section-title">Saved <span className="hl">Searches</span></h2>
                <div className="saved-layout">
                    <div className="saved-card">
                        <h3>💾 Save Current</h3>
                        <div className="save-row">
                            <input className="save-input" value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Name..." />
                            <button className="btn-save" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                    <div className="saved-card">
                        <h3>📂 Your List</h3>
                        <div className="saved-items">
                            {savedList.map(s => (
                                <div key={s.id} className="si">
                                    <div className="si-header">
                                        <div className="si-name">📌 {s.name}</div>
                                        <div className="si-actions">
                                            <button className="btn-apply" onClick={() => onApplySaved(s.snap)}>Apply</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
