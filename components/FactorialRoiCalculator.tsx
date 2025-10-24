import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

// Helper: currency formatting
const fmt = (n: number, currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);

// Presets for quick scenario planning
const PRESETS = {
  conservative: {
    minutesSavedPerEmployeePerMonth: 20,
    managerHoursSavedPerMonth: 1,
  },
  base: {
    minutesSavedPerEmployeePerMonth: 40,
    managerHoursSavedPerMonth: 2,
  },
  aggressive: {
    minutesSavedPerEmployeePerMonth: 60,
    managerHoursSavedPerMonth: 4,
  },
} as const;

type PresetKey = keyof typeof PRESETS;

export default function FactorialRoiCalculator() {
  const [currency, setCurrency] = useState<string>("EUR");
  const [employees, setEmployees] = useState<number>(150);
  const [pricePerEmployee, setPricePerEmployee] = useState<number>(8); // monthly price per employee
  const [hrHourly, setHrHourly] = useState<number>(35);
  const [managersEnabled, setManagersEnabled] = useState<boolean>(true);
  const [managerCount, setManagerCount] = useState<number>(12);
  const [managerHourly, setManagerHourly] = useState<number>(45);
  const [minutesSavedPerEmployeePerMonth, setMinutesSavedPerEmployeePerMonth] = useState<number>(PRESETS.base.minutesSavedPerEmployeePerMonth);
  const [managerHoursSavedPerMonth, setManagerHoursSavedPerMonth] = useState<number>(PRESETS.base.managerHoursSavedPerMonth);
  const [otherSavingsMonthly, setOtherSavingsMonthly] = useState<number>(600); // tool consolidation, error reduction, compliance, etc.
  const [oneTimeImplementation, setOneTimeImplementation] = useState<number>(0);
  const [applyPreset, setApplyPreset] = useState<PresetKey>("base");

  // Derived calculations
  const monthlySoftwareCost = useMemo(() => employees * pricePerEmployee, [employees, pricePerEmployee]);
  const annualSoftwareCost = useMemo(() => monthlySoftwareCost * 12, [monthlySoftwareCost]);
  const annualTotalCostY1 = useMemo(() => annualSoftwareCost + oneTimeImplementation, [annualSoftwareCost, oneTimeImplementation]);

  const adminHoursSavedPerMonth = useMemo(() => (minutesSavedPerEmployeePerMonth / 60) * employees, [minutesSavedPerEmployeePerMonth, employees]);
  const adminSavingsMonthly = useMemo(() => adminHoursSavedPerMonth * hrHourly, [adminHoursSavedPerMonth, hrHourly]);

  const managerSavingsMonthly = useMemo(() => (managersEnabled ? managerCount * managerHoursSavedPerMonth * managerHourly : 0), [managersEnabled, managerCount, managerHoursSavedPerMonth, managerHourly]);

  const totalSavingsMonthly = useMemo(() => adminSavingsMonthly + managerSavingsMonthly + otherSavingsMonthly, [adminSavingsMonthly, managerSavingsMonthly, otherSavingsMonthly]);
  const totalSavingsAnnual = useMemo(() => totalSavingsMonthly * 12, [totalSavingsMonthly]);

  const netBenefitY1 = useMemo(() => totalSavingsAnnual - annualTotalCostY1, [totalSavingsAnnual, annualTotalCostY1]);
  const netBenefitY2Plus = useMemo(() => totalSavingsAnnual - annualSoftwareCost, [totalSavingsAnnual, annualSoftwareCost]);

  const roiY1 = useMemo(() => (annualTotalCostY1 === 0 ? 0 : (netBenefitY1 / annualTotalCostY1) * 100), [netBenefitY1, annualTotalCostY1]);
  const roiY2Plus = useMemo(() => (annualSoftwareCost === 0 ? 0 : (netBenefitY2Plus / annualSoftwareCost) * 100), [netBenefitY2Plus, annualSoftwareCost]);

  // Payback period in months using monthly view and including one-time cost
  const monthlyCostIncludingOneTimeSpread = useMemo(() => monthlySoftwareCost, [monthlySoftwareCost]);
  const paybackMonths = useMemo(() => {
    const monthlyNet = totalSavingsMonthly - monthlyCostIncludingOneTimeSpread;
    if (monthlyNet <= 0) return Infinity;
    // months to recover one-time cost
    const monthsForOneTime = oneTimeImplementation / monthlyNet;
    return monthsForOneTime;
  }, [totalSavingsMonthly, monthlyCostIncludingOneTimeSpread, oneTimeImplementation]);

  const chartData = useMemo(() => (
    [
      { name: "Annual Savings", value: totalSavingsAnnual },
      { name: "Annual Cost (Y1)", value: annualTotalCostY1 },
      { name: "Annual Cost (Y2+)", value: annualSoftwareCost },
    ]
  ), [totalSavingsAnnual, annualTotalCostY1, annualSoftwareCost]);

  const handlePresetChange = (key: PresetKey) => {
    setApplyPreset(key);
    setMinutesSavedPerEmployeePerMonth(PRESETS[key].minutesSavedPerEmployeePerMonth);
    setManagerHoursSavedPerMonth(PRESETS[key].managerHoursSavedPerMonth);
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Factorial ROI Calculator</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">Estimate payback, annual savings, and ROI when adopting Factorial for HR and people ops. Adjust the assumptions to match your org.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Currency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="AUD">AUD (A$)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Label className="text-xs md:text-sm">Preset</Label>
              <Select value={applyPreset} onValueChange={(v) => handlePresetChange(v as PresetKey)}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Inputs grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-lg font-medium">Team & Pricing</h2>
              <div className="space-y-3">
                <LabeledNumber label="Employees" value={employees} setValue={setEmployees} min={1} step={1} />
                <LabeledNumber label={`Price / employee / month (${currency})`} value={pricePerEmployee} setValue={setPricePerEmployee} min={0} step={1} />
                <LabeledNumber label={`One-time implementation (${currency})`} value={oneTimeImplementation} setValue={setOneTimeImplementation} min={0} step={100} />
              </div>
              <Divider />
              <h3 className="text-sm font-medium text-gray-700">HR Admin Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabeledNumber label={`HR hourly cost (${currency})`} value={hrHourly} setValue={setHrHourly} min={0} step={1} />
                <div>
                  <Label className="text-sm">Minutes saved / employee / month</Label>
                  <Slider value={[minutesSavedPerEmployeePerMonth]} onValueChange={(v) => setMinutesSavedPerEmployeePerMonth(v[0])} min={0} max={120} step={5} className="mt-3" />
                  <div className="text-xs text-gray-600 mt-1">{minutesSavedPerEmployeePerMonth} min / employee / month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-lg font-medium">Manager Time & Other Savings</h2>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Include manager time savings</Label>
                <Switch checked={managersEnabled} onCheckedChange={setManagersEnabled} />
              </div>
              {managersEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabeledNumber label="Managers" value={managerCount} setValue={setManagerCount} min={0} step={1} />
                  <LabeledNumber label={`Manager hourly cost (${currency})`} value={managerHourly} setValue={setManagerHourly} min={0} step={1} />
                  <LabeledNumber label="Manager hours saved / month" value={managerHoursSavedPerMonth} setValue={setManagerHoursSavedPerMonth} min={0} step={0.5} />
                </div>
              )}
              <Divider />
              <LabeledNumber label={`Other savings (monthly) (${currency})`} value={otherSavingsMonthly} setValue={setOtherSavingsMonthly} min={0} step={50} help="Tool consolidation, error reduction, avoided fines, reduced overtime, etc." />
              <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600 flex gap-2"><Info className="w-4 h-4 mt-[2px]" />Adjust these to your reality. You can export figures below.</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-lg font-medium">Summary</h2>
              <SummaryRow label="Software cost (annual)">{fmt(annualSoftwareCost, currency)}</SummaryRow>
              {oneTimeImplementation > 0 && (
                <SummaryRow label="One-time implementation (Y1)">{fmt(oneTimeImplementation, currency)}</SummaryRow>
              )}
              <SummaryRow label="Total cost (Y1)"><strong>{fmt(annualTotalCostY1, currency)}</strong></SummaryRow>
              <Divider />
              <SummaryRow label="Admin savings (annual)">{fmt(adminSavingsMonthly * 12, currency)}</SummaryRow>
              {managersEnabled && (
                <SummaryRow label="Manager savings (annual)">{fmt(managerSavingsMonthly * 12, currency)}</SummaryRow>
              )}
              <SummaryRow label="Other savings (annual)">{fmt(otherSavingsMonthly * 12, currency)}</SummaryRow>
              <SummaryRow label="Total savings (annual)"><strong>{fmt(totalSavingsAnnual, currency)}</strong></SummaryRow>
              <Divider />
              <SummaryRow label="Net benefit (Y1)"><strong>{fmt(netBenefitY1, currency)}</strong></SummaryRow>
              <SummaryRow label="Net benefit (Y2+)"><strong>{fmt(netBenefitY2Plus, currency)}</strong></SummaryRow>
              <SummaryRow label="ROI (Y1)"><strong>{Number.isFinite(roiY1) ? `${roiY1.toFixed(0)}%` : "—"}</strong></SummaryRow>
              <SummaryRow label="ROI (Y2+)"><strong>{Number.isFinite(roiY2Plus) ? `${roiY2Plus.toFixed(0)}%` : "—"}</strong></SummaryRow>
              <SummaryRow label="Payback period">
                <strong>{Number.isFinite(paybackMonths) ? `${paybackMonths.toFixed(1)} months` : "> 24 months (adjust assumptions)"}</strong>
              </SummaryRow>
              <div className="pt-2 text-xs text-gray-600">Payback uses monthly savings vs monthly software cost and recovers any one-time cost.</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="rounded-2xl shadow-sm mt-6">
          <CardContent className="p-6">
            <h3 className="text-base font-medium mb-4">Cost vs Savings (Annual)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis tickFormatter={(v) => fmt(v, currency)} width={100} />
                  <Tooltip formatter={(v: number) => fmt(v, currency)} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Export */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => exportCSV({
            currency,
            employees,
            pricePerEmployee,
            oneTimeImplementation,
            hrHourly,
            minutesSavedPerEmployeePerMonth,
            managersEnabled,
            managerCount,
            managerHourly,
            managerHoursSavedPerMonth,
            otherSavingsMonthly,
            totals: {
              annualSoftwareCost,
              annualTotalCostY1,
              totalSavingsAnnual,
              netBenefitY1,
              netBenefitY2Plus,
              roiY1,
              roiY2Plus,
              paybackMonths,
            }
          })}>Export CSV</Button>
        </div>

        <footer className="mt-10 text-xs text-gray-500">
          Built for Factorial by your ROI wizard. Assumptions are illustrative—replace with your data.
        </footer>
      </div>
    </div>
  );
}

