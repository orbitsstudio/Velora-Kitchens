import React, { useState, useEffect } from 'react';
import { Booking, Enquiry, Material, Project } from '../types';
import { api } from '../services/api';
import { getOptimizedImageUrl, handleImageFallback, LUXURY_IMAGE_FALLBACKS } from '../utils/imageUtils';
import {
  Shield,
  LogOut,
  Calendar,
  MessageSquare,
  Layers,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Lock,
  ChevronRight
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onMaterialsUpdated?: () => void;
  onProjectsUpdated?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onMaterialsUpdated,
  onProjectsUpdated
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(api.isAdminLoggedIn());
  const [passkeyInput, setPasskeyInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'bookings' | 'enquiries' | 'materials' | 'projects'>('bookings');

  // Data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter
  const [bookingFilter, setBookingFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Material Modal
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [newMatName, setNewMatName] = useState('');
  const [newMatCat, setNewMatCat] = useState<Material['category']>('Natural Marble');
  const [newMatOrigin, setNewMatOrigin] = useState('');
  const [newMatFinish, setNewMatFinish] = useState('');
  const [newMatDesc, setNewMatDesc] = useState('');

  // Add Project Modal
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjLoc, setNewProjLoc] = useState('');
  const [newProjStyle, setNewProjStyle] = useState('Contemporary Luxury');
  const [newProjMaterials, setNewProjMaterials] = useState('');
  const [newProjOverview, setNewProjOverview] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [b, e, m, p] = await Promise.all([
        api.getBookings(),
        api.getEnquiries(),
        api.getMaterials(),
        api.getProjects()
      ]);
      setBookings(b);
      setEnquiries(e);
      setMaterials(m);
      setProjects(p);
    } catch {
      // fallback handled inside api
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const ok = await api.loginAdmin(passkeyInput);
      if (ok) {
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid studio passkey. (Hint: velora2026)');
      }
    } catch {
      setLoginError('Authentication service unavailable');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    api.logoutAdmin();
    setIsAuthenticated(false);
  };

  const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
    await api.updateBooking(id, { status: newStatus });
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: newStatus } : b)));
  };

  const handleEnquiryStatusChange = async (id: string, newStatus: Enquiry['status']) => {
    await api.updateEnquiryStatus(id, newStatus);
    setEnquiries(prev => prev.map(e => (e.id === id ? { ...e, status: newStatus } : e)));
  };

  const handleAddMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim()) return;

    const added = await api.addMaterial({
      name: newMatName,
      category: newMatCat,
      origin: newMatOrigin || 'Tuscany, Italy',
      finish: newMatFinish || 'Satin Honed',
      description: newMatDesc || 'Bespoke architectural specimen.',
      durabilityRating: 'High Architectural Grade',
      recommendedUse: 'Islands & Feature Joinery',
      image: '/images/material_marble_detail.jpg',
      featured: true
    });

    setMaterials(prev => [...prev, added]);
    setShowAddMaterial(false);
    setNewMatName('');
    setNewMatOrigin('');
    setNewMatFinish('');
    setNewMatDesc('');
    if (onMaterialsUpdated) onMaterialsUpdated();
  };

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjLoc.trim()) return;

    const added = await api.addProject({
      name: newProjName,
      location: newProjLoc,
      style: newProjStyle,
      materialsUsed: newProjMaterials || 'Calacatta Marble & Fluted Walnut',
      overview: newProjOverview || 'Custom architectural kitchen installation.',
      year: new Date().getFullYear().toString(),
      image: '/images/project_penthouse_kitchen.jpg',
      featured: true
    });

    setProjects(prev => [...prev, added]);
    setShowAddProject(false);
    setNewProjName('');
    setNewProjLoc('');
    setNewProjMaterials('');
    setNewProjOverview('');
    if (onProjectsUpdated) onProjectsUpdated();
  };

  const exportBookingsCSV = () => {
    const headers = ['Reference,Full Name,Email,Phone,City,Property Type,Kitchen Size,Date,Time,Consultation Type,Status'];
    const rows = bookings.map(b =>
      `"${b.id}","${b.fullName}","${b.email}","${b.phone}","${b.city}","${b.propertyType}","${b.kitchenSize}","${b.preferredDate}","${b.preferredTime}","${b.consultationType}","${b.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `velora_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const matchesFilter = bookingFilter === 'All' || b.status === bookingFilter;
    const matchesSearch =
      searchQuery === '' ||
      b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const pendingCount = bookings.filter(b => b.status === 'Pending Review').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const unreadEnquiries = enquiries.filter(e => e.status === 'Unread').length;

  return (
    <div className="fixed inset-0 z-50 bg-[#171717] text-[#F5F1E9] flex flex-col overflow-hidden">
      {/* Admin Top Bar */}
      <div className="bg-[#1D1815] border-b border-[#C6A875]/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#C6A875] flex items-center justify-center text-[#C6A875] font-serif font-bold text-xs">
            VK
          </div>
          <div>
            <div className="font-serif text-lg text-white">Velora Studio Administration</div>
            <div className="text-[10px] text-[#C6A875] tracking-[0.2em] uppercase">
              Master Atelier Management Portal
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-xs text-[#D8CCBA]/70 hover:text-white flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs uppercase tracking-wider bg-[#29231F] hover:bg-[#C6A875] text-[#F5F1E9] hover:text-[#171717] transition-colors border border-[#C6A875]/40 cursor-pointer"
          >
            Return to Website
          </button>
        </div>
      </div>

      {/* Main Body */}
      {!isAuthenticated ? (
        /* Login Screen */
        <div className="flex-1 flex items-center justify-center p-6 bg-[#171717]">
          <div className="max-w-md w-full bg-[#1D1815] border border-[#C6A875]/40 p-8 sm:p-10 shadow-2xl">
            <div className="text-center space-y-2 mb-8">
              <div className="w-12 h-12 rounded-none border border-[#C6A875] mx-auto flex items-center justify-center text-[#C6A875]">
                <Lock size={20} />
              </div>
              <h3 className="font-serif text-2xl text-white">Atelier Director Access</h3>
              <p className="text-xs text-[#D8CCBA]/70">
                Authorized access for Mayfair, Milan, and New York directors.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D8CCBA] mb-2 font-medium">
                  Studio Passkey
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter studio passkey..."
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  className="w-full px-4 py-3 bg-[#171717] border border-[#29231F] focus:border-[#C6A875] text-sm text-white outline-none"
                />
                <div className="text-[10px] text-[#D8CCBA]/50 mt-1.5">
                  Default Demo Passkey: <span className="text-[#C6A875] font-mono">velora2026</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-[#C6A875] hover:bg-[#DFCA9E] text-[#171717] text-xs uppercase tracking-[0.16em] font-semibold transition-colors cursor-pointer mt-2"
              >
                {isLoggingIn ? 'Authenticating...' : 'Enter Studio Dashboard'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Authenticated Dashboard */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stats Bar */}
          <div className="bg-[#1D1815]/70 border-b border-[#29231F] px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border-r border-[#29231F] pr-4">
                <div className="text-[10px] uppercase tracking-wider text-[#D8CCBA]/50">Total Bookings</div>
                <div className="font-serif text-2xl text-white mt-0.5 tabular-nums">{bookings.length}</div>
              </div>

              <div className="border-r border-[#29231F] pr-4">
                <div className="text-[10px] uppercase tracking-wider text-[#D8CCBA]/50">Pending Review</div>
                <div className="font-serif text-2xl text-[#C6A875] mt-0.5 tabular-nums">{pendingCount}</div>
              </div>

              <div className="border-r border-[#29231F] pr-4">
                <div className="text-[10px] uppercase tracking-wider text-[#D8CCBA]/50">Confirmed Appointments</div>
                <div className="font-serif text-2xl text-emerald-400 mt-0.5 tabular-nums">{confirmedCount}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#D8CCBA]/50">Unread Enquiries</div>
                <div className="font-serif text-2xl text-[#D8CCBA] mt-0.5 tabular-nums">{unreadEnquiries}</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-[#29231F] bg-[#171717] px-6 lg:px-8 flex items-center justify-between">
            <div className="flex gap-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-3.5 text-xs uppercase tracking-[0.14em] font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'border-[#C6A875] text-[#C6A875]'
                    : 'border-transparent text-[#D8CCBA]/60 hover:text-white'
                }`}
              >
                <Calendar size={14} />
                <span>Consultation Bookings ({bookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('enquiries')}
                className={`py-3.5 text-xs uppercase tracking-[0.14em] font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'enquiries'
                    ? 'border-[#C6A875] text-[#C6A875]'
                    : 'border-transparent text-[#D8CCBA]/60 hover:text-white'
                }`}
              >
                <MessageSquare size={14} />
                <span>Client Enquiries ({enquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`py-3.5 text-xs uppercase tracking-[0.14em] font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'materials'
                    ? 'border-[#C6A875] text-[#C6A875]'
                    : 'border-transparent text-[#D8CCBA]/60 hover:text-white'
                }`}
              >
                <Layers size={14} />
                <span>Material Catalog ({materials.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`py-3.5 text-xs uppercase tracking-[0.14em] font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'border-[#C6A875] text-[#C6A875]'
                    : 'border-transparent text-[#D8CCBA]/60 hover:text-white'
                }`}
              >
                <Briefcase size={14} />
                <span>Portfolio Projects ({projects.length})</span>
              </button>
            </div>

            <button
              onClick={loadAllData}
              disabled={loading}
              className="text-xs text-[#D8CCBA]/60 hover:text-[#C6A875] flex items-center gap-1.5 py-2 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#141211]">
            {/* 1. BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* Search & Actions Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#1D1815] p-4 border border-[#29231F]">
                  <div className="flex flex-1 items-center gap-3">
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type="text"
                        placeholder="Search client, reference, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-[#171717] border border-[#29231F] text-white focus:border-[#C6A875] outline-none pl-8"
                      />
                      <Search size={13} className="absolute left-2.5 top-2.5 text-[#D8CCBA]/50" />
                    </div>

                    {/* Filter Dropdown */}
                    <select
                      value={bookingFilter}
                      onChange={(e) => setBookingFilter(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-[#171717] border border-[#29231F] text-white focus:border-[#C6A875] outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Rescheduled">Rescheduled</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>

                  <button
                    onClick={exportBookingsCSV}
                    className="px-4 py-1.5 bg-[#29231F] hover:bg-[#C6A875] text-[#F5F1E9] hover:text-[#171717] text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download size={13} />
                    Export CSV
                  </button>
                </div>

                {/* Bookings Table / List */}
                <div className="space-y-4">
                  {filteredBookings.length === 0 ? (
                    <div className="p-12 text-center text-sm text-[#D8CCBA]/50 bg-[#1D1815] border border-[#29231F]">
                      No consultation bookings found matching criteria.
                    </div>
                  ) : (
                    filteredBookings.map((b) => (
                      <div
                        key={b.id}
                        className="bg-[#1D1815] border border-[#29231F] p-6 hover:border-[#C6A875]/40 transition-colors space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29231F] pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-[#C6A875] px-2 py-0.5 bg-[#171717] border border-[#C6A875]/30">
                              {b.id}
                            </span>
                            <h4 className="font-serif text-xl text-white">{b.fullName}</h4>
                            <span className="text-xs text-[#D8CCBA]/60 font-light">
                              ({b.city})
                            </span>
                          </div>

                          {/* Status Management */}
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#D8CCBA]/60 uppercase tracking-wider text-[10px]">
                              Status:
                            </span>
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value as Booking['status'])}
                              className={`text-xs px-2.5 py-1 border font-medium outline-none cursor-pointer ${
                                b.status === 'Confirmed'
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                                  : b.status === 'Pending Review'
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                                  : b.status === 'Completed'
                                  ? 'bg-blue-950/60 text-blue-300 border-blue-500/50'
                                  : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                              }`}
                            >
                              <option value="Pending Review">Pending Review</option>
                              <option value="Confirmed">Approve & Confirm</option>
                              <option value="Rescheduled">Rescheduled</option>
                              <option value="Completed">Completed</option>
                              <option value="Declined">Decline</option>
                            </select>
                          </div>
                        </div>

                        {/* Booking Meta */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-[#D8CCBA]/50 block uppercase text-[10px] tracking-wider">Contact</span>
                            <span className="text-white font-medium">{b.email}</span>
                            <span className="text-[#D8CCBA]/70 block">{b.phone}</span>
                          </div>

                          <div>
                            <span className="text-[#D8CCBA]/50 block uppercase text-[10px] tracking-wider">Appointment</span>
                            <span className="text-white font-medium">{b.preferredDate}</span>
                            <span className="text-[#D8CCBA]/70 block">{b.preferredTime}</span>
                          </div>

                          <div>
                            <span className="text-[#D8CCBA]/50 block uppercase text-[10px] tracking-wider">Property & Type</span>
                            <span className="text-white font-medium">{b.propertyType}</span>
                            <span className="text-[#D8CCBA]/70 block">{b.kitchenSize}</span>
                          </div>

                          <div>
                            <span className="text-[#D8CCBA]/50 block uppercase text-[10px] tracking-wider">Service</span>
                            <span className="text-[#C6A875] font-medium">{b.consultationType}</span>
                            <span className="text-[#D8CCBA]/50 block text-[10px]">
                              Logged {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Custom 3D Studio Config attached */}
                        {b.customStudioConfig && (
                          <div className="p-3 bg-[#171717] border border-[#C6A875]/20 text-xs text-[#D8CCBA] flex flex-wrap items-center gap-3">
                            <span className="text-[10px] uppercase tracking-wider text-[#C6A875] font-semibold">
                              Attached 3D Studio Spec:
                            </span>
                            <span>Layout: <strong className="text-white">{b.customStudioConfig.layout}</strong></span>
                            <span>·</span>
                            <span>Cabinet: <strong className="text-white">{b.customStudioConfig.finish}</strong></span>
                            <span>·</span>
                            <span>Stone: <strong className="text-white">{b.customStudioConfig.countertop}</strong></span>
                            <span>·</span>
                            <span>Hardware: <strong className="text-white">{b.customStudioConfig.hardware}</strong></span>
                          </div>
                        )}

                        {/* Requirements & Notes */}
                        {b.additionalRequirements && (
                          <div className="text-xs text-[#D8CCBA]/80 bg-[#171717]/50 p-3 border border-[#29231F]">
                            <span className="text-[#D8CCBA]/50 uppercase text-[10px] tracking-wider block mb-1">
                              Client Notes:
                            </span>
                            <p className="whitespace-pre-line">{b.additionalRequirements}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 2. ENQUIRIES TAB */}
            {activeTab === 'enquiries' && (
              <div className="space-y-4">
                {enquiries.length === 0 ? (
                  <div className="p-12 text-center text-sm text-[#D8CCBA]/50 bg-[#1D1815] border border-[#29231F]">
                    No client enquiries received yet.
                  </div>
                ) : (
                  enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-[#1D1815] border border-[#29231F] p-6 hover:border-[#C6A875]/30 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29231F] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-[#C6A875] px-2 py-0.5 bg-[#171717]">
                            {enq.id}
                          </span>
                          <span className="font-medium text-white text-sm">{enq.name}</span>
                          <span className="text-xs text-[#D8CCBA]/50">({enq.email})</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            value={enq.status}
                            onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value as Enquiry['status'])}
                            className="text-xs px-2.5 py-1 bg-[#171717] border border-[#29231F] text-white"
                          >
                            <option value="Unread">Unread</option>
                            <option value="Responded">Responded</option>
                            <option value="Archived">Archived</option>
                          </select>

                          <a
                            href={`mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject)}`}
                            className="text-xs text-[#C6A875] hover:underline flex items-center gap-1 uppercase tracking-wider"
                          >
                            Reply <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>

                      <div className="text-xs text-[#C6A875] font-medium uppercase tracking-wider">
                        Subject: {enq.subject}
                      </div>

                      <p className="text-xs text-[#D8CCBA]/80 leading-relaxed font-light">
                        {enq.message}
                      </p>

                      <div className="text-[10px] text-[#D8CCBA]/40 pt-2 flex justify-between">
                        <span>Phone: {enq.phone || 'None provided'}</span>
                        <span>Received {new Date(enq.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. MATERIALS TAB */}
            {activeTab === 'materials' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#1D1815] p-4 border border-[#29231F]">
                  <span className="text-xs text-[#D8CCBA] uppercase tracking-wider">
                    Total Curated Materials: {materials.length}
                  </span>
                  <button
                    onClick={() => setShowAddMaterial(true)}
                    className="px-4 py-2 bg-[#C6A875] text-[#171717] text-xs uppercase tracking-wider font-semibold hover:bg-[#DFCA9E] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    Add New Material Swatch
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materials.map((m) => (
                    <div key={m.id} className="bg-[#1D1815] border border-[#29231F] p-4 flex gap-4">
                      <img
                        src={getOptimizedImageUrl(m.image, LUXURY_IMAGE_FALLBACKS.marble)}
                        alt={m.name}
                        className="w-20 h-20 object-cover bg-black shrink-0 border border-[#29231F]"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => handleImageFallback(e, LUXURY_IMAGE_FALLBACKS.marble)}
                      />
                      <div className="flex-1 overflow-hidden">
                        <div className="text-[10px] text-[#C6A875] uppercase tracking-wider">
                          {m.category}
                        </div>
                        <h4 className="font-serif text-lg text-white truncate">{m.name}</h4>
                        <div className="text-[11px] text-[#D8CCBA]/60">{m.origin}</div>
                        <div className="text-[11px] text-[#D8CCBA]/80 mt-1 truncate">{m.finish}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#1D1815] p-4 border border-[#29231F]">
                  <span className="text-xs text-[#D8CCBA] uppercase tracking-wider">
                    Completed Architectural Projects: {projects.length}
                  </span>
                  <button
                    onClick={() => setShowAddProject(true)}
                    className="px-4 py-2 bg-[#C6A875] text-[#171717] text-xs uppercase tracking-wider font-semibold hover:bg-[#DFCA9E] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    Commission New Portfolio Project
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((p) => (
                    <div key={p.id} className="bg-[#1D1815] border border-[#29231F] p-5 flex gap-5">
                      <img
                        src={getOptimizedImageUrl(p.image, LUXURY_IMAGE_FALLBACKS.penthouse)}
                        alt={p.name}
                        className="w-28 h-28 object-cover bg-black shrink-0 border border-[#29231F]"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => handleImageFallback(e, LUXURY_IMAGE_FALLBACKS.penthouse)}
                      />
                      <div className="space-y-1 overflow-hidden">
                        <div className="text-[10px] text-[#C6A875] uppercase tracking-wider">
                          {p.location} · {p.year}
                        </div>
                        <h4 className="font-serif text-xl text-white truncate">{p.name}</h4>
                        <div className="text-xs text-[#D8CCBA]/70">{p.style}</div>
                        <p className="text-[11px] text-[#D8CCBA]/60 line-clamp-2 mt-1">{p.overview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Material */}
      {showAddMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1D1815] border border-[#C6A875] p-8 max-w-lg w-full space-y-4">
            <h3 className="font-serif text-2xl text-white">Add New Material Swatch</h3>
            <form onSubmit={handleAddMaterialSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#D8CCBA] mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nero Marquina Honed"
                  value={newMatName}
                  onChange={(e) => setNewMatName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#29231F] text-white"
                />
              </div>

              <div>
                <label className="block text-[#D8CCBA] mb-1">Category</label>
                <select
                  value={newMatCat}
                  onChange={(e) => setNewMatCat(e.target.value as Material['category'])}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#29231F] text-white"
                >
                  <option value="Natural Marble">Natural Marble</option>
                  <option value="Quartz Surfaces">Quartz Surfaces</option>
                  <option value="Natural Wood Veneers">Natural Wood Veneers</option>
                  <option value="Italian Laminates">Italian Laminates</option>
                  <option value="Matte Lacquer Finishes">Matte Lacquer Finishes</option>
                  <option value="Luxury Hardware">Luxury Hardware</option>
                  <option value="Designer Cabinet Finishes">Designer Cabinet Finishes</option>
                </select>
              </div>

              <div>
                <label className="block text-[#D8CCBA] mb-1">Origin Quarry / Mill</label>
                <input
                  type="text"
                  placeholder="e.g. Basque Country, Spain"
                  value={newMatOrigin}
                  onChange={(e) => setNewMatOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#29231F] text-white"
                />
              </div>

              <div>
                <label className="block text-[#D8CCBA] mb-1">Surface Finish</label>
                <input
                  type="text"
                  placeholder="e.g. Velvet Leathered Touch"
                  value={newMatFinish}
                  onChange={(e) => setNewMatFinish(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#29231F] text-white"
                />
              </div>

              <div>
                <label className="block text-[#D8CCBA] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe tactile quality, veining, and application..."
                  value={newMatDesc}
                  onChange={(e) => setNewMatDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#29231F] text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMaterial(false)}
                  className="px-4 py-2 border border-[#29231F] text-[#D8CCBA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C6A875] text-[#171717] font-semibold"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Project */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1D1815] border border-[#C6A875] p-8 max-w-lg w-full space-y-4">
            <h3 className="font-serif text-2xl text-white">Add Portfolio Project</h3>
            <form onSubmit={handleAddProjectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#D8CCBA] mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Horizon Residence"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#29231F] text-white"
                />
              </div>

              <div>
                <label className="block text-[#D8CCBA] mb-1">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zurich, Switzerland"
                  value={newProjLoc}
                  onChange={(e) => setNewProjLoc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#29231F] text-white"
                />
              </div>

              <div>
                <label className="block text-[#D8CCBA] mb-1">Kitchen Style</label>
                <input
                  type="text"
                  placeholder="e.g. Contemporary Island Architecture"
                  value={newProjStyle}
                  onChange={(e) => setNewProjStyle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#29231F] text-white"
                />
              </div>

              <div>
                <label className="block text-[#D8CCBA] mb-1">Materials Used</label>
                <input
                  type="text"
                  placeholder="e.g. Calacatta Viola, Smoked Oak, Gunmetal"
                  value={newProjMaterials}
                  onChange={(e) => setNewProjMaterials(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#29231F] text-white"
                />
              </div>

              <div>
                <label className="block text-[#D8CCBA] mb-1">Overview</label>
                <textarea
                  rows={2}
                  placeholder="Describe residence scope, dimensions, and architectural intent..."
                  value={newProjOverview}
                  onChange={(e) => setNewProjOverview(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#29231F] text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 border border-[#29231F] text-[#D8CCBA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C6A875] text-[#171717] font-semibold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
