"use client";
import { useState, useEffect, useRef } from "react";
import { C } from "@/lib/constants";
import { customersApi, vehiclesApi, jobsApi, staffApi } from "@/lib/api";
import type { Customer } from "@/lib/types";
import type { StaffMember } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

type CustomerState =
  | { status: "idle" }
  | { status: "searching" }
  | { status: "found"; customer: Customer }
  | { status: "not_found" }
  | { status: "new"; customer: Customer }; // freshly created

interface Vehicle {
  id: string;
  type: string;
  make: string | null;
  model: string | null;
  registration: string | null;
  year: number | null;
  color: string | null;
}

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

// ── Small UI atoms ────────────────────────────────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 600,
      color: C.textSec,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    }}
  >
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    style={{
      width: "100%",
      padding: "7px 10px",
      fontSize: 13,
      border: `1px solid ${C.border}`,
      borderRadius: 4,
      fontFamily: "inherit",
      color: C.text,
      background: C.surface,
      outline: "none",
      boxSizing: "border-box",
      ...props.style,
    }}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    style={{
      width: "100%",
      padding: "7px 10px",
      fontSize: 13,
      border: `1px solid ${C.border}`,
      borderRadius: 4,
      fontFamily: "inherit",
      color: C.text,
      background: C.surface,
      outline: "none",
      boxSizing: "border-box",
      cursor: "pointer",
      ...props.style,
    }}
  />
);

// ── Component ─────────────────────────────────────────────────────────────────

