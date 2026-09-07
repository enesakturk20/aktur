"use client";

import { useState, useEffect } from "react";
import Sidebar, { MenuItem } from "./ui/Sidebar";
import TopHeader from "./ui/TopHeader";
import StatCard from "./ui/StatCard";
import { adminService, getImageUrl } from "@/services";

const formatTransferDateTime = (dateStr: string | null | undefined, locale = "tr-TR"): string => {
  if (!dateStr) return "-";
  const cleanStr = typeof dateStr === "string" ? dateStr.replace(/Z$/, "") : dateStr;
  const d = new Date(cleanStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return `${d.toLocaleDateString(locale)} ${d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}`;
};

interface SuperAdminDashboardProps {
  dictionary: any;
  lang: string;
  user: any;
}

export default function SuperAdminDashboard({ dictionary, lang, user }: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Companies state
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [searchCompany, setSearchCompany] = useState("");

  // Vehicles state
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [searchVehicle, setSearchVehicle] = useState("");

  // Students state
  const [students, setStudents] = useState<any[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");

  // VIP Vehicles state
  const [vipVehicles, setVipVehicles] = useState<any[]>([]);
  const [isLoadingVipVehicles, setIsLoadingVipVehicles] = useState(false);
  const [searchVipVehicle, setSearchVipVehicle] = useState("");
  const [showAddVipModal, setShowAddVipModal] = useState(false);
  const [showEditVipModal, setShowEditVipModal] = useState(false);
  const [showDeleteVipModal, setShowDeleteVipModal] = useState(false);
  const [selectedVipVehicle, setSelectedVipVehicle] = useState<any>(null);

  // VIP Vehicle form states
  const [vipName, setVipName] = useState("");
  const [vipLuggage, setVipLuggage] = useState(0);
  const [vipPassenger, setVipPassenger] = useState(0);
  const [vipImage, setVipImage] = useState("");
  const [vipIsVisible, setVipIsVisible] = useState(true);
  const [vipPriceRanges, setVipPriceRanges] = useState<any[]>([]);
  const [newFromKm, setNewFromKm] = useState<number | "">("");
  const [newToKm, setNewToKm] = useState<number | "">("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Bank Accounts state
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [isLoadingBankAccounts, setIsLoadingBankAccounts] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [showDeleteBankModal, setShowDeleteBankModal] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [iban, setIban] = useState("");
  const [currency, setCurrency] = useState("TRY");
  const [bankIsActive, setBankIsActive] = useState(true);
  
  // VIP Reservations states
  const [vipReservations, setVipReservations] = useState<any[]>([]);
  const [isLoadingVipReservations, setIsLoadingVipReservations] = useState(false);
  const [showReservationDetailsModal, setShowReservationDetailsModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [searchVipReservation, setSearchVipReservation] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const menuItems: MenuItem[] = [
    {
      id: "overview",
      label: dictionary.menuSystemOverview,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: "companies",
      label: dictionary.menuCompanies,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: "vehicles",
      label: dictionary.menuGlobalVehicles,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-3V5a1 1 0 00-1-1H9" />
        </svg>
      )
    },
    {
      id: "students",
      label: dictionary.menuGlobalStudents,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: "vip-vehicles",
      label: dictionary.menuVipVehicles || "VIP Araç Yönetimi",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.324-5.184a3.375 3.375 0 00-3.37-3.166h-4.88m-6 0h11.25m-11.25 0V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V9.75M3.375 14.25h17.25m-17.25 0a3.375 3.375 0 003 3.375h11.25a3.375 3.375 0 003-3.375" />
        </svg>
      )
    },
    {
      id: "bank-accounts",
      label: dictionary.menuBankAccounts || "Banka Hesapları",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      )
    },
    {
      id: "vip-reservations",
      label: "VIP Rezervasyonlar",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    }
  ];

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const data = await adminService.getSystemStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      const data = await adminService.getCompanies();
      setCompanies(data);
    } catch (e) {
      console.error(e);
      showToast(dictionary.errorFetch || "Firmalar yüklenemedi.", "error");
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const fetchVehicles = async () => {
    setIsLoadingVehicles(true);
    try {
      const data = await adminService.getAllVehicles();
      setVehicles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const data = await adminService.getAllStudents();
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchVipVehicles = async () => {
    setIsLoadingVipVehicles(true);
    try {
      const data = await adminService.getVipVehicles();
      setVipVehicles(data);
    } catch (e) {
      console.error(e);
      showToast(dictionary.errorFetch || "Veriler yüklenirken hata oluştu.", "error");
    } finally {
      setIsLoadingVipVehicles(false);
    }
  };

  const handleOpenAddVipModal = () => {
    setVipName("");
    setVipLuggage(0);
    setVipPassenger(0);
    setVipImage("");
    setVipIsVisible(true);
    setVipPriceRanges([]);
    setNewFromKm("");
    setNewToKm("");
    setNewPrice("");
    setShowAddVipModal(true);
  };

  const handleOpenEditVipModal = (vehicle: any) => {
    setSelectedVipVehicle(vehicle);
    setVipName(vehicle.name);
    setVipLuggage(vehicle.luggageCapacity);
    setVipPassenger(vehicle.passengerCapacity);
    setVipImage(vehicle.imageUrl || "");
    setVipIsVisible(vehicle.isVisible);
    setVipPriceRanges(vehicle.priceRanges || []);
    setNewFromKm("");
    setNewToKm("");
    setNewPrice("");
    setShowEditVipModal(true);
  };

  const handleOpenDeleteVipModal = (vehicle: any) => {
    setSelectedVipVehicle(vehicle);
    setShowDeleteVipModal(true);
  };

  const handleAddPriceRange = () => {
    if (newFromKm === "" || newToKm === "" || newPrice === "") {
      showToast("Lütfen tüm fiyat aralığı alanlarını doldurun.", "error");
      return;
    }
    const fromVal = Number(newFromKm);
    const toVal = Number(newToKm);
    const priceVal = Number(newPrice);

    if (fromVal < 0 || toVal <= fromVal || priceVal <= 0) {
      showToast("Geçersiz KM veya fiyat değeri. Başlangıç KM bitişten küçük olmalıdır.", "error");
      return;
    }

    const isDuplicate = vipPriceRanges.some(
      (r) => r.fromKm === fromVal && r.toKm === toVal
    );
    if (isDuplicate) {
      showToast("Bu KM aralığı zaten eklenmiş.", "error");
      return;
    }

    const newRange = { fromKm: fromVal, toKm: toVal, price: priceVal };
    setVipPriceRanges([...vipPriceRanges, newRange].sort((a, b) => a.fromKm - b.fromKm));
    setNewFromKm("");
    setNewToKm("");
    setNewPrice("");
  };

  const handleRemovePriceRange = (index: number) => {
    setVipPriceRanges(vipPriceRanges.filter((_, i) => i !== index));
  };

  const handleAddVipVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipName || vipPassenger <= 0) {
      showToast("Lütfen gerekli alanları doldurun.", "error");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      name: vipName,
      luggageCapacity: Number(vipLuggage),
      passengerCapacity: Number(vipPassenger),
      imageUrl: vipImage || null,
      isVisible: vipIsVisible,
      priceRanges: vipPriceRanges
    };

    try {
      await adminService.createVipVehicle(payload);
      showToast(dictionary.successAddVipVehicle || "VIP araç başarıyla eklendi.");
      setShowAddVipModal(false);
      fetchVipVehicles();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || dictionary.errorGeneric || "Sistem hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVipVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipName || vipPassenger <= 0) {
      showToast("Lütfen gerekli alanları doldurun.", "error");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      name: vipName,
      luggageCapacity: Number(vipLuggage),
      passengerCapacity: Number(vipPassenger),
      imageUrl: vipImage || null,
      isVisible: vipIsVisible,
      priceRanges: vipPriceRanges
    };

    try {
      await adminService.updateVipVehicle(selectedVipVehicle.id, payload);
      showToast(dictionary.successUpdateVipVehicle || "VIP araç başarıyla güncellendi.");
      setShowEditVipModal(false);
      fetchVipVehicles();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || dictionary.errorGeneric || "Sistem hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVipVehicle = async () => {
    setIsSubmitting(true);
    try {
      await adminService.deleteVipVehicle(selectedVipVehicle.id);
      showToast(dictionary.successDeleteVipVehicle || "VIP araç silindi.");
      setShowDeleteVipModal(false);
      fetchVipVehicles();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || dictionary.errorGeneric || "Sistem hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchVipReservations = async () => {
    setIsLoadingVipReservations(true);
    try {
      const data = await adminService.getVipReservations();
      const sortedData = Array.isArray(data)
        ? [...data].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [];
      setVipReservations(sortedData);
    } catch (e: any) {
      console.error(e);
      if (e?.status === 401) {
        localStorage.removeItem("aktur_token");
        localStorage.removeItem("aktur_user");
        window.location.href = `/${lang}/portal`;
        return;
      }
      showToast("VIP rezervasyonları yüklenirken hata oluştu.", "error");
    } finally {
      setIsLoadingVipReservations(false);
    }
  };

  const handleViewReservationDetails = (res: any) => {
    setSelectedReservation(res);
    setShowReservationDetailsModal(true);
  };

  const fetchBankAccounts = async () => {
    setIsLoadingBankAccounts(true);
    try {
      const data = await adminService.getBankAccounts();
      setBankAccounts(data);
    } catch (e) {
      console.error(e);
      showToast("Banka hesapları yüklenirken hata oluştu.", "error");
    } finally {
      setIsLoadingBankAccounts(false);
    }
  };

  const handleOpenAddBankModal = () => {
    setBankName("");
    setAccountHolder("");
    setIban("");
    setCurrency("TRY");
    setBankIsActive(true);
    setShowAddBankModal(true);
  };

  const handleOpenEditBankModal = (account: any) => {
    setSelectedBankAccount(account);
    setBankName(account.bankName);
    setAccountHolder(account.accountHolder);
    setIban(account.iban);
    setCurrency(account.currency || "TRY");
    setBankIsActive(account.isActive);
    setShowEditBankModal(true);
  };

  const handleOpenDeleteBankModal = (account: any) => {
    setSelectedBankAccount(account);
    setShowDeleteBankModal(true);
  };

  const handleAddBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountHolder || !iban) {
      showToast("Lütfen gerekli alanları doldurun.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await adminService.createBankAccount({
        bankName,
        accountHolder,
        iban,
        currency,
        isActive: bankIsActive
      });
      showToast("Banka hesabı başarıyla eklendi.");
      setShowAddBankModal(false);
      fetchBankAccounts();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || "Hata oluştu.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountHolder || !iban) {
      showToast("Lütfen gerekli alanları doldurun.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await adminService.updateBankAccount(selectedBankAccount.id, {
        bankName,
        accountHolder,
        iban,
        currency,
        isActive: bankIsActive
      });
      showToast("Banka hesabı başarıyla güncellendi.");
      setShowEditBankModal(false);
      fetchBankAccounts();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || "Hata oluştu.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBankAccount = async () => {
    setIsSubmitting(true);
    try {
      await adminService.deleteBankAccount(selectedBankAccount.id);
      showToast("Banka hesabı silindi.");
      setShowDeleteBankModal(false);
      fetchBankAccounts();
    } catch (err) {
      console.error(err);
      showToast("Banka hesabı silinirken bir hata oluştu.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (activeTab === "overview") {
      fetchStats();
    } else if (activeTab === "companies") {
      fetchCompanies();
    } else if (activeTab === "vehicles") {
      fetchVehicles();
    } else if (activeTab === "students") {
      fetchStudents();
    } else if (activeTab === "vip-vehicles") {
      fetchVipVehicles();
    } else if (activeTab === "bank-accounts") {
      fetchBankAccounts();
    } else if (activeTab === "vip-reservations") {
      fetchVipReservations();
    }
  }, [activeTab]);

  const handleOpenAddModal = () => {
    setName("");
    setEmail("");
    setPassword("");
    setLogo("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (company: any) => {
    setSelectedCompany(company);
    setName(company.name);
    setEmail(company.email);
    setPassword("");
    setLogo(company.logo || "");
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (company: any) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast(dictionary.errorGeneric || "Lütfen gerekli alanları doldurun.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await adminService.createCompany({ name, email, password, logo: logo || null });
      showToast(dictionary.successAddCompany || "Firma başarıyla eklendi.");
      setShowAddModal(false);
      fetchCompanies();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || dictionary.errorGeneric || "Sistem hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast(dictionary.errorGeneric || "Lütfen gerekli alanları doldurun.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await adminService.updateCompany(selectedCompany.id, {
        name,
        email,
        password: password || null,
        logo: logo || null,
      });
      showToast(dictionary.successUpdateCompany || "Firma güncellendi.");
      setShowEditModal(false);
      fetchCompanies();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || dictionary.errorGeneric || "Sistem hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCompany = async () => {
    setIsSubmitting(true);
    try {
      await adminService.deleteCompany(selectedCompany.id);
      showToast(dictionary.successDeleteCompany || "Firma silindi.");
      setShowDeleteModal(false);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      showToast(dictionary.errorGeneric || "Sistem hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAdmin = async (company: any) => {
    try {
      await adminService.toggleAdmin(company.id);
      showToast(dictionary.successToggleAdmin || "Admin yetkisi değiştirildi.");
      fetchCompanies();
    } catch (err) {
      console.error(err);
      showToast(dictionary.errorGeneric || "Sistem hatası.", "error");
    }
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchCompany.toLowerCase()) ||
      c.email.toLowerCase().includes(searchCompany.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.plate.toLowerCase().includes(searchVehicle.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchVehicle.toLowerCase()) ||
      v.companyName.toLowerCase().includes(searchVehicle.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.school.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const filteredVipVehicles = vipVehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchVipVehicle.toLowerCase())
  );

  const filteredVipReservations = vipReservations
    .filter(
      (res) =>
        (res.contactFullName || "").toLowerCase().includes(searchVipReservation.toLowerCase()) ||
        (res.contactEmail || "").toLowerCase().includes(searchVipReservation.toLowerCase()) ||
        (res.contactPhone || "").toLowerCase().includes(searchVipReservation.toLowerCase()) ||
        (res.fromLocation || "").toLowerCase().includes(searchVipReservation.toLowerCase()) ||
        (res.toLocation || "").toLowerCase().includes(searchVipReservation.toLowerCase()) ||
        (res.vipVehicleName || "").toLowerCase().includes(searchVipReservation.toLowerCase()) ||
        `#vip-${res.id}`.toLowerCase().includes(searchVipReservation.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center p-4 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0 ${toast.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-rose-50 border-rose-100 text-rose-800"
            }`}
        >
          <span className="mr-3">
            {toast.type === "success" ? (
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </span>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      <Sidebar
        dictionary={dictionary}
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopHeader dictionary={dictionary} user={user} title={dictionary.roleSuperAdmin} />

        <div className="p-8 overflow-y-auto flex-1">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuSystemOverview}</h2>
              {isLoadingStats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse h-32 flex flex-col justify-between">
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title={dictionary.statsTotalCompanies}
                    value={stats?.companyCount ?? 0}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                  />
                  <StatCard
                    title={dictionary.statsTotalVehicles}
                    value={stats?.vehicleCount ?? 0}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-3V5a1 1 0 00-1-1H9" /></svg>}
                  />
                  <StatCard
                    title={dictionary.statsTotalStudents}
                    value={stats?.studentCount ?? 0}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                  />
                </div>
              )}
            </div>
          )}

          {/* Companies Tab */}
          {activeTab === "companies" && (
            <div className="animate-fade-in space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuCompanies}</h2>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {dictionary.addCompany}
                </button>
              </div>

              {/* Search filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center">
                <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={dictionary.searchPlaceholder}
                  value={searchCompany}
                  onChange={(e) => setSearchCompany(e.target.value)}
                  className="w-full text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {isLoadingCompanies ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredCompanies.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-slate-500 text-sm">{dictionary.noRecentData || "Kayıtlı firma bulunmamaktadır."}</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.companyName}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.companyEmail}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">{dictionary.schoolCount}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">{dictionary.vehicleCount}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">{dictionary.studentCount}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{dictionary.actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCompanies.map((company) => (
                          <tr key={company.id} className="hover:bg-slate-50/50 transition-all duration-150">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                {company.logo ? (
                                  <img
                                    src={getImageUrl(company.logo)}
                                    alt={company.name}
                                    className="w-9 h-9 rounded-xl object-cover border border-slate-100"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                                    {company.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span className="font-semibold text-slate-800 text-sm">{company.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{company.email}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                {company.schoolCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                                {company.vehicleCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                                {company.studentCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                {/* Toggle Admin status */}
                                <button
                                  onClick={() => handleToggleAdmin(company)}
                                  title={dictionary.toggleAdminStatus || "Admin Yetkisi Ver"}
                                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors duration-150"
                                >
                                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                                  </svg>
                                </button>
                                {/* Edit */}
                                <button
                                  onClick={() => handleOpenEditModal(company)}
                                  title={dictionary.editCompany}
                                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors duration-150"
                                >
                                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                </button>
                                {/* Delete */}
                                <button
                                  onClick={() => handleOpenDeleteModal(company)}
                                  title={dictionary.deleteCompany}
                                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors duration-150"
                                >
                                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vehicles Tab */}
          {activeTab === "vehicles" && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuGlobalVehicles}</h2>

              {/* Search filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center">
                <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={dictionary.searchPlaceholder}
                  value={searchVehicle}
                  onChange={(e) => setSearchVehicle(e.target.value)}
                  className="w-full text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {isLoadingVehicles ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-slate-500 text-sm">{dictionary.noRecentData || "Kayıtlı araç bulunmamaktadır."}</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.vehiclePlate || "Plaka"}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.driverName || "Sürücü"}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.companyName || "Firma"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredVehicles.map((vehicle) => (
                          <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-all duration-150">
                            <td className="px-6 py-4 font-semibold text-slate-800 text-sm">
                              <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-mono text-slate-700">
                                {vehicle.plate}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{vehicle.driverName}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{vehicle.companyName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuGlobalStudents}</h2>

              {/* Search filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center">
                <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={dictionary.searchPlaceholder}
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {isLoadingStudents ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-slate-500 text-sm">{dictionary.noRecentData || "Kayıtlı öğrenci bulunmamaktadır."}</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.studentName || "Öğrenci Adı"}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.studentSchool || "Okul"}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.studentClass || "Sınıf"}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.vehiclePlate || "Plaka"}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.companyName || "Firma"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-50/50 transition-all duration-150">
                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">{student.fullName}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{student.school}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{student.schoolClass} {student.branch && `(${student.branch})`}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {student.vehiclePlate ? (
                                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono text-xs text-slate-700">
                                  {student.vehiclePlate}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-xs italic">{dictionary.statusUnassigned || "Atanmadı"}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{student.companyName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIP Vehicles Tab */}
          {activeTab === "vip-vehicles" && (
            <div className="animate-fade-in space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuVipVehicles || "VIP Araç Yönetimi"}</h2>
                <button
                  onClick={handleOpenAddVipModal}
                  className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {dictionary.addVipVehicle || "Yeni VIP Araç Ekle"}
                </button>
              </div>

              {/* Search filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center">
                <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={dictionary.searchPlaceholder}
                  value={searchVipVehicle}
                  onChange={(e) => setSearchVipVehicle(e.target.value)}
                  className="w-full text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {isLoadingVipVehicles ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredVipVehicles.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-slate-500 text-sm">{dictionary.noRecentData || "Kayıtlı VIP araç bulunmamaktadır."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVipVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
                      <div>
                        {/* Vehicle Image */}
                        <div className="relative aspect-[16/9] w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                          {vehicle.imageUrl ? (
                            <img
                              src={getImageUrl(vehicle.imageUrl)}
                              alt={vehicle.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.324-5.184a3.375 3.375 0 00-3.37-3.166h-4.88m-6 0h11.25m-11.25 0V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V9.75M3.375 14.25h17.25m-17.25 0a3.375 3.375 0 003 3.375h11.25a3.375 3.375 0 003-3.375" />
                              </svg>
                              <span className="text-xs">Görsel Yok</span>
                            </div>
                          )}
                          {/* Visibility Badge */}
                          <div className="absolute top-3 right-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm border ${vehicle.isVisible
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                              }`}>
                              {vehicle.isVisible ? "Yayında" : "Gizli"}
                            </span>
                          </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="p-5">
                          <h3 className="font-bold text-slate-800 text-lg mb-4">{vehicle.name}</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{dictionary.passengerCapacity || "Yolcu"}</span>
                              <span className="font-bold text-slate-700 text-sm">{vehicle.passengerCapacity} Kişi</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{dictionary.luggageCapacity || "Bagaj"}</span>
                              <span className="font-bold text-slate-700 text-sm">{vehicle.luggageCapacity} Adet</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditVipModal(vehicle)}
                          className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 text-xs font-semibold transition-all"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleOpenDeleteVipModal(vehicle)}
                          className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 text-xs font-semibold transition-all"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bank Accounts Tab */}
          {activeTab === "bank-accounts" && (
            <div className="animate-fade-in space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuBankAccounts || "Banka Hesapları"}</h2>
                <button
                  onClick={handleOpenAddBankModal}
                  className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Yeni Hesap Ekle
                </button>
              </div>

              {isLoadingBankAccounts ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : bankAccounts.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-slate-500 text-sm">Kayıtlı banka hesabı bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Banka Adı</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hesap Sahibi</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">IBAN</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Para Birimi</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Durum</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bankAccounts.map((account) => (
                          <tr key={account.id} className="hover:bg-slate-50/50 transition-all duration-150">
                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">{account.bankName}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{account.accountHolder}</td>
                            <td className="px-6 py-4 text-sm font-mono text-slate-600">{account.iban}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">{account.currency || "TRY"}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                account.isActive 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}>
                                {account.isActive ? "Aktif" : "Pasif"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleOpenEditBankModal(account)}
                                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors duration-150"
                                >
                                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleOpenDeleteBankModal(account)}
                                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors duration-150"
                                >
                                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIP Reservations Tab */}
          {activeTab === "vip-reservations" && (
            <div className="animate-fade-in space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">VIP Rezervasyonlar</h2>
                <button
                  onClick={fetchVipReservations}
                  disabled={isLoadingVipReservations}
                  className="inline-flex items-center px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
                >
                  <svg className={`w-4.5 h-4.5 mr-2 ${isLoadingVipReservations ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Yenile
                </button>
              </div>

              {/* Search filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center">
                <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={dictionary.searchPlaceholder || "Ara..."}
                  value={searchVipReservation}
                  onChange={(e) => setSearchVipReservation(e.target.value)}
                  className="w-full text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {isLoadingVipReservations ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : vipReservations.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-slate-500 text-sm">Kayıtlı VIP rezervasyonu bulunmamaktadır.</p>
                </div>
              ) : filteredVipReservations.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-slate-500 text-sm">Arama kriterlerine uygun VIP rezervasyonu bulunamadı.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kod</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Müşteri</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Araç / Rota</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarih</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ödeme Yöntemi</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Toplam Fiyat</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredVipReservations.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-50/50 transition-all duration-150">
                            <td className="px-6 py-4 text-sm font-bold text-indigo-600">#VIP-{res.id}</td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-slate-800">{res.contactFullName}</div>
                              <div className="text-xs text-slate-500">{res.contactEmail}</div>
                              <div className="text-xs text-slate-500">{res.contactPhone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-slate-800">{res.vipVehicleName}</div>
                              <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                <span>{res.fromLocation}</span>
                                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                                <span>{res.toLocation}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              <div>{formatTransferDateTime(res.transferDate)}</div>
                              {res.isReturn && res.returnDate && (
                                <div className="text-xs text-slate-400 mt-0.5">Dönüş: {formatTransferDateTime(res.returnDate)}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                res.paymentMethod === "BankTransfer" 
                                  ? "bg-amber-50 text-amber-700 border border-amber-200" 
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {res.paymentMethod === "BankTransfer" ? "Havale / EFT" : "Kredi Kartı"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right">
                              {res.totalPrice?.toLocaleString("tr-TR")} ₺
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleViewReservationDetails(res)}
                                className="inline-flex items-center px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 font-semibold text-xs rounded-xl shadow-sm transition-all duration-150"
                              >
                                Detay
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add Bank Account Modal */}
      {showAddBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Yeni Banka Hesabı Ekle</h3>
              <button onClick={() => setShowAddBankModal(false)} className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAddBankAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Banka Adı</label>
                <input type="text" required value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Ziraat Bankası, Garanti vb." className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Hesap Sahibi</label>
                <input type="text" required value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Ad Soyad veya Firma Ünvanı" className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">IBAN</label>
                <input type="text" required value={iban} onChange={(e) => setIban(e.target.value)} placeholder="TR..." className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Para Birimi</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all bg-white">
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <input type="checkbox" id="bankIsActiveAdd" checked={bankIsActive} onChange={(e) => setBankIsActive(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                <label htmlFor="bankIsActiveAdd" className="text-sm font-semibold text-slate-700 cursor-pointer">Ödeme Adımında Gösterilsin (Aktif)</label>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddBankModal(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">İptal</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all">{isSubmitting ? "Kaydediliyor..." : "Kaydet"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bank Account Modal */}
      {showEditBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Banka Hesabını Düzenle</h3>
              <button onClick={() => setShowEditBankModal(false)} className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleEditBankAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Banka Adı</label>
                <input type="text" required value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Ziraat Bankası, Garanti vb." className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Hesap Sahibi</label>
                <input type="text" required value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Ad Soyad veya Firma Ünvanı" className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">IBAN</label>
                <input type="text" required value={iban} onChange={(e) => setIban(e.target.value)} placeholder="TR..." className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Para Birimi</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all bg-white">
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <input type="checkbox" id="bankIsActiveEdit" checked={bankIsActive} onChange={(e) => setBankIsActive(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                <label htmlFor="bankIsActiveEdit" className="text-sm font-semibold text-slate-700 cursor-pointer">Ödeme Adımında Gösterilsin (Aktif)</label>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowEditBankModal(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">İptal</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all">{isSubmitting ? "Kaydediliyor..." : "Kaydet"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Bank Account Modal */}
      {showDeleteBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Banka Hesabını Sil</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Bu banka hesabını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                {selectedBankAccount && (
                  <span className="block font-semibold text-slate-700 mt-2">"{selectedBankAccount.bankName} - {selectedBankAccount.iban}"</span>
                )}
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button type="button" onClick={() => setShowDeleteBankModal(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">İptal</button>
                <button type="button" onClick={handleDeleteBankAccount} disabled={isSubmitting} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all">{isSubmitting ? "Siliniyor..." : "Sil"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">{dictionary.addCompany}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddCompany} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.companyName}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={dictionary.companyName}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.companyEmail}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dictionary.companyEmail}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.password}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={dictionary.passwordPlaceholder}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.logoUrl || "Logo URL"}</label>
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : dictionary.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">{dictionary.editCompany}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditCompany} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.companyName}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={dictionary.companyName}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.companyEmail}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dictionary.companyEmail}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.password}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={dictionary.passwordPlaceholder}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">{dictionary.passwordHelp || "Şifreyi değiştirmek istemiyorsanız boş bırakın."}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.logoUrl || "Logo URL"}</label>
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : dictionary.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{dictionary.deleteConfirmTitle}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                {dictionary.deleteCompanyConfirmText || "Bu firmayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."}
                {selectedCompany && (
                  <span className="block font-semibold text-slate-700 mt-2">"{selectedCompany.name}"</span>
                )}
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCompany}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : dictionary.deleteCompany || "Sil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add VIP Vehicle Modal */}
      {showAddVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
              <h3 className="text-lg font-bold text-slate-800">{dictionary.addVipVehicle || "Yeni VIP Araç Ekle"}</h3>
              <button
                onClick={() => setShowAddVipModal(false)}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddVipVehicle} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.vipVehicleName || "Araç Adı"}</label>
                <input
                  type="text"
                  required
                  value={vipName}
                  onChange={(e) => setVipName(e.target.value)}
                  placeholder="Mercedes Vito, Volkswagen Caravelle vb."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.passengerCapacity || "Yolcu Kapasitesi"}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={vipPassenger}
                    onChange={(e) => setVipPassenger(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.luggageCapacity || "Bagaj Kapasitesi"}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={vipLuggage}
                    onChange={(e) => setVipLuggage(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.vipVehicleImage || "Araç Görseli"}</label>
                {vipImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-50 group">
                    <img src={vipImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setVipImage("")}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold text-sm transition-opacity duration-200"
                    >
                      Görseli Kaldır / Değiştir
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-500 transition-colors bg-slate-50/50 text-center relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setIsUploadingImage(true);
                        try {
                          const data = await adminService.uploadFile(file);
                          setVipImage(data.url);
                          showToast("Görsel başarıyla yüklendi.");
                        } catch (err: any) {
                          console.error(err);
                          showToast(err?.message || "Görsel yüklenirken bir hata oluştu.", "error");
                        } finally {
                          setIsUploadingImage(false);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploadingImage}
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      {isUploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                          <span className="text-sm font-semibold text-slate-600">Yükleniyor...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                          </svg>
                          <span className="text-sm font-semibold text-slate-600">Görsel Seçmek İçin Tıklayın</span>
                          <span className="text-xs text-slate-400">PNG, JPG, JPEG veya WEBP (Max. 10MB)</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* KM Price Ranges Section */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">KM Fiyat Tarifeleri</label>

                {/* List existing ranges */}
                {vipPriceRanges.length > 0 ? (
                  <div className="space-y-2">
                    {vipPriceRanges.map((range, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-sm animate-fade-in">
                        <span className="font-semibold text-slate-700">{range.fromKm} - {range.toKm} KM</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-indigo-600">{range.price.toLocaleString("tr-TR")} TL</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePriceRange(index)}
                            className="text-rose-500 hover:text-rose-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Henüz fiyat tarifesi eklenmedi.</p>
                )}

                {/* Add new range form */}
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Başlangıç KM</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Örn: 0"
                        value={newFromKm}
                        onChange={(e) => setNewFromKm(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none text-xs text-slate-700 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Bitiş KM</label>
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        placeholder="Örn: 2"
                        value={newToKm}
                        onChange={(e) => setNewToKm(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none text-xs text-slate-700 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Fiyat (TL)</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Örn: 1000"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none text-xs text-slate-700 bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPriceRange}
                    className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs rounded-lg transition-colors border border-indigo-100"
                  >
                    Tarife Ekle
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="vipIsVisibleAdd"
                  checked={vipIsVisible}
                  onChange={(e) => setVipIsVisible(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="vipIsVisibleAdd" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  {dictionary.isVisible || "Web sitesinde gösterilsin"}
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white z-10">
                <button
                  type="button"
                  onClick={() => setShowAddVipModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : dictionary.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit VIP Vehicle Modal */}
      {showEditVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
              <h3 className="text-lg font-bold text-slate-800">{dictionary.editVipVehicle || "VIP Aracı Düzenle"}</h3>
              <button
                onClick={() => setShowEditVipModal(false)}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditVipVehicle} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.vipVehicleName || "Araç Adı"}</label>
                <input
                  type="text"
                  required
                  value={vipName}
                  onChange={(e) => setVipName(e.target.value)}
                  placeholder="Araç ismi giriniz"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.passengerCapacity || "Yolcu Kapasitesi"}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={vipPassenger}
                    onChange={(e) => setVipPassenger(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.luggageCapacity || "Bagaj Kapasitesi"}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={vipLuggage}
                    onChange={(e) => setVipLuggage(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.vipVehicleImage || "Araç Görseli"}</label>
                {vipImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-50 group">
                    <img src={vipImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setVipImage("")}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold text-sm transition-opacity duration-200"
                    >
                      Görseli Kaldır / Değiştir
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-500 transition-colors bg-slate-50/50 text-center relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setIsUploadingImage(true);
                        try {
                          const data = await adminService.uploadFile(file);
                          setVipImage(data.url);
                          showToast("Görsel başarıyla yüklendi.");
                        } catch (err: any) {
                          console.error(err);
                          showToast(err?.message || "Görsel yüklenirken bir hata oluştu.", "error");
                        } finally {
                          setIsUploadingImage(false);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploadingImage}
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      {isUploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                          <span className="text-sm font-semibold text-slate-600">Yükleniyor...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                          </svg>
                          <span className="text-sm font-semibold text-slate-600">Görsel Seçmek İçin Tıklayın</span>
                          <span className="text-xs text-slate-400">PNG, JPG, JPEG veya WEBP (Max. 10MB)</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* KM Price Ranges Section */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">KM Fiyat Tarifeleri</label>

                {/* List existing ranges */}
                {vipPriceRanges.length > 0 ? (
                  <div className="space-y-2">
                    {vipPriceRanges.map((range, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-sm animate-fade-in">
                        <span className="font-semibold text-slate-700">{range.fromKm} - {range.toKm} KM</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-indigo-600">{range.price.toLocaleString("tr-TR")} TL</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePriceRange(index)}
                            className="text-rose-500 hover:text-rose-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Henüz fiyat tarifesi eklenmedi.</p>
                )}

                {/* Add new range form */}
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Başlangıç KM</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Örn: 0"
                        value={newFromKm}
                        onChange={(e) => setNewFromKm(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none text-xs text-slate-700 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Bitiş KM</label>
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        placeholder="Örn: 2"
                        value={newToKm}
                        onChange={(e) => setNewToKm(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none text-xs text-slate-700 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Fiyat (TL)</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Örn: 1000"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none text-xs text-slate-700 bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPriceRange}
                    className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs rounded-lg transition-colors border border-indigo-100"
                  >
                    Tarife Ekle
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="vipIsVisibleEdit"
                  checked={vipIsVisible}
                  onChange={(e) => setVipIsVisible(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="vipIsVisibleEdit" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  {dictionary.isVisible || "Web sitesinde gösterilsin"}
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white z-10">
                <button
                  type="button"
                  onClick={() => setShowEditVipModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : dictionary.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete VIP Vehicle Confirmation Modal */}
      {showDeleteVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{dictionary.deleteConfirmTitle}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                {dictionary.deleteVipVehicleConfirmText || "Bu VIP aracı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."}
                {selectedVipVehicle && (
                  <span className="block font-semibold text-slate-700 mt-2">"{selectedVipVehicle.name}"</span>
                )}
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteVipModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteVipVehicle}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : dictionary.deleteCompany || "Sil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIP Reservation Details Modal */}
      {showReservationDetailsModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">VIP Rezervasyon Detayı</h3>
                <p className="text-xs text-slate-500 mt-0.5">Rezervasyon Kodu: <span className="font-semibold text-indigo-600">#VIP-{selectedReservation.id}</span></p>
              </div>
              <button 
                onClick={() => {
                  setShowReservationDetailsModal(false);
                  setSelectedReservation(null);
                }} 
                className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm text-slate-700">
              
              {/* Transfer Details Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Transfer Bilgileri</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-slate-400">Araç</span>
                    <span className="font-semibold text-slate-800">{selectedReservation.vipVehicleName}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Ödeme Yöntemi</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-0.5 ${
                      selectedReservation.paymentMethod === "BankTransfer" 
                        ? "bg-amber-50 text-amber-700 border border-amber-200" 
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {selectedReservation.paymentMethod === "BankTransfer" ? "Havale / EFT" : "Kredi Kartı"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs text-slate-400">Güzergah</span>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-0.5">
                      <span>{selectedReservation.fromLocation}</span>
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <span>{selectedReservation.toLocation}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Gidiş Tarihi</span>
                    <span className="font-semibold text-slate-800">
                      {formatTransferDateTime(selectedReservation.transferDate)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Uçuş Numarası</span>
                    <span className="font-semibold text-slate-800">{selectedReservation.flightNumber || "-"}</span>
                  </div>
                  {selectedReservation.isReturn && (
                    <div>
                      <span className="block text-xs text-slate-400">Dönüş Tarihi</span>
                      <span className="font-semibold text-slate-800">
                        {formatTransferDateTime(selectedReservation.returnDate)}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="block text-xs text-slate-400">Oluşturulma Tarihi</span>
                    <span className="text-slate-600">
                      {new Date(selectedReservation.createdAt).toLocaleDateString('tr-TR')} {new Date(selectedReservation.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Details Card */}
              <div className="border border-slate-100 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">İletişim Bilgileri</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-slate-400">Ad Soyad</span>
                    <span className="font-semibold text-slate-800">{selectedReservation.contactFullName}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Telefon</span>
                    <span className="font-semibold text-slate-800">{selectedReservation.contactPhone}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">E-posta</span>
                    <span className="font-semibold text-slate-800">{selectedReservation.contactEmail}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Dil / Uyruk</span>
                    <span className="font-semibold text-slate-800">{selectedReservation.contactLanguage} / {selectedReservation.contactNationality}</span>
                  </div>
                </div>
              </div>

              {/* Passengers Card */}
              <div className="border border-slate-100 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Yolcular</h4>
                {(!selectedReservation.passengers || selectedReservation.passengers.length === 0) ? (
                  <p className="text-xs text-slate-400">Kayıtlı yolcu bulunmamaktadır.</p>
                ) : (
                  <div className="overflow-hidden border border-slate-100 rounded-lg">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-3 py-2 text-xs font-semibold text-slate-500">Ad Soyad</th>
                          <th className="px-3 py-2 text-xs font-semibold text-slate-500">Doğum Tarihi</th>
                          <th className="px-3 py-2 text-xs font-semibold text-slate-500">Uyruk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedReservation.passengers.map((p: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2 text-xs font-semibold text-slate-800">{p.fullName}</td>
                            <td className="px-3 py-2 text-xs text-slate-600">{new Date(p.dateOfBirth).toLocaleDateString('tr-TR')}</td>
                            <td className="px-3 py-2 text-xs text-slate-600">{p.nationality}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Note details */}
              {selectedReservation.note && (
                <div className="border border-slate-100 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Notlar</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-50">{selectedReservation.note}</p>
                </div>
              )}

              {/* Total Price summary */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 px-1">
                <span className="font-bold text-slate-800 text-sm">Genel Toplam</span>
                <span className="text-xl font-extrabold text-emerald-600">{selectedReservation.totalPrice?.toLocaleString("tr-TR")} ₺</span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
              <button 
                onClick={() => {
                  setShowReservationDetailsModal(false);
                  setSelectedReservation(null);
                }} 
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
