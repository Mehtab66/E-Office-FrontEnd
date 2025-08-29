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
}

interface AddEntityModalProps {
  config: EntityConfig;
  onClose: () => void;
  initialData?: any; // For pre-filling form when editing
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
      options: countries.map((country: Country) => ({
        value: country.name,
        label: `${country.name} (${country.isoCode})`,
      })),
    },
    {
      name: "currency",
      label: "Currency",
      type: "text",
      placeholder: "Auto-detected",
      required: true,
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
  const teamMembersInputRef = useRef<HTMLInputElement>(null);

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
  }, [config, initialData]);

  // Handle country change
  const handleCountryChange = (country: string) => {
    const selectedCountry = countries.find((c: { name: string; }    ) => c.name === country);
    if (selectedCountry) {
      setFormData((prev) => ({
        ...prev,
        country,
        currency: selectedCountry.currencyCode,
        phone: selectedCountry.phoneCode,
      }));
    }
  };

  // Handle phone change
  const handlePhoneChange = (phone: string, countryCode: string) => {
    if (!phone.startsWith(countryCode)) {
      phone = countryCode + phone.replace(/^\+\d+/, "");
    }
    setFormData((prev) => ({ ...prev, phone }));
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
  };

  // Remove team member
  const handleRemoveTeamMember = (member: string) => {
    setTeamMembers((prev) => prev.filter((m) => m !== member));
    setFormData((prev) => ({
      ...prev,
      teamMembers: teamMembers.filter((m) => m !== member).join(", "),
    }));
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
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

  // Render input field
  const renderField = (field: FormField) => {
    const commonClasses =
      "w-full px-4 py-2 border rounded-md focus:outline-none transition-colors focus:ring-2 focus:ring-primary";
    const errorClasses = errors[field.name]
      ? "border-destructive"
      : "border-border";

    switch (field.type) {
      case "select":
        return (
          <div className="relative">
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className={`${commonClasses} ${errorClasses} appearance-none bg-card text-foreground pr-10`}
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
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            {errors[field.name] && (
              <p className="text-destructive text-sm mt-1">
                {errors[field.name]}
              </p>
            )}
          </div>
        );
      default:
        if (field.name === "teamMembers") {
          return (
            <div className="relative">
              <div className="absolute left-3 top-3 text-muted-foreground">
                <FiUsers />
              </div>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-card min-h-[42px] pl-10">
                {teamMembers.map((member) => (
                  <div
                    key={member}
                    className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => handleRemoveTeamMember(member)}
                      className="ml-2 text-destructive hover:text-destructive/80"
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
                  className="flex-1 border-none bg-transparent focus:outline-none min-w-[150px]"
                  ref={teamMembersInputRef}
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-card border border-border rounded-md mt-1 max-h-40 overflow-y-auto shadow-md">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-foreground"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              {errors[field.name] && (
                <p className="text-destructive text-sm mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        }
        return (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {field.name === "name" && <FiBriefcase />}
              {field.name === "email" && <FiMail />}
              {field.name === "phone" && <FiPhone />}
              {field.name.includes("Address") && <FiMapPin />}
              {field.name === "currency" && <FiDollarSign />}
              {field.name === "client" && <FiUsers />}
              {field.name === "status" && <FiClock />}
              {field.name === "startDate" && <FiCalendar />}
              {field.name === "estimatedTime" && <FiClock />}
              {field.name === "teamLead" && <FiUser />}
              {field.name === "date" && <FiCalendar />}
              {field.name === "description" && <FiFileText />}
              {field.name === "notes" && <FiMessageSquare />}
            </div>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`${commonClasses} ${errorClasses} pl-10 bg-card text-foreground`}
              required={field.required}
              readOnly={field.name === "currency"}
            />
            {errors[field.name] && (
              <p className="text-destructive text-sm mt-1">
                {errors[field.name]}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-background/60 flex items-center justify-center z-[99999] p-4">
      <div className="bg-gradient-to-br from-card to-card/90 border border-border rounded-xl shadow-xl w-full max-w-lg sm:max-w-xl lg:max-w-2xl p-8 transform transition-all duration-300 scale-100 hover:shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {config.title}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
          >
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {config.fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm font-semibold text-muted-foreground mb-2">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </label>
              {renderField(field)}
            </div>
          ))}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntityModal;
