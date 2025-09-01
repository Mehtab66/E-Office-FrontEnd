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
  FiFileText,
  FiMessageSquare,
  FiCheck,
  FiPlus,
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
}

interface EntityConfig {
  type: "client" | "project" | "deliverable";
  title: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
  initialData?: any;
}

interface AddEntityModalProps {
  config: EntityConfig;
  onClose: () => void;
  initialData?: any;
}

const dummyClients = ["TechCorp Inc.", "Innovate Solutions"];
const dummyEmployees = [
  "Sarah Johnson",
  "David Kim",
  "John Doe",
  "Emily Chen",
  "Michael Rodriguez",
  "Alex Turner",
  "Lisa Wang",
  "James Wilson",
];

export const clientConfig: EntityConfig = {
  type: "client",
  title: "Client",
  fields: [
    {
      name: "name",
      label: "Client Name",
      type: "text",
      placeholder: "Enter client name",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email address",
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter phone number (e.g., +1234567890)",
      required: true,
    },
    {
      name: "country",
      label: "Country",
      type: "select",
      placeholder: "Select country",
      required: true,
      options: [], // Populated dynamically
    },
    {
      name: "currency",
      label: "Currency",
      type: "select",
      placeholder: "Select currency",
      required: true,
      options: [], // Populated dynamically
    },
    {
      name: "billingAddress",
      label: "Billing Address",
      type: "text",
      placeholder: "Enter billing address",
      required: true,
    },
    {
      name: "shippingAddress",
      label: "Shipping Address",
      type: "text",
      placeholder: "Enter shipping address",
      required: true,
    },
  ],
  onSubmit: (data) => {
    console.log("Client data submitted:", data);
  },
};

export const projectConfig: EntityConfig = {
  type: "project",
  title: "Project",
  fields: [
    {
      name: "name",
      label: "Project Name",
      type: "text",
      placeholder: "Enter project name",
      required: true,
    },
    {
      name: "client",
      label: "Client",
      type: "select",
      placeholder: "Select client",
      required: true,
      options: dummyClients,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      placeholder: "Select status",
      required: true,
      options: ["active", "pending", "completed"],
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      placeholder: "YYYY-MM-DD",
      required: true,
    },
    {
      name: "estimatedTime",
      label: "Estimated Time",
      type: "text",
      placeholder: "e.g., 3 months",
      required: true,
    },
    {
      name: "teamLead",
      label: "Team Lead",
      type: "select",
      placeholder: "Select team lead",
      required: true,
      options: dummyEmployees,
    },
    {
      name: "teamMembers",
      label: "Team Members",
      type: "text",
      placeholder: "Enter team members (e.g., Sarah Johnson, David Kim)",
      required: true,
    },
  ],
  onSubmit: (data) => {
    console.log("Project data submitted:", data);
  },
};

