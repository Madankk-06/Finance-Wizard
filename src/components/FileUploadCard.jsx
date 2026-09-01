import React, { useRef } from 'react';
import { UploadCloud, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export default function FileUploadCard({
  index = 1,
  title = "Settlement Report",
  defaultFileName = "settlement.csv",
  color = "#059669",
  bgLight = "#ECFDF5",
  fileState = null,
  onUpload = () => {},
  onClear = () => {}
}) {
  const fileInputRef = useRef(null);

  const parseFileMetadata = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      const headerLine = lines[0] || "";
      const colCount = headerLine.split(',').length;
      const recordCount = Math.max(0, lines.length - 1);
      callback({
        rawFile: file,
        name: file.name,
        records: recordCount,
        columns: colCount,
        valid: true,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
    };
    reader.onerror = () => {
      callback({
        rawFile: file,
        name: file.name,
        records: 0,
        columns: 0,
        valid: true,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
    };
    reader.readAsText(file.slice(0, 1024 * 1024)); // Read first 1MB for fast line counting
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      parseFileMetadata(file, (meta) => onUpload(meta));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      parseFileMetadata(file, (meta) => onUpload(meta));
    }
  };

  return (
    <div className="card-base" style={{
      flex: 1,
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      border: fileState?.valid ? '2px solid var(--status-approve-border)' : '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-card)',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '10px',
          backgroundColor: bgLight,
          border: `1px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0
        }}>
          <FileSpreadsheet size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            {index}. {title}
          </h3>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 500 }}>
            {defaultFileName}
          </div>
        </div>
      </div>

      {/* Upload Drop Zone / Valid State Card */}
      {fileState?.valid ? (
        <div style={{
          backgroundColor: 'var(--status-approve-bg)',
          border: '1px solid var(--status-approve-border)',
          borderRadius: '10px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <CheckCircle2 size={22} color="var(--status-approve)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--status-approve)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fileState.name}
              </span>
            </div>
            <span className="badge-valid">Valid</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--status-approve)',
            paddingTop: '10px',
            borderTop: '1px solid var(--status-approve-border)',
            fontWeight: 600
          }}>
            <span>{fileState.records} records • {fileState.columns} columns</span>
            <button
              onClick={onClear}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '12.5px',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--status-escalate)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Replace
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            backgroundColor: 'var(--bg-input)',
            border: '2px dashed var(--border-strong)',
            borderRadius: '10px',
            padding: '28px 18px',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.15s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.backgroundColor = 'var(--bg-active-nav)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
            e.currentTarget.style.backgroundColor = 'var(--bg-input)';
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-active-nav)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <UploadCloud size={22} />
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 700 }}>
            Drag & drop CSV file here
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            or click to browse
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
}
