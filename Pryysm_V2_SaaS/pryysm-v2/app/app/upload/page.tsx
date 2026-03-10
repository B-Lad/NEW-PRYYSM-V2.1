'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileBox, CheckCircle, Loader } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { calculateQuote, estimateVolumeFromFile, MATERIAL_RATES } from '@/lib/quote-calculator'
import type { Quality, QuoteResult } from '@/lib/quote-calculator'
import { MOCK_MACHINES } from '@/lib/mock-data'
import { fmtPrice, fmtSeconds } from '@/lib/utils'

const MATERIALS = Object.keys(MATERIAL_RATES)
const QUALITIES: { val: Quality; label: string; desc: string }[] = [
  { val: 'draft',    label: 'Draft',    desc: '0.3mm — fastest' },
  { val: 'standard', label: 'Standard', desc: '0.2mm — balanced' },
  { val: 'fine',     label: 'Fine',     desc: '0.15mm — detailed' },
  { val: 'ultra',    label: 'Ultra',    desc: '0.1mm — precision' },
]

export default function UploadPage() {
  const [file,     setFile    ] = useState<File | null>(null)
  const [material, setMaterial] = useState('PLA+')
  const [infill,   setInfill  ] = useState(20)
  const [quality,  setQuality ] = useState<Quality>('standard')
  const [machine,  setMachine ] = useState('')
  const [quote,    setQuote   ] = useState<QuoteResult | null>(null)
  const [loading,  setLoading ] = useState(false)
  const [submitted,setSubmit  ] = useState(false)

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0]
    if (!f) return
    setFile(f)
    setQuote(null)
    setSubmit(false)
    // Auto-compute quote on drop
    const vol = estimateVolumeFromFile(f)
    const q = calculateQuote({ volumeCm3: vol, material, infillPct: infill, quality })
    setQuote(q)
  }, [material, infill, quality])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'model/stl': ['.stl'], 'application/octet-stream': ['.stl','.3mf','.obj'] },
    maxFiles: 1,
  })

  const recalculate = () => {
    if (!file) return
    const vol = estimateVolumeFromFile(file)
    const q = calculateQuote({ volumeCm3: vol, material, infillPct: infill, quality })
    setQuote(q)
  }

  const handleSubmit = async () => {
    if (!file || !quote) return
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setSubmit(true)
  }

  return (
    <div>
      <div className="mb-5">
        <div className="font-mono text-[9px] text-[#b8b3c4] tracking-[.14em] mb-1">DASHBOARD / UPLOAD & QUOTE</div>
        <h1 className="font-display font-extrabold text-[22px] tracking-tight text-[#1a1624]">Upload & Quote</h1>
        <p className="text-[12.5px] text-[#8a8499] font-light mt-1">Upload an STL file to get an instant price estimate and create a job</p>
      </div>

      <div className="grid grid-cols-12 gap-5">

        {/* Left — Upload + config */}
        <div className="col-span-7 flex flex-col gap-4">

          {/* Drop zone */}
          <Card>
            <div className="p-5">
              <div {...getRootProps()} className={`
                border-2 border-dashed rounded-[10px] p-8 text-center cursor-pointer transition-all duration-200
                ${isDragActive ? 'border-[#5b3fd4] bg-[#ede9fd]' : 'border-[#d8d3ca] bg-[#f0ede8] hover:border-[#5b3fd4] hover:bg-[#ede9fd]/40'}
              `}>
                <input {...getInputProps()} />
                {file ? (
                  <div>
                    <FileBox size={32} color="#5b3fd4" className="mx-auto mb-3" strokeWidth={1.5} />
                    <p className="font-semibold text-[14px] text-[#1a1624]">{file.name}</p>
                    <p className="text-[12px] text-[#8a8499] mt-1">{(file.size / 1024).toFixed(1)} KB · Drop a new file to replace</p>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} color="#b8b3c4" className="mx-auto mb-3" strokeWidth={1.5} />
                    <p className="font-semibold text-[14px] text-[#4a4558]">
                      {isDragActive ? 'Drop your STL here…' : 'Drag & drop your STL file here'}
                    </p>
                    <p className="text-[12px] text-[#8a8499] mt-1">or click to browse · .stl, .3mf, .obj supported</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Config */}
          <Card>
            <div className="p-5">
              <h3 className="font-display font-bold text-[14px] text-[#1a1624] mb-4">Print Settings</h3>

              {/* Material */}
              <div className="mb-4">
                <label className="font-mono text-[9px] text-[#8a8499] tracking-[.1em] uppercase block mb-2">Material</label>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map(mat => (
                    <button key={mat} onClick={() => { setMaterial(mat); if (file) recalculate() }}
                      className={`px-3 py-1.5 rounded-[8px] font-mono text-[11px] font-medium border transition-all duration-150 ${
                        material === mat
                          ? 'bg-[#ede9fd] text-[#5b3fd4] border-[#5b3fd433] font-semibold'
                          : 'bg-white text-[#4a4558] border-[#e8e4dd] hover:bg-[#f0ede8]'
                      }`}>{mat}</button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="mb-4">
                <label className="font-mono text-[9px] text-[#8a8499] tracking-[.1em] uppercase block mb-2">Quality</label>
                <div className="grid grid-cols-4 gap-2">
                  {QUALITIES.map(({ val, label, desc }) => (
                    <button key={val} onClick={() => { setQuality(val); if (file) recalculate() }}
                      className={`px-3 py-2 rounded-[9px] border text-left transition-all duration-150 ${
                        quality === val
                          ? 'bg-[#ede9fd] border-[#5b3fd433] text-[#5b3fd4]'
                          : 'bg-white border-[#e8e4dd] text-[#4a4558] hover:bg-[#f0ede8]'
                      }`}>
                      <div className="font-semibold text-[12px]">{label}</div>
                      <div className="font-mono text-[9px] text-[#8a8499] mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Infill */}
              <div className="mb-4">
                <label className="font-mono text-[9px] text-[#8a8499] tracking-[.1em] uppercase block mb-2">
                  Infill — <span className="text-[#5b3fd4]">{infill}%</span>
                </label>
                <input type="range" min={5} max={100} step={5} value={infill}
                  onChange={e => { setInfill(+e.target.value); if (file) recalculate() }}
                  className="w-full accent-[#5b3fd4]" />
                <div className="flex justify-between font-mono text-[9px] text-[#b8b3c4] mt-1">
                  <span>5%</span><span>Gyroid reccomended</span><span>100%</span>
                </div>
              </div>

              {/* Assign to machine */}
              <div>
                <label className="font-mono text-[9px] text-[#8a8499] tracking-[.1em] uppercase block mb-2">Assign to Printer (optional)</label>
                <select value={machine} onChange={e => setMachine(e.target.value)}
                  className="w-full px-3 py-2 rounded-[9px] border border-[#e8e4dd] bg-white text-[12.5px] text-[#1a1624] font-body focus:outline-none focus:border-[#5b3fd4]">
                  <option value="">Auto-assign</option>
                  {MOCK_MACHINES.filter(m => m.status !== 'error').map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.status})</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Right — Quote panel */}
        <div className="col-span-5 flex flex-col gap-4">
          <Card accent="violet">
            <div className="p-5">
              <h3 className="font-display font-bold text-[14px] text-[#1a1624] mb-4">Instant Quote</h3>

              {!file && (
                <div className="py-10 text-center text-[12px] text-[#8a8499]">
                  Upload a file to see your quote
                </div>
              )}

              {quote && file && !submitted && (
                <div>
                  {/* Total */}
                  <div className="bg-[#f0ede8] rounded-[12px] p-4 mb-4 text-center">
                    <div className="font-mono text-[10px] text-[#8a8499] tracking-[.1em] uppercase mb-1">Total Estimate</div>
                    <div className="font-display font-extrabold text-[40px] text-[#5b3fd4] leading-none">{fmtPrice(quote.total)}</div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-2 mb-4">
                    {[
                      { l: 'Setup fee',      v: fmtPrice(quote.breakdown.setupFee) },
                      { l: 'Material cost',  v: fmtPrice(quote.breakdown.materialCost) },
                      { l: 'Machine cost',   v: fmtPrice(quote.breakdown.machineCost) },
                      { l: 'Est. print time', v: fmtSeconds(quote.estimatedTimeSeconds) },
                    ].map(({ l, v }) => (
                      <div key={l} className="flex justify-between text-[12.5px] pb-2 border-b border-[#f0ede8]">
                        <span className="text-[#8a8499]">{l}</span>
                        <span className="font-mono font-bold text-[#1a1624]">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Settings summary */}
                  <div className="bg-[#f0ede8] rounded-[9px] p-3 mb-4 flex flex-wrap gap-2">
                    {[material, quality, `${infill}% infill`].map(t => (
                      <span key={t} className="font-mono text-[9.5px] px-2 py-0.5 rounded-[5px] bg-white border border-[#e8e4dd] text-[#4a4558]">{t}</span>
                    ))}
                  </div>

                  <Button variant="primary" className="w-full justify-center py-3 text-[14px]" onClick={handleSubmit} disabled={loading}>
                    {loading ? <><Loader size={14} className="animate-spin" /> Creating job…</> : 'Accept & Create Job'}
                  </Button>
                  <Button variant="ghost" className="w-full justify-center mt-2" onClick={recalculate}>
                    Recalculate
                  </Button>
                </div>
              )}

              {submitted && (
                <div className="py-8 text-center">
                  <CheckCircle size={40} color="#1a7048" className="mx-auto mb-3" strokeWidth={1.5} />
                  <div className="font-display font-bold text-[16px] text-[#1a1624] mb-1">Job Created!</div>
                  <p className="text-[12.5px] text-[#8a8499] mb-4">{file?.name} has been added to the queue.</p>
                  <Button variant="primary" className="mx-auto" onClick={() => { setFile(null); setQuote(null); setSubmit(false) }}>
                    Upload Another
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Material rates reference */}
          <Card>
            <div className="p-4">
              <h4 className="font-mono text-[9px] text-[#b8b3c4] tracking-[.1em] uppercase mb-3">Material Rate Reference</h4>
              {Object.entries(MATERIAL_RATES).map(([mat, rate]) => (
                <div key={mat} className="flex justify-between items-center py-1.5 border-b border-[#f0ede8] last:border-0 text-[12px]">
                  <span className={`font-medium ${mat === material ? 'text-[#5b3fd4]' : 'text-[#4a4558]'}`}>{mat}</span>
                  <span className="font-mono text-[11px] text-[#8a8499]">${rate.toFixed(3)}/g</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
