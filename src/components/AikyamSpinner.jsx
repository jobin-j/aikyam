import './AikyamSpinner.scss';

export default function AikyamSpinner({ color }) {
  return (
    <div className="aikyam-spinner-overlay">
      <span className="aikyam-spinner" style={{ color }}>A</span>
    </div>
  );
}