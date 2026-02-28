import { useState, useRef } from 'react'
import { set, unset, useClient } from 'sanity'
import { techStackOptions } from '../schemaTypes/techStackOptions'

const aliasMap = {
  'typescript':   'ts',
  'javascript':   'js',
  'python':       'py',
  'tailwindcss':  'tailwind',
  'node.js':      'nodejs',
  'next.js':      'nextjs',
  'vue.js':       'vue',
  'postgresql':   'postgres',
  'c++':          'cpp',
  'c#':           'cs',
}

function getSkillIconUrl(name) {
  const key = name.toLowerCase()
  const iconName = aliasMap[key] ?? key.replace(/\s+/g, '')
  return `https://skillicons.dev/icons?i=${iconName}`
}

function generateKey() {
  return Math.random().toString(36).slice(2, 9)
}

export function TechStackInput({ value = [], onChange }) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pendingName, setPendingName] = useState('')
  const fileInputRef = useRef(null)

  const filtered = techStackOptions.filter(
    (opt) =>
      opt.title.toLowerCase().includes(query.toLowerCase()) &&
      !value.some((v) => v.name === opt.value),
  )

  const isCustom =
    query.trim() &&
    !techStackOptions.some(
      (opt) => opt.value.toLowerCase() === query.trim().toLowerCase(),
    ) &&
    !value.some((v) => v.name === query.trim())

  function addItem(name, iconRef = null) {
    const item = { _type: 'techItem', _key: generateKey(), name }
    if (iconRef) {
      item.icon = { _type: 'image', asset: { _type: 'reference', _ref: iconRef } }
    }
    onChange(set([...value, item]))
    setQuery('')
    setShowDropdown(false)
  }

  function removeItem(key) {
    const next = value.filter((v) => v._key !== key)
    onChange(next.length ? set(next) : unset())
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !pendingName) return

    setUploading(true)
    try {
      const asset = await client.assets.upload('image', file, { filename: file.name })
      addItem(pendingName, asset._id)
    } catch (err) {
      console.error('아이콘 업로드 실패:', err)
    } finally {
      setUploading(false)
      setPendingName('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function openUploadFor(name) {
    setPendingName(name)
    fileInputRef.current?.click()
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* 선택된 뱃지 */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {value.map((item) => (
            <span
              key={item._key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 12,
                border: '1px solid #334155',
              }}
            >
              <img
                src={getSkillIconUrl(item.name)}
                alt={item.name}
                width={16}
                height={16}
                onError={(e) => { e.target.style.display = 'none' }}
              />
              {item.name}
              <button
                type="button"
                onClick={() => removeItem(item._key)}
                style={{
                  marginLeft: 2,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 16,
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* 검색 입력 + 드롭다운 */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true) }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              e.preventDefault()
              addItem(query.trim())
            } else if (e.key === 'Escape') {
              setShowDropdown(false)
            }
          }}
          placeholder={uploading ? '업로드 중...' : '기술 검색 또는 직접 입력 후 Enter'}
          disabled={uploading}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #334155',
            background: uploading ? '#1e293b' : '#0f172a',
            color: 'white',
            fontSize: 13,
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />

        {showDropdown && (filtered.length > 0 || isCustom) && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 6,
              maxHeight: 240,
              overflowY: 'auto',
              zIndex: 100,
            }}
          >
            {/* 목록에서 검색된 항목 */}
            {filtered.map((opt) => (
              <div
                key={opt.value}
                onMouseDown={(e) => { e.preventDefault(); addItem(opt.value) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#e2e8f0',
                  fontSize: 13,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#334155')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <img
                  src={getSkillIconUrl(opt.value)}
                  alt={opt.title}
                  width={20}
                  height={20}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                {opt.title}
              </div>
            ))}

            {/* 직접 추가 (목록에 없는 항목) */}
            {isCustom && (
              <div style={{ borderTop: filtered.length > 0 ? '1px solid #334155' : 'none' }}>
                {/* 텍스트만 추가 */}
                <div
                  onMouseDown={(e) => { e.preventDefault(); addItem(query.trim()) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    fontSize: 13,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#334155')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span
                    style={{
                      fontSize: 11,
                      background: '#334155',
                      color: '#e2e8f0',
                      padding: '2px 6px',
                      borderRadius: 4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    직접 추가
                  </span>
                  {query.trim()}
                </div>

                {/* 아이콘 이미지와 함께 추가 */}
                <div
                  onMouseDown={(e) => { e.preventDefault(); openUploadFor(query.trim()) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    fontSize: 13,
                    borderTop: '1px solid #1e3a5f',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#334155')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span
                    style={{
                      fontSize: 11,
                      background: '#1d4ed8',
                      color: '#e2e8f0',
                      padding: '2px 6px',
                      borderRadius: 4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    아이콘 업로드
                  </span>
                  {query.trim()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
