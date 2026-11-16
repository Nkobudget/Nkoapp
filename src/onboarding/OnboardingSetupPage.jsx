import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Lock } from "lucide-react";
import OnboardingStepLayout from "./OnboardingStepLayout";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "../lib/motion";

const ROLES = [
  { id: "executive_producer", label: "Executive Producer", code: "EP" },
  { id: "producer", label: "Producer", code: "PR" },
  { id: "line_producer", label: "Line Producer", code: "LP" },
  { id: "production_manager", label: "Production Manager", code: "PM" },
];

const COUNTRIES = [
  {
    name: "Nigeria",
    currency: "NGN",
    states: ["Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Enugu", "Kano", "Ogun", "Cross River"],
  },
  {
    name: "Ghana",
    currency: "GHS",
    states: ["Greater Accra", "Ashanti", "Central", "Western", "Eastern", "Northern"],
  },
  {
    name: "Kenya",
    currency: "KES",
    states: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Uasin Gishu"],
  },
  {
    name: "South Africa",
    currency: "ZAR",
    states: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State"],
  },
  {
    name: "Uganda",
    currency: "UGX",
    states: ["Central (Kampala)", "Wakiso", "Western", "Eastern", "Northern"],
  },
  {
    name: "Tanzania",
    currency: "TZS",
    states: ["Dar es Salaam", "Arusha", "Zanzibar", "Mwanza", "Dodoma"],
  },
  {
    name: "Côte d'Ivoire",
    currency: "XOF",
    states: ["Abidjan", "Yamoussoukro", "Bouaké", "San-Pédro"],
  },
  {
    name: "Ethiopia",
    currency: "ETB",
    states: ["Addis Ababa", "Oromia", "Amhara", "Tigray"],
  },
  {
    name: "United Kingdom",
    currency: "GBP",
    states: ["London", "Manchester", "Birmingham", "Bristol", "Glasgow", "Cardiff"],
  },
  {
    name: "United States",
    currency: "USD",
    states: ["California", "New York", "Georgia", "Texas", "Illinois", "Florida"],
  },
  {
    name: "Canada",
    currency: "CAD",
    states: ["Ontario", "British Columbia", "Quebec", "Alberta"],
  },
  {
    name: "France",
    currency: "EUR",
    states: ["Île-de-France", "Auvergne-Rhône-Alpes", "Occitanie", "Provence-Alpes-Côte d'Azur"],
  },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const CURRENT_YEAR = 2026;
const YEARS = Array.from({ length: 70 }, (_, i) => String(CURRENT_YEAR - 16 - i));

function SelectField({ id, label, value, onChange, placeholder, options, disabled = false }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-xs font-medium text-palette-stone">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`min-h-11 w-full appearance-none rounded-xl border border-palette-graphite bg-palette-near-black px-3.5 py-2.5 pr-9 text-sm transition-colors focus:border-palette-apricot focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold disabled:cursor-not-allowed disabled:opacity-50 ${
            value ? "text-palette-ivory" : "text-palette-stone"
          }`}
        >
          <option value="" className="bg-palette-near-black text-palette-stone">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-palette-near-black text-palette-ivory">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-palette-stone"
        />
      </div>
    </div>
  );
}

export default function OnboardingSetupPage({ onBack, onContinue }) {
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("English");

  const selectedRole = useMemo(() => ROLES.find((r) => r.id === role) || null, [role]);
  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.name === country) || null,
    [country]
  );

  const availableStates = selectedCountry ? selectedCountry.states : [];
  const currencyCode = selectedCountry ? selectedCountry.currency : "NGN";
  const locationLabel = selectedCountry
    ? stateRegion
      ? `${stateRegion}, ${selectedCountry.name}`
      : selectedCountry.name
    : "Where you're based";

  const isComplete = Boolean(role && country && stateRegion && day && month && year && language);

  function handleCountryChange(nextCountry) {
    setCountry(nextCountry);
    setStateRegion("");
  }

  function handleContinue(e) {
    e.preventDefault();
    if (!isComplete || typeof onContinue !== "function") return;
    onContinue({
      roleId: selectedRole.id,
      roleLabel: selectedRole.label,
      roleCode: selectedRole.code,
      country,
      stateRegion,
      locationLabel,
      currency: currencyCode,
      language,
    });
  }

  const preview = {
    roleCode: selectedRole ? selectedRole.code : "YO",
    roleLabel: selectedRole ? selectedRole.label : "Your role",
    roleSelected: Boolean(selectedRole),
    locationLabel,
    productionLocation: selectedCountry ? locationLabel : "Location",
    language,
    currency: currencyCode,
  };

  return (
    <OnboardingStepLayout activeStep={0} onBack={onBack} preview={preview}>
      <motion.form
        onSubmit={handleContinue}
        variants={staggerContainer(0.05, 0.04)}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-[33rem]"
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-[1.875rem] leading-[1.12] font-medium tracking-[-0.03em] text-palette-ivory sm:text-[2.25rem]">
            First, tell us about you.
          </h1>
          <p className="mt-2.5 max-w-[30rem] text-sm leading-6 text-palette-stone">
            NKO adapts your workspace currency, language and local rates to your role and where you work.
          </p>
        </motion.div>

        {/* Role selection */}
        <motion.fieldset variants={fadeUp} className="mt-7">
          <legend className="mb-2.5 text-xs font-medium text-palette-stone">
            What&apos;s your role?
          </legend>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {ROLES.map((item) => {
              const checked = role === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  onClick={() => setRole(item.id)}
                  className={`flex min-h-11 items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold ${
                    checked
                      ? "border-palette-apricot/80 bg-palette-apricot/8 text-palette-ivory"
                      : "border-palette-graphite bg-palette-near-black text-palette-stone hover:border-palette-warm-gray hover:text-palette-ivory"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      checked
                        ? "border-palette-apricot bg-palette-apricot/20"
                        : "border-palette-warm-gray bg-transparent"
                    }`}
                  >
                    {checked && <span className="size-1.5 rounded-full bg-palette-apricot" />}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.fieldset>

        {/* Location */}
        <motion.div variants={fadeUp} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SelectField
            id="onboarding-country"
            label="Where are you based?"
            value={country}
            onChange={handleCountryChange}
            placeholder="Select Country"
            options={COUNTRIES.map((c) => c.name)}
          />
          <SelectField
            id="onboarding-state"
            label="State / region"
            value={stateRegion}
            onChange={setStateRegion}
            placeholder="Select State"
            options={availableStates}
            disabled={!selectedCountry}
          />
        </motion.div>

        {/* Date of birth */}
        <motion.div variants={fadeUp} className="mt-6">
          <span className="mb-2 block text-xs font-medium text-palette-stone">
            Date of birth
          </span>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <SelectField
              id="onboarding-dob-day"
              label="Day"
              value={day}
              onChange={setDay}
              placeholder="Day"
              options={DAYS}
            />
            <SelectField
              id="onboarding-dob-month"
              label="Month"
              value={month}
              onChange={setMonth}
              placeholder="Month"
              options={MONTHS}
            />
            <SelectField
              id="onboarding-dob-year"
              label="Year"
              value={year}
              onChange={setYear}
              placeholder="Year"
              options={YEARS}
            />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] leading-4 text-palette-gray">
            <Lock aria-hidden="true" className="size-3 shrink-0" />
            <span>Used only for anonymous audience insights. Never shown on your profile.</span>
          </p>
        </motion.div>

        {/* Workspace language */}
        <motion.fieldset variants={fadeUp} className="mt-6">
          <legend className="mb-2.5 text-xs font-medium text-palette-stone">
            Workspace language
          </legend>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {["English", "Français"].map((langOption) => {
              const active = language === langOption;
              return (
                <motion.button
                  key={langOption}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  onClick={() => setLanguage(langOption)}
                  className={`flex min-h-11 items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-gold ${
                    active
                      ? "border-palette-apricot/80 bg-palette-apricot/8 text-palette-ivory"
                      : "border-palette-graphite bg-palette-near-black text-palette-stone hover:border-palette-warm-gray hover:text-palette-ivory"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      active
                        ? "border-palette-apricot bg-palette-apricot"
                        : "border-palette-warm-gray bg-transparent"
                    }`}
                  >
                    {active && <span className="size-1.5 rounded-full bg-palette-black" />}
                  </span>
                  <span className="font-medium">{langOption}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.fieldset>

        {/* Continue row */}
        <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-3">
          <motion.button
            type="submit"
            disabled={!isComplete}
            whileHover={isComplete ? { scale: 1.015 } : undefined}
            whileTap={isComplete ? { scale: 0.985 } : undefined}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-gold ${
              isComplete
                ? "bg-palette-apricot text-palette-black shadow-[0_8px_24px_rgba(255,179,71,0.28)] hover:brightness-105 cursor-pointer"
                : "bg-palette-apricot/45 text-palette-black/80 cursor-not-allowed"
            }`}
          >
            <span>Continue</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </motion.button>

          <div
            className={`inline-flex min-h-11 items-center rounded-xl border px-4 py-2.5 text-xs transition-colors ${
              isComplete
                ? "border-palette-apricot/40 bg-palette-apricot/8 text-palette-apricot"
                : "border-palette-graphite bg-palette-near-black/70 text-palette-stone"
            }`}
          >
            {isComplete ? "All fields complete" : "Complete all fields to continue"}
          </div>
        </motion.div>
      </motion.form>
    </OnboardingStepLayout>
  );
}
