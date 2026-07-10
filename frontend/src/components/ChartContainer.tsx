import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
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

  // Predicted water quality data
  const qualityData = [
    { name: 'Turbidity', turbidity: data.predicted_turbidity, color: COLORS.primary },
    { name: 'Iron', iron: data.predicted_iron, color: COLORS.secondary },
    { name: 'Manganese', manganese: data.predicted_manganese, color: COLORS.accent },
    { name: 'Ammonia', ammonia: data.predicted_ammonia, color: COLORS.info },
    { name: 'pH', ph: data.predicted_ph, color: COLORS.danger }
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

  // Find x-axis key dynamically
  const axisKey = ['turbidity', 'iron', 'manganese', 'ammonia', 'ph'].find(key =>
    'turbidity' in data ||
    'iron' in data ||
    'manganese' in data ||
    'ammonia' in data ||
    'ph' in data
  ) as string | undefined;

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
                formatter={(value: any) => {
                  const entry = dosageData.find(d => d.name === value.name);
                  return [
                    <p>{value.name}</p>,
                    <p>{value.value} mg/L</p>,
                    <p>{entry?.formula || ''}</p>
                  ];
                }}
              >
                {(props) => (
                  <div style={{ fontSize: '12px' }}>
                    <p>{props.activePayload?.name}</p>
                    <p>{props.activePayload?.value} mg/L</p>
                    {props.activePayload?.name === 'Alum' && (
                      <p>Formula: Alum = 15 + 0.40×Turbidity (clamped 10-150 mg/L)</p>
                    )}
                    {props.activePayload?.name === 'Soda Ash' && (
                      <p>Formula: Soda Ash = 1.01×(20 - Alkalinity Remaining)</p>
                    )}
                    {props.activePayload?.name === 'Chlorine' && (
                      <p>Formula: Cl₂ = Oxidation + Demand + Residual</p>
                    )}
                  </div>
                )}
              </Tooltip>
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="value" fill="#8884d8" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Predicted Water Quality Metrics Line Chart */}
        <div className="chart-section">
          <h3>Predicted Water Quality Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={axisKey || 'name'} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '8px'
                }}
              >
                {(props) => (
                  <div style={{ fontSize: '12px' }}>
                    <p>{props.activePayload?.name}</p>
                    <p>
                      {props.activePayload?.name === 'Turbidity'
                        ? `${props.activePayload?.turbidity} NTU`
                        : props.activePayload?.name === 'Iron'
                        ? `${props.activePayload?.iron} mg/L`
                        : props.activePayload?.name === 'Manganese'
                        ? `${props.activePayload?.manganese} mg/L`
                        : props.activePayload?.name === 'Ammonia'
                        ? `${props.activePayload?.ammonia} mg/L`
                        : props.activePayload?.name === 'pH'
                        ? `${props.activePayload?.ph} pH`
                        : ''
                    }
                    </p>
                    <p>
                      {props.activePayload?.name === 'Turbidity'
                        ? 'WHO Limit: < 1.0 NTU (preferred)'
                        : props.activePayload?.name === 'Iron'
                        ? 'WHO Limit: < 0.3 mg/L'
                        : props.activePayload?.name === 'Manganese'
                        ? 'WHO Limit: < 0.1 mg/L'
                        : props.activePayload?.name === 'Ammonia'
                        ? 'WHO Limit: < 1.5 mg/L'
                        : props.activePayload?.name === 'pH'
                        ? 'WHO Range: 6.5 - 8.5 pH'
                        : ''
                    }
                    </p>
                  </div>
                )}
              </Tooltip>
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="turbidity" stroke={COLORS.primary} name="NTU" dot={false} />
              <Line type="monotone" dataKey="iron" stroke={COLORS.secondary} name="Iron (mg/L)" dot={false} />
              <Line type="monotone" dataKey="manganese" stroke={COLORS.accent} name="Manganese (mg/L)" dot={false} />
              <Line type="monotone" dataKey="ammonia" stroke={COLORS.info} name="Ammonia (mg/L)" dot={false} />
              <Line type="monotone" dataKey="ph" stroke={COLORS.danger} name="pH" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Compliance Radar Chart */}
        <div className="chart-section">
          <h3>Compliance Status Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 100]} />
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
              <Cell fill={COLORS.primary} dataKey="value" />
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
                fill="#00C49F"
              >
                <Cell fill={(props) => (props.payload.name === 'Confidence' ? '#8884d8' : '#ECF0F1')} />
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