/**
 * AIResponsePanel
 * Renders the AI output panel — handles loading, empty state, and all
 * response types: error explanation, fix, logic breakdown, trace, tests, complexity.
 */
export default function AIResponsePanel({ isLoading, response: rawResponse, onApplyFix }) {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <span className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px' }} />
        <p style={{ color: 'var(--text-2)', marginTop: '12px', fontSize: '0.8rem' }}>
          AI is analyzing...
        </p>
      </div>
    );
  }

  if (!rawResponse) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-2)' }}>
        <p style={{ fontSize: '0.85rem' }}>AI Assistant</p>
        <p style={{ fontSize: '0.72rem', marginTop: '8px' }}>
          Use toolbar: Tests, Visualize, Explain, Fix
        </p>
      </div>
    );
  }

  const response = rawResponse.content || rawResponse;
  const usage = rawResponse.usage;
  const severityStyles = {
    High: { color: '#ff6b6b', border: 'rgba(255,107,107,0.35)', bg: 'rgba(255,107,107,0.08)' },
    Medium: { color: '#ffd166', border: 'rgba(255,209,102,0.35)', bg: 'rgba(255,209,102,0.08)' },
    Low: { color: '#4ec9b0', border: 'rgba(78,201,176,0.35)', bg: 'rgba(78,201,176,0.08)' },
  };
  const auditFindings = Array.isArray(response.findings) ? response.findings : null;

  return (
    <div>
      {response.issue && (
        <div className="ai-card error">
          <div className="ai-card-label">Issue</div>
          <div className="ai-card-content">{response.issue}</div>
        </div>
      )}
      {response.explanation && (
        <div className="ai-card info">
          <div className="ai-card-label">Explanation</div>
          <div className="ai-card-content">{response.explanation}</div>
        </div>
      )}
      {response.fix && (
        <div className="ai-card success">
          <div className="ai-card-label">Fix</div>
          <div className="ai-card-content">{response.fix}</div>
        </div>
      )}
      {response.fixedCode && (
        <div className="ai-card">
          <div
            className="ai-card-label d-flex align-items-center justify-content-between"
            style={{ color: 'var(--green)' }}
          >
            <span>Fixed Code</span>
            {onApplyFix && (
              <button
                onClick={() => onApplyFix(response.fixedCode)}
                style={{
                  background: 'var(--green)',
                  color: '#fff',
                  border: 'none',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                }}
              >
                Apply Solution
              </button>
            )}
          </div>
          <pre
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-0)',
              whiteSpace: 'pre-wrap',
              fontFamily: "'JetBrains Mono', monospace",
              marginTop: '8px',
            }}
          >
            {response.fixedCode}
          </pre>
        </div>
      )}
      {Array.isArray(response.steps) && (
        <div style={{ marginBottom: '10px' }}>
          <div
            className="ai-card-label"
            style={{ color: 'var(--accent)', marginBottom: '8px', fontSize: '0.7rem' }}
          >
            ⟡ Execution Trace ({response.steps.length} steps)
          </div>
          {response.steps.map((step, i) => {
            const isString = typeof step === 'string';
            const desc = isString
              ? step
              : step.description || step.explanation || step.action || '';
            const line = isString ? null : step.line;
            const stepCode = isString ? null : step.code;
            const vars = isString ? null : step.variables;
            return (
              <div
                key={i}
                className="ai-card"
                style={{
                  padding: '8px 10px',
                  marginBottom: '6px',
                  borderLeftColor: 'var(--accent)',
                  borderLeftWidth: '3px',
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span
                    style={{
                      background: 'var(--accent)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  {line && (
                    <span
                      style={{
                        fontSize: '0.62rem',
                        color: 'var(--text-2)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      Line {line}
                    </span>
                  )}
                </div>
                {stepCode && (
                  <pre
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--yellow)',
                      fontFamily: "'JetBrains Mono', monospace",
                      margin: '4px 0',
                      padding: '4px 8px',
                      background: 'var(--bg-0)',
                      borderRadius: '3px',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {stepCode}
                  </pre>
                )}
                {desc && (
                  <div className="ai-card-content" style={{ fontSize: '0.72rem' }}>
                    {desc}
                  </div>
                )}
                {vars && (
                  <div
                    style={{
                      marginTop: '4px',
                      padding: '4px 8px',
                      background: 'rgba(78,201,176,0.08)',
                      borderRadius: '3px',
                      border: '1px solid rgba(78,201,176,0.15)',
                    }}
                  >
                    <span style={{ fontSize: '0.6rem', color: 'var(--green)', fontWeight: 600 }}>
                      Variables:{' '}
                    </span>
                    <code
                      style={{
                        fontSize: '0.68rem',
                        color: 'var(--yellow)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {typeof vars === 'string'
                        ? vars
                        : Object.entries(vars)
                            .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
                            .join(', ')}
                    </code>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {Array.isArray(response.testCases) &&
        response.testCases.map((tc, i) => (
          <div key={i} className="ai-card">
            <div className="ai-card-label" style={{ color: 'var(--green)' }}>
              Test {i + 1}{' '}
              <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>({tc.type || 'normal'})</span>
            </div>
            <div className="ai-card-content">
              <div>
                Input: <code style={{ color: 'var(--text-0)' }}>{tc.input}</code>
              </div>
              <div>
                Expected: <code style={{ color: 'var(--green)' }}>{tc.expected}</code>
              </div>
              {tc.description && (
                <div style={{ marginTop: '4px', color: 'var(--text-2)' }}>{tc.description}</div>
              )}
            </div>
          </div>
        ))}
      {auditFindings && (
        <div style={{ marginBottom: '10px' }}>
          <div
            className="ai-card-label"
            style={{ color: 'var(--accent)', marginBottom: '8px', fontSize: '0.7rem' }}
          >
            Security Audit
            {typeof response.riskScore === 'number' && (
              <span style={{ color: 'var(--text-2)', marginLeft: '8px', fontWeight: 500 }}>
                Risk {response.riskScore}/100
              </span>
            )}
          </div>
          {auditFindings.length === 0 ? (
            <div className="ai-card success">
              <div className="ai-card-label">No Findings</div>
              <div className="ai-card-content">
                No meaningful vulnerabilities were detected in this snippet.
              </div>
            </div>
          ) : (
            auditFindings.map((finding, i) => {
              const severity = finding.severity || 'Low';
              const style = severityStyles[severity] || severityStyles.Low;
              return (
                <div
                  key={`${severity}-${finding.title || i}`}
                  className="ai-card"
                  style={{
                    borderColor: style.border,
                    background: style.bg,
                    borderLeftColor: style.color,
                    borderLeftWidth: '3px',
                  }}
                >
                  <div
                    className="ai-card-label d-flex align-items-center justify-content-between"
                    style={{ color: style.color }}
                  >
                    <span>{finding.title || `Finding ${i + 1}`}</span>
                    <span
                      style={{
                        border: `1px solid ${style.border}`,
                        borderRadius: '999px',
                        padding: '1px 7px',
                        fontSize: '0.62rem',
                      }}
                    >
                      {severity}
                    </span>
                  </div>
                  {finding.explanation && (
                    <div className="ai-card-content">{finding.explanation}</div>
                  )}
                  {finding.evidence && (
                    <div className="ai-card-content" style={{ marginTop: '6px' }}>
                      <strong style={{ color: 'var(--text-0)' }}>Evidence:</strong>{' '}
                      {finding.evidence}
                    </div>
                  )}
                  {finding.suggestion && (
                    <div className="ai-card-content" style={{ marginTop: '6px' }}>
                      <strong style={{ color: 'var(--text-0)' }}>Fix:</strong>{' '}
                      {finding.suggestion}
                    </div>
                  )}
                  {finding.refactor && (
                    <div className="ai-card-content" style={{ marginTop: '6px' }}>
                      <strong style={{ color: 'var(--text-0)' }}>Refactor:</strong>{' '}
                      {finding.refactor}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
      {Array.isArray(response.remediationSteps) && response.remediationSteps.length > 0 && (
        <div className="ai-card" style={{ borderColor: 'rgba(86,156,214,0.3)' }}>
          <div className="ai-card-label" style={{ color: 'var(--accent)' }}>
            Remediation Steps
          </div>
          <ol style={{ margin: '6px 0 0 18px', padding: 0 }}>
            {response.remediationSteps.map((step, i) => (
              <li key={`${step}-${i}`} className="ai-card-content" style={{ marginBottom: '4px' }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
      {(response.complexity || response.timeComplexity) && (
        <div className="ai-card info">
          <div className="ai-card-label">Complexity</div>
          <div className="ai-card-content">
            Time:{' '}
            <strong style={{ color: 'var(--text-0)' }}>
              {response.complexity?.time || response.timeComplexity || 'N/A'}
            </strong>
            {' | '}
            Space:{' '}
            <strong style={{ color: 'var(--text-0)' }}>
              {response.complexity?.space || response.spaceComplexity || 'N/A'}
            </strong>
          </div>
        </div>
      )}
      {response.summary && (
        <div className="ai-card" style={{ borderColor: 'rgba(78,201,176,0.3)' }}>
          <div className="ai-card-label" style={{ color: 'var(--green)' }}>
            Summary
          </div>
          <div className="ai-card-content">{response.summary}</div>
        </div>
      )}
      {response.bestPractice && (
        <div className="ai-card" style={{ borderColor: 'rgba(220,220,170,0.3)' }}>
          <div className="ai-card-label" style={{ color: 'var(--yellow)' }}>
            ✦ Best Practice
          </div>
          <div className="ai-card-content">{response.bestPractice}</div>
        </div>
      )}
      {usage && (
        <div
          style={{
            marginTop: '15px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: 'var(--text-2)',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <span>⚡ Tokens: {usage.total_tokens || 0}</span>
          <span>
            🚀 Speed:{' '}
            {usage.completion_time
              ? Math.round(usage.completion_tokens / usage.completion_time)
              : 0}{' '}
            T/s
          </span>
          <span>💰 Cost: ${(usage.total_tokens * 0.0000005).toFixed(6)}</span>
        </div>
      )}
    </div>
  );
}
