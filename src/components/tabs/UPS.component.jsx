import React, { memo, useMemo, useEffect } from 'react';
import UpsTable from '../table/UpsTable';
import '../table/ups-table.css';
// import ablyService from "../../services/ablyService";

const DEFAULT_UPS_DATA = {
  id: 'UPS-01',
  model: 'Centiel 300kVA',
  capacity: '300kVA',
  lastUpdated: '04-Feb-25 12:06:00 PM',
  status: 'UPS Output Active',
  inputVoltage: { l1: 222, l2: 224, l3: 223 },
  inputFrequency: 50.1,
  batteryVoltage: 341,
  batteryChargeLevel: 100,
  onBattery: '20:12',
  temperature: 38,
  autonomyTime: 72,
  outputVoltage: { l1: 222, l2: 224, l3: 223 },
  outputPowerA: { l1: 117, l2: 132, l3: 125 },
  outputPowerKw: { l1: 80, l2: 81, l3: 82, total: 243 },
  outputPowerPct: { l1: 29, l2: 30, l3: 32 },
  alarms: Array(12).fill(''),
};

const PHASES = ['l1', 'l2', 'l3'];

const mergePhaseValues = (base = {}, incoming = {}) => ({
  ...base,
  ...incoming,
});

const mergeUpsData = (data = {}) => ({
  ...DEFAULT_UPS_DATA,
  ...data,
  inputVoltage: mergePhaseValues(DEFAULT_UPS_DATA.inputVoltage, data.inputVoltage),
  outputVoltage: mergePhaseValues(DEFAULT_UPS_DATA.outputVoltage, data.outputVoltage),
  outputPowerA: mergePhaseValues(DEFAULT_UPS_DATA.outputPowerA, data.outputPowerA),
  outputPowerKw: { ...DEFAULT_UPS_DATA.outputPowerKw, ...data.outputPowerKw },
  outputPowerPct: mergePhaseValues(DEFAULT_UPS_DATA.outputPowerPct, data.outputPowerPct),
  alarms: Array.isArray(data.alarms) ? data.alarms : DEFAULT_UPS_DATA.alarms,
});

const hasValue = (value) => value !== undefined && value !== null && value !== '';

const formatValue = (value, suffix = '') => {
  if (!hasValue(value)) return '--';
  return `${value}${suffix}`;
};

const formatPhaseLabel = (phase) => phase.toUpperCase();

const getStatusTone = (status = '') => {
  const normalized = String(status).toLowerCase();
  if (
    normalized.includes('active') ||
    normalized.includes('normal') ||
    normalized.includes('online') ||
    normalized.includes('healthy')
  ) {
    return 'success';
  }

  if (
    normalized.includes('warning') ||
    normalized.includes('battery') ||
    normalized.includes('bypass')
  ) {
    return 'warning';
  }

  if (
    normalized.includes('fault') ||
    normalized.includes('alarm') ||
    normalized.includes('offline') ||
    normalized.includes('error')
  ) {
    return 'danger';
  }

  return 'neutral';
};

const buildPhaseRows = (label, values = {}, formatter = (value) => formatValue(value)) =>
  PHASES.map((phase, index) => ({
    cells: [
      index === 0
        ? {
            content: label,
            className: 'ups-table__metric',
            rowSpan: PHASES.length,
          }
        : null,
      {
        content: formatPhaseLabel(phase),
        className: 'ups-table__phase',
      },
      {
        content: formatter(values?.[phase]),
        className: 'ups-table__value',
      },
    ].filter(Boolean),
  }));

const buildAlarmRows = (alarms = []) =>
  Array.from({ length: Math.max(12, alarms.length || 0) }, (_, index) => {
    const alarm = alarms[index];
    return {
      cells: [
        {
          content: String(index + 1).padStart(2, '0'),
          className: 'ups-table__alarm-index',
        },
        {
          content: alarm || '--',
          className: alarm ? 'ups-table__alarm-text is-active' : 'ups-table__alarm-text',
        },
      ],
    };
  });

