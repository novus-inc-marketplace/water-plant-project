import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from 'recharts';

interface ChemicalDosage {
  alum_dose: number;
  soda_ash_dose: number;
  chlorine_dose: number;
  predicted_turbidity: number;
  predicted_iron: number;
  predicted_manganese: number;
  predicted_ammonia: number;
  predicted_ph: number;
  compliance_status: string;
  confidence_index: number;
};

type Props = {
  data: ChemicalDosage;
};

const COLORS = {
  primary: '#0088FE',
  secondary: '#00C49F',
  accent: '#FFBB28',
  danger: '#E74C3C',
  success: '#2ECC71',
  info: '#2980B9'
};

export const ChartContainer: React.FC<Props> = ({ data }) => {
  // Dosage bar chart data
  const dosageData = [
    { name: 'Alum', value: data.alum_dose, color: COLORS.primary },
    { name: 'Soda Ash', value: data.soda_ash_dose, color: COLORS.secondary },
    { name: 'Chlorine', value: data.chlorine_dose, color: COLORS.accent }
  ];

  // Predicted water quality data (single value per metric, with unit + WHO limit)
  const qualityData = [
    { name: 'Turbidity', value: data.predicted_turbidity, unit: 'NTU', limit: 'WHO Limit: < 1.0 NTU (preferred)', color: COLORS.primary },
    { name: 'Iron', value: data.predicted_iron, unit: 'mg/L', limit: 'WHO Limit: < 0.3 mg/L', color: COLORS.secondary },
    { name: 'Manganese', value: data.predicted_manganese, unit: 'mg/L', limit: 'WHO Limit: < 0.1 mg/L', color: COLORS.accent },
    { name: 'Ammonia', value: data.predicted_ammonia, unit: 'mg/L', limit: 'WHO Limit: < 1.5 mg/L', color: COLORS.info },
    { name: 'pH', value: data.predicted_ph, unit: 'pH', limit: 'WHO Range: 6.5 - 8.5 pH', color: COLORS.danger }
  ];

  // Compliance radar chart data
  const complianceRadarData = [
    { subject: 'Turbidity', value: data.compliance_status === 'PASS' ? 100 : 50 },
    { subject: 'Iron', value: data.compliance_status === 'PASS' ? 100 : 50 },
    { subject: 'Manganese', value: data.compliance_status === 'PASS' ? 100 : 50 },
    { subject: 'Ammonia', value: data.compliance_status === 'PASS' ? 100 : 50 },
    { subject: 'pH', value: data.compliance_status === 'PASS' ? 100 : 50 }
  ];

  // Confidence pie chart data
  const confidenceData = [
    { name: 'Confidence', value: data.confidence_index },
    { name: 'Remaining', value: 100 - data.confidence_index }
  ];

  return (
    <div className="chart-container">
      <div className="charts-grid">
        {/* 1. Chemical Dosage Bar Chart */}
        <div className="chart-section">
          <h3>Chemical Dosages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dosageData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `${value} mg/L`} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '8px'
                }}
              >
                {(props) => {
                  const entry = props.activePayload?.[0]?.payload as
                    | typeof dosageData[number]
                    | undefined;
                  if (!entry) return null;
                  return (
                    <div style={{ fontSize: '12px' }}>
                      <p><strong>{entry.name}</strong></p>
                      <p>{entry.value} mg/L</p>
                    </div>
                  );
                }}
              </Tooltip>
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="value" radius={4}>
                {dosageData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Predicted Water Quality Metrics Bar Chart */}
        <div className="chart-section">
          <h3>Predicted Water Quality Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={qualityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '8px'
                }}
              >
                {(props) => {
                  const entry = props.activePayload?.[0]?.payload as
                    | typeof qualityData[number]
                    | undefined;
                  if (!entry) return null;
                  return (
                    <div style={{ fontSize: '12px' }}>
                      <p><strong>{entry.name}</strong></p>
                      <p>{entry.value} {entry.unit}</p>
                      <p>{entry.limit}</p>
                    </div>
                  );
                }}
              </Tooltip>
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="value" radius={4} label={{ position: 'top', fontSize: 11, fill: '#333' }}>
                {qualityData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Compliance Radar Chart */}
        <div className="chart-section">
          <h3>Compliance Status Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={complianceRadarData} outerRadius="80%">
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Compliance"
                dataKey="value"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.6}
              />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '8px' }}>
                {(props) => {
                  const entry = complianceRadarData.find(r => r.subject === props.activePayload?.subject);
                  return (
                    <div style={{ fontSize: '12px' }}>
                      <p>{entry?.subject}</p>
                      <p>{props.activePayload?.value}%</p>
                      <p>
                        {entry?.subject === 'Turbidity'
                          ? 'Drinking Standard: < 1.0 NTU (preferred)'
                          : entry?.subject === 'Iron'
                          ? 'Drinking Standard: < 0.3 mg/L'
                          : entry?.subject === 'Manganese'
                          ? 'Drinking Standard: < 0.1 mg/L'
                          : entry?.subject === 'Ammonia'
                          ? 'Drinking Standard: < 1.5 mg/L'
                          : 'Optimal: 6.5 - 8.5 pH'
                        }
                      </p>
                    </div>
                  );
                }}
              </Tooltip>
              <Legend verticalAlign="top" height={36} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Confidence Index Pie Chart */}
        <div className="chart-section">
          <h3>Model Confidence Index</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={confidenceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                startAngle={180}
                endAngle={360}
                dataKey="value"
                fill="#8884d8"
                label={(value) => `${value.name}: ${value.value}%`}
                labelRadius={16}
              >
                {confidenceData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.name === 'Confidence' ? '#8884d8' : '#ECF0F1'} />
                ))}
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '8px' }}>
                  {(props) => (
                    <div style={{ fontSize: '14px' }}>
                      <p>{props.activePayload?.name}</p>
                      <p>{props.activePayload?.value}%</p>
                      <p>
                        {props.activePayload?.name === 'Confidence'
                          ? `Level: ${data.confidence_index >= 90 ? 'High' : data.confidence_index >= 70 ? 'Moderate' : data.confidence_index >= 50 ? 'Low' : 'Preliminary'}`
                          : ''}
                      </p>
                    </div>
                  )}
                </Tooltip>
                <Legend verticalAlign="top" height={36} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