const AddEntityModal: React.FC<AddEntityModalProps> = ({
  config,
  onClose,
  initialData,
}) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>(
    initialData || {}
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<string[]>(
    initialData?.teamMembers?.split(", ").filter(Boolean) || []
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [countryOptions, setCountryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [currencyOptions, setCurrencyOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const teamMembersInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize country and currency options
  useEffect(() => {
    // Country options
    const countryOpts = countries.map((country: Country) => ({
      value: country.name,
      label: `${country.name} (${country.isoCode})`,
    }));
    setCountryOptions(countryOpts);
    console.log("Country options set:", countryOpts);

    // Currency options (unique currencies)
    const uniqueCurrencies = Array.from(
      new Map(
        countries.map((country) => [
          country.currencyCode,
          {
            value: country.currencyCode,
            label: `${country.currencyCode} (${country.currencyName})`,
          },
        ])
      ).values()
    );
    setCurrencyOptions(uniqueCurrencies);
    console.log("Currency options set:", uniqueCurrencies);
  }, []);

  // Debug countries on mount
  useEffect(() => {
    console.log("Countries data:", countries);
  }, []);

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.teamMembers) {
        setTeamMembers(initialData.teamMembers.split(", ").filter(Boolean));
      }
    } else {
      const initialData = config.fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {} as { [key: string]: string });
      setFormData(initialData);
      setTeamMembers([]);
    }
    setCurrentInput("");
    setIsDirty(false);
  }, [config, initialData]);

  // Handle clicks outside modal
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle country change
  const handleCountryChange = (country: string) => {
    const selectedCountry = countries.find((c) => c.name === country);
    if (selectedCountry) {
      setFormData((prev) => ({
        ...prev,
        country,
        currency: selectedCountry.currencyCode,
        phone:
          selectedCountry.phoneCode + (prev.phone || "").replace(/^\+\d+/, ""),
      }));
    }
    setIsDirty(true);
  };

  // Handle phone change
  const handlePhoneChange = (phone: string, countryCode: string) => {
    if (!phone.startsWith(countryCode)) {
      phone = countryCode + phone.replace(/^\+\d+/, "");
    }
    setFormData((prev) => ({ ...prev, phone }));
    setIsDirty(true);
  };

  // Handle team members input
  const handleTeamMembersInput = (value: string) => {
    setCurrentInput(value);
    if (value) {
      const filteredSuggestions = dummyEmployees.filter(
        (employee) =>
          employee.toLowerCase().includes(value.toLowerCase()) &&
          !teamMembers.includes(employee)
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setIsDirty(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setTeamMembers((prev) => [...prev, suggestion]);
    setCurrentInput("");
    setShowSuggestions(false);
    if (teamMembersInputRef.current) {
      teamMembersInputRef.current.focus();
    }
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...teamMembers, suggestion].join(", "),
    }));
    setIsDirty(true);
  };

  // Remove team member
  const handleRemoveTeamMember = (member: string) => {
    setTeamMembers((prev) => prev.filter((m) => m !== member));
    setFormData((prev) => ({
      ...prev,
      teamMembers: teamMembers.filter((m) => m !== member).join(", "),
    }));
    setIsDirty(true);
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "country") {
      handleCountryChange(value);
    } else if (name === "phone") {
      const selectedCountry = countries.find(
        (c) => c.name === formData.country
      );
      handlePhoneChange(value, selectedCountry?.phoneCode || "");
    } else if (name === "teamMembers") {
      handleTeamMembersInput(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setIsDirty(true);
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    console.log("Form data:", formData);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    config.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (
        field.name === "email" &&
        formData.email &&
        !/\S+@\S+\.\S+/.test(formData.email)
      ) {
        newErrors.email = "Invalid email format";
      }
      if (
        field.name === "phone" &&
        formData.phone &&
        !/^\+\d{7,15}$/.test(formData.phone)
      ) {
        newErrors.phone = "Invalid phone number (7-15 digits)";
      }
      if (
        field.name === "date" &&
        formData.date &&
        !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)
      ) {
        newErrors.date = "Invalid date format (YYYY-MM-DD)";
      }
      if (
        field.name === "teamMembers" &&
        formData.teamMembers &&
        !formData.teamMembers
          .split(",")
          .every((member) => dummyEmployees.includes(member.trim()))
      ) {
        newErrors.teamMembers = "All team members must be valid employees";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      config.onSubmit(formData);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  // Update config with country and currency options
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

  // Render input field
  const renderField = (field: FormField) => {
    const commonClasses =
      "w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary";
    const errorClasses = errors[field.name]
      ? "border-destructive focus:ring-destructive/50"
      : "border-border";

    console.log(
      `Rendering field ${field.name} with type ${field.type}, options:`,
      field.options
    );

    switch (field.type) {
      case "select":
        return (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {field.name === "country" && <FiGlobe size={18} />}
              {field.name === "currency" && <FiDollarSign size={18} />}
              {field.name === "client" && <FiUsers size={18} />}
              {field.name === "status" && <FiClock size={18} />}
              {field.name === "teamLead" && <FiUser size={18} />}
            </div>
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className={`${commonClasses} ${errorClasses} appearance-none bg-card text-foreground pl-10 pr-10`}
              required={field.required}
            >
              <option value="" disabled>
                {field.placeholder || `Select ${field.label}`}
              </option>
              {field.options?.map((option) =>
                typeof option === "string" ? (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ) : (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              )}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
            {errors[field.name] && (
              <p className="text-destructive text-sm mt-2 flex items-center">
                <FiX size={14} className="mr-1" /> {errors[field.name]}
              </p>
            )}
          </div>
        );
      default:
        if (field.name === "teamMembers") {
          return (
            <div className="relative">
              <div className="absolute left-3 top-3 text-muted-foreground">
                <FiUsers size={18} />
              </div>
              <div
                className={`flex flex-wrap gap-2 p-3 border rounded-lg bg-card min-h-[50px] pl-10 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary ${errorClasses}`}
                onClick={() => teamMembersInputRef.current?.focus()}
              >
                {teamMembers.map((member) => (
                  <div
                    key={member}
                    className="flex items-center bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm transition-colors hover:bg-primary/20"
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => handleRemoveTeamMember(member)}
                      className="ml-2 text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  name={field.name}
                  value={currentInput}
                  onChange={handleChange}
                  placeholder={
                    teamMembers.length === 0
                      ? field.placeholder
                      : "Add another member..."
                  }
                  className="flex-1 border-none bg-transparent focus:outline-none min-w-[120px] text-foreground"
                  ref={teamMembersInputRef}
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-card border border-border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      className="px-4 py-3 hover:bg-primary/10 cursor-pointer text-foreground flex items-center transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <FiUser className="mr-2 text-muted-foreground" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              {errors[field.name] && (
                <p className="text-destructive text-sm mt-2 flex items-center">
                  <FiX size={14} className="mr-1" /> {errors[field.name]}
                </p>
              )}
            </div>
          );
        }
        return (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {field.name === "name" && config.type === "project" && (
                <FiBriefcase size={18} />
              )}
              {field.name === "name" && config.type === "client" && (
                <FiUser size={18} />
              )}
              {field.name === "email" && <FiMail size={18} />}
              {field.name === "phone" && <FiPhone size={18} />}
              {field.name.includes("Address") && <FiMapPin size={18} />}
              {field.name === "currency" && <FiDollarSign size={18} />}
              {field.name === "startDate" && <FiCalendar size={18} />}
              {field.name === "estimatedTime" && <FiClock size={18} />}
              {field.name === "date" && <FiCalendar size={18} />}
              {field.name === "description" && <FiFileText size={18} />}
              {field.name === "notes" && <FiMessageSquare size={18} />}
            </div>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`${commonClasses} ${errorClasses} pl-10 bg-card text-foreground`}
              required={field.required}
            />
            {errors[field.name] && (
              <p className="text-destructive text-sm mt-2 flex items-center">
                <FiX size={14} className="mr-1" /> {errors[field.name]}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-background/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl lg:max-w-2xl p-6 animate-scale-in"
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground flex items-center">
            {config.type === "client" && (
              <FiUser className="mr-2 text-primary" />
            )}
            {config.type === "project" && (
              <FiBriefcase className="mr-2 text-primary" />
            )}
            {initialData ? "Edit" : "Add New"} {config.title}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted flex items-center justify-center h-8 w-8"
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
                <label className="text-sm font-medium text-foreground mb-2 flex items-center">
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-foreground bg-transparent border border-border rounded-lg hover:bg-muted transition-colors font-medium flex items-center"
            >
              <FiX size={16} className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className={`px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center ${
                isSubmitting || !isDirty
                  ? "opacity-70 cursor-not-allowed"
                  : "shadow-md hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck size={16} className="mr-2" /> Save {config.title}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }
      `}</style>
    </div>
  );
};

export default AddEntityModal;
