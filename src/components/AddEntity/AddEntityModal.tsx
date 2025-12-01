import React, { useState, useEffect, useRef } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiChevronDown,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiUsers,
  FiGlobe,
} from "react-icons/fi";
import { type Country, countries } from "../../libs/countries";

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: string[] | { value: string; label: string }[];
  multiple?: boolean;
}

interface EntityConfig {
  type: "client" | "project" | "employee" | "deliverable";
  title: string;
  fields: FormField[];
  onSubmit: (data: unknown) => void;
  initialData?: unknown;
}

interface AddEntityModalProps {
  config: EntityConfig;
  onClose: () => void;
}

interface CustomSelectProps {
  options: { value: string; label: string }[];
  value: string | string[];
  onChange: (val: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

interface FormData {
  [key: string]: string | string[] | undefined;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  placeholder,
  icon,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      if (currentValue.includes(selectedValue)) {
        onChange(currentValue.filter((v) => v !== selectedValue));
      } else {
        onChange([...currentValue, selectedValue]);
      }
    } else {
      onChange(selectedValue);
      setOpen(false);
    }
  };

  const displayValue = multiple
    ? Array.isArray(value) && value.length > 0
      ? `${value.length} selected`
      : placeholder
    : typeof value === "string" && value
      ? options.find((opt) => opt.value === value)?.label || value
      : placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 text-left flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
      >
        {icon && <div className="mr-2 text-slate-500">{icon}</div>}
        <span className="flex-1 truncate">{displayValue}</span>
        <FiChevronDown className="ml-2 text-slate-500" />
      </button>
      {open && (
        <div className="absolute z-50 w-full bg-slate-900 border border-slate-700 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 border-b border-slate-700 bg-slate-950 text-slate-200 focus:outline-none"
          />
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-2 text-slate-500">
              No options found
            </div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-4 py-2 hover:bg-slate-800 cursor-pointer flex items-center text-slate-300 ${multiple && Array.isArray(value) && value.includes(opt.value)
                  ? "bg-slate-800"
                  : ""
                  }`}
              >
                {multiple && (
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(opt.value)}
                    readOnly
                    className="mr-2 bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500/50"
                  />
                )}
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((v) => {
            const opt = options.find((o) => o.value === v);
            return opt ? (
              <div
                key={v}
                className="flex items-center bg-blue-900/30 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full text-sm"
              >
                {opt.label}
                <button
                  type="button"
                  onClick={() => handleSelect(v)}
                  className="ml-2 text-slate-400 hover:text-white focus:outline-none"
                >
                  <FiX size={14} />
                </button>
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

const AddEntityModal: React.FC<AddEntityModalProps> = ({ config, onClose }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryOptions] = useState<{ value: string; label: string }[]>(
    countries.map((country: Country) => ({
      value: country.name,
      label: `${country.name} (${country.isoCode})`,
    }))
  );
  const [currencyOptions] = useState<{ value: string; label: string }[]>(
    Array.from(
      new Map(
        countries.map((country) => [
          country.currencyCode,
          {
            value: country.currencyCode,
            label: `${country.currencyCode} (${country.currencyName})`,
          },
        ])
      ).values()
    )
  );
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("📊 Form data updated:", formData);
  }, [formData]);

  const formatDateToYYYYMMDD = (date: string | Date | undefined): string => {
    if (!date) return "";
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return date;
      return parsedDate.toISOString().split("T")[0];
    }
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const initialData = config.initialData || {};
    const newFormData = config.fields.reduce((acc, field) => {
      let initialValue = (initialData as FormData)[field.name];
      if (
        field.name === "teamLead" &&
        typeof initialValue === "object" &&
        !Array.isArray(initialValue) &&
        (initialValue as { _id?: string })._id
      ) {
        initialValue = (initialValue as any)._id;
      } else if (
        (field.name === "teamMembers" || field.name === "projects") &&
        Array.isArray(initialValue)
      ) {
        initialValue = initialValue.map((item) =>
          typeof item === "object" && item !== null && "_id" in item
            ? (item as { _id: string })._id
            : item
        );
      } else if (
        field.name === "client" &&
        typeof initialValue === "object" &&
        initialValue !== null &&
        "_id" in initialValue
      ) {
        initialValue = (initialValue as any)._id;
      } else if (field.name === "startDate") {
        initialValue = formatDateToYYYYMMDD(initialValue as string | Date);
      }
      acc[field.name] = initialValue ?? (field.multiple ? [] : "");
      return acc;
    }, {} as FormData);

    if (newFormData.country && !newFormData.currency) {
      const selectedCountry = countries.find(
        (c) => c.name === newFormData.country
      );
      if (selectedCountry) {
        newFormData.currency = selectedCountry.currencyCode;
        if (!newFormData.phone) {
          newFormData.phone = selectedCountry.phoneCode;
        }
      }
    }

    setFormData(newFormData);
    setErrors({});
  }, [config]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    console.log(`🔍 Field changed: ${name} = ${value}`);
    console.log(`📋 Current formData:`, formData);

    if (name === "country") {
      console.log(`🌍 Country selected: ${value}`);
      const selectedCountry = countries.find((c) => c.name === value);
      console.log("✅ Found country:", selectedCountry);

      if (selectedCountry) {
        console.log(`💰 Auto-setting currency to: ${selectedCountry.currencyCode}`);
        console.log(`📞 Auto-setting phone code to: ${selectedCountry.phoneCode}`);

        setFormData((prev) => ({
          ...prev,
          country: value,
          currency: selectedCountry.currencyCode,
          phone: selectedCountry.phoneCode,
        }));

        setTimeout(() => {
          console.log("🔄 Updated formData after country selection:", formData);
        }, 100);
      } else {
        console.log("❌ Country not found in countries list");
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          currency: "",
          phone: "",
        }));
      }
    } else {
      console.log(`📝 Regular field update: ${name} = ${value}`);
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    config.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (
        field.name === "email" &&
        formData.email &&
        !/\S+@\S+\.\S+/.test(formData.email as string)
      ) {
        newErrors.email = "Invalid email format";
      }
      if (
        field.name === "phone" &&
        formData.phone &&
        !/^\+\d{7,15}$/.test(formData.phone as string)
      ) {
        newErrors.phone = "Invalid phone number (7-15 digits)";
      }
      if (
        field.name === "startDate" &&
        formData.startDate &&
        !/^\d{4}-\d{2}-\d{2}$/.test(formData.startDate as string)
      ) {
        newErrors.startDate = "Invalid date format (YYYY-MM-DD)";
      }
      if (
        field.name === "cnic" &&
        formData.cnic &&
        !/^\d{5}-\d{7}-\d$/.test(formData.cnic as string)
      ) {
        newErrors.cnic = "Invalid CNIC format (e.g., 12345-1234567-1)";
      }
      if (
        field.name === "country" &&
        formData.country &&
        !countries.some((c) => c.name === formData.country)
      ) {
        newErrors.country = "Invalid country selection";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    config.onSubmit(formData);
    setIsSubmitting(false);
  };

  const renderField = (field: FormField) => {
    const commonClasses =
      "w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-slate-950 text-slate-200";
    const errorClasses = errors[field.name]
      ? "border-red-500 focus:ring-red-500/50"
      : "border-slate-700";

    switch (field.type) {
      case "textarea":
        return (
          <div className="relative">
            <textarea
              name={field.name}
              value={formData[field.name] as string || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`${commonClasses} ${errorClasses} pl-10 h-24 resize-none`}
              required={field.required}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <FiX size={14} className="mr-1" /> {errors[field.name]}
              </p>
            )}
          </div>
        );
      case "select":
        {
          const selectOptions = field.options?.map((opt) =>
            typeof opt === "string" ? { value: opt, label: opt } : opt
          ) || [];

          const selectIcon =
            field.name === "country" ? (
              <FiGlobe size={18} />
            ) : field.name === "currency" ? (
              <FiDollarSign size={18} />
            ) : field.name === "client" ? (
              <FiUsers size={18} />
            ) : field.name === "status" ? (
              <FiClock size={18} />
            ) : field.name === "teamLead" ? (
              <FiUser size={18} />
            ) : field.name === "teamMembers" ? (
              <FiUsers size={18} />
            ) : field.name === "role" ? (
              <FiUser size={18} />
            ) : field.name === "projects" ? (
              <FiBriefcase size={18} />
            ) : null;

          return (
            <div className="relative">
              <CustomSelect
                options={selectOptions}
                value={
                  field.multiple
                    ? formData[field.name] as string[] || []
                    : formData[field.name] as string || ""
                }
                onChange={(val) => {
                  console.log(`🎯 CustomSelect onChange for ${field.name}:`, val);

                  if (field.name === "country") {
                    const selectedCountry = countries.find((c) => c.name === val);
                    console.log("🌍 Country selected via CustomSelect:", selectedCountry);

                    if (selectedCountry) {
                      setFormData((prev) => ({
                        ...prev,
                        country: val as string,
                        currency: selectedCountry.currencyCode,
                        phone: selectedCountry.phoneCode,
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: val,
                        currency: "",
                        phone: "",
                      }));
                    }
                  } else {
                    setFormData((prev) => ({ ...prev, [field.name]: val }));
                  }

                  if (errors[field.name]) {
                    setErrors((prev) => ({ ...prev, [field.name]: "" }));
                  }
                }}
                multiple={field.multiple}
                placeholder={field.placeholder || `Select ${field.label}`}
                icon={selectIcon}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <FiX size={14} className="mr-1" /> {errors[field.name]}
                </p>
              )}
            </div>
          );
        }
      default:
        return (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
              {field.name === "name" && config.type === "project" && (
                <FiBriefcase size={18} />
              )}
              {field.name === "name" && config.type === "client" && (
                <FiUser size={18} />
              )}
              {field.name === "name" && config.type === "employee" && (
                <FiUser size={18} />
              )}
              {field.name === "email" && <FiMail size={18} />}
              {field.name === "phone" && <FiPhone size={18} />}
              {field.name.includes("Address") && <FiMapPin size={18} />}
              {field.name === "startDate" && <FiCalendar size={18} />}
              {field.name === "estimatedTime" && <FiClock size={18} />}
              {field.name === "grade" && <FiUser size={18} />}
              {field.name === "designation" && <FiUser size={18} />}
              {field.name === "cnic" && <FiUser size={18} />}
              {field.name === "description" && <FiBriefcase size={18} />}
              {field.name === "notes" && <FiBriefcase size={18} />}
            </div>
            <input
              type={field.type}
              name={field.name}
              value={field.name === "startDate" ? formData[field.name] as string || "" : formData[field.name] as string || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`${commonClasses} ${errorClasses} pl-10`}
              required={field.required}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <FiX size={14} className="mr-1" /> {errors[field.name]}
              </p>
            )}
          </div>
        );
    }
  };

  const updatedConfig = {
    ...config,
    fields: config.fields.map((field) =>
      field.name === "country"
        ? { ...field, type: "select", options: countryOptions }
        : field.name === "currency"
          ? { ...field, type: "select", options: currencyOptions }
          : field
    ),
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-slate-950/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl lg:max-w-2xl p-6 animate-scale-in"
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white flex items-center">
            {config.type === "client" && (
              <FiUser className="mr-2 text-blue-500" />
            )}
            {config.type === "project" && (
              <FiBriefcase className="mr-2 text-blue-500" />
            )}
            {config.type === "employee" && (
              <FiUser className="mr-2 text-blue-500" />
            )}
            {config.type === "deliverable" && (
              <FiBriefcase className="mr-2 text-blue-500" />
            )}
            {config.initialData ? "Edit" : "Add New"} {config.title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-800 flex items-center justify-center h-8 w-8"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 py-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {updatedConfig.fields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-300 bg-transparent border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-colors font-medium flex items-center"
            >
              <FiX size={16} className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium flex items-center border border-blue-500/50 ${isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FiBriefcase size={16} className="mr-2" /> Save {config.title}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
};

export default AddEntityModal;