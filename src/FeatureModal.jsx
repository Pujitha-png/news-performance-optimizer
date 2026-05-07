export default function FeatureModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Performance Notes</p>
            <h2 id="feature-modal-title">What changed in the optimized build</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close performance notes">
            ×
          </button>
        </div>

        <div className="modal-grid">
          <div>
            <h3>Core wins</h3>
            <ul>
              <li>Parallel fetches for all story details</li>
              <li>Virtualized article list to keep the DOM small</li>
              <li>Compressed hero imagery with responsive sizes</li>
              <li>Cherry-picked lodash import for score sorting</li>
            </ul>
          </div>
          <div>
            <h3>Why it stays fast</h3>
            <ul>
              <li>React.memo reduces unnecessary rerenders</li>
              <li>useMemo avoids recomputing filtered lists</li>
              <li>Code splitting keeps secondary UI out of the initial path</li>
              <li>Explicit sizing prevents layout shifts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
