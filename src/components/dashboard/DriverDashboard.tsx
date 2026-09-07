"use client";

import { useState, useEffect } from "react";
import Sidebar, { MenuItem } from "./ui/Sidebar";
import TopHeader from "./ui/TopHeader";
import { driverService } from "@/services";

interface DriverDashboardProps {
  dictionary: any;
  lang: string;
  user: any;
}

export default function DriverDashboard({ dictionary, lang, user }: DriverDashboardProps) {
  const [activeTab, setActiveTab] = useState("routes");
  const [passengers, setPassengers] = useState<any[]>([]);
  const [routesData, setRoutesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Drag & Drop state
  const [dragRouteIdx, setDragRouteIdx] = useState<number | null>(null);
  const [dragStudIdx, setDragStudIdx] = useState<number | null>(null);
  const [dropTargetIdx, setDropTargetIdx] = useState<number | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPassengers = async () => {
    setIsLoading(true);
    try {
      const data = await driverService.getMyPassengers();
      setPassengers(data);
    } catch (e) {
      console.error(e);
      showToast(dictionary.errorFetch || "Yolcu listesi yüklenirken hata oluştu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  // Initialize and group passengers with saved sorting order
  useEffect(() => {
    if (passengers.length > 0) {
      const grouped: Record<string, any[]> = {};
      passengers.forEach((p) => {
        if (!grouped[p.school]) {
          grouped[p.school] = [];
        }
        grouped[p.school].push(p);
      });

      const initialRoutes = Object.keys(grouped).map((schoolName) => {
        const storedOrder = localStorage.getItem(`aktur_order_${user?.emailOrPlate}_${schoolName}`);
        let studentsList = grouped[schoolName];
        if (storedOrder) {
          try {
            const orderIds = JSON.parse(storedOrder) as number[];
            studentsList = [...studentsList].sort((a, b) => {
              const indexA = orderIds.indexOf(a.id);
              const indexB = orderIds.indexOf(b.id);
              if (indexA === -1 && indexB === -1) return 0;
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            });
          } catch (e) {
            console.error("Failed to parse stored route order", e);
          }
        }
        return {
          schoolName,
          students: studentsList
        };
      });
      setRoutesData(initialRoutes);
    } else {
      setRoutesData([]);
    }
  }, [passengers, user?.emailOrPlate]);

  const moveStudent = (routeIndex: number, studentIndex: number, direction: "up" | "down") => {
    const newRoutes = [...routesData];
    const route = { ...newRoutes[routeIndex] };
    const studentsList = [...route.students];

    const targetIndex = direction === "up" ? studentIndex - 1 : studentIndex + 1;
    if (targetIndex < 0 || targetIndex >= studentsList.length) return;

    // Swap elements
    const temp = studentsList[studentIndex];
    studentsList[studentIndex] = studentsList[targetIndex];
    studentsList[targetIndex] = temp;

    route.students = studentsList;
    newRoutes[routeIndex] = route;
    setRoutesData(newRoutes);

    // Persist sorted order in localStorage
    const orderIds = studentsList.map((s: any) => s.id);
    localStorage.setItem(`aktur_order_${user?.emailOrPlate}_${route.schoolName}`, JSON.stringify(orderIds));
    showToast("Yolcu sırası güncellendi.");
  };

  // Drag & Drop handlers
  const handleDragStart = (routeIdx: number, studIdx: number) => {
    setDragRouteIdx(routeIdx);
    setDragStudIdx(studIdx);
  };

  const handleDragOver = (e: React.DragEvent, studIdx: number) => {
    e.preventDefault();
    setDropTargetIdx(studIdx);
  };

  const handleDragLeave = () => {
    setDropTargetIdx(null);
  };

  const handleDrop = (e: React.DragEvent, routeIdx: number, targetStudIdx: number) => {
    e.preventDefault();
    setDropTargetIdx(null);
    if (dragRouteIdx === null || dragStudIdx === null) return;
    if (dragRouteIdx !== routeIdx) return; // Only within same route
    if (dragStudIdx === targetStudIdx) return;

    const newRoutes = [...routesData];
    const route = { ...newRoutes[routeIdx] };
    const studentsList = [...route.students];

    // Remove dragged item and insert at target position
    const [draggedStudent] = studentsList.splice(dragStudIdx, 1);
    studentsList.splice(targetStudIdx, 0, draggedStudent);

    route.students = studentsList;
    newRoutes[routeIdx] = route;
    setRoutesData(newRoutes);

    // Persist
    const orderIds = studentsList.map((s: any) => s.id);
    localStorage.setItem(`aktur_order_${user?.emailOrPlate}_${route.schoolName}`, JSON.stringify(orderIds));
    showToast("Yolcu sırası güncellendi.");
  };

  const handleDragEnd = () => {
    setDragRouteIdx(null);
    setDragStudIdx(null);
    setDropTargetIdx(null);
  };

  const handleOpenRouteInMaps = (route: any) => {
    if (route.students.length === 0) return;
    
    // Final destination: School Name
    const destination = encodeURIComponent(route.schoolName);
    
    // Waypoints: pick-up addresses in order
    const waypoints = route.students.map((s: any) => encodeURIComponent(getFullAddress(s))).join("%7C");
    
    // Origin is left empty so Google Maps defaults to current location
    const url = `https://www.google.com/maps/dir/?api=1&origin=&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const menuItems: MenuItem[] = [
    {
      id: "routes",
      label: dictionary.menuMyRoutes || "Bugünün Rotaları",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      id: "passengers",
      label: dictionary.menuMyPassengers || "Yolcularım",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: "profile",
      label: dictionary.menuMyProfile || "Sürücü Profili",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const filteredPassengers = passengers.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFullAddress = (p: any) => {
    return `${p.neighborhood} Mh. ${p.street} Cd. ${p.alley} Sk. No:${p.buildingNo} D:${p.apartmentNo} ${p.district}/${p.city}`;
  };

  const handleOpenMap = (student: any) => {
    const address = getFullAddress(student);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center p-4 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0 ${
            toast.type === "success"
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
        <TopHeader dictionary={dictionary} user={user} title={dictionary.roleDriver || "Sürücü"} />

        <div className="p-8 overflow-y-auto flex-1">
          {/* Routes Tab */}
          {activeTab === "routes" && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuMyRoutes || "Bugünün Rotaları"}</h2>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse h-60"></div>
                  ))}
                </div>
              ) : routesData.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm max-w-lg mx-auto mt-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-semibold">{dictionary.driverRouteEmpty || "Bugün için atanmış yolcu bulunmamaktadır."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {routesData.map((route: any, routeIdx: number) => (
                    <div key={routeIdx} className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33L12 5.5l-7.5 4.83V21h15z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800 text-lg leading-snug">{route.schoolName}</h3>
                              <p className="text-xs text-slate-400 font-medium">Hedef Okul</p>
                            </div>
                          </div>
                          <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-xs">
                            {route.students.length} Yolcu
                          </span>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplanma Sıralaması (Sürükle/Sırala)</p>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-semibold">Sıra ilk binecek öğrenciden başlar</span>
                          </div>
                          
                          <ul className="space-y-3">
                            {route.students.map((stud: any, studIdx: number) => (
                              <li
                                key={stud.id}
                                draggable
                                onDragStart={() => handleDragStart(routeIdx, studIdx)}
                                onDragOver={(e) => handleDragOver(e, studIdx)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, routeIdx, studIdx)}
                                onDragEnd={handleDragEnd}
                                className={`p-3 bg-slate-50 border rounded-xl flex items-center justify-between transition-all cursor-grab active:cursor-grabbing ${
                                  dragRouteIdx === routeIdx && dragStudIdx === studIdx
                                    ? "opacity-40 border-slate-300 scale-[0.98]"
                                    : dropTargetIdx === studIdx && dragRouteIdx === routeIdx
                                    ? "border-indigo-400 bg-indigo-50/50 shadow-sm"
                                    : "border-slate-100 hover:bg-slate-100/40"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  {/* Drag Handle */}
                                  <div className="flex flex-col items-center justify-center text-slate-300 hover:text-slate-500 transition-colors" title="Sürükle">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <circle cx="9" cy="5" r="1.5" />
                                      <circle cx="15" cy="5" r="1.5" />
                                      <circle cx="9" cy="12" r="1.5" />
                                      <circle cx="15" cy="12" r="1.5" />
                                      <circle cx="9" cy="19" r="1.5" />
                                      <circle cx="15" cy="19" r="1.5" />
                                    </svg>
                                  </div>
                                  {/* Order Badge */}
                                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                                    {studIdx + 1}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-800 leading-snug">{stud.fullName}</p>
                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{stud.schoolClass} {stud.branch && `(${stud.branch})`}</p>
                                    <p className="text-[11px] text-slate-500 font-normal mt-1 leading-normal max-w-xs">{getFullAddress(stud)}</p>
                                  </div>
                                </div>

                                {/* Sorting & Single Actions */}
                                <div className="flex items-center space-x-2">
                                  <div className="flex flex-col space-y-1">
                                    <button
                                      disabled={studIdx === 0}
                                      onClick={() => moveStudent(routeIdx, studIdx, "up")}
                                      className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-600 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                                      title="Yukarı Taşı"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                      </svg>
                                    </button>
                                    <button
                                      disabled={studIdx === route.students.length - 1}
                                      onClick={() => moveStudent(routeIdx, studIdx, "down")}
                                      className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-600 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                                      title="Aşağı Taşı"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Map Generation Button */}
                      <div className="border-t border-slate-100 pt-6 mt-6">
                        <button
                          onClick={() => handleOpenRouteInMaps(route)}
                          className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Rotayı Haritada Aç ve Yolculuğa Başla
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Passengers Tab */}
          {activeTab === "passengers" && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuMyPassengers || "Yolcularım"}</h2>

              {/* Search filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center">
                <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Yolcu adı veya okul ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredPassengers.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-slate-500 text-sm">Yolcu kaydı bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Yolcu Adı</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Okul</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sınıf/Şube</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Adres Bilgisi</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Navigasyon</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPassengers.map((student: any) => (
                          <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{student.fullName}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{student.school}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{student.schoolClass} {student.branch && `(${student.branch})`}</td>
                            <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate" title={getFullAddress(student)}>
                              {getFullAddress(student)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleOpenMap(student)}
                                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Haritada Aç
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

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="animate-fade-in space-y-6 max-w-xl">
              <h2 className="text-2xl font-bold text-slate-800">{dictionary.menuMyProfile || "Sürücü Profili"}</h2>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md shadow-indigo-600/20">
                    {user?.name ? user.name.substring(0, 2) : "SR"}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{user?.name || "Sürücü"}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {dictionary.roleDriver || "Servis Sürücüsü"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Araç Plakası</p>
                    <span className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg font-mono font-bold text-slate-700 text-sm inline-block">
                      {user?.emailOrPlate || "Atanmamış"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kullanıcı Rolü</p>
                    <p className="text-sm font-semibold text-slate-700">Araç Sürücüsü / Şoför</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
