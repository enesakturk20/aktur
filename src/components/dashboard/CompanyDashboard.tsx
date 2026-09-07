"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar, { MenuItem } from "./ui/Sidebar";
import TopHeader from "./ui/TopHeader";
import StatCard from "./ui/StatCard";
import { ChevronDown } from "lucide-react";
import { companyService, studentService } from "@/services";

interface CompanyDashboardProps {
  dictionary: any;
  lang: string;
  user: any;
}

export default function CompanyDashboard({ dictionary, lang, user }: CompanyDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [schools, setSchools] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Search terms
  const [searchSchool, setSearchSchool] = useState("");
  const [searchVehicle, setSearchVehicle] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [studentFilter, setStudentFilter] = useState<"all" | "assigned" | "unassigned">("all");

  // CRUD Modal triggers
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [schoolModalType, setSchoolModalType] = useState<"add" | "edit">("add");
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [showSchoolDeleteModal, setShowSchoolDeleteModal] = useState(false);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleModalType, setVehicleModalType] = useState<"add" | "edit">("add");
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [showVehicleDeleteModal, setShowVehicleDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentModalType, setStudentModalType] = useState<"add" | "edit">("add");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showStudentDeleteModal, setShowStudentDeleteModal] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);

  // Detail filter overlay modals (e.g. students of a school or driver)
  const [showDetailStudentsModal, setShowDetailStudentsModal] = useState(false);
  const [detailStudentsTitle, setDetailStudentsTitle] = useState("");
  const [detailStudentsList, setDetailStudentsList] = useState<any[]>([]);

  // Form Fields
  // School Form
  const [schoolName, setSchoolName] = useState("");

  // Vehicle Form
  const [driverName, setDriverName] = useState("");
  const [plate, setPlate] = useState("");
  const [password, setPassword] = useState("");

  // Reset Password
  const [newPassword, setNewPassword] = useState("");

  // Student Form
  const [fullName, setFullName] = useState("");
  const [studentSchool, setStudentSchool] = useState("");
  const [schoolClass, setSchoolClass] = useState("");
  const [branch, setBranch] = useState("");
  const [city, setCity] = useState("");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [district, setDistrict] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [street, setStreet] = useState("");
  const [alley, setAlley] = useState("");
  const [buildingNo, setBuildingNo] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Ref to skip cascade resets during edit initialization
  const skipCascadeReset = useRef(false);

  // Vehicle Assignment
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | string>("");

  // Feedback states
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getCompanyId = () => {
    try {
      const token = localStorage.getItem("aktur_token");
      if (!token) return 0;
      const payloadBase64 = token.split(".")[1];
      const decodedJson = atob(payloadBase64);
      const payload = JSON.parse(decodedJson);
      const sub = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.sub;
      return parseInt(sub, 10) || 0;
    } catch (e) {
      console.error(e);
      return 0;
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [dataSchools, dataVehicles, dataStudents] = await Promise.all([
        companyService.getSchools(),
        companyService.getVehicles(),
        companyService.getStudents(),
      ]);
      setSchools(dataSchools);
      setVehicles(dataVehicles);
      setStudents(dataStudents);
    } catch (e) {
      console.error(e);
      showToast(dictionary.errorFetch || "Veriler yüklenirken bir hata oluştu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Address cascading: load provinces on mount
  useEffect(() => {
    studentService.getProvinces()
      .then(setProvinces)
      .catch((err) => console.error("Failed to load provinces", err));
  }, []);

  // Address cascading: load districts when city changes
  useEffect(() => {
    if (!city) {
      setDistricts([]);
      setNeighborhoods([]);
      return;
    }
    if (skipCascadeReset.current) return;
    studentService.getDistricts(city)
      .then(setDistricts)
      .catch((err) => console.error("Failed to load districts", err));
    setDistrict("");
    setNeighborhood("");
    setNeighborhoods([]);
  }, [city]);

  // Address cascading: load neighborhoods when district changes
  useEffect(() => {
    if (!district) {
      setNeighborhoods([]);
      return;
    }
    if (skipCascadeReset.current) return;
    studentService.getNeighborhoods(district)
      .then(setNeighborhoods)
      .catch((err) => console.error("Failed to load neighborhoods", err));
    setNeighborhood("");
  }, [district]);

  const menuItems: MenuItem[] = [
    {
      id: "overview",
      label: dictionary.menuDashboard,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: "schools",
      label: dictionary.menuSchools || "Okul Yönetimi",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33L12 5.5l-7.5 4.83V21h15z" />
        </svg>
      )
    },
    {
      id: "vehicles",
      label: dictionary.menuVehicles,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-3V5a1 1 0 00-1-1H9" />
        </svg>
      )
    },
    {
      id: "students",
      label: dictionary.menuStudents,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  // School Actions
  const handleOpenAddSchool = () => {
    setSchoolName("");
    setSchoolModalType("add");
    setShowSchoolModal(true);
  };

  const handleOpenEditSchool = (school: any) => {
    setSelectedSchool(school);
    setSchoolName(school.name);
    setSchoolModalType("edit");
    setShowSchoolModal(true);
  };

  const handleOpenDeleteSchool = (school: any) => {
    setSelectedSchool(school);
    setShowSchoolDeleteModal(true);
  };

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) {
      showToast(dictionary.errorGeneric || "Lütfen okul adını giriniz.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      if (schoolModalType === "add") {
        await companyService.createSchool({ name: schoolName });
      } else {
        await companyService.updateSchool(selectedSchool.id, { name: schoolName });
      }

      showToast(
        schoolModalType === "add"
          ? dictionary.successAddSchool || "Okul başarıyla eklendi."
          : dictionary.successUpdateSchool || "Okul başarıyla güncellendi."
      );
      setShowSchoolModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || dictionary.errorGeneric || "Sistem hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSchool = async () => {
    setIsSubmitting(true);
    try {
      await companyService.deleteSchool(selectedSchool.id);
      showToast(dictionary.successDeleteSchool || "Okul başarıyla silindi.");
      setShowSchoolDeleteModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || "Okul silinirken bir hata oluştu.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vehicle Actions
  const handleOpenAddVehicle = () => {
    setDriverName("");
    setPlate("");
    setPassword("");
    setVehicleModalType("add");
    setShowVehicleModal(true);
  };

  const handleOpenEditVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDriverName(vehicle.driverName);
    setPlate(vehicle.plate);
    setPassword("");
    setVehicleModalType("edit");
    setShowVehicleModal(true);
  };

  const handleOpenDeleteVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDeleteModal(true);
  };

  const handleOpenResetPassword = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setNewPassword("");
    setShowResetPasswordModal(true);
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !plate.trim() || (vehicleModalType === "add" && !password)) {
      showToast(dictionary.errorGeneric || "Lütfen alanları eksiksiz doldurun.", "error");
      return;
    }
    setIsSubmitting(true);
    // Format plate: uppercase and trim spaces
    const formattedPlate = plate.toUpperCase().replace(/\s+/g, "");

    try {
      if (vehicleModalType === "add") {
        await companyService.createVehicle({ driverName, plate: formattedPlate, password });
      } else {
        await companyService.updateVehicle(selectedVehicle.id, { driverName, plate: formattedPlate, password: password || null });
      }

      showToast(
        vehicleModalType === "add"
          ? "Sürücü/Araç başarıyla oluşturuldu."
          : "Sürücü/Araç başarıyla güncellendi."
      );
      setShowVehicleModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || dictionary.errorGeneric || "Sistem hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async () => {
    setIsSubmitting(true);
    try {
      await companyService.deleteVehicle(selectedVehicle.id);
      showToast("Sürücü/Araç kaydı başarıyla silindi.");
      setShowVehicleDeleteModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || "Silme işlemi sırasında hata oluştu.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 6) {
      showToast("Şifre en az 6 karakter olmalıdır.", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      await companyService.resetVehiclePassword(selectedVehicle.id, newPassword);
      showToast("Şoför şifresi başarıyla sıfırlandı.");
      setShowResetPasswordModal(false);
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || "Şifre güncellenemedi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Student Actions
  const handleOpenAddStudent = () => {
    setFullName("");
    setStudentSchool(schools[0]?.name || "");
    setSchoolClass("");
    setBranch("");
    setCity("");
    setDistrict("");
    setNeighborhood("");
    setStreet("");
    setAlley("");
    setBuildingNo("");
    setApartmentNo("");
    setPostalCode("");
    setStudentModalType("add");
    setShowStudentModal(true);
  };

  const handleOpenEditStudent = async (student: any) => {
    setSelectedStudent(student);
    setFullName(student.fullName);
    setStudentSchool(student.school);
    setSchoolClass(student.schoolClass);
    setBranch(student.branch || "");
    setStreet(student.street);
    setAlley(student.alley);
    setBuildingNo(student.buildingNo);
    setApartmentNo(student.apartmentNo);
    setPostalCode(student.postalCode || "");
    setStudentModalType("edit");
    setShowStudentModal(true);

    // Reverse-lookup: find province ID from name
    skipCascadeReset.current = true;
    try {
      // Ensure provinces are loaded
      let currentProvinces = provinces;
      if (currentProvinces.length === 0) {
        currentProvinces = await studentService.getProvinces();
        setProvinces(currentProvinces);
      }

      const matchedProvince = currentProvinces.find(
        (p: any) => p.name === student.city
      );
      if (matchedProvince) {
        setCity(String(matchedProvince.id));

        // Fetch districts for this province
        const districtList = await studentService.getDistricts(matchedProvince.id);
        setDistricts(districtList);

        const matchedDistrict = districtList.find(
          (d: any) => d.name === student.district
        );
        if (matchedDistrict) {
          setDistrict(String(matchedDistrict.id));

          // Fetch neighborhoods for this district
          const neighborhoodList = await studentService.getNeighborhoods(matchedDistrict.id);
          setNeighborhoods(neighborhoodList);

          const matchedNeighborhood = neighborhoodList.find(
            (n: any) => n.name === student.neighborhood
          );
          if (matchedNeighborhood) {
            setNeighborhood(String(matchedNeighborhood.id));
          } else {
            setNeighborhood("");
          }
        } else {
          setDistrict("");
          setNeighborhood("");
          setNeighborhoods([]);
        }
      } else {
        setCity("");
        setDistrict("");
        setNeighborhood("");
        setDistricts([]);
        setNeighborhoods([]);
      }
    } catch (err) {
      console.error("Failed to resolve address IDs", err);
      setCity("");
      setDistrict("");
      setNeighborhood("");
    } finally {
      skipCascadeReset.current = false;
    }
  };

  const handleOpenDeleteStudent = (student: any) => {
    setSelectedStudent(student);
    setShowStudentDeleteModal(true);
  };

  const handleOpenAssignStudent = (student: any) => {
    setSelectedStudent(student);
    setSelectedVehicleId(vehicles[0]?.id || "");
    setShowAssignModal(true);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !studentSchool.trim() || !schoolClass.trim() || !district.trim() || !neighborhood.trim()) {
      showToast(dictionary.errorGeneric || "Lütfen zorunlu alanları doldurun.", "error");
      return;
    }
    setIsSubmitting(true);
    const studentPayload = {
      fullName,
      school: studentSchool,
      schoolClass,
      branch: branch || null,
      city: provinces.find((p: any) => String(p.id) === String(city))?.name || city,
      district: districts.find((d: any) => String(d.id) === String(district))?.name || district,
      neighborhood: neighborhoods.find((n: any) => String(n.id) === String(neighborhood))?.name || neighborhood,
      street,
      alley,
      buildingNo,
      apartmentNo,
      postalCode: postalCode || null,
      ...(studentModalType === "add" ? { companyId: getCompanyId() } : {})
    };

    try {
      if (studentModalType === "add") {
        await companyService.createStudent(studentPayload);
      } else {
        await companyService.updateStudent(selectedStudent.id, studentPayload);
      }

      showToast(
        studentModalType === "add"
          ? "Öğrenci kaydı başarıyla oluşturuldu."
          : "Öğrenci kaydı başarıyla güncellendi."
      );
      setShowStudentModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || dictionary.errorGeneric || "Sistem hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async () => {
    setIsSubmitting(true);
    try {
      await companyService.deleteStudent(selectedStudent.id);
      showToast("Öğrenci kaydı başarıyla silindi.");
      setShowStudentDeleteModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || dictionary.errorGeneric || "Sistem hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      showToast("Lütfen bir araç seçin.", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      await companyService.assignStudent(selectedStudent.id, parseInt(selectedVehicleId.toString(), 10));
      showToast("Öğrenci araca başarıyla atandı.");
      setShowAssignModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || "Atama hatası.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnassignStudent = async (student: any) => {
    try {
      await companyService.unassignStudent(student.id);
      showToast("Öğrenci araçtan çıkartıldı.");
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || dictionary.errorGeneric || "Sistem hatası.", "error");
    }
  };

  // Student Overlay Details (Students of School / Driver)
  const handleOpenDetailStudents = (title: string, list: any[]) => {
    setDetailStudentsTitle(title);
    setDetailStudentsList(list);
    setShowDetailStudentsModal(true);
  };

  // Filter lists in memory
  const filteredSchools = schools.filter((s) =>
    s.name.toLowerCase().includes(searchSchool.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.plate.toLowerCase().includes(searchVehicle.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchVehicle.toLowerCase())
  );

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.school.toLowerCase().includes(searchStudent.toLowerCase());
    const isAssigned = s.vehicleId && s.status === 1;

    if (studentFilter === "assigned") {
      return matchesSearch && isAssigned;
    }
    if (studentFilter === "unassigned") {
      return matchesSearch && !isAssigned;
    }
    return matchesSearch;
  });

  // Calculations for stats
  const totalVehiclesCount = vehicles.length;
  const totalStudentsCount = students.length;
  const unassignedStudentsCount = students.filter((s) => s.status === 0 || !s.vehicleId).length;
  const totalSchoolsCount = schools.length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Toast Notification */}
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
        <TopHeader dictionary={dictionary} user={user} title={dictionary.roleCompany} />

        <div className="p-8 overflow-y-auto flex-1">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuDashboard}</h2>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse h-32 flex flex-col justify-between">
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title={dictionary.menuSchools || "Kayıtlı Okul"}
                    value={totalSchoolsCount}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33L12 5.5l-7.5 4.83V21h15z" /></svg>}
                  />
                  <StatCard
                    title={dictionary.statsTotalVehicles}
                    value={totalVehiclesCount}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-3V5a1 1 0 00-1-1H9" /></svg>}
                  />
                  <StatCard
                    title={dictionary.statsTotalStudents}
                    value={totalStudentsCount}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                  />
                  <StatCard
                    title={dictionary.statsUnassignedStudents}
                    value={unassignedStudentsCount}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                  />
                </div>
              )}
            </div>
          )}

          {/* Schools Tab */}
          {activeTab === "schools" && (
            <div className="animate-fade-in space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuSchools || "Okul Yönetimi"}</h2>
                <button
                  onClick={handleOpenAddSchool}
                  className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {dictionary.addSchool || "Yeni Okul Ekle"}
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
                  value={searchSchool}
                  onChange={(e) => setSearchSchool(e.target.value)}
                  className="w-full text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredSchools.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-slate-500 text-sm">Kayıtlı okul bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.schoolName || "Okul Adı"}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Kayıtlı Öğrenci Sayısı</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{dictionary.actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSchools.map((school) => {
                          const schoolStuds = students.filter(s => s.school.toLowerCase() === school.name.toLowerCase());
                          return (
                            <tr key={school.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{school.name}</td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => handleOpenDetailStudents(`${school.name} Okulu Öğrencileri`, schoolStuds)}
                                  className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-lg transition-colors"
                                >
                                  {schoolStuds.length} {dictionary.studentCount || "Öğrenci"}
                                  <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </button>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleOpenEditSchool(school)}
                                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                                  >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleOpenDeleteSchool(school)}
                                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
                                  >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuVehicles}</h2>
                <button
                  onClick={handleOpenAddVehicle}
                  className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {dictionary.addVehicle}
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
                  value={searchVehicle}
                  onChange={(e) => setSearchVehicle(e.target.value)}
                  className="w-full text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-slate-500 text-sm">Kayıtlı sürücü/araç bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.vehiclePlate}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.driverName}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Taşınan Öğrenci</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{dictionary.actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredVehicles.map((vehicle) => {
                          const vehicleStuds = students.filter(s => s.vehicleId === vehicle.id);
                          return (
                            <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-mono font-semibold text-slate-700 text-sm">
                                  {vehicle.plate}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600 font-semibold">{vehicle.driverName}</td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => handleOpenDetailStudents(`${vehicle.plate} Plakalı Araç Yolcuları`, vehicleStuds)}
                                  className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-lg transition-colors"
                                >
                                  {vehicleStuds.length} {dictionary.studentCount || "Öğrenci"}
                                  <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </button>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleOpenResetPassword(vehicle)}
                                    title={dictionary.resetPassword}
                                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors"
                                  >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditVehicle(vehicle)}
                                    title={dictionary.editVehicle}
                                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                                  >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleOpenDeleteVehicle(vehicle)}
                                    title={dictionary.deleteVehicle}
                                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
                                  >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuStudents}</h2>
                <button
                  onClick={handleOpenAddStudent}
                  className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Yeni Öğrenci Ekle
                </button>
              </div>

              {/* Search filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center flex-1">
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
                <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Durum Filtresi:</span>
                  <select
                    value={studentFilter}
                    onChange={(e: any) => setStudentFilter(e.target.value)}
                    className="text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50/50 outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="all">Tümü (Hepsi)</option>
                    <option value="assigned">Atanmışlar</option>
                    <option value="unassigned">Atanmamışlar (Havuz)</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-slate-500 text-sm">Kayıtlı öğrenci bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.studentName}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.studentSchool}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.studentClass}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.vehiclePlate}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{dictionary.studentStatus}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{dictionary.actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((student) => {
                          const isAssigned = student.vehicleId && student.status === 1;
                          const assignedVehicle = vehicles.find(v => v.id === student.vehicleId);
                          return (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{student.fullName}</td>
                              <td className="px-6 py-4 text-sm text-slate-600 font-medium">{student.school}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">{student.schoolClass} {student.branch && `(${student.branch})`}</td>
                              <td className="px-6 py-4">
                                {isAssigned && assignedVehicle ? (
                                  <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-mono text-xs text-slate-700 font-semibold">
                                    {assignedVehicle.plate}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-xs italic">{dictionary.statusUnassigned}</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {isAssigned ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    {dictionary.statusAssigned}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    Havuzda (Atanmamış)
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-1.5">
                                  {isAssigned ? (
                                    <button
                                      onClick={() => handleUnassignStudent(student)}
                                      title={dictionary.unassign || "Araçtan Kaldır"}
                                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                                    >
                                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenAssignStudent(student)}
                                      title={dictionary.assignVehicleTitle || "Araca Ata"}
                                      className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors"
                                    >
                                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleOpenEditStudent(student)}
                                    title="Düzenle"
                                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                  >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                  </button>

                                  <button
                                    onClick={() => handleOpenDeleteStudent(student)}
                                    title="Sil"
                                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                                  >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* School Add/Edit Modal */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {schoolModalType === "add" ? (dictionary.addSchool || "Yeni Okul Ekle") : (dictionary.editSchool || "Okulu Düzenle")}
              </h3>
              <button
                onClick={() => setShowSchoolModal(false)}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSchoolSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.schoolName || "Okul Adı"}</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="örn: Atatürk İlköğretim Okulu"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSchoolModal(false)}
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

      {/* School Delete Modal */}
      {showSchoolDeleteModal && (
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
                Bu okulu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                {selectedSchool && (
                  <span className="block font-semibold text-slate-700 mt-2">"{selectedSchool.name}"</span>
                )}
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSchoolDeleteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSchool}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : (dictionary.deleteSchool || "Sil")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Add/Edit Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {vehicleModalType === "add" ? dictionary.addVehicle : dictionary.editVehicle}
              </h3>
              <button
                onClick={() => setShowVehicleModal(false)}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleVehicleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.driverName}</label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="örn: Ahmet Yılmaz"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.vehiclePlate}</label>
                <input
                  type="text"
                  required
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="örn: 34ABC123"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all text-transform: uppercase"
                />
              </div>
              {vehicleModalType === "add" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.driverPassword || "Sürücü Şifresi"}</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
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

      {/* Vehicle Delete Modal */}
      {showVehicleDeleteModal && (
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
                Bu sürücü/araç kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                {selectedVehicle && (
                  <span className="block font-semibold text-slate-700 mt-2">"{selectedVehicle.plate} - {selectedVehicle.driverName}"</span>
                )}
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVehicleDeleteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteVehicle}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : (dictionary.deleteVehicle || "Sil")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Driver Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Sürücü Şifresini Sıfırla</h3>
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Sürücü: <strong className="text-slate-700">{selectedVehicle?.driverName} ({selectedVehicle?.plate})</strong>
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Yeni Şifre</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-800 transition-all"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : "Şifreyi Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Add/Edit Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-scale-up my-8">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {studentModalType === "add" ? "Yeni Öğrenci Ekle" : "Öğrenci Kaydını Düzenle"}
              </h3>
              <button
                onClick={() => setShowStudentModal(false)}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleStudentSubmit} className="p-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1">Öğrenci & Okul Bilgileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.fullName || "Adı Soyadı"} *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="örn: Alperen Yılmaz"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.studentSchool || "Okul"} *</label>
                  {schools.length > 0 ? (
                    <select
                      value={studentSchool}
                      onChange={(e) => setStudentSchool(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 transition-all bg-white"
                    >
                      {studentSchool && !schools.some(s => s.name.toLowerCase() === studentSchool.toLowerCase()) && (
                        <option value={studentSchool}>{studentSchool}</option>
                      )}
                      {schools.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={studentSchool}
                      onChange={(e) => setStudentSchool(e.target.value)}
                      placeholder="Okul adı"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 transition-all"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.studentClass || "Sınıf"} *</label>
                  <select
                    value={schoolClass}
                    onChange={(e) => setSchoolClass(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 bg-white transition-all"
                  >
                    <option value="" disabled>Seçiniz</option>
                    {schoolClass && !["Anasınıfı", "1", "2", "3", "4", "5", "6", "7", "8", "Lise Hazırlık", "9", "10", "11", "12"].includes(schoolClass) && (
                      <option value={schoolClass}>{schoolClass}</option>
                    )}
                    {["Anasınıfı", "1", "2", "3", "4", "5", "6", "7", "8", "Lise Hazırlık", "9", "10", "11", "12"].map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.branch || "Şube"}</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 bg-white transition-all"
                  >
                    <option value="">Seçiniz (İsteğe Bağlı)</option>
                    {branch && !["A", "B", "C", "D", "E", "F", "G", "H", "Sayısal", "Eşit Ağırlık", "Sözel", "Dil"].includes(branch) && (
                      <option value={branch}>{branch}</option>
                    )}
                    {["A", "B", "C", "D", "E", "F", "G", "H", "Sayısal", "Eşit Ağırlık", "Sözel", "Dil"].map((br) => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1 pt-2">Adres Bilgileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.city || "İl"} *</label>
                  <div className="relative">
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 pr-12 rounded-xl border bg-slate-50 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                    >
                      <option value="" disabled>Seçiniz</option>
                      {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>{prov.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.district || "İlçe"} *</label>
                  <div className="relative">
                    <select
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-2 pr-12 rounded-xl border bg-slate-50 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                      disabled={!city}
                    >
                      <option value="" disabled>Seçiniz</option>
                      {districts.map((dist) => (
                        <option key={dist.id} value={dist.id}>{dist.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.neighborhood || "Mahalle"} *</label>
                  <div className="relative">
                    <select
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full px-4 py-2 pr-12 rounded-xl border bg-slate-50 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                      disabled={!district}
                    >
                      <option value="" disabled>Seçiniz</option>
                      {neighborhoods.map((nh) => (
                        <option key={nh.id} value={nh.id}>{nh.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.street || "Cadde"}</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="örn: Ahmet Rasim"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.alley || "Sokak"}</label>
                  <input
                    type="text"
                    value={alley}
                    onChange={(e) => setAlley(e.target.value)}
                    placeholder="örn: Ahmet Rasim Sk."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.buildingNo || "Bina No"}</label>
                  <input
                    type="text"
                    value={buildingNo}
                    onChange={(e) => setBuildingNo(e.target.value)}
                    placeholder="örn: 13"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.apartmentNo || "Daire No"}</label>
                  <input
                    type="text"
                    value={apartmentNo}
                    onChange={(e) => setApartmentNo(e.target.value)}
                    placeholder="örn: 3"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.postalCode || "Posta Kodu"}</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="34722"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
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

      {/* Student Delete Modal */}
      {showStudentDeleteModal && (
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
                Bu öğrenci kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                {selectedStudent && (
                  <span className="block font-semibold text-slate-700 mt-2">"{selectedStudent.fullName}"</span>
                )}
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowStudentDeleteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStudent}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : "Sil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Student Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">{dictionary.assignVehicleTitle || "Araca Ata"}</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAssignStudent} className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Öğrenci: <strong className="text-slate-700">{selectedStudent?.fullName}</strong>
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{dictionary.selectVehicle || "Araç Seçiniz"}</label>
                {vehicles.length > 0 ? (
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-800 transition-all bg-white"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.plate} ({v.driverName})</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-rose-500">Atama yapabilmek için önce bir araç oluşturmalısınız.</p>
                )}
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || vehicles.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? dictionary.loading : dictionary.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Students Overlay Modal */}
      {showDetailStudentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-xl w-full overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">{detailStudentsTitle}</h3>
              <button
                onClick={() => setShowDetailStudentsModal(false)}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[400px] overflow-y-auto">
              {detailStudentsList.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">Bu kategoriye ait öğrenci bulunmamaktadır.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {detailStudentsList.map((stud) => (
                    <li key={stud.id} className="py-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold text-slate-800">{stud.fullName}</p>
                        <p className="text-xs text-slate-500">{stud.school} - {stud.schoolClass} {stud.branch && `(${stud.branch})`}</p>
                      </div>
                      <div>
                        {stud.vehicleId ? (
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono text-[11px] text-slate-600">
                            {vehicles.find(v => v.id === stud.vehicleId)?.plate || "Atandı"}
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded font-semibold">
                            Havuzda
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-right">
              <button
                onClick={() => setShowDetailStudentsModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
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
