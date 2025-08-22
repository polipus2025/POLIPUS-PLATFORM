import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

interface AgriTraceDashboardData {
  systemInfo: {
    platform: string;
    module: string;
    scope: string;
    adminType: string;
    version: string;
    lastUpdated: string;
  };
  systemHealth: {
    status: string;
    uptime: number;
    memory: any;
    cpu: number[];
    moduleSpecific: string;
  };
  recentActivity: any[];
  activeFeatures: any[];
  activeControls: any[];
  performanceOverview: {
    avgResponseTime: number;
    errorRate: number;
    throughput: number;
  };
  restrictions: {
    platformAccess: boolean;
    otherModules: boolean;
    globalControls: boolean;
    crossModuleData: boolean;
  };
  capabilities: string[];
}

export default function AgriTraceAdminPortal() {
  const [dashboardData, setDashboardData] = useState<AgriTraceDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");

  const userInfo = {
    username: localStorage.getItem("username") || "agritrace.admin",
    role: localStorage.getItem("userRole") || "system_administrator",
    scope: localStorage.getItem("adminScope") || "AgriTrace360™ Module Only"
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch('/api/agritrace-admin/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch dashboard data";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    localStorage.removeItem("adminScope");
    
    window.location.href = "/";
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #10b981',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', margin: '0 0 8px' }}>
            Loading AgriTrace Control Center...
          </h2>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Helmet>
        <title>AgriTrace System Administrator - Control Center</title>
        <meta name="description" content="AgriTrace360™ agricultural traceability system administration" />
      </Helmet>

      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <img 
                src={lacraLogo} 
                alt="LACRA Official Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#111827', 
                margin: '0 0 4px' 
              }}>
                AgriTrace Control Center
              </h1>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: 0 
              }}>
                Agricultural Traceability System Administration
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#111827', 
                margin: '0 0 2px' 
              }}>
                {userInfo.username}
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                margin: 0 
              }}>
                {userInfo.scope}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                color: '#374151',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#dc2626'
          }}>
            {error}
          </div>
        )}

        {/* System Information Cards */}
        {dashboardData && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    margin: 0 
                  }}>
                    System Status
                  </h3>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%'
                  }}></div>
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#10b981',
                  marginBottom: '4px'
                }}>
                  Healthy
                </div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  margin: 0 
                }}>
                  AgriTrace Module Only
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    margin: 0 
                  }}>
                    Uptime
                  </h3>
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#3b82f6',
                  marginBottom: '4px'
                }}>
                  {formatUptime(dashboardData.systemHealth.uptime)}
                </div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  margin: 0 
                }}>
                  Continuous operation
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    margin: 0 
                  }}>
                    Memory Usage
                  </h3>
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#f59e0b',
                  marginBottom: '4px'
                }}>
                  {formatMemory(dashboardData.systemHealth.memory.heapUsed)}
                </div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  margin: 0 
                }}>
                  of {formatMemory(dashboardData.systemHealth.memory.heapTotal)}
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    margin: 0 
                  }}>
                    Admin Scope
                  </h3>
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#10b981',
                  marginBottom: '4px'
                }}>
                  Limited
                </div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  margin: 0 
                }}>
                  AgriTrace Only
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '24px'
              }}>
                {['overview', 'system', 'features', 'controls', 'restrictions'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '12px 24px',
                      borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: activeTab === tab ? '#3b82f6' : '#6b7280',
                      fontWeight: activeTab === tab ? '600' : '400',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      fontSize: '14px'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                      System Information
                    </h3>
                    <div style={{ space: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Platform:</span>
                        <span style={{ fontSize: '14px' }}>{dashboardData.systemInfo.platform}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Module:</span>
                        <span style={{ fontSize: '14px' }}>{dashboardData.systemInfo.module}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Admin Type:</span>
                        <span style={{ 
                          fontSize: '12px', 
                          padding: '2px 8px', 
                          backgroundColor: '#f3f4f6', 
                          borderRadius: '4px' 
                        }}>
                          {dashboardData.systemInfo.adminType}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Version:</span>
                        <span style={{ fontSize: '14px' }}>{dashboardData.systemInfo.version}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                      AgriTrace Capabilities
                    </h3>
                    <div style={{ space: '8px' }}>
                      {dashboardData.capabilities.map((capability, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#10b981',
                            borderRadius: '50%'
                          }}></div>
                          <span style={{ fontSize: '14px' }}>{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'restrictions' && (
                <div>
                  <div style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                    color: '#92400e'
                  }}>
                    This administrator has limited scope - AgriTrace agricultural module only.
                  </div>

                  <div style={{ space: '16px' }}>
                    {[
                      { label: 'Polipus Platform Access', status: 'Restricted', color: '#dc2626' },
                      { label: 'Other Module Access', status: 'Restricted', color: '#dc2626' },
                      { label: 'Global System Controls', status: 'Restricted', color: '#dc2626' },
                      { label: 'Cross-Module Data', status: 'Restricted', color: '#dc2626' },
                      { label: 'AgriTrace Administration', status: 'Allowed', color: '#10b981' }
                    ].map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
                        <span style={{
                          fontSize: '12px',
                          padding: '4px 12px',
                          backgroundColor: item.color,
                          color: 'white',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    AgriTrace System Health
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '48px', 
                        fontWeight: 'bold', 
                        color: '#10b981', 
                        marginBottom: '8px' 
                      }}>
                        {dashboardData.systemHealth.status.toUpperCase()}
                      </div>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>Overall Status</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '48px', 
                        fontWeight: 'bold', 
                        color: '#3b82f6', 
                        marginBottom: '8px' 
                      }}>
                        {dashboardData.systemHealth.cpu[0]?.toFixed(2) || "0.00"}
                      </div>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>CPU Load</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '48px', 
                        fontWeight: 'bold', 
                        color: '#f59e0b', 
                        marginBottom: '8px' 
                      }}>
                        {formatMemory(dashboardData.systemHealth.memory.heapUsed)}
                      </div>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>Memory Used</p>
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === 'features' || activeTab === 'controls') && (
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '50%',
                    margin: '0 auto 16px'
                  }}></div>
                  <p style={{ color: '#6b7280' }}>
                    No active AgriTrace {activeTab} to display
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}