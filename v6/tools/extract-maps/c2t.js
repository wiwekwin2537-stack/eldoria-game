async () => { const g=[]; const sv=C2.Zm; try{C2.alt(g)}catch(e){} C2.Zm=sv; const names=[...new Set(g.flat())]; return {names, rows:g.map(r=>r.map(v=>names.indexOf(v).toString(36)).join(''))} }
