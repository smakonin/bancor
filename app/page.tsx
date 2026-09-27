"use client";

import { useMemo, useState } from "react";

type Country = {
  name: string;
  code: string;
  color: string;
  exports: number;
  imports: number;
  gold: number;
  commodities: { name: string; icon: string; share: number }[];
};

const countries: Country[] = [
  { name: "United States", code: "USA", color: "#99a9ff", exports: 210, imports: 270, gold: 38, commodities: [{ name: "Grain", icon: "✣", share: 34 }, { name: "Energy", icon: "◆", share: 26 }, { name: "Machinery", icon: "⚙", share: 40 }] },
  { name: "China", code: "CHN", color: "#f0c765", exports: 285, imports: 220, gold: 16, commodities: [{ name: "Electronics", icon: "⌁", share: 44 }, { name: "Rare earths", icon: "✦", share: 22 }, { name: "Textiles", icon: "▧", share: 34 }] },
  { name: "Germany", code: "DEU", color: "#66d2c6", exports: 192, imports: 160, gold: 24, commodities: [{ name: "Machinery", icon: "⚙", share: 46 }, { name: "Vehicles", icon: "◈", share: 36 }, { name: "Chemicals", icon: "◌", share: 18 }] },
  { name: "Saudi Arabia", code: "SAU", color: "#ee8f68", exports: 128, imports: 72, gold: 7, commodities: [{ name: "Petroleum", icon: "◆", share: 78 }, { name: "Chemicals", icon: "◌", share: 14 }, { name: "Metals", icon: "⬡", share: 8 }] },
  { name: "Brazil", code: "BRA", color: "#8ed073", exports: 112, imports: 94, gold: 5, commodities: [{ name: "Soy", icon: "❧", share: 35 }, { name: "Iron ore", icon: "⬡", share: 36 }, { name: "Coffee", icon: "●", share: 29 }] },
  { name: "Canada", code: "CAN", color: "#e26f62", exports: 126, imports: 111, gold: 4, commodities: [{ name: "Potash", icon: "✣", share: 38 }, { name: "Uranium", icon: "☢", share: 27 }, { name: "Timber", icon: "♠", share: 35 }] },
  { name: "Japan", code: "JPN", color: "#df8fc4", exports: 148, imports: 178, gold: 6, commodities: [{ name: "Vehicles", icon: "◈", share: 42 }, { name: "Electronics", icon: "⌁", share: 38 }, { name: "Machinery", icon: "⚙", share: 20 }] },
  { name: "India", code: "IND", color: "#d1a378", exports: 105, imports: 142, gold: 11, commodities: [{ name: "Services", icon: "✺", share: 38 }, { name: "Textiles", icon: "▧", share: 31 }, { name: "Pharma", icon: "✚", share: 31 }] },
];

const fmt = (n: number) => `${n < 0 ? "−" : "+"}${Math.abs(n).toFixed(1)} B₳`;

