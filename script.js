const fs = require('fs');

let quizCode = fs.readFileSync('src/components/VibeQuiz.js', 'utf8');

// Replace export default function VibeQuiz({ onComplete }) {
quizCode = quizCode.replace(
  'export default function VibeQuiz({ onComplete }) {',
  'export default function VibeQuiz({ onComplete, userRole }) {'
);

// Add state for investor
const stateAdd = 
  const [invGoal, setInvGoal] = useState('rental');
  const [invTenant, setInvTenant] = useState('professional');
  const [invBudget, setInvBudget] = useState('500k-1m');
;
quizCode = quizCode.replace('const [isGeocoding, setIsGeocoding] = useState(false);', 'const [isGeocoding, setIsGeocoding] = useState(false);' + stateAdd);

// Modify handleSubmit to include investor data
const newSubmit = 
  const handleSubmit = async () => {
    if (userRole === 'investor') {
      onComplete({
        userRole,
        invGoal,
        invTenant,
        invBudget
      });
      return;
    }
;
quizCode = quizCode.replace('  const handleSubmit = async () => {', newSubmit);

// Now, handle the render branching.
const renderStart = 
  return (
    <div className="quiz-container-inner">
      {userRole === 'investor' ? (
        <div className="quiz-step-content fade-in">
          <h2 className="quiz-title display-font platinum-text-glow">Investor Profile</h2>
          <p className="quiz-subtitle">Configure your investment targets below.</p>
          
          <div className="quiz-form-group" style={{ marginBottom: '2rem' }}>
            <label className="quiz-label uppercase letter-spacing">1. Primary Investment Goal</label>
            <div className="quiz-toggle-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'rental', label: 'High-Yield Rental Income' },
                { id: 'appreciation', label: 'Long-Term Appreciation' },
                { id: 'flip', label: 'Pre-Construction / Flipping' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={\quiz-toggle-btn luxury-btn \\}
                  onClick={() => setInvGoal(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-form-group" style={{ marginBottom: '2rem' }}>
            <label className="quiz-label uppercase letter-spacing">2. Target Tenant Profile</label>
            <div className="quiz-toggle-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'professional', label: 'Young Professionals (Downtown/Transit)' },
                { id: 'student', label: 'University Students (Campuses)' },
                { id: 'family', label: 'Families (Schools/Parks)' },
                { id: 'luxury', label: 'Luxury Corporate (Yorkville/King West)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={\quiz-toggle-btn luxury-btn \\}
                  onClick={() => setInvTenant(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-form-group" style={{ marginBottom: '2rem' }}>
            <label className="quiz-label uppercase letter-spacing">3. Target Budget</label>
            <div className="quiz-toggle-group">
              {[
                { id: 'under500', label: 'Under ' },
                { id: '500k-1m', label: ' - ' },
                { id: 'over1m', label: '+' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={\quiz-toggle-btn luxury-btn \\}
                  onClick={() => setInvBudget(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-nav-actions" style={{ marginTop: '2rem' }}>
            <div></div>
            <button className="btn-success btn-platinum-success" onClick={handleSubmit}>
              Calculate Market Matches &rarr;
            </button>
          </div>
        </div>
      ) : (
        <>
;

quizCode = quizCode.replace('  return (\n    <div className="quiz-container-inner">', renderStart);

// We need to close the <React.Fragment> at the very end.
quizCode = quizCode.replace(/    <\/div>\s*\);\s*}\s*$/, '        </>\n      )}\n    </div>\n  );\n}');

fs.writeFileSync('src/components/VibeQuiz.js', quizCode);
console.log('VibeQuiz updated for investor flow!');
