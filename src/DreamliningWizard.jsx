import React, { useState, useEffect } from 'react';
import { Clock, Target, DollarSign, Zap, Calendar, FileText, ArrowRight, Star } from 'lucide-react';

const DreamliningWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeline, setTimeline] = useState('');
  const [dreams, setDreams] = useState({
    have: [],
    be: [],
    do: []
  });
  const [costs, setCosts] = useState({
    have: [],
    be: [],
    do: []
  });
  const [actions, setActions] = useState({
    today: [],
    tomorrow: [],
    thisWeek: []
  });

  const steps = [
    { title: "Choisir Timeline", icon: Clock },
    { title: "AVOIR (5 rêves)", icon: DollarSign },
    { title: "ÊTRE (5 rêves)", icon: Target },
    { title: "FAIRE (5 rêves)", icon: Zap },
    { title: "ÊTRE → FAIRE", icon: ArrowRight },
    { title: "Calcul Coûts", icon: DollarSign },
    { title: "Actions", icon: Calendar },
    { title: "Export", icon: FileText }
  ];

  const addDream = (category, dream) => {
    if (dreams[category].length < 5) {
      setDreams({
        ...dreams,
        [category]: [...dreams[category], dream]
      });
    }
  };

  const addCost = (category, index, cost) => {
    const newCosts = { ...costs };
    newCosts[category][index] = parseFloat(cost) || 0;
    setCosts(newCosts);
  };

  const calculateTotals = () => {
    const totalA = costs.have.reduce((sum, cost) => sum + (cost || 0), 0);
    const totalB = costs.be.reduce((sum, cost) => sum + (cost || 0), 0);
    const totalC = costs.do.reduce((sum, cost) => sum + (cost || 0), 0);
    const grandTotal = totalA + totalB + totalC;
    
    const months = timeline === '6months' ? 6 : 12;
    const rmc = Math.ceil(grandTotal / months);
    const rqc = Math.ceil(rmc / 30);

    return { totalA, totalB, totalC, grandTotal, rmc, rqc };
  };

  const generateMarkdown = () => {
    const { totalA, totalB, totalC, grandTotal, rmc, rqc } = calculateTotals();
    const timelineText = timeline === '6months' ? '6 mois' : '12 mois';

    return `# CHRONORÊVES - ${timelineText.toUpperCase()}

## 🎯 AVOIR (${totalA.toLocaleString()} DH)
${dreams.have.map((dream, i) => `${i+1}. **${dream}** - ${(costs.have[i] || 0).toLocaleString()} DH`).join('\n')}

## 👤 ÊTRE (${totalB.toLocaleString()} DH)
${dreams.be.map((dream, i) => `${i+1}. **${dream}** - ${(costs.be[i] || 0).toLocaleString()} DH`).join('\n')}

## 🚀 FAIRE (${totalC.toLocaleString()} DH)
${dreams.do.map((dream, i) => `${i+1}. **${dream}** - ${(costs.do[i] || 0).toLocaleString()} DH`).join('\n')}

## 💰 RÉCAPITULATIF FINANCIER
- **Total AVOIR (A)**: ${totalA.toLocaleString()} DH
- **Total ÊTRE (B)**: ${totalB.toLocaleString()} DH  
- **Total FAIRE (C)**: ${totalC.toLocaleString()} DH
- **TOTAL GÉNÉRAL**: ${grandTotal.toLocaleString()} DH
- **RMC (Revenu Mensuel Cible)**: ${rmc.toLocaleString()} DH/mois
- **RQC (Revenu Quotidien Cible)**: ${rqc.toLocaleString()} DH/jour

## ⚡ ACTIONS IMMÉDIATES

### Aujourd'hui
${actions.today.map(action => `- [ ] ${action}`).join('\n')}

### Demain
${actions.tomorrow.map(action => `- [ ] ${action}`).join('\n')}

### Cette semaine
${actions.thisWeek.map(action => `- [ ] ${action}`).join('\n')}

---
*Généré le ${new Date().toLocaleDateString('fr-FR')} - Méthode Tim Ferriss*`;
  };

  const TimelineStep = () => (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Choisissez votre timeline</h2>
      <div className="flex justify-center gap-8">
        <button
          onClick={() => { setTimeline('6months'); setCurrentStep(1); }}
          className="bg-blue-500 text-white px-12 py-8 rounded-xl text-2xl font-bold hover:bg-blue-600 transition-all transform hover:scale-105"
        >
          <Clock className="mx-auto mb-4" size={48} />
          6 MOIS
        </button>
        <button
          onClick={() => { setTimeline('12months'); setCurrentStep(1); }}
          className="bg-purple-500 text-white px-12 py-8 rounded-xl text-2xl font-bold hover:bg-purple-600 transition-all transform hover:scale-105"
        >
          <Clock className="mx-auto mb-4" size={48} />
          12 MOIS
        </button>
      </div>
    </div>
  );

  const DreamStep = ({ category, title, color, description }) => {
    const [input, setInput] = useState('');
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${color} mb-2`}>{title}</h2>
          <p className="text-gray-600">{description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Timeline : {timeline === '6months' ? '6 mois' : '12 mois'} | 
            Rêves ajoutés : {dreams[category].length}/5
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            {dreams[category].map((dream, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Star className={`${color.replace('text-', 'text-')} fill-current`} size={20} />
                <span className="flex-1 font-medium">{dream}</span>
              </div>
            ))}
          </div>

          {dreams[category].length < 5 && (
            <div className="mt-6 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Rêve ${category.toUpperCase()} précis (soyez spécifique !)`}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && input.trim()) {
                    addDream(category, input.trim());
                    setInput('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (input.trim()) {
                    addDream(category, input.trim());
                    setInput('');
                  }
                }}
                className={`px-6 py-3 ${color.replace('text-', 'bg-')} text-white rounded-lg hover:opacity-80 transition-colors`}
              >
                Ajouter
              </button>
            </div>
          )}

          {dreams[category].length === 5 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
            >
              Continuer →
            </button>
          )}
        </div>
      </div>
    );
  };

  const BeToDoStep = () => {
    const [conversions, setConversions] = useState([]);
    
    const addConversion = (beItem) => {
      const doAction = prompt(`Comment transformer "${beItem}" en action FAIRE ?`);
      if (doAction) {
        setConversions([...conversions, { be: beItem, do: doAction }]);
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-orange-600 mb-2">ÊTRE → FAIRE</h2>
          <p className="text-gray-600">Transformez vos qualités en actions concrètes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-600 mb-4">ÊTRE (Qualités)</h3>
            {dreams.be.map((dream, index) => (
              <div key={index} className="flex justify-between items-center p-3 mb-2 bg-white rounded-lg">
                <span>{dream}</span>
                <button
                  onClick={() => addConversion(dream)}
                  className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                >
                  Convertir
                </button>
              </div>
            ))}
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-600 mb-4">FAIRE (Actions)</h3>
            {conversions.map((conv, index) => (
              <div key={index} className="p-3 mb-2 bg-white rounded-lg">
                <div className="text-sm text-gray-500">{conv.be} →</div>
                <div className="font-medium">{conv.do}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentStep(5)}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
        >
          Continuer aux Coûts →
        </button>
      </div>
    );
  };

  const CostStep = () => {
    const { totalA, totalB, totalC, grandTotal, rmc, rqc } = calculateTotals();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-2">CALCUL DES COÛTS</h2>
          <p className="text-gray-600">Estimez le coût de chaque rêve</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {['have', 'be', 'do'].map((category) => (
            <div key={category} className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className={`text-xl font-bold mb-4 ${
                category === 'have' ? 'text-blue-600' :
                category === 'be' ? 'text-purple-600' : 'text-green-600'
              }`}>
                {category.toUpperCase()}
              </h3>
              {dreams[category].map((dream, index) => (
                <div key={index} className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {dream}
                  </label>
                  <input
                    type="number"
                    placeholder="Coût en DH"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => addCost(category, index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="bg-gray-800 text-white rounded-xl p-6">
          <h3 className="text-2xl font-bold mb-4">📊 RÉCAPITULATIF</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{totalA.toLocaleString()}</div>
              <div className="text-sm">Total A (AVOIR)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{totalB.toLocaleString()}</div>
              <div className="text-sm">Total B (ÊTRE)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{totalC.toLocaleString()}</div>
              <div className="text-sm">Total C (FAIRE)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">{rmc.toLocaleString()}</div>
              <div className="text-sm">RMC (DH/mois)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400">{rqc.toLocaleString()}</div>
              <div className="text-sm">RQC (DH/jour)</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-4xl font-bold text-white">{grandTotal.toLocaleString()} DH</div>
            <div>TOTAL GÉNÉRAL</div>
          </div>
        </div>

        <button
          onClick={() => setCurrentStep(6)}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
        >
          Définir les Actions →
        </button>
      </div>
    );
  };

  const ActionStep = () => {
    const [newAction, setNewAction] = useState('');
    const [actionType, setActionType] = useState('today');

    const addAction = () => {
      if (newAction.trim()) {
        setActions({
          ...actions,
          [actionType]: [...actions[actionType], newAction.trim()]
        });
        setNewAction('');
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-2">ACTIONS IMMÉDIATES</h2>
          <p className="text-gray-600">Que faire MAINTENANT pour avancer ?</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex gap-4 mb-6">
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Aujourd'hui</option>
              <option value="tomorrow">Demain</option>
              <option value="thisWeek">Cette semaine</option>
            </select>
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              placeholder="Action concrète à faire..."
              className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addAction()}
            />
            <button
              onClick={addAction}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Ajouter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'today', title: 'Aujourd\'hui', color: 'bg-red-100 border-red-300' },
              { key: 'tomorrow', title: 'Demain', color: 'bg-orange-100 border-orange-300' },
              { key: 'thisWeek', title: 'Cette semaine', color: 'bg-yellow-100 border-yellow-300' }
            ].map(({ key, title, color }) => (
              <div key={key} className={`${color} border-2 rounded-lg p-4`}>
                <h4 className="font-bold mb-3">{title}</h4>
                {actions[key].map((action, index) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded text-sm">
                    {action}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentStep(7)}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
        >
          Générer le Export →
        </button>
      </div>
    );
  };

  const ExportStep = () => {
    const markdown = generateMarkdown();
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-2">EXPORT COMPLET</h2>
          <p className="text-gray-600">Votre plan d'action formaté pour assistant IA</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-bold">Markdown pour Assistant</h3>
            <button
              onClick={() => navigator.clipboard.writeText(markdown)}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Copier
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap">
            {markdown}
          </pre>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-bold text-blue-800 mb-2">Instructions pour Assistant :</h4>
          <p className="text-blue-700 text-sm">
            Copiez ce markdown et donnez-le à votre assistant IA (Claude, Grok, Gemini) avec cette instruction :
            <br/><br/>
            <em>"Analyse ce plan de chronorêves Tim Ferriss et aide-moi à prioriser mes actions quotidiennes pour atteindre mon RQC de {calculateTotals().rqc.toLocaleString()} DH/jour. Donne-moi un plan d'action détaillé pour les 7 prochains jours."</em>
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentStep(0);
            setTimeline('');
            setDreams({ have: [], be: [], do: [] });
            setCosts({ have: [], be: [], do: [] });
            setActions({ today: [], tomorrow: [], thisWeek: [] });
          }}
          className="w-full bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
        >
          Recommencer
        </button>
      </div>
    );
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0: return <TimelineStep />;
      case 1: return <DreamStep category="have" title="AVOIR" color="text-blue-600" description="Qu'est-ce que vous voulez posséder, obtenir ou acquérir ?" />;
      case 2: return <DreamStep category="be" title="ÊTRE" color="text-purple-600" description="Quelles compétences ou qualités voulez-vous développer ?" />;
      case 3: return <DreamStep category="do" title="FAIRE" color="text-green-600" description="Quelles expériences voulez-vous vivre ?" />;
      case 4: return <BeToDoStep />;
      case 5: return <CostStep />;
      case 6: return <ActionStep />;
      case 7: return <ExportStep />;
      default: return <TimelineStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-green-100">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎯 CHRONORÊVES WIZARD
          </h1>
          <p className="text-xl text-gray-600">
            Processus Tim Ferriss complet étape par étape
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-sm ${
                  index <= currentStep 
                    ? 'text-blue-600' 
                    : 'text-gray-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200'
                }`}>
                  <step.icon size={20} />
                </div>
                <span className="text-center">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default DreamliningWizard;