export function NewJobModal({ onClose, onCreated }: Props) {
  // ── Phone lookup ─────────────────────────────────────────────────────────
  const [phone, setPhone] = useState("");
  const [customerState, setCS] = useState<CustomerState>({ status: "idle" });
  const lookupRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── New customer fields (shown when not_found) ────────────────────────────
  const [newName, setNewName] = useState("");
  const [waOptIn, setWaOptIn] = useState(true);

  // ── Vehicle ───────────────────────────────────────────────────────────────
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelVeh] = useState("");
  const [vehiclesLoading, setVehLoad] = useState(false);

  // New vehicle fields (always shown for new customers, optional for existing)
  const [addVehicle, setAddVehicle] = useState(false);
  const [vehType, setVehType] = useState<"car" | "bike">("car");
  const [vehMake, setVehMake] = useState("");
  const [vehModel, setVehModel] = useState("");
  const [vehReg, setVehReg] = useState("");
  const [vehYear, setVehYear] = useState("");

  // ── Job fields ────────────────────────────────────────────────────────────
  const [mechanics, setMechanics] = useState<StaffMember[]>([]);
  const [selMechanic, setSelMechanic] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [serviceDesc, setServiceDesc] = useState("");
  const [odometer, setOdometer] = useState("");
  const [estCompletion, setEstCompl] = useState("");

  // ── Submit ────────────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Fetch mechanics once ──────────────────────────────────────────────────
  useEffect(() => {
    staffApi.list({ role: "mechanic" }).then((r) => setMechanics(r.data));
  }, []);

  // ── Phone lookup (debounced, fires at 10 digits) ──────────────────────────
  useEffect(() => {
    const digits = phone.replace(/\D/g, "");

    // ✅ Always clear any pending timeout first — moved above the early return
    if (lookupRef.current) clearTimeout(lookupRef.current);

    if (digits.length < 10) {
      setCS({ status: "idle" });
      return;
    }

    setCS({ status: "searching" });

    lookupRef.current = setTimeout(async () => {
      try {
        const res = await customersApi.lookup(digits);
        if (res.found) {
          setCS({ status: "found", customer: res.customer });
          setVehLoad(true);
          const vehs = await vehiclesApi.listByCustomer(res.customer.id);
          setVehicles(vehs);
          if (vehs.length === 1) setSelVeh(vehs[0].id);
          setVehLoad(false);
        } else {
          setCS({ status: "not_found" });
          setVehicles([]);
          setSelVeh("");
        }
      } catch {
        setCS({ status: "idle" });
      }
    }, 400);

    // ✅ Cleanup so the timeout is cancelled if the component unmounts mid-debounce
    return () => {
      if (lookupRef.current) clearTimeout(lookupRef.current);
    };
  }, [phone]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function resetCustomer() {
    setPhone("");
    setCS({ status: "idle" });
    setNewName("");
    setWaOptIn(true);
    setVehicles([]);
    setSelVeh("");
    setAddVehicle(false);
    resetVehicleFields();
  }

  function resetVehicleFields() {
    setVehType("car");
    setVehMake("");
    setVehModel("");
    setVehReg("");
    setVehYear("");
  }

  const resolvedCustomer: Customer | null =
    customerState.status === "found" || customerState.status === "new"
      ? customerState.customer
      : null;

  const canSubmit =
    !submitting &&
    (customerState.status === "found" ||
      customerState.status === "new" ||
      (customerState.status === "not_found" && newName.trim().length > 0));

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      let customerId = resolvedCustomer?.id ?? null;
      let vehicleId = selectedVehicle || null;

      // 1. Create customer if new
      if (!customerId) {
        const c = await customersApi.create({
          name: newName.trim(),
          phone: phone.replace(/\D/g, ""),
          whatsapp_opt_in: waOptIn,
        });
        customerId = c.id;
        setCS({ status: "new", customer: c });
      }

      // 2. Create vehicle if requested
      if (
        addVehicle ||
        (customerState.status === "not_found" && vehReg.trim())
      ) {
        if (vehMake.trim() || vehModel.trim() || vehReg.trim()) {
          const v = await vehiclesApi.create({
            customer_id: customerId,
            type: vehType,
            make: vehMake.trim() || undefined,
            model: vehModel.trim() || undefined,
            registration: vehReg.trim() || undefined,
            year: vehYear ? Number(vehYear) : undefined,
          });
          vehicleId = (v as any).id;
        }
      }

      // 3. Create job
      await jobsApi.create({
        customer_id: customerId,
        vehicle_id: vehicleId ?? undefined,
        mechanic_id: selMechanic || undefined,
        service_description: serviceDesc || undefined,
        odometer_in: odometer ? Number(odometer) : undefined,
        estimated_completion: estCompletion || undefined,
      });

      onCreated();
      onClose();
    } catch (e: any) {
      setSubmitError(e?.error ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Derived UI flags ──────────────────────────────────────────────────────
  const isNew = customerState.status === "not_found";
  const isFound =
    customerState.status === "found" || customerState.status === "new";
  const isSearching = customerState.status === "searching";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",

          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
          zIndex: 99999,
          width: 240,
          maxWidth: "calc(100vw - 24px)",
          overflow: "hidden",

          top: coords.top,
          left: coords.left,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>
            New Job
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.textSec,
              padding: 2,
            }}
          >
            <i className="ti ti-x" style={{ fontSize: 16 }} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* ── Phone ── */}
          <div>
            <Label>
              Phone Number <span style={{ color: C.danger }}>*</span>
            </Label>
            <div style={{ position: "relative" }}>
              <Input
                type="tel"
                placeholder="Enter customer's phone number…"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  paddingRight: isFound ? 32 : 10,
                  borderColor: isFound
                    ? C.success
                    : isNew
                      ? C.accent
                      : C.border,
                }}
              />
              {isSearching && (
                <i
                  className="ti ti-loader-2 ti-spin"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: C.textSec,
                    fontSize: 14,
                  }}
                />
              )}
              {(isFound || isNew) && (
                <button
                  onClick={resetCustomer}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: C.textSec,
                    padding: 0,
                  }}
                >
                  <i className="ti ti-x" style={{ fontSize: 13 }} />
                </button>
              )}
            </div>

            {/* Found chip */}
            {isFound && resolvedCustomer && (
              <div
                style={{
                  marginTop: 6,
                  padding: "6px 10px",
                  background: "#f0fdf4",
                  border: `1px solid #bbf7d0`,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <i
                  className="ti ti-circle-check-filled"
                  style={{ color: C.success, fontSize: 15 }}
                />
                <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                  {resolvedCustomer.name}
                </span>
                <span
                  style={{ fontSize: 12, color: C.textSec, marginLeft: "auto" }}
                >
                  {resolvedCustomer.phone}
                </span>
              </div>
            )}

            {/* Not found — new customer fields */}
            {isNew && (
              <div
                style={{
                  marginTop: 8,
                  padding: 12,
                  background: "#fafafa",
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 12, color: C.textSec }}>
                  No customer found — fill in details to register
                </div>
                <div>
                  <Label>
                    Name <span style={{ color: C.danger }}>*</span>
                  </Label>
                  <Input
                    placeholder="Customer's full name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    color: C.text,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={waOptIn}
                    onChange={(e) => setWaOptIn(e.target.checked)}
                  />
                  Send WhatsApp updates
                </label>
              </div>
            )}
          </div>

          {/* ── Vehicle (existing customer) ── */}
          {isFound && (
            <div>
              <Label>Vehicle</Label>
              {vehiclesLoading ? (
                <div style={{ fontSize: 12, color: C.textSec }}>
                  Loading vehicles…
                </div>
              ) : vehicles.length === 0 ? (
                <div
                  style={{ fontSize: 12, color: C.textSec, padding: "4px 0" }}
                >
                  No vehicles on file
                </div>
              ) : (
                <Select
                  value={selectedVehicle}
                  onChange={(e) => setSelVeh(e.target.value)}
                >
                  <option value="">— No vehicle / select later —</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {[
                        v.make,
                        v.model,
                        v.registration ? `(${v.registration})` : null,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </option>
                  ))}
                </Select>
              )}

              {/* Toggle to add a new vehicle for existing customer */}
              {!addVehicle ? (
                <button
                  onClick={() => setAddVehicle(true)}
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: C.accent,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  + Add new vehicle
                </button>
              ) : (
                <VehicleFields
                  type={vehType}
                  make={vehMake}
                  model={vehModel}
                  reg={vehReg}
                  year={vehYear}
                  setType={setVehType}
                  setMake={setVehMake}
                  setModel={setVehModel}
                  setReg={setVehReg}
                  setYear={setVehYear}
                  onRemove={() => {
                    setAddVehicle(false);
                    resetVehicleFields();
                  }}
                />
              )}
            </div>
          )}

          {/* ── Vehicle (new customer — always shown) ── */}
          {isNew && (
            <div>
              <Label>
                Vehicle{" "}
                <span
                  style={{
                    color: C.textSec,
                    fontWeight: 400,
                    textTransform: "none",
                  }}
                >
                  (optional)
                </span>
              </Label>
              <VehicleFields
                type={vehType}
                make={vehMake}
                model={vehModel}
                reg={vehReg}
                year={vehYear}
                setType={setVehType}
                setMake={setVehMake}
                setModel={setVehModel}
                setReg={setVehReg}
                setYear={setVehYear}
              />
            </div>
          )}

          {/* ── Job fields — only shown once customer is resolved ── */}
          {(isFound || isNew) && (
            <>
              {/* Mechanic */}
              <div>
                <Label>Assign Mechanic</Label>
                <Select
                  value={selMechanic}
                  onChange={(e) => setSelMechanic(e.target.value)}
                >
                  <option value="">— Unassigned —</option>
                  {mechanics.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Service description */}
              <div>
                <Label>Service Description</Label>
                <textarea
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="e.g. Oil change, brake pad replacement…"
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    fontSize: 13,
                    border: `1px solid ${C.border}`,
                    borderRadius: 4,
                    fontFamily: "inherit",
                    color: C.text,
                    background: C.surface,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Odometer + Est completion */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <Label>Odometer In (km)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 42000"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    min={0}
                  />
                </div>
                <div>
                  <Label>Est. Completion</Label>
                  <Input
                    type="datetime-local"
                    value={estCompletion}
                    onChange={(e) => setEstCompl(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Error */}
          {submitError && (
            <div
              style={{
                padding: "8px 12px",
                background: "#fef2f2",
                border: `1px solid #fecaca`,
                borderRadius: 4,
                fontSize: 13,
                color: C.danger,
              }}
            >
              {submitError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 18px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: "7px 16px",
              fontSize: 13,
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              background: C.surface,
              color: C.textSec,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              padding: "7px 16px",
              fontSize: 13,
              border: "none",
              borderRadius: 4,
              background: canSubmit ? C.accent : C.textMuted,
              color: "#fff",
              cursor: canSubmit ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {submitting && (
              <i className="ti ti-loader-2 ti-spin" style={{ fontSize: 13 }} />
            )}
            {submitting
              ? "Creating…"
              : isNew
                ? "Create Customer & Job"
                : "Create Job"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── VehicleFields sub-component ───────────────────────────────────────────────

function VehicleFields({
  type,
  make,
  model,
  reg,
  year,
  setType,
  setMake,
  setModel,
  setReg,
  setYear,
  onRemove,
}: {
  type: "car" | "bike";
  make: string;
  model: string;
  reg: string;
  year: string;
  setType: (v: "car" | "bike") => void;
  setMake: (v: string) => void;
  setModel: (v: string) => void;
  setReg: (v: string) => void;
  setYear: (v: string) => void;
  onRemove?: () => void;
}) {
  // ✅ Removed the local Input redefinition — uses the one defined at module level

  return (
    <div
      style={{
        marginTop: 8,
        padding: 12,
        background: "#fafafa",
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {onRemove && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onRemove}
            style={{
              fontSize: 12,
              color: C.textSec,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Type toggle */}
      <div style={{ display: "flex", gap: 6 }}>
        {(["car", "bike"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              padding: "5px 14px",
              fontSize: 12,
              borderRadius: 3,
              border: `1px solid ${type === t ? C.accent : C.border}`,
              background: type === t ? C.accent : C.surface,
              color: type === t ? "#fff" : C.textSec,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: type === t ? 500 : 400,
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Input
          placeholder="Make (e.g. Honda)"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
        <Input
          placeholder="Model (e.g. City)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <Input
          placeholder="Reg No."
          value={reg}
          onChange={(e) => setReg(e.target.value)}
        />
        <Input
          placeholder="Year (e.g. 2019)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          type="number"
        />
      </div>
    </div>
  );
}
