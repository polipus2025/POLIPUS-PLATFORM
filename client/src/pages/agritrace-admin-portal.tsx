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

              {activeTab === 'features' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
                    AgriTrace360™ Administrative Features
                  </h3>
                  
                  {/* Agricultural Module Controls */}
                  <div style={{ marginBottom: '32px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                      Agricultural Module Controls
                    </h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {[
                        { name: 'Farmer Registration Management', description: 'Enable/disable new farmer registrations', enabled: true },
                        { name: 'Crop Scheduling Override', description: 'Manually adjust crop schedules system-wide', enabled: true },
                        { name: 'Harvest Validation Controls', description: 'Set automated vs manual harvest approval', enabled: false },
                        { name: 'Batch Code Generation', description: 'Configure automatic batch code formats', enabled: true }
                      ].map((feature, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: '#fafafa'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                              {feature.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {feature.description}
                            </div>
                          </div>
                          <div style={{
                            width: '40px',
                            height: '20px',
                            borderRadius: '10px',
                            backgroundColor: feature.enabled ? '#10b981' : '#d1d5db',
                            position: 'relative',
                            cursor: 'pointer'
                          }}>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              position: 'absolute',
                              top: '2px',
                              left: feature.enabled ? '22px' : '2px',
                              transition: 'left 0.2s'
                            }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance & Monitoring Features */}
                  <div style={{ marginBottom: '32px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                      Compliance & Monitoring Features
                    </h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {[
                        { name: 'EUDR Compliance Monitoring', description: 'Real-time environmental compliance tracking', enabled: true },
                        { name: 'Quality Assurance Settings', description: 'Configure quality thresholds and standards', enabled: true },
                        { name: 'GPS Boundary Validation', description: 'Enable/disable strict GPS coordinate checking', enabled: false },
                        { name: 'Document Verification Rules', description: 'Set requirements for farm documentation', enabled: true }
                      ].map((feature, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: '#fafafa'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                              {feature.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {feature.description}
                            </div>
                          </div>
                          <div style={{
                            width: '40px',
                            height: '20px',
                            borderRadius: '10px',
                            backgroundColor: feature.enabled ? '#10b981' : '#d1d5db',
                            position: 'relative',
                            cursor: 'pointer'
                          }}>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              position: 'absolute',
                              top: '2px',
                              left: feature.enabled ? '22px' : '2px',
                              transition: 'left 0.2s'
                            }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Management Controls */}
                  <div style={{ marginBottom: '32px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                      Data Management Controls
                    </h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {[
                        { name: 'Export Report Automation', description: 'Schedule automated PDF report generation', enabled: true },
                        { name: 'Database Backup Controls', description: 'Configure AgriTrace data backup schedules', enabled: true },
                        { name: 'Audit Trail Management', description: 'Set retention periods for audit logs', enabled: true },
                        { name: 'Performance Optimization', description: 'Enable/disable resource-intensive features', enabled: false }
                      ].map((feature, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: '#fafafa'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                              {feature.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {feature.description}
                            </div>
                          </div>
                          <div style={{
                            width: '40px',
                            height: '20px',
                            borderRadius: '10px',
                            backgroundColor: feature.enabled ? '#10b981' : '#d1d5db',
                            position: 'relative',
                            cursor: 'pointer'
                          }}>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              position: 'absolute',
                              top: '2px',
                              left: feature.enabled ? '22px' : '2px',
                              transition: 'left 0.2s'
                            }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Access Controls */}
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                      User Access Controls
                    </h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {[
                        { name: 'Farmer Portal Restrictions', description: 'Control which features farmers can access', enabled: true },
                        { name: 'Inspector Assignment Rules', description: 'Configure automatic inspector assignments', enabled: true },
                        { name: 'Communication Settings', description: 'Enable/disable messaging between user types', enabled: true },
                        { name: 'Role-Based Permissions', description: 'Fine-tune access levels for different user roles', enabled: false }
                      ].map((feature, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: '#fafafa'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                              {feature.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {feature.description}
                            </div>
                          </div>
                          <div style={{
                            width: '40px',
                            height: '20px',
                            borderRadius: '10px',
                            backgroundColor: feature.enabled ? '#10b981' : '#d1d5db',
                            position: 'relative',
                            cursor: 'pointer'
                          }}>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              position: 'absolute',
                              top: '2px',
                              left: feature.enabled ? '22px' : '2px',
                              transition: 'left 0.2s'
                            }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'controls' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
                    AgriTrace360™ System Controls
                  </h3>
                  
                  {/* Emergency Controls */}
                  <div style={{ marginBottom: '32px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', marginBottom: '16px' }}>
                      Emergency Controls
                    </h4>
                    <div style={{
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ fontSize: '14px', color: '#dc2626', margin: 0 }}>
                        These controls should only be used in emergency situations. All actions are logged and audited.
                      </p>
                    </div>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {[
                        { name: 'Suspend All Farmer Registrations', description: 'Temporarily halt new farmer onboarding', action: 'Suspend', color: '#dc2626' },
                        { name: 'Freeze Harvest Processing', description: 'Stop all harvest validation and batch generation', action: 'Freeze', color: '#dc2626' },
                        { name: 'Enable Maintenance Mode', description: 'Put AgriTrace in maintenance mode', action: 'Enable', color: '#f59e0b' },
                        { name: 'Reset System Cache', description: 'Clear all cached data and restart services', action: 'Reset', color: '#3b82f6' }
                      ].map((control, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: 'white'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                              {control.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {control.description}
                            </div>
                          </div>
                          <button style={{
                            padding: '8px 16px',
                            backgroundColor: control.color,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>
                            {control.action}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Operations */}
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                      System Operations
                    </h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {[
                        { name: 'Generate System Report', description: 'Create comprehensive AgriTrace status report', action: 'Generate', color: '#10b981' },
                        { name: 'Backup Database', description: 'Create manual backup of AgriTrace data', action: 'Backup', color: '#3b82f6' },
                        { name: 'Refresh Configurations', description: 'Reload all system configurations', action: 'Refresh', color: '#6b7280' },
                        { name: 'Test Integrations', description: 'Verify all external service connections', action: 'Test', color: '#f59e0b' }
                      ].map((operation, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: 'white'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                              {operation.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {operation.description}
                            </div>
                          </div>
                          <button style={{
                            padding: '8px 16px',
                            backgroundColor: operation.color,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>
                            {operation.action}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}