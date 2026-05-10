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
  | { status: "new"; customer: Customer };

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
      marginBottom: 5,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
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
      padding: "8px 10px",
      fontSize: 13,
      border: `1px solid ${C.border}`,
      borderRadius: 4,
      fontFamily: "inherit",
      color: C.text,
      background: C.bg,
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s",
      ...props.style,
    }}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    style={{
      width: "100%",
      padding: "8px 10px",
      fontSize: 13,
      border: `1px solid ${C.border}`,
      borderRadius: 4,
      fontFamily: "inherit",
      color: C.text,
      background: C.bg,
      outline: "none",
      boxSizing: "border-box",
      cursor: "pointer",
      ...props.style,
    }}
  />
);

// Section divider with label
const SectionDivider = ({ icon, label }: { icon: string; label: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "4px 0 2px",
    }}
  >
    <i className={`ti ${icon}`} style={{ fontSize: 13, color: C.textSec }} />
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: C.textSec,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </span>
    <div
      style={{
        flex: 1,
        height: 1,
        background: C.borderFaint,
      }}
    />
  </div>
);

// Initials avatar for found customer
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: C.accent + "18",
        color: C.accent,
        fontSize: 12,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NewJobModal({ onClose, onCreated }: Props) {
  // ── Phone lookup ─────────────────────────────────────────────────────────
  const [phone, setPhone] = useState("");
  const [customerState, setCS] = useState<CustomerState>({ status: "idle" });
  const lookupRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── New customer fields ───────────────────────────────────────────────────
  const [newName, setNewName] = useState("");
  const [waOptIn, setWaOptIn] = useState(true);

  // ── Vehicle ───────────────────────────────────────────────────────────────
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelVeh] = useState("");
  const [vehiclesLoading, setVehLoad] = useState(false);
  const [addVehicle, setAddVehicle] = useState(false);
  const [vehType, setVehType] = useState<"car" | "bike">("car");
  const [vehMake, setVehMake] = useState("");
  const [vehModel, setVehModel] = useState("");
  const [vehReg, setVehReg] = useState("");
  const [vehYear, setVehYear] = useState("");

  // ── Job fields ────────────────────────────────────────────────────────────
  const [mechanics, setMechanics] = useState<StaffMember[]>([]);
  const [selMechanic, setSelMechanic] = useState("");
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

  const isNew = customerState.status === "not_found";
  const isFound =
    customerState.status === "found" || customerState.status === "new";
  const isSearching = customerState.status === "searching";

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      let customerId = resolvedCustomer?.id ?? null;
      let vehicleId = selectedVehicle || null;

      if (!customerId) {
        const c = await customersApi.create({
          name: newName.trim(),
          phone: phone.replace(/\D/g, ""),
          whatsapp_opt_in: waOptIn,
        });
        customerId = c.id;
        setCS({ status: "new", customer: c });
      }

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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        {/* Modal — stop click propagation so backdrop click doesn't close from inside */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            boxShadow:
              "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06)",
            zIndex: 101,
            width: "100%",
            maxWidth: 500,
            maxHeight: "90dvh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: C.accent + "15",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="ti ti-tool"
                  style={{ fontSize: 15, color: C.accent }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>
                  New Job
                </div>
                <div style={{ fontSize: 11, color: C.textSec, marginTop: 1 }}>
                  Create a job card for a customer
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                cursor: "pointer",
                color: C.textSec,
                padding: "4px 6px",
                display: "flex",
                alignItems: "center",
                lineHeight: 1,
              }}
            >
              <i className="ti ti-x" style={{ fontSize: 14 }} />
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* ══ Section: Customer ══ */}
            <div>
              <SectionDivider icon="ti-user" label="Customer" />
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div>
                  <Label>
                    Phone Number <span style={{ color: C.danger }}>*</span>
                  </Label>
                  <div style={{ position: "relative" }}>
                    <Input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        paddingRight: 36,
                        borderColor: isFound
                          ? C.success
                          : isNew
                            ? C.accent
                            : C.border,
                      }}
                    />
                    {/* Right icon */}
                    {isSearching ? (
                      <i
                        className="ti ti-loader-2 ti-spin"
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: C.textSec,
                          fontSize: 14,
                          pointerEvents: "none",
                        }}
                      />
                    ) : isFound || isNew ? (
                      <button
                        onClick={resetCustomer}
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: C.borderFaint,
                          border: "none",
                          borderRadius: "50%",
                          cursor: "pointer",
                          color: C.textSec,
                          width: 18,
                          height: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                        }}
                      >
                        <i className="ti ti-x" style={{ fontSize: 11 }} />
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Found customer card */}
                {isFound && resolvedCustomer && (
                  <div
                    style={{
                      padding: "10px 12px",
                      background: C.success + "0d",
                      border: `1px solid ${C.success}40`,
                      borderRadius: 5,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Avatar name={resolvedCustomer.name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.text,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {resolvedCustomer.name}
                      </div>
                      <div
                        style={{ fontSize: 11, color: C.textSec, marginTop: 1 }}
                      >
                        {resolvedCustomer.phone}
                      </div>
                    </div>
                    <i
                      className="ti ti-circle-check-filled"
                      style={{ color: C.success, fontSize: 16, flexShrink: 0 }}
                    />
                  </div>
                )}

                {/* New customer inline fields */}
                {isNew && (
                  <div
                    style={{
                      padding: "12px 14px",
                      background: C.bg,
                      border: `1px solid ${C.border}`,
                      borderRadius: 5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        color: C.accent,
                        fontWeight: 500,
                      }}
                    >
                      <i className="ti ti-user-plus" style={{ fontSize: 13 }} />
                      New customer — fill in details to register
                    </div>
                    <div>
                      <Label>
                        Full Name <span style={{ color: C.danger }}>*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Rahul Sharma"
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
                        userSelect: "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={waOptIn}
                        onChange={(e) => setWaOptIn(e.target.checked)}
                        style={{ accentColor: C.accent }}
                      />
                      <span>Send WhatsApp updates</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* ══ Section: Vehicle (shown once customer is known) ══ */}
            {(isFound || isNew) && (
              <div>
                <SectionDivider icon="ti-car" label="Vehicle" />
                <div style={{ marginTop: 12 }}>
                  {isFound && (
                    <>
                      {vehiclesLoading ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                            color: C.textSec,
                            padding: "6px 0",
                          }}
                        >
                          <i
                            className="ti ti-loader-2 ti-spin"
                            style={{ fontSize: 13 }}
                          />
                          Loading vehicles…
                        </div>
                      ) : vehicles.length === 0 ? (
                        <div
                          style={{
                            fontSize: 12,
                            color: C.textSec,
                            padding: "4px 0 8px",
                          }}
                        >
                          No vehicles on file
                        </div>
                      ) : (
                        <Select
                          value={selectedVehicle}
                          onChange={(e) => setSelVeh(e.target.value)}
                          style={{ marginBottom: 8 }}
                        >
                          <option value="">
                            — No vehicle / select later —
                          </option>
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

                      {!addVehicle ? (
                        <button
                          onClick={() => setAddVehicle(true)}
                          style={{
                            fontSize: 12,
                            color: C.accent,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <i className="ti ti-plus" style={{ fontSize: 12 }} />
                          Add new vehicle
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
                    </>
                  )}

                  {isNew && (
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
                  )}
                </div>
              </div>
            )}

            {/* ══ Section: Job Details ══ */}
            {(isFound || isNew) && (
              <div>
                <SectionDivider icon="ti-clipboard-list" label="Job Details" />
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
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
                        padding: "8px 10px",
                        fontSize: 13,
                        border: `1px solid ${C.border}`,
                        borderRadius: 4,
                        fontFamily: "inherit",
                        color: C.text,
                        background: C.bg,
                        outline: "none",
                        resize: "vertical",
                        boxSizing: "border-box",
                        lineHeight: 1.5,
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
                </div>
              </div>
            )}

            {/* Error */}
            {submitError && (
              <div
                style={{
                  padding: "9px 12px",
                  background: "#fef2f2",
                  border: `1px solid #fecaca`,
                  borderRadius: 4,
                  fontSize: 13,
                  color: C.danger,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <i
                  className="ti ti-alert-circle"
                  style={{ fontSize: 14, flexShrink: 0 }}
                />
                {submitError}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              padding: "12px 20px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
              background: C.bg,
            }}
          >
            <button
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: "8px 16px",
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
                padding: "8px 18px",
                fontSize: 13,
                border: "none",
                borderRadius: 4,
                background: canSubmit ? C.accent : C.textMuted,
                color: "#fff",
                cursor: canSubmit ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "opacity 0.15s",
              }}
            >
              {submitting && (
                <i
                  className="ti ti-loader-2 ti-spin"
                  style={{ fontSize: 13 }}
                />
              )}
              {submitting
                ? "Creating…"
                : isNew
                  ? "Register & Create Job"
                  : "Create Job"}
            </button>
          </div>
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
  return (
    <div
      style={{
        padding: "12px 14px",
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Type toggle */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            padding: 3,
          }}
        >
          {(["car", "bike"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                padding: "4px 12px",
                fontSize: 12,
                borderRadius: 3,
                border:
                  type === t
                    ? `1px solid ${C.border}`
                    : "1px solid transparent",
                background: type === t ? C.surface : "transparent",
                color: type === t ? C.text : C.textSec,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: type === t ? 600 : 400,
                textTransform: "capitalize",
                boxShadow: type === t ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <i
                className={`ti ${t === "car" ? "ti-car" : "ti-motorbike"}`}
                style={{ fontSize: 12 }}
              />
              {t}
            </button>
          ))}
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            style={{
              fontSize: 12,
              color: C.textSec,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <i className="ti ti-trash" style={{ fontSize: 12 }} />
            Remove
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { ph: "Make (e.g. Honda)", val: make, set: setMake },
          { ph: "Model (e.g. City)", val: model, set: setModel },
          { ph: "Reg No.", val: reg, set: setReg },
          { ph: "Year (e.g. 2019)", val: year, set: setYear, type: "number" },
        ].map(({ ph, val, set, type: t }) => (
          <input
            key={ph}
            placeholder={ph}
            value={val}
            onChange={(e) => set(e.target.value)}
            type={t ?? "text"}
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
            }}
          />
        ))}
      </div>
    </div>
  );
}