export default function Home() {
  const [year, setYear] = useState(2032);
  const [credit, setCredit] = useState(45);
  const [charge, setCharge] = useState(3.5);
  const [goldRatio, setGoldRatio] = useState(20);
  const [elasticity, setElasticity] = useState(65);
  const [shock, setShock] = useState("Baseline");
  const [selected, setSelected] = useState("USA");
  const [running, setRunning] = useState(false);

  const results = useMemo(() => {
    const shockMap: Record<string, Record<string, number>> = {
      Baseline: {},
      "Oil shock": { SAU: 34, USA: -10, JPN: -12, IND: -9, DEU: -7 },
      "Food shortage": { BRA: 24, USA: 14, CAN: 11, CHN: -13, IND: -16, JPN: -8 },
      "Gold squeeze": { USA: 8, DEU: 7, CHN: -7, IND: -5, BRA: -4, CAN: -3 },
    };
    return countries.map((c) => {
      const raw = c.exports - c.imports + (shockMap[shock]?.[c.code] ?? 0);
      const balancing = Math.sign(raw) * Math.min(Math.abs(raw) * (charge / 12) * (elasticity / 100), credit * .45);
      const goldEffect = (c.gold - 15) * ((goldRatio - 20) / 100) * .35;
      const balance = raw - balancing + goldEffect;
      return { ...c, raw, balancing, balance, reserve: c.gold * goldRatio / 20 + Math.max(0, balance) * .14 };
    });
  }, [credit, charge, goldRatio, elasticity, shock]);

  const totalTrade = countries.reduce((s, c) => s + c.exports + c.imports, 0) * (1 + (year - 2032) * .018);
  const imbalance = results.reduce((s, c) => s + Math.abs(c.balance), 0) / 2;
  const selectedCountry = results.find((c) => c.code === selected) ?? results[0];
  const maxBalance = Math.max(...results.map((c) => Math.abs(c.balance)), 1);

  function advance() {
    setRunning(true);
    window.setTimeout(() => {
      setYear((y) => y + 1);
      setRunning(false);
    }, 520);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Bancor World home">
          <span className="coin">₳</span>
          <span><strong>BANCOR</strong><small>WORLD CLEARING UNION</small></span>
        </a>
        <div className="status"><i /> System balanced · {year}</div>
        <nav aria-label="Primary navigation"><a className="active" href="#simulation">Simulation</a><a href="#countries">Countries</a><a href="#method">Method</a></nav>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">A COUNTERFACTUAL WORLD ECONOMY</p>
          <h1>What if trade<br />could <em>clear?</em></h1>
          <p className="lede">Explore Keynes’s unfinished idea: a neutral international money, anchored to gold, that makes both debtors and creditors responsible for restoring balance.</p>
        </div>
        <div className="gold-orbit" aria-label="One Bancor equals 0.35 grams of gold">
          <div className="orbit one" /><div className="orbit two" />
          <div className="gold-core"><span>₳</span><small>1 BANCOR</small></div>
          <div className="gold-label"><span>GOLD ANCHOR</span><strong>0.35g</strong><small>per B₳</small></div>
        </div>
      </section>

      <section className="ticker" aria-label="World economic summary">
        <div><span>GLOBAL TRADE</span><strong>{totalTrade.toFixed(0)} B₳</strong><small>↗ 2.8%</small></div>
        <div><span>NET IMBALANCE</span><strong>{imbalance.toFixed(1)} B₳</strong><small className="good">↘ {Math.min(89, charge * 8).toFixed(0)}%</small></div>
        <div><span>GOLD RESERVES</span><strong>107.0 kt</strong><small>↗ 0.4%</small></div>
        <div><span>CLEARING RATE</span><strong>₳ 1.00</strong><small>= 0.35g Au</small></div>
      </section>

      <section className="lab" id="simulation">
        <aside className="controls">
          <div className="section-title"><span>01</span><div><p>POLICY CONSOLE</p><h2>Tune the union</h2></div></div>
          <Control label="OVERDRAFT LIMIT" value={`${credit}%`} note="of annual trade" min={10} max={90} step={5} state={credit} setState={setCredit} />
          <Control label="IMBALANCE CHARGE" value={`${charge.toFixed(1)}%`} note="annual rate" min={0} max={10} step={.5} state={charge} setState={setCharge} />
          <Control label="GOLD RESERVE RATIO" value={`${goldRatio}%`} note="minimum backing" min={0} max={60} step={5} state={goldRatio} setState={setGoldRatio} />
          <Control label="TRADE ELASTICITY" value={`${elasticity}%`} note="response strength" min={10} max={100} step={5} state={elasticity} setState={setElasticity} />
          <label className="shock-label">SCENARIO SHOCK</label>
          <select value={shock} onChange={(e) => setShock(e.target.value)} aria-label="Scenario shock">
            <option>Baseline</option><option>Oil shock</option><option>Food shortage</option><option>Gold squeeze</option>
          </select>
          <button className="run" onClick={advance} disabled={running}><span>{running ? "CALCULATING" : "ADVANCE ONE YEAR"}</span><b>{running ? "···" : "→"}</b></button>
          <button className="reset" onClick={() => { setCredit(45); setCharge(3.5); setGoldRatio(20); setElasticity(65); setShock("Baseline"); setYear(2032); }}>↻ Reset assumptions</button>
        </aside>

        <div className="clearing-room">
          <div className="room-head"><div><p>LIVE CLEARING LEDGER</p><h2>World positions</h2></div><div className="legend"><span><i className="surplus" />Surplus</span><span><i className="deficit" />Deficit</span></div></div>
          <div className="zero-axis"><span>DEFICIT</span><b>0 B₳</b><span>SURPLUS</span></div>
          <div className={`balance-chart ${running ? "is-running" : ""}`}>
            {results.map((c) => {
              const width = Math.max(3, Math.abs(c.balance) / maxBalance * 47);
              return <button key={c.code} className={`balance-row ${selected === c.code ? "selected" : ""}`} onClick={() => setSelected(c.code)} aria-label={`View ${c.name}`}>
                <div className="country-name"><span className="flag-dot" style={{ background: c.color }}>{c.code.slice(0, 2)}</span><span><strong>{c.name}</strong><small>{c.code}</small></span></div>
                <div className="bar-space"><div className="midline" />{c.balance < 0 ? <div className="bar negative" style={{ width: `${width}%` }}><span>{fmt(c.balance)}</span></div> : <div className="bar positive" style={{ width: `${width}%` }}><span>{fmt(c.balance)}</span></div>}</div>
              </button>;
            })}
          </div>
          <div className="room-foot"><span>World accounts always sum to zero before reserve adjustments.</span><strong>Imbalance index <b>{(imbalance / totalTrade * 100).toFixed(1)}%</b></strong></div>
        </div>
      </section>

      <section className="country-panel" id="countries">
        <div className="section-title"><span>02</span><div><p>COUNTRY DETAIL</p><h2>{selectedCountry.name}</h2></div></div>
        <div className="country-grid">
          <div className="commodity-card">
            <p>PRIMARY EXPORT CAPACITY</p>
            {selectedCountry.commodities.map((item) => <div className="commodity" key={item.name}><span className="commodity-icon">{item.icon}</span><div><strong>{item.name}</strong><div className="capacity"><i style={{ width: `${item.share}%` }} /></div></div><b>{item.share}%</b></div>)}
          </div>
          <div className="account-card">
            <p>CLEARING ACCOUNT</p><strong className={selectedCountry.balance >= 0 ? "positive-text" : "negative-text"}>{fmt(selectedCountry.balance)}</strong>
            <div><span>Exports</span><b>{selectedCountry.exports} B₳</b></div><div><span>Imports</span><b>{selectedCountry.imports} B₳</b></div><div><span>Gold backing</span><b>{selectedCountry.gold} kt</b></div><div><span>Policy adjustment</span><b>{fmt(-selectedCountry.balancing)}</b></div>
          </div>
          <div className="mechanism-card">
            <p>THE BANCOR MECHANISM</p><h3>{selectedCountry.balance >= 0 ? "Spend, invest, or appreciate." : "Adjust gradually—not suddenly."}</h3><p className="explain">{selectedCountry.balance >= 0 ? "Persistent creditors pay a charge on excess Bancor balances, encouraging imports, foreign investment, or currency appreciation." : "The overdraft facility finances temporary deficits while measured charges encourage export growth and demand adjustment."}</p>
            <div className="mechanism-meter"><span>NO PRESSURE</span><i><b style={{ left: `${Math.min(92, Math.abs(selectedCountry.balance) / maxBalance * 85 + 7)}%` }} /></i><span>STRONG</span></div>
          </div>
        </div>
      </section>

      <section className="method" id="method">
        <p className="eyebrow">WHY IT CHANGES THE GAME</p><h2>Balance is a shared obligation.</h2>
        <div className="principles"><article><span>1</span><h3>Neutral money</h3><p>Bancor is used between central banks—not held as a national reserve asset.</p></article><article><span>2</span><h3>Symmetric pressure</h3><p>Deficit and surplus countries both face incentives to bring trade back toward balance.</p></article><article><span>3</span><h3>Elastic liquidity</h3><p>Overdrafts expand world demand without forcing countries into abrupt austerity.</p></article></div>
        <p className="disclaimer">An educational counterfactual model. Country and commodity values are stylized indices, not forecasts or investment advice.</p>
      </section>
    </main>
  );
}

function Control({ label, value, note, min, max, step, state, setState }: { label: string; value: string; note: string; min: number; max: number; step: number; state: number; setState: (n: number) => void }) {
  const pct = (state - min) / (max - min) * 100;
  return <label className="control"><span><b>{label}</b><em>{value}</em></span><input type="range" min={min} max={max} step={step} value={state} onChange={(e) => setState(Number(e.target.value))} style={{ "--pct": `${pct}%` } as React.CSSProperties} /><small>{note}</small></label>;
}
