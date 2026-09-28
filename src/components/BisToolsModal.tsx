import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  FlaskConical, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  Info, 
  Smartphone,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  INDIAN_STANDARDS_DATABASE, 
  CERTIFICATION_SCHEMES, 
  BIS_TESTING_LABORATORIES, 
  GOLD_PURITY_GRADES,
  MANDATORY_HALLMARK_MARKS,
  IndianStandardItem 
} from '../data/bisStandardsData';
import { BisLogo } from './BisLogo';

interface BisToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'standards' | 'schemes' | 'labs' | 'hallmarking';
  onAskAi: (prompt: string) => void;
}

export const BisToolsModal: React.FC<BisToolsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'standards',
  onAskAi
}) => {
  const [activeTab, setActiveTab] = useState<'standards' | 'schemes' | 'labs' | 'hallmarking'>(initialTab);
  const [standardsSearch, setStandardsSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('scheme-1');
  const [labSearch, setLabSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [huidInput, setHuidInput] = useState('');
  const [huidValidationResult, setHuidValidationResult] = useState<{ isValid: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Food & Water', 'Safety & PPE', 'Electronics & IT', 'Electrical Appliances', 'Precious Metals & Jewellery', 'Consumer & Toys', 'Construction & Metals'];
  const regions = ['All', 'North', 'West', 'South', 'East'];

  const filteredStandards = INDIAN_STANDARDS_DATABASE.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = standardsSearch.toLowerCase().trim();
    const matchesSearch = !q || 
      item.productName.toLowerCase().includes(q) ||
      item.isNumber.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.descriptionInPlainLanguage.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const currentScheme = CERTIFICATION_SCHEMES.find(s => s.id === selectedSchemeId) || CERTIFICATION_SCHEMES[0];

  const filteredLabs = BIS_TESTING_LABORATORIES.filter(lab => {
    const matchesRegion = selectedRegion === 'All' || lab.region === selectedRegion;
    const q = labSearch.toLowerCase().trim();
    const matchesSearch = !q || 
      lab.name.toLowerCase().includes(q) ||
      lab.address.toLowerCase().includes(q) ||
      lab.keyProductScopes.some(s => s.toLowerCase().includes(q)) ||
      lab.disciplines.some(d => d.toLowerCase().includes(q));
    return matchesRegion && matchesSearch;
  });

  const validateHuid = () => {
    const clean = huidInput.trim().toUpperCase();
    if (!clean) {
      setHuidValidationResult(null);
      return;
    }
    // HUID format is strictly 6 alphanumeric characters
    const huidRegex = /^[A-Z0-9]{6}$/;
    if (huidRegex.test(clean)) {
      setHuidValidationResult({
        isValid: true,
        message: `Valid HUID Format: "${clean}". In the official BIS Care mobile app, this code reveals the registered jeweller, hallmarking centre, date of hallmarking, and tested purity grade.`
      });
    } else {
      setHuidValidationResult({
        isValid: false,
        message: `Invalid format: HUID must be exactly 6 alphanumeric characters (e.g. "AB1234"). It should not contain spaces or special symbols.`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <BisLogo size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#111827]">BIS Services & Standards Hub</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF1FA] text-[#2F5FA7] border border-[#2F5FA7]/20">
                  Official Directory
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Search Indian Standards, certification workflows, recognized testing labs, and gold hallmarking rules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-[#E2E8F0] bg-white gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('standards')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'standards'
                ? 'border-[#2F5FA7] text-[#2F5FA7]'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find Indian Standard (IS) & QCOs</span>
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'schemes'
                ? 'border-[#2F5FA7] text-[#2F5FA7]'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Step-by-Step Certification Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'labs'
                ? 'border-[#2F5FA7] text-[#2F5FA7]'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Recognized Testing Laboratories</span>
          </button>

          <button
            onClick={() => setActiveTab('hallmarking')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'hallmarking'
                ? 'border-[#2F5FA7] text-[#2F5FA7]'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Gold Hallmarking & HUID Guide</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          {/* TAB 1: STANDARDS & QCOs */}
          {activeTab === 'standards' && (
            <div className="space-y-5">
              {/* Search & Category Filter */}
              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={standardsSearch}
                      onChange={(e) => setStandardsSearch(e.target.value)}
                      placeholder="Search by product name (e.g. packaged water, toys, helmets, lithium battery, cables, led)..."
                      className="w-full text-xs pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:border-[#2F5FA7] focus:ring-1 focus:ring-[#2F5FA7] outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (standardsSearch.trim()) {
                        onAskAi(`What is the official Indian Standard and mandatory certification requirements for ${standardsSearch}?`);
                        onClose();
                      }
                    }}
                    className="px-4 py-2 bg-[#2F5FA7] hover:bg-[#244B85] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Assistant</span>
                  </button>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider shrink-0 mr-1">Category:</span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-xs transition-colors shrink-0 cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#2F5FA7] text-white font-semibold'
                          : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#EAF1FA] border border-[#E2E8F0]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standards Result Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStandards.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col justify-between hover:border-[#2F5FA7]/40 hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EAF1FA] text-[#2F5FA7] border border-[#2F5FA7]/20">
                            {item.isNumber}
                          </span>
                          <h3 className="font-bold text-[#111827] text-sm mt-1.5 group-hover:text-[#2F5FA7] transition-colors">
                            {item.productName}
                          </h3>
                        </div>
                        {item.mandatoryQco ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                            Mandatory QCO
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-600 border border-gray-200 shrink-0">
                            Voluntary
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#6B7280] italic mb-2 line-clamp-1">
                        "{item.title}"
                      </div>

                      <p className="text-xs text-[#374151] leading-relaxed mb-3">
                        {item.descriptionInPlainLanguage}
                      </p>

                      {/* Key Testing Parameters */}
                      <div className="mb-3 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]/80">
                        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
                          Critical Safety & Quality Tests:
                        </div>
                        <ul className="text-[11px] text-[#475569] space-y-1">
                          {item.keyTestingParameters.slice(0, 3).map((param, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#2F5FA7] font-bold">•</span>
                              <span>{param}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-[#6B7280]">
                        Scheme: <strong className="text-[#111827]">{item.scheme}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={item.officialDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-[#6B7280] hover:text-[#2F5FA7] hover:bg-[#EAF1FA] rounded-md transition-colors"
                          title="View on official BIS standards portal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            onAskAi(`Guide me step-by-step through obtaining certification for ${item.productName} under ${item.isNumber} (${item.scheme}). What are the laboratory tests and documents needed?`);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#EAF1FA] hover:bg-[#d8e6f8] text-[#2F5FA7] transition-colors cursor-pointer"
                        >
                          <span>Ask AI Guide</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CERTIFICATION SCHEMES WORKFLOW */}
          {activeTab === 'schemes' && (
            <div className="space-y-6">
              {/* Scheme Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CERTIFICATION_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => setSelectedSchemeId(scheme.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSchemeId === scheme.id
                        ? 'border-[#2F5FA7] bg-[#EAF1FA]/50 shadow-sm'
                        : 'border-[#E2E8F0] bg-white hover:border-[#2F5FA7]/40'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-[#2F5FA7] mb-1">
                      {scheme.schemeCode}
                    </div>
                    <div className="font-bold text-xs text-[#111827] line-clamp-1 mb-1">
                      {scheme.name}
                    </div>
                    <div className="text-[11px] text-[#6B7280] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{scheme.estimatedTimeline}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Active Scheme Details */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">{currentScheme.name}</h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      <strong>Applicable For:</strong> {currentScheme.applicableProducts}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={currentScheme.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2F5FA7] bg-[#EAF1FA] hover:bg-[#d8e6f8] border border-[#2F5FA7]/30 transition-colors"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => {
                        onAskAi(`Please prepare a complete checklist of documents and factory audit requirements for ${currentScheme.name} (${currentScheme.schemeCode}).`);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#2F5FA7] hover:bg-[#244B85] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Audit Prep</span>
                    </button>
                  </div>
                </div>

                {/* Step-by-Step Flow */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    Step-by-Step Application Roadmap
                  </h4>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
                    {currentScheme.steps.map((step) => (
                      <div key={step.stepNumber} className="relative">
                        <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#2F5FA7] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          {step.stepNumber}
                        </div>
                        <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
                          <div className="font-bold text-xs text-[#111827] mb-1">
                            {step.title}
                          </div>
                          <p className="text-xs text-[#475569] leading-relaxed mb-2.5">
                            {step.description}
                          </p>
                          <div className="p-2 bg-white rounded-lg border border-[#E2E8F0] mb-2 text-xs text-[#2F5FA7] font-medium flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span><strong>Action Required:</strong> {step.actionRequired}</span>
                          </div>
                          <div className="text-[11px] text-[#6B7280]">
                            <strong>Documents Required:</strong> {step.documentsNeeded.join(' · ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fee and Pitfalls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                    <div className="font-bold text-[#2F5FA7] mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Official Fee Structure</span>
                    </div>
                    <p className="text-[#334155] leading-relaxed">
                      {currentScheme.keyFees}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 text-xs">
                    <div className="font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>Common Pitfalls to Avoid</span>
                    </div>
                    <ul className="text-amber-950 space-y-1">
                      {currentScheme.commonPitfalls.map((p, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TESTING LABORATORIES */}
          {activeTab === 'labs' && (
            <div className="space-y-5">
              {/* Lab search and region filters */}
              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="w-full sm:w-80 relative">
                  <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={labSearch}
                    onChange={(e) => setLabSearch(e.target.value)}
                    placeholder="Search by city, discipline or product..."
                    className="w-full text-xs pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:border-[#2F5FA7] outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mr-1">Region:</span>
                  {regions.map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                        selectedRegion === reg
                          ? 'bg-[#2F5FA7] text-white font-semibold'
                          : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#EAF1FA] border border-[#E2E8F0]'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Labs List */}
              <div className="grid grid-cols-1 gap-4">
                {filteredLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:border-[#2F5FA7]/40 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#111827]">{lab.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF1FA] text-[#2F5FA7]">
                            {lab.region} Region
                          </span>
                        </div>
                        <div className="text-xs text-[#6B7280] flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2F5FA7]" />
                          <span>{lab.address}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onAskAi(`What is the process, sample quantity, and testing fee schedule for submitting samples to ${lab.name}?`);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EAF1FA] hover:bg-[#d8e6f8] text-[#2F5FA7] rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Inquire with AI</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-[#475569] pt-2 border-t border-[#E2E8F0]/60">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#6B7280]" />
                        <span className="font-mono text-xs">{lab.contactEmail}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#6B7280]" />
                        <span>{lab.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-[#111827]">Disciplines:</span>
                        <span>{lab.disciplines.join(', ')}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
                        Accredited Testing Scopes:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {lab.keyProductScopes.map((scope, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white text-[11px] text-[#334155] border border-[#E2E8F0]">
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GOLD HALLMARKING & HUID */}
          {activeTab === 'hallmarking' && (
            <div className="space-y-6">
              {/* 3 Mandatory Signs Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white p-6 rounded-2xl border border-amber-200 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-1">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>The 3 Mandatory Marks on Genuine BIS Hallmarked Gold</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed mb-4">
                  Under Indian Standard <strong>IS 1417:2016</strong> and government regulations, selling gold jewellery without these 3 distinct marks is strictly prohibited in notified districts across India.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {MANDATORY_HALLMARK_MARKS.map((mark) => (
                    <div key={mark.id} className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs">
                      <div className="font-bold text-xs text-[#111827] mb-1">
                        {mark.title}
                      </div>
                      <p className="text-[11px] text-[#475569] leading-relaxed mb-2">
                        {mark.description}
                      </p>
                      <div className="text-[10px] font-semibold text-amber-700 bg-amber-50 p-1.5 rounded">
                        {mark.significance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive HUID Verifier Assistant */}
              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#2F5FA7]" />
                    <h4 className="font-bold text-xs text-[#111827]">
                      Test Your 6-Digit HUID Code
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#6B7280]">
                    Verified against BIS Care App format
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={huidInput}
                    onChange={(e) => setHuidInput(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit code (e.g. AB1234)..."
                    className="font-mono text-sm tracking-widest uppercase px-3 py-2 border border-[#E2E8F0] rounded-lg w-52 text-center focus:border-[#2F5FA7] outline-none"
                  />
                  <button
                    onClick={validateHuid}
                    className="px-4 py-2 bg-[#2F5FA7] hover:bg-[#244B85] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Check Format
                  </button>
                </div>

                {huidValidationResult && (
                  <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                    huidValidationResult.isValid
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {huidValidationResult.isValid ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    )}
                    <span>{huidValidationResult.message}</span>
                  </div>
                )}
              </div>

              {/* Gold Karat & Fineness Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs">
                <div className="px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold text-xs text-[#111827]">
                  Official BIS Approved Karat & Fineness Standards
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F8FAFC] text-[#6B7280] font-semibold border-b border-[#E2E8F0]">
                      <tr>
                        <th className="py-2.5 px-4">Karat</th>
                        <th className="py-2.5 px-4">Hallmark Mark</th>
                        <th className="py-2.5 px-4">Gold Fineness</th>
                        <th className="py-2.5 px-4">Common Uses</th>
                        <th className="py-2.5 px-4">Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {GOLD_PURITY_GRADES.map((grade) => (
                        <tr key={grade.karat} className="hover:bg-[#F8FAFC]/80">
                          <td className="py-3 px-4 font-bold text-[#111827]">{grade.karat}</td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs">
                              {grade.markingSymbol}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#2F5FA7]">{grade.goldPercentage}</td>
                          <td className="py-3 px-4 text-[#475569]">{grade.typicalUses}</td>
                          <td className="py-3 px-4 text-[#6B7280]">{grade.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Consumer Rights Card */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Consumer Protection & Compensation Rights</span>
                </div>
                <p className="text-emerald-950 leading-relaxed">
                  • <strong>Testing Fee for Consumers:</strong> Any customer can get their gold jewellery purity verified at any BIS-recognized Assaying and Hallmarking Centre (AHC) for just <strong>₹45 + GST per piece</strong>.<br />
                  • <strong>Substandard Penalty:</strong> If the tested purity is found lower than marked, the jeweller is legally liable to compensate the buyer for the difference in value, pay the testing fees, and provide a penalty of <strong>2x the deficit value</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