function LabeledNumber({ label, value, setValue, min = 0, step = 1, help }: { label: string; value: number; setValue: (v: number) => void; min?: number; step?: number; help?: string; }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Input type="number" value={Number.isFinite(value) ? value : 0} onChange={(e) => setValue(Number(e.target.value))} min={min} step={step} className="text-right" />
      {help && <div className="text-xs text-gray-500">{help}</div>}
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <span className="text-gray-600">{label}</span>
      <span>{children}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200 my-1" />;
}

function exportCSV(data: any) {
  const rows: Array<[string, string]> = [
    ["Currency", data.currency],
    ["Employees", String(data.employees)],
    ["PricePerEmployee", String(data.pricePerEmployee)],
    ["OneTimeImplementation", String(data.oneTimeImplementation)],
    ["HRHourly", String(data.hrHourly)],
    ["MinutesSavedPerEmployeePerMonth", String(data.minutesSavedPerEmployeePerMonth)],
    ["ManagersEnabled", String(data.managersEnabled)],
    ["ManagerCount", String(data.managerCount)],
    ["ManagerHourly", String(data.managerHourly)],
    ["ManagerHoursSavedPerMonth", String(data.managerHoursSavedPerMonth)],
    ["OtherSavingsMonthly", String(data.otherSavingsMonthly)],
    ["AnnualSoftwareCost", String(Math.round(data.totals.annualSoftwareCost))],
    ["TotalCostY1", String(Math.round(data.totals.annualTotalCostY1))],
    ["TotalSavingsAnnual", String(Math.round(data.totals.totalSavingsAnnual))],
    ["NetBenefitY1", String(Math.round(data.totals.netBenefitY1))],
    ["NetBenefitY2Plus", String(Math.round(data.totals.netBenefitY2Plus))],
    ["ROIY1Percent", String(Math.round(data.totals.roiY1))],
    ["ROIY2PlusPercent", String(Math.round(data.totals.roiY2Plus))],
    ["PaybackMonths", String(Number.isFinite(data.totals.paybackMonths) ? data.totals.paybackMonths.toFixed(1) : ">24")],
  ];

  const header = "Metric,Value";
  const csv = [header, ...rows.map(([k, v]) => `${escapeCsv(k)},${escapeCsv(v)}`)].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "factorial-roi.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCsv(v: string) {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}