const UPSHeader = memo(({ id, model, capacity, lastUpdated, status }) => (
  <div className="ups-panel__header">
    <div className="ups-panel__meta">
      <div className="ups-meta-card ups-meta-card--stacked">
        <span className="ups-meta-card__value ups-meta-card__value--primary">{id || '--'}</span>
        <span className="ups-meta-card__subvalue">
          <span className={`ups-status-pill is-${getStatusTone(status)}`}>
            {status || 'Unknown'}
          </span>
        </span>
      </div>
      <div className="ups-meta-card">
        <span className="ups-meta-card__label">Model</span>
        <span className="ups-meta-card__value">{model || '--'}</span>
      </div>
      <div className="ups-meta-card">
        <span className="ups-meta-card__label">Capacity</span>
        <span className="ups-meta-card__value">{capacity || '--'}</span>
      </div>
      <div className="ups-meta-card">
        <span className="ups-meta-card__label">Time</span>
        <span className="ups-meta-card__value">{lastUpdated || '--'}</span>
      </div>
    </div>
  </div>
));

UPSHeader.displayName = 'UPSHeader';

const UPSCard = memo(({ upsData }) => {
  const measurementsRows = useMemo(
    () => [
      ...buildPhaseRows('Input Voltage (V)', upsData.inputVoltage),
      {
        cells: [
          { content: 'Input Frequency (Hz)', className: 'ups-table__metric', colSpan: 2 },
          { content: formatValue(upsData.inputFrequency), className: 'ups-table__value' },
        ],
      },
      {
        cells: [
          { content: 'Battery Voltage (V)', className: 'ups-table__metric', colSpan: 2 },
          { content: formatValue(upsData.batteryVoltage), className: 'ups-table__value' },
        ],
      },
      {
        cells: [
          { content: 'Battery Charge Level (%)', className: 'ups-table__metric', colSpan: 2 },
          { content: formatValue(upsData.batteryChargeLevel), className: 'ups-table__value' },
        ],
      },
      {
        cells: [
          { content: 'On Battery (MM:SS)', className: 'ups-table__metric', colSpan: 2 },
          { content: formatValue(upsData.onBattery), className: 'ups-table__value' },
        ],
      },
      {
        cells: [
          { content: 'Temperature (°C)', className: 'ups-table__metric', colSpan: 2 },
          { content: formatValue(upsData.temperature), className: 'ups-table__value' },
        ],
      },
      {
        cells: [
          { content: 'Autonomy Time (Minutes)', className: 'ups-table__metric', colSpan: 2 },
          { content: formatValue(upsData.autonomyTime), className: 'ups-table__value' },
        ],
      },
    ],
    [upsData]
  );

  const outputRows = useMemo(
    () => [
      ...buildPhaseRows('Output Voltage (V)', upsData.outputVoltage),
      ...buildPhaseRows('Output Power (A)', upsData.outputPowerA),
      ...buildPhaseRows('Output Power (kW)', upsData.outputPowerKw),
      {
        cells: [
          { content: 'Total Output (kW)', className: 'ups-table__metric', colSpan: 2 },
          {
            content: formatValue(upsData.outputPowerKw?.total),
            className: 'ups-table__value is-emphasis',
          },
        ],
      },
      ...buildPhaseRows('Output Power (%)', upsData.outputPowerPct, (value) =>
        formatValue(value, '%')
      ),
    ],
    [upsData]
  );

  const alarmRows = useMemo(() => buildAlarmRows(upsData.alarms), [upsData.alarms]);

  return (
    <section className="ups-panel">
      <UPSHeader
        id={upsData.id}
        model={upsData.model}
        capacity={upsData.capacity}
        lastUpdated={upsData.lastUpdated}
        status={upsData.status}
      />

      <div className="ups-panel__content">
        <UpsTable title="Measurements" rows={measurementsRows} />
        <UpsTable title="Output Statistics" rows={outputRows} />
        <UpsTable title="Alarms" rows={alarmRows} compact />
      </div>
    </section>
  );
});

UPSCard.displayName = 'UPSCard';

const normalizeUpsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item) => mergeUpsData(item));
  }

  if (data && typeof data === 'object' && Object.keys(data).length > 0) {
    return [mergeUpsData(data)];
  }

  return [mergeUpsData()];
};

const UPS = ({ data = {} }) => {
  //   useEffect(() => {
  //   ablyService.subscribeToUpsEvent((data) => {
  //     console.log('UPS Data:', data);
  //   });

  //   return () => {
  //     ablyService.unsubscribeFromChannel();
  //   };
  // }, []);
  const upsList = useMemo(() => normalizeUpsList(data), [data]);

  return (
    <div className="ups-panel-stack">
      {upsList.map((upsData, index) => (
        <UPSCard key={upsData.id || `${upsData.model || 'ups'}-${index}`} upsData={upsData} />
      ))}
    </div>
  );
};

export default UPS;
