import { useEffect, useMemo, useRef, useState } from "react";

const courseCards = [
  {
    key: "MS-CIT",
    title: "MS-CIT",
    icon: "D",
    description:
      "Maharashtra State Certificate in IT covering computer basics, MS Office, internet, and digital skills.",
    duration: "3",
    durationLabel: "Months",
    badge: "Govt.",
    badgeLabel: "Certified",
    fee: 5000,
  },
  {
    key: "Tally Prime",
    title: "Tally Prime",
    icon: "T",
    description:
      "Accounting, GST billing, ledgers, inventory, and reports for business-ready bookkeeping skills.",
    duration: "6",
    durationLabel: "Months",
    badge: "Industry",
    badgeLabel: "Standard",
    fee: 6000,
  },
  {
    key: "Typing - English",
    title: "Typing - English",
    icon: "K",
    description:
      "English typing practice for 30 and 40 wpm tracks, ideal for government exam aspirants and office roles.",
    duration: "30/40",
    durationLabel: "wpm",
    badge: "Exam",
    badgeLabel: "Ready",
    fee: 6800,
  },
  {
    key: "Typing - Marathi",
    title: "Typing - Marathi",
    icon: "M",
    description:
      "Marathi typewriting with guided preparation for official speed tests and job-focused certification.",
    duration: "30/40",
    durationLabel: "wpm",
    badge: "Marathi",
    badgeLabel: "Language",
    fee: 6800,
  },
];

const whyCards = [
  ["CT", "Certified Training", "Aligned with recognized certification standards and exam-oriented learning."],
  ["EF", "Experienced Faculty", "Practical teachers focused on student clarity, confidence, and outcomes."],
  ["16+", "16+ Years Experience", "Trusted institute experience with long-running local teaching support and consistent student guidance."],
  ["PL", "Practical Learning", "Hands-on lab sessions, live software use, and structured daily practice."],
  ["AF", "Affordable Fees", "Career-relevant courses offered at accessible pricing with guided support."],
  ["LO", "Prime Location", "Campus access near Tahsildar Office Main Road, plus Bhaji Mandai in front of Hanuman Temple, Shirol."],
  ["PR", "Proven Results", "Students move into jobs, exam readiness, and stronger digital confidence."],
];

const calculatorCourses = [
  { id: "mscit", label: "MS-CIT", meta: "3 Months - Govt. Certified", fee: 5000 },
  { id: "tally", label: "Tally Prime", meta: "6 Months - Accounting", fee: 6000 },
  { id: "typing", label: "Typewriting", meta: "English or Marathi", fee: 6800 },
];

const typingChoices = [
  "English 30 wpm",
  "English 40 wpm",
  "Marathi 30 wpm",
  "Marathi 40 wpm",
];

const processSteps = [
  [
    "01",
    "Choose Your Course",
    "Pick MS-CIT, Tally Prime, or typewriting based on your exam, office, or accounting goal.",
  ],
  [
    "02",
    "Submit Enquiry",
    "Fill the admission form with your details so the institute can contact you and confirm the batch.",
  ],
  [
    "03",
    "Confirm Payment",
    "Use the fee calculator and UPI payment block, then share the payment screenshot on WhatsApp for confirmation.",
  ],
];

const faqs = [
  [
    "What is the eligibility to enroll in MS-CIT?",
    "Students who have passed 7th standard or above can enroll in MS-CIT. There is no upper age limit.",
  ],
  [
    "How long is the MS-CIT course and what is the fee?",
    "MS-CIT is a 3-month course with a fee of Rs. 5,000 covering computer basics, MS Office, internet, email, and digital literacy.",
  ],
  [
    "Is Tally Prime useful for government jobs?",
    "Tally Prime is strongest for private sector accounting and office roles. For government jobs, MS-CIT and typing are often more directly relevant.",
  ],
  [
    "What is the difference between 30 wpm and 40 wpm in typing?",
    "30 wpm is common for many clerk posts, while 40 wpm is the higher benchmark for faster job-readiness and certain positions.",
  ],
  [
    "Can I enroll in multiple courses at the same time?",
    "Yes. Many students combine MS-CIT with typing. Batch planning can be adjusted based on timing availability.",
  ],
  [
    "Do you provide a certificate after course completion?",
    "Yes. Course completion certificates are provided, and recognized programs follow the relevant certification process.",
  ],
  [
    "What are the batch timings?",
    "Morning and evening batches are supported. Contact the institute to confirm current batch slots and seat availability.",
  ],
  [
    "How can I pay the fees?",
    "Fees can be paid at the institute or through UPI after calculating the total on the website.",
  ],
];

const siteSettingsDefaults = {
  instituteName: "Priyadarshini Computer & Typewriting Institute, Shirol",
  shortName: "Priyadarshini Computer & Typewriting Institute",
  location:
    "Near Tahsildar Office Main Road, Shirol, Kolhapur. 2nd address: Bhaji Mandai, front of Hanuman Temple, Shirol.",
  whatsappNumber: "917558628660",
  contactPhone: "+91 755 862 8660",
  upiId: "",
  upiPayeeName: "Priyadarshini Institute",
  upiQrImageUrl: "",
  upiPaymentNote: "Admission fee payment",
};

const navItems = [
  ["home", "Home"],
  ["courses", "Courses"],
  ["fee-calc", "Fee Calc"],
  ["process", "Process"],
  ["faq", "FAQ"],
  ["contact", "Contact"],
];

const initialAdmissionForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  email: "",
  contact: "",
  parentContact: "",
  address: "",
  highestEducation: [],
  courses: [],
  typingOptions: [],
};

function App() {
  const admissionRef = useRef(null);
  const adminMode = typeof window !== "undefined" && window.location.search.includes("admin=1");
  const [navOpen, setNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [toast, setToast] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [calcSelections, setCalcSelections] = useState({});
  const [calcTypingOption, setCalcTypingOption] = useState("");
  const [admissionForm, setAdmissionForm] = useState(initialAdmissionForm);
  const [isSubmittingAdmission, setIsSubmittingAdmission] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [adminView, setAdminView] = useState("enquiries");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [siteSettings, setSiteSettings] = useState(siteSettingsDefaults);
  const [settingsForm, setSettingsForm] = useState(siteSettingsDefaults);
  const [adminAccessForm, setAdminAccessForm] = useState({
    username: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [publicHighlights, setPublicHighlights] = useState({ totalAdmissions: 0, rows: [] });
  const [adminState, setAdminState] = useState({
    rows: [],
    loading: false,
    error: "",
    query: "",
    page: 1,
    total: 0,
    stats: { total: 0, pending: 0, paid: 0 },
  });
  const [messageState, setMessageState] = useState({
    rows: [],
    loading: false,
    error: "",
    query: "",
    page: 1,
    total: 0,
    stats: { total: 0, fresh: 0, resolved: 0 },
  });

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const payload = await response.json();
        if (!response.ok) {
          return;
        }

        const nextSettings = {
          instituteName: payload.settings.institute_name || siteSettingsDefaults.instituteName,
          shortName: payload.settings.short_name || siteSettingsDefaults.shortName,
          location: payload.settings.location || siteSettingsDefaults.location,
          whatsappNumber: payload.settings.whatsapp_number || siteSettingsDefaults.whatsappNumber,
          contactPhone: payload.settings.contact_phone || siteSettingsDefaults.contactPhone,
          upiId: payload.settings.upi_id || "",
          upiPayeeName: payload.settings.upi_payee_name || siteSettingsDefaults.upiPayeeName,
          upiQrImageUrl: payload.settings.upi_qr_image_url || "",
          upiPaymentNote: payload.settings.upi_payment_note || siteSettingsDefaults.upiPaymentNote,
        };

        setSiteSettings(nextSettings);
        setSettingsForm(nextSettings);
      } catch {
        // Keep defaults if settings API is not configured yet.
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const response = await fetch("/api/highlights");
        const payload = await response.json();
        if (!response.ok) {
          return;
        }
        setPublicHighlights(payload);
      } catch {
        // Leave empty state until database is configured.
      }
    };

    loadHighlights();
  }, []);

  const calculatorTotal = useMemo(
    () => Object.values(calcSelections).reduce((sum, fee) => sum + fee, 0),
    [calcSelections],
  );

  const selectedCalculatorLabels = useMemo(() => {
    return calculatorCourses
      .filter((course) => calcSelections[course.id])
      .map((course) => course.label)
      .join(" + ");
  }, [calcSelections]);

  const adminStats = useMemo(() => {
    return {
      total: adminState.stats.total,
      pending: adminState.stats.pending,
      paid: adminState.stats.paid,
    };
  }, [adminState.stats]);

  const messageStats = useMemo(() => {
    return {
      total: messageState.stats.total,
      fresh: messageState.stats.fresh,
      resolved: messageState.stats.resolved,
    };
  }, [messageState.stats]);
  const totalAdminPages = useMemo(() => Math.max(1, Math.ceil(adminState.total / 20)), [adminState.total]);
  const totalMessagePages = useMemo(() => Math.max(1, Math.ceil(messageState.total / 20)), [messageState.total]);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.location)}`;
  const whatsappUrl = `https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(
    `Hello, I want to know more about admissions at ${siteSettings.shortName}.`,
  )}`;
  const upiPaymentLink =
    calculatorTotal && siteSettings.upiId
      ? `upi://pay?pa=${encodeURIComponent(siteSettings.upiId)}&pn=${encodeURIComponent(
          siteSettings.upiPayeeName || siteSettings.shortName,
        )}&am=${calculatorTotal}&cu=INR&tn=${encodeURIComponent(siteSettings.upiPaymentNote || "Admission fee payment")}`
      : "";

  const showToast = (message) => setToast(message);

  const copyUpiId = async () => {
    if (!siteSettings.upiId) {
      showToast("Add a UPI ID from admin settings first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(siteSettings.upiId);
      showToast("UPI ID copied.");
    } catch {
      showToast("Unable to copy UPI ID on this device.");
    }
  };

  const downloadReceipt = async (receipt) => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(siteSettings.instituteName, 20, 24);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(siteSettings.location, 20, 32);
    pdf.text(`Contact: ${siteSettings.contactPhone}`, 20, 39);

    pdf.setDrawColor(26, 107, 107);
    pdf.line(20, 45, 190, 45);

    pdf.setFont("helvetica", "bold");
    pdf.text("Admission Receipt", 20, 56);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Student ID: ${receipt.studentCode}`, 20, 68);
    pdf.text(`Student Name: ${receipt.studentName}`, 20, 76);
    pdf.text(`Courses: ${receipt.selectedCourses}`, 20, 84);
    pdf.text(`Admission Date: ${receipt.admissionDate}`, 20, 92);
    pdf.text(`Payment Status: ${receipt.paymentStatus}`, 20, 100);
    pdf.text("This receipt confirms that the enquiry was submitted successfully.", 20, 114);

    pdf.save(`${receipt.studentCode}-receipt.pdf`);
  };

  const scrollToForm = (course) => {
    admissionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setAdmissionForm((current) => ({ ...current, courses: [course] }));
  };

  const toggleCalcCourse = (id, fee) => {
    setCalcSelections((current) => {
      const next = { ...current };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = fee;
      }
      return next;
    });
  };

  const onAdmissionChange = (field, value) => {
    setAdmissionForm((current) => ({ ...current, [field]: value }));
  };

  const toggleFormArrayValue = (field, value) => {
    setAdmissionForm((current) => {
      const set = new Set(current[field]);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      return { ...current, [field]: Array.from(set) };
    });
  };

  const submitAdmission = async (event) => {
    event.preventDefault();

    if (!admissionForm.firstName || !admissionForm.lastName || !admissionForm.contact) {
      showToast("Please fill first name, last name, and contact number.");
      return;
    }

    if (!admissionForm.gender) {
      showToast("Please select gender.");
      return;
    }

    if (!admissionForm.address.trim()) {
      showToast("Please fill your address.");
      return;
    }

    if (admissionForm.courses.length === 0) {
      showToast("Please select at least one course.");
      return;
    }

    setIsSubmittingAdmission(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(admissionForm),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to submit admission enquiry.");
      }

      setAdmissionForm(initialAdmissionForm);
      await downloadReceipt(payload);
      showToast("Admission enquiry submitted successfully.");
    } catch (error) {
      showToast(error.message || "Something went wrong while submitting the form.");
    } finally {
      setIsSubmittingAdmission(false);
    }
  };

  const submitContact = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to send message.");
      }

      setContactForm({ name: "", phone: "", message: "" });
      showToast("Message sent successfully. The institute will contact you soon.");
    } catch (error) {
      showToast(error.message || "Unable to send message.");
    }
  };

  const loadAdminSettings = async (credentials = adminCredentials) => {
    const response = await fetch("/api/admin/settings", {
      headers: {
        "x-admin-user": credentials.username,
        "x-admin-pass": credentials.password,
      },
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Unable to load site settings.");
    }

    const mappedSettings = {
      instituteName: payload.rows.find((row) => row.setting_key === "institute_name")?.setting_value || siteSettingsDefaults.instituteName,
      shortName: payload.rows.find((row) => row.setting_key === "short_name")?.setting_value || siteSettingsDefaults.shortName,
      location: payload.rows.find((row) => row.setting_key === "location")?.setting_value || siteSettingsDefaults.location,
      whatsappNumber:
        payload.rows.find((row) => row.setting_key === "whatsapp_number")?.setting_value ||
        siteSettingsDefaults.whatsappNumber,
      contactPhone:
        payload.rows.find((row) => row.setting_key === "contact_phone")?.setting_value ||
        siteSettingsDefaults.contactPhone,
      upiId: payload.rows.find((row) => row.setting_key === "upi_id")?.setting_value || "",
      upiPayeeName:
        payload.rows.find((row) => row.setting_key === "upi_payee_name")?.setting_value ||
        siteSettingsDefaults.upiPayeeName,
      upiQrImageUrl:
        payload.rows.find((row) => row.setting_key === "upi_qr_image_url")?.setting_value || "",
      upiPaymentNote:
        payload.rows.find((row) => row.setting_key === "upi_payment_note")?.setting_value ||
        siteSettingsDefaults.upiPaymentNote,
    };

    setSiteSettings(mappedSettings);
    setSettingsForm(mappedSettings);
    setAdminAccessForm((current) => ({
      ...current,
      username: credentials.username,
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const loadAdminRows = async (credentials = adminCredentials, overrides = {}) => {
    const nextQuery = overrides.query ?? adminState.query;
    const nextPage = overrides.page ?? adminState.page;
    const params = new URLSearchParams({
      limit: "20",
      offset: String((nextPage - 1) * 20),
    });
    if (nextQuery.trim()) {
      params.set("query", nextQuery.trim());
    }

    setAdminState((current) => ({ ...current, loading: true, error: "" }));

    try {
      const response = await fetch(`/api/admin/registrations?${params.toString()}`, {
        headers: {
          "x-admin-user": credentials.username,
          "x-admin-pass": credentials.password,
        },
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to load registrations.");
      }

      setAdminState((current) => ({
        ...current,
        rows: payload.rows,
        total: payload.total || 0,
        stats: payload.stats || current.stats,
        page: nextPage,
        query: nextQuery,
        loading: false,
        error: "",
      }));
      await loadAdminSettings(credentials);
    } catch (error) {
      setAdminState((current) => ({
        ...current,
        loading: false,
        error: error.message || "Admin login failed.",
      }));
      throw error;
    }
  };

  const loadMessages = async (credentials = adminCredentials, overrides = {}) => {
    const nextQuery = overrides.query ?? messageState.query;
    const nextPage = overrides.page ?? messageState.page;
    const params = new URLSearchParams({
      limit: "20",
      offset: String((nextPage - 1) * 20),
    });
    if (nextQuery.trim()) {
      params.set("query", nextQuery.trim());
    }

    setMessageState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const response = await fetch(`/api/admin/messages?${params.toString()}`, {
        headers: {
          "x-admin-user": credentials.username,
          "x-admin-pass": credentials.password,
        },
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to load messages.");
      }

      setMessageState((current) => ({
        ...current,
        rows: payload.rows,
        total: payload.total || 0,
        stats: payload.stats || current.stats,
        page: nextPage,
        query: nextQuery,
        loading: false,
        error: "",
      }));
    } catch (error) {
      setMessageState((current) => ({
        ...current,
        loading: false,
        error: error.message || "Unable to load messages.",
      }));
      throw error;
    }
  };

  const adminLogin = async (event) => {
    event.preventDefault();

    if (!adminCredentials.username.trim() || !adminCredentials.password.trim()) {
      setAdminState((current) => ({ ...current, error: "Enter admin username and password." }));
      return;
    }

    const credentials = {
      username: adminCredentials.username.trim(),
      password: adminCredentials.password,
    };

    try {
      await Promise.all([
        loadAdminRows(credentials, { page: 1, query: "" }),
        loadMessages(credentials, { page: 1, query: "" }),
      ]);
      setAdminLoggedIn(true);
    } catch {
      setAdminLoggedIn(false);
    }
  };

  useEffect(() => {
    if (!adminLoggedIn) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      loadAdminRows(adminCredentials).catch(() => {});
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [adminLoggedIn, adminState.query, adminState.page]);

  useEffect(() => {
    if (!adminLoggedIn) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      loadMessages(adminCredentials).catch(() => {});
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [adminLoggedIn, messageState.query, messageState.page]);

  const saveAdminSettings = async () => {
    if (adminAccessForm.newPassword && adminAccessForm.newPassword !== adminAccessForm.confirmPassword) {
      showToast("New password and confirm password must match.");
      return;
    }

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": adminCredentials.username,
          "x-admin-pass": adminCredentials.password,
        },
        body: JSON.stringify({
          institute_name: settingsForm.instituteName,
          short_name: settingsForm.shortName,
          location: settingsForm.location,
          whatsapp_number: settingsForm.whatsappNumber,
          contact_phone: settingsForm.contactPhone,
          upi_id: settingsForm.upiId,
          upi_payee_name: settingsForm.upiPayeeName,
          upi_qr_image_url: settingsForm.upiQrImageUrl,
          upi_payment_note: settingsForm.upiPaymentNote,
          admin_username:
            adminAccessForm.username && adminAccessForm.username !== adminCredentials.username
              ? adminAccessForm.username
              : undefined,
          admin_password: adminAccessForm.newPassword || undefined,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to save settings.");
      }

      setSiteSettings(settingsForm);
      if (adminAccessForm.username && adminAccessForm.username !== adminCredentials.username) {
        setAdminCredentials((current) => ({ ...current, username: adminAccessForm.username }));
      }
      setAdminAccessForm((current) => ({ ...current, newPassword: "", confirmPassword: "" }));
      showToast("Admin settings updated successfully.");
    } catch (error) {
      showToast(error.message || "Unable to save settings.");
    }
  };

  const updateMessageStatus = async (id, status) => {
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": adminCredentials.username,
          "x-admin-pass": adminCredentials.password,
        },
        body: JSON.stringify({ id, status }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to update message status.");
      }
      await loadMessages(adminCredentials);
    } catch (error) {
      showToast(error.message || "Unable to update message status.");
    }
  };

  const deleteMessage = async (id) => {
    try {
      const response = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-user": adminCredentials.username,
          "x-admin-pass": adminCredentials.password,
        },
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete message.");
      }
      await loadMessages(adminCredentials);
    } catch (error) {
      showToast(error.message || "Unable to delete message.");
    }
  };

  const updatePaymentStatus = async (id, nextStatus) => {
    try {
      const response = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": adminCredentials.username,
          "x-admin-pass": adminCredentials.password,
        },
        body: JSON.stringify({ id, paymentStatus: nextStatus }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to update payment status.");
      }
      await loadAdminRows(adminCredentials);
    } catch (error) {
      showToast(error.message || "Unable to update payment status.");
    }
  };

  const deleteRegistration = async (id) => {
    try {
      const response = await fetch(`/api/admin/registrations?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-user": adminCredentials.username,
          "x-admin-pass": adminCredentials.password,
        },
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete registration.");
      }
      await loadAdminRows(adminCredentials);
    } catch (error) {
      showToast(error.message || "Unable to delete registration.");
    }
  };

  const nextPaymentStatus = (status) => {
    const states = ["pending", "paid", "confirmed"];
    const current = states.indexOf(status);
    return states[(current + 1) % states.length];
  };

  return (
    <div className="site-shell">
      <nav className={navScrolled ? "site-nav scrolled" : "site-nav"} id="navbar">
        <a className="nav-brand" href="#home">
          <span className="brand-dot">P</span>
          <span>{siteSettings.shortName}</span>
        </a>

        <button className="hamburger" type="button" onClick={() => setNavOpen((current) => !current)}>
          <span />
          <span />
          <span />
        </button>

        <ul className={navOpen ? "nav-links open" : "nav-links"}>
          {navItems.map(([href, label]) => (
            <li key={href}>
              <a href={`#${href}`} onClick={() => setNavOpen(false)}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <a className="nav-cta" href="#admission" onClick={() => setNavOpen(false)}>
              Enroll Now
            </a>
          </li>
        </ul>
      </nav>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-bg-circle circle-a" />
          <div className="hero-bg-circle circle-b" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-label">
                <span className="pulse" />
                2026 Admissions Open - Shirol
              </div>
              <h1 className="hero-title">
                Shape Your
                <br />
                <span className="accent">Digital Future</span>
                <br />
                <span className="gold">With Confidence</span>
              </h1>
              <p className="hero-sub">
                Priyadarshini Computer and Typewriting Institute, Shirol offers
                career-oriented, certification-driven training in a clean,
                supportive, and job-focused learning environment.
              </p>
              <div className="hero-highlights">
                <span>16+ years experience</span>
                <span>Shirol, Kolhapur</span>
                <span>Admission guidance + practical training</span>
              </div>
              <div className="hero-addr">
                <span className="pin">+</span>
                <span>{siteSettings.location}</span>
              </div>
              <div className="hero-btns">
                <a className="btn-primary" href="#admission">
                  Apply for Admission
                </a>
                <a className="btn-outline" href="#fee-calc">
                  Calculate Fees
                </a>
              </div>
            </div>

            <div className="hero-card-wrap">
              <div className="hero-card" data-reveal="">
                <div className="hero-card-badge">Seats Filling Fast</div>
                <h2 className="hero-card-title">Available Courses</h2>
                {courseCards.map((course) => (
                  <button
                    className="course-pill course-pill-button"
                    key={course.key}
                    type="button"
                    onClick={() => scrollToForm(course.key)}
                  >
                    <div>
                      <div className="pill-name">{course.title}</div>
                      <div className="pill-meta">
                        {course.durationLabel === "Months" ? `${course.duration} Months` : "30 / 40 wpm"}
                      </div>
                    </div>
                    <div className="pill-price">Rs. {course.fee.toLocaleString("en-IN")}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="courses" className="light-section">
          <SectionHead
            tag="Our Programs"
            title="Courses We"
            accent="Offer"
            description="Choose a program that fits your career goals and practical skill requirements."
          />
          <div className="courses-grid">
            {courseCards.map((course) => (
              <article className="course-card" key={course.key} data-reveal="">
                <div className="course-icon">{course.icon}</div>
                <h3>{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-meta-row">
                  <div className="meta-item">
                    <div className="meta-val">{course.duration}</div>
                    <div className="meta-lbl">{course.durationLabel}</div>
                  </div>
                  <div className="divider-v" />
                  <div className="meta-item">
                    <div className="meta-val">{course.badge}</div>
                    <div className="meta-lbl">{course.badgeLabel}</div>
                  </div>
                  <div className="divider-v" />
                  <div className="meta-item">
                    <div className="meta-val">Rs. {course.fee.toLocaleString("en-IN")}</div>
                    <div className="meta-lbl">Fees</div>
                  </div>
                </div>
                <button className="enroll-btn" type="button" onClick={() => scrollToForm(course.key)}>
                  Enroll Now
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="why" className="dark-section">
          <SectionHead
            tag="Why Choose Us"
            title="The Priyadarshini"
            accent="Difference"
            description="We do not just teach software and typing. We build confidence, discipline, and job-ready skill."
          />
          <div className="why-grid">
            {whyCards.map(([icon, title, text]) => (
              <article className="why-card" key={title} data-reveal="">
                <div className="why-icon">{icon}</div>
                <h4>{title}</h4>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="admissions-live" className="mist-section">
          <SectionHead
            tag="Live Admissions"
            title="Recent"
            accent="Admissions"
            description="This section shows real enquiry activity from the website after students submit the admission form."
          />
          <div className="testi-grid">
            <article className="testi-card highlight-stat" data-reveal="">
              <div className="stars">LIVE</div>
              <p className="testi-text">Total admission enquiries received through the website.</p>
              <div className="highlight-total">{publicHighlights.totalAdmissions}</div>
            </article>

            {publicHighlights.rows.length > 0 ? (
              publicHighlights.rows.map((row) => (
                <article className="testi-card" key={row.studentCode} data-reveal="">
                  <div className="stars">{row.paymentStatus.toUpperCase()}</div>
                  <p className="testi-text">
                    {row.studentName} submitted an enquiry for {row.selectedCourses}.
                  </p>
                  <div className="testi-author">
                    <div className="testi-avatar">{row.studentName.charAt(0)}</div>
                    <div>
                      <div className="testi-name">{row.studentCode}</div>
                      <div className="testi-course">
                        {new Date(row.admissionDate).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <article className="testi-card" data-reveal="">
                <div className="stars">READY</div>
                <p className="testi-text">
                  No live admission records yet. Once the first students submit the form, recent admissions will
                  appear here automatically.
                </p>
                <div className="testi-author">
                  <div className="testi-avatar">N</div>
                  <div>
                    <div className="testi-name">No admissions yet</div>
                    <div className="testi-course">Waiting for first enquiry</div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>

        <section id="fee-calc" className="light-section">
          <SectionHead
            tag="Plan Your Budget"
            title="Fee"
            accent="Calculator"
            description="Tap a course card below to select it, then review the total and payment details instantly."
          />
          <div className="calc-wrap" data-reveal="">
            <div className="calc-help-strip">
              <strong>How to use:</strong> select one or more course cards below. Selected cards turn green and add to the total immediately.
            </div>
            <div className="calc-courses">
              {calculatorCourses.map((course) => {
                const selected = Boolean(calcSelections[course.id]);
                return (
                  <button
                    className={selected ? "calc-course-card selected" : "calc-course-card"}
                    key={course.id}
                    type="button"
                    onClick={() => toggleCalcCourse(course.id, course.fee)}
                    aria-pressed={selected}
                  >
                    <span className="calc-checkbox">{selected ? "OK" : "+"}</span>
                    <div className="calc-course-name">{course.label}</div>
                    <div className="calc-course-dur">{course.meta}</div>
                    <div className="calc-course-fee">Rs. {course.fee.toLocaleString("en-IN")}</div>
                    <div className="calc-course-state">{selected ? "Selected" : "Tap to Select"}</div>
                  </button>
                );
              })}
            </div>

            <div className={calcSelections.typing ? "calc-typing-opts show" : "calc-typing-opts"}>
              <h4>Select Typing Language and Speed</h4>
              <div className="calc-typing-row">
                {typingChoices.map((choice) => (
                  <label className="check-item" key={choice}>
                    <input
                      checked={calcTypingOption === choice}
                      name="calcTyping"
                      onChange={() => setCalcTypingOption(choice)}
                      type="radio"
                    />
                    {choice}
                  </label>
                ))}
              </div>
            </div>

            <div className="calc-result">
              <div className="calc-result-summary">
                <div>
                  <div className="calc-result-label">Total Estimated Fee</div>
                  <div className="calc-result-total">Rs. {calculatorTotal.toLocaleString("en-IN")}</div>
                  <div className="calc-result-label subtle">
                    {selectedCalculatorLabels || "No course selected"}
                    {calcSelections.typing && calcTypingOption ? ` - ${calcTypingOption}` : ""}
                  </div>
                </div>
                <div className="calc-result-actions">
                  <button className="calc-upi-btn secondary" type="button" onClick={copyUpiId}>
                    Copy UPI ID
                  </button>
                  <a
                    className={upiPaymentLink ? "calc-upi-btn" : "calc-upi-btn disabled"}
                    href={
                      upiPaymentLink ||
                      "#fee-calc"
                    }
                    onClick={(event) => {
                      if (!calculatorTotal) {
                        event.preventDefault();
                        showToast("Please select at least one course first.");
                        return;
                      }
                      if (!siteSettings.upiId) {
                        event.preventDefault();
                        showToast("UPI is not configured yet. Update it from admin settings.");
                      }
                    }}
                  >
                    Pay via UPI / QR
                  </a>
                </div>
              </div>

              <div className="calc-payment-panel">
                <div className="calc-qr-card">
                  {siteSettings.upiQrImageUrl ? (
                    <img
                      className="calc-qr-image"
                      src={siteSettings.upiQrImageUrl}
                      alt="Institute UPI QR code"
                    />
                  ) : (
                    <div className="calc-qr-empty">
                      <strong>QR not added yet</strong>
                      <span>Add a QR image URL from admin to show scannable payment here.</span>
                    </div>
                  )}
                </div>
                <div className="calc-payment-copy">
                  <div className="calc-payment-kicker">UPI Payment</div>
                  <h3>{siteSettings.upiPayeeName || siteSettings.shortName}</h3>
                  <div className="calc-upi-id">{siteSettings.upiId || "UPI ID not configured yet"}</div>
                  <p>
                    {siteSettings.upiPaymentNote ||
                      "Add a payment note from admin settings for clearer payment references."}
                  </p>
                  <ul className="calc-payment-meta">
                    <li>Currency: INR only</li>
                    <li>Amount: Rs. {calculatorTotal.toLocaleString("en-IN")}</li>
                    <li>Status: Share payment screenshot on WhatsApp after paying</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="mist-section">
          <SectionHead
            tag="Simple Admission"
            title="How It"
            accent="Works"
            description="The site is focused on enquiry, payment, and admin follow-up, so this section replaces the old gallery with something more useful."
          />
          <div className="process-grid">
            {processSteps.map(([step, title, description]) => (
              <article className="process-card" key={step} data-reveal="">
                <span className="process-step">{step}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="light-section">
          <SectionHead
            tag="Got Questions?"
            title="Frequently Asked"
            accent="Questions"
            description="Everything you need to know before enrolling."
          />
          <div className="faq-wrap">
            <div className="faq-intro-card">
              <div>
                <strong>Need a quick answer?</strong>
                <p>
                  Open a question below to view details about admissions, courses,
                  timings, and fees.
                </p>
              </div>
              <span className="faq-intro-badge">FAQ Desk</span>
            </div>
            {faqs.map(([question, answer], index) => {
              const open = activeFaq === index;
              return (
                <article className={open ? "faq-item open" : "faq-item"} key={question}>
                  <button className="faq-q" type="button" onClick={() => setActiveFaq(open ? null : index)}>
                    <span>{question}</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-a">
                    <p>{answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mist-section" id="admission" ref={admissionRef}>
          <SectionHead
            tag="Admissions Open"
            title="Fill Your"
            accent="Admission Form"
            description="Complete the form below and the team will contact you with batch and admission details."
          />

          <form className="form-wrap" onSubmit={submitAdmission}>
            <div className="form-section-title">Personal Information</div>

            <div className="form-grid three">
              <Field label="First Name *">
                <input
                  required
                  value={admissionForm.firstName}
                  onChange={(event) => onAdmissionChange("firstName", event.target.value)}
                />
              </Field>
              <Field label="Middle Name">
                <input
                  value={admissionForm.middleName}
                  onChange={(event) => onAdmissionChange("middleName", event.target.value)}
                />
              </Field>
              <Field label="Last Name *">
                <input
                  required
                  value={admissionForm.lastName}
                  onChange={(event) => onAdmissionChange("lastName", event.target.value)}
                />
              </Field>
            </div>

            <div className="form-grid">
              <Field label="Gender *">
                <div className="radio-group">
                  {["Male", "Female", "Other"].map((option) => (
                    <label className="radio-item" key={option}>
                      <input
                        checked={admissionForm.gender === option}
                        name="gender"
                        onChange={() => onAdmissionChange("gender", option)}
                        type="radio"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Email Address">
                <input
                  type="email"
                  value={admissionForm.email}
                  onChange={(event) => onAdmissionChange("email", event.target.value)}
                />
              </Field>
            </div>

            <div className="form-grid">
              <Field label="Contact Number *">
                <input
                  required
                  value={admissionForm.contact}
                  onChange={(event) => onAdmissionChange("contact", event.target.value)}
                />
              </Field>
              <Field label="Parent / Guardian Contact">
                <input
                  value={admissionForm.parentContact}
                  onChange={(event) => onAdmissionChange("parentContact", event.target.value)}
                />
              </Field>
            </div>

            <Field label="Full Address *">
              <textarea
                required
                rows="4"
                value={admissionForm.address}
                onChange={(event) => onAdmissionChange("address", event.target.value)}
              />
            </Field>

            <div className="form-section-title">Education and Course</div>

            <Field label="Highest Education *">
              <div className="check-group">
                {["10th", "12th", "Graduation", "Post Graduation"].map((option) => (
                  <label className="check-item" key={option}>
                    <input
                      checked={admissionForm.highestEducation.includes(option)}
                      onChange={() => toggleFormArrayValue("highestEducation", option)}
                      type="checkbox"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Course Selection *">
              <div className="check-group">
                {courseCards.map((course) => (
                  <label className="check-item" key={course.key}>
                    <input
                      checked={admissionForm.courses.includes(course.key)}
                      onChange={() => toggleFormArrayValue("courses", course.key)}
                      type="checkbox"
                    />
                    {course.title} (Rs. {course.fee.toLocaleString("en-IN")})
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Typing Options">
              <div className="check-group">
                {typingChoices.map((option) => (
                  <label className="check-item" key={option}>
                    <input
                      checked={admissionForm.typingOptions.includes(option)}
                      onChange={() => toggleFormArrayValue("typingOptions", option)}
                      type="checkbox"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </Field>

            <button className="submit-btn" disabled={isSubmittingAdmission} type="submit">
              {isSubmittingAdmission ? "Submitting..." : "Submit Admission Enquiry"}
            </button>
          </form>
        </section>

        <section id="contact" className="light-section">
          <SectionHead tag="Get In Touch" title="We Are Here to" accent="Help You" />
          <div className="contact-shell">
            <div className="contact-grid">
              <div className="contact-info">
                <h3>Institute Details</h3>
                <ContactItem title="Address" body={`${siteSettings.location}, Karnataka`} />
                <ContactItem title="Phone" body={siteSettings.contactPhone} />
                <ContactItem title="Working Hours" body="Monday to Saturday: 9:00 AM to 6:00 PM. Sunday closed." />
                <div className="contact-actions">
                  <a className="contact-action-btn" href={mapsUrl} target="_blank" rel="noreferrer">
                    Open in Google Maps
                  </a>
                  <a className="contact-action-btn secondary" href={whatsappUrl} target="_blank" rel="noreferrer">
                    Chat on WhatsApp
                  </a>
                </div>
                <a className="map-placeholder map-link" href={mapsUrl} target="_blank" rel="noreferrer">
                  <span>{siteSettings.location}</span>
                  <small>Tap to open direct Google Maps navigation</small>
                </a>
              </div>

              <form className="contact-form-card" onSubmit={submitContact}>
                <h4>Send Us a Message</h4>
                <Field label="Your Name">
                  <input
                    required
                    value={contactForm.name}
                    onChange={(event) => setContactForm((current) => ({ ...current, name: event.target.value }))}
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    required
                    value={contactForm.phone}
                    onChange={(event) => setContactForm((current) => ({ ...current, phone: event.target.value }))}
                  />
                </Field>
                <Field label="Your Message">
                  <textarea
                    required
                    rows="5"
                    value={contactForm.message}
                    onChange={(event) => setContactForm((current) => ({ ...current, message: event.target.value }))}
                  />
                </Field>
                <button className="submit-btn compact" type="submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <strong>{siteSettings.instituteName}</strong>
            <p>{siteSettings.location}</p>
            <div className="footer-quick-actions">
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                Get Directions
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp Us
              </a>
            </div>
          </div>

          <div className="footer-nav">
            <span className="footer-heading">Quick Links</span>
            <div className="footer-links">
              {[...navItems, ["admission", "Admission"]].map(([href, label]) => (
                <a href={`#${href}`} key={href}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-contact">
            <span className="footer-heading">Contact</span>
            <a href={`tel:${siteSettings.contactPhone.replace(/\s+/g, "")}`}>{siteSettings.contactPhone}</a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp Chat
            </a>
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              Google Maps
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright 2026 All Rights Reserved</p>
          <p>Admissions, messages, and settings are managed securely from the admin panel.</p>
        </div>
      </footer>

      <div className="floating-actions">
        <a className="wa-fab directions-fab" href={mapsUrl} target="_blank" rel="noreferrer" aria-label="Get Directions">
          <span className="wa-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 22s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Zm0-8.5a3.5 3.5 0 1 1 0-7a3.5 3.5 0 0 1 0 7Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="wa-text">Get Directions</span>
        </a>

        <a className="wa-fab" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
          <span className="wa-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.89c0 2.1.55 4.15 1.59 5.96L0 24l6.31-1.65a11.8 11.8 0 0 0 5.72 1.46h.01c6.55 0 11.89-5.33 11.89-11.89c0-3.18-1.24-6.17-3.41-8.44ZM12.04 21.8h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.74.98 1-3.64-.24-.37a9.84 9.84 0 0 1-1.51-5.27C2.19 6.57 6.61 2.15 12.05 2.15c2.63 0 5.09 1.02 6.95 2.88a9.75 9.75 0 0 1 2.87 6.96c0 5.44-4.43 9.81-9.83 9.81Zm5.39-7.34c-.29-.14-1.73-.85-2-.95-.27-.1-.46-.14-.66.14-.19.29-.75.95-.92 1.15-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.66-1.59-.91-2.18-.24-.57-.49-.49-.66-.5h-.56c-.19 0-.5.07-.76.35-.26.29-1 1-1 2.43s1.03 2.8 1.17 2.99c.14.19 2.02 3.08 4.89 4.32.68.29 1.21.47 1.63.6.69.22 1.31.19 1.81.11.55-.08 1.72-.7 1.96-1.39.24-.68.24-1.27.17-1.39-.07-.11-.26-.18-.55-.33Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="wa-text">WhatsApp</span>
        </a>
      </div>

      <div className={toast ? "toast show" : "toast"}>{toast}</div>

      {adminMode ? (
        <div className="admin-overlay" onClick={() => { window.location.href = window.location.pathname; }}>
          <div className="admin-container" onClick={(event) => event.stopPropagation()}>
            {!adminLoggedIn ? (
              <div className="admin-login-box">
                <h2>Admin Login</h2>
                <p>Use your private admin credentials to access enquiries, messages, payment settings, and dashboard controls.</p>
                <form onSubmit={adminLogin}>
                  <input
                    className="admin-input"
                    placeholder="Username"
                    value={adminCredentials.username}
                    onChange={(event) =>
                      setAdminCredentials((current) => ({ ...current, username: event.target.value }))
                    }
                  />
                  <div className="password-wrap">
                    <input
                      className="admin-input"
                      placeholder="Password"
                      type={showAdminPassword ? "text" : "password"}
                      value={adminCredentials.password}
                      onChange={(event) =>
                        setAdminCredentials((current) => ({ ...current, password: event.target.value }))
                      }
                    />
                    <button
                      className="password-toggle"
                      type="button"
                      aria-label={showAdminPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowAdminPassword((current) => !current)}
                    >
                      {showAdminPassword ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M2.3 1 1 2.3l4.05 4.05A12.8 12.8 0 0 0 1 12c1.73 4.03 6.1 7 11 7 2.09 0 4.08-.54 5.82-1.49L21.7 21l1.3-1.3L2.3 1Zm9.7 15a4 4 0 0 1-4-4c0-.63.15-1.23.41-1.75l5.34 5.34c-.52.26-1.12.41-1.75.41Zm3.7-1.47-1.67-1.67c.18-.26.28-.58.28-.93a2 2 0 0 0-2-2c-.35 0-.67.1-.93.28L9.7 8.54A3.94 3.94 0 0 1 12 8c2.21 0 4 1.79 4 4 0 .82-.24 1.58-.65 2.23ZM12 5c4.9 0 9.27 2.97 11 7a12.7 12.7 0 0 1-3.77 4.81l-1.46-1.46A10.7 10.7 0 0 0 20.82 12C19.34 9.05 15.95 7 12 7c-1.15 0-2.26.18-3.28.52l-1.6-1.6A12.9 12.9 0 0 1 12 5Z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M12 5c4.9 0 9.27 2.97 11 7-1.73 4.03-6.1 7-11 7S2.73 16.03 1 12c1.73-4.03 6.1-7 11-7Zm0 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8Zm0-2a2 2 0 1 1 0-4a2 2 0 0 1 0 4Z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button className="admin-login-btn" type="submit">
                    {adminState.loading ? "Loading..." : "Login to Dashboard"}
                  </button>
                </form>
                {adminState.error ? <p className="admin-error">{adminState.error}</p> : null}
              </div>
            ) : (
              <div className="admin-dashboard">
                <div className="admin-nav">
                  <div className="admin-nav-brand">Priyadarshini Admin Dashboard</div>
                  <button
                    className="admin-logout"
                    onClick={() => {
                      window.location.href = window.location.pathname;
                      setAdminLoggedIn(false);
                      setAdminState({
                        rows: [],
                        loading: false,
                        error: "",
                        query: "",
                        page: 1,
                        total: 0,
                        stats: { total: 0, pending: 0, paid: 0 },
                      });
                      setMessageState({
                        rows: [],
                        loading: false,
                        error: "",
                        query: "",
                        page: 1,
                        total: 0,
                        stats: { total: 0, fresh: 0, resolved: 0 },
                      });
                    }}
                    type="button"
                  >
                    Back to Website
                  </button>
                </div>

                <div className="admin-body">
                  <div className="admin-hero-panel">
                    <div>
                      <span className="admin-hero-kicker">Control Center</span>
                      <h3>Manage enquiries, payment details, messages, and institute settings from one place.</h3>
                      <p>
                        Update the public site content instantly. Payment settings here control the fee calculator, QR block, UPI ID, and payment link on the live site.
                      </p>
                    </div>
                    <div className="admin-hero-badges">
                      <span>Admissions</span>
                      <span>Messages</span>
                      <span>Payments</span>
                      <span>Site Settings</span>
                    </div>
                  </div>

                  <div className="admin-stats">
                    <StatCard label="Total Students" value={adminStats.total} />
                    <StatCard label="Pending Payment" tone="gold" value={adminStats.pending} />
                    <StatCard label="Confirmed and Paid" tone="green" value={adminStats.paid} />
                    <StatCard label="New Messages" tone="red" value={messageStats.fresh} />
                  </div>

                  <div className="admin-tabs">
                    <button
                      className={adminView === "enquiries" ? "filter-btn active" : "filter-btn"}
                      onClick={() => setAdminView("enquiries")}
                      type="button"
                    >
                      Enquiries
                    </button>
                    <button
                      className={adminView === "messages" ? "filter-btn active" : "filter-btn"}
                      onClick={() => setAdminView("messages")}
                      type="button"
                    >
                      Messages
                    </button>
                    <button
                      className={adminView === "settings" ? "filter-btn active" : "filter-btn"}
                      onClick={() => setAdminView("settings")}
                      type="button"
                    >
                      Settings
                    </button>
                  </div>

                  {adminView === "settings" ? (
                  <div className="admin-settings-card">
                    <div className="admin-table-head">
                      <h3>Site Settings</h3>
                    </div>
                    <div className="settings-shell">
                      <section className="settings-section-card">
                        <div className="settings-section-head">
                          <h4>Institute Details</h4>
                          <p>These fields power the public header, contact area, footer, and WhatsApp/Maps actions.</p>
                        </div>
                        <div className="settings-grid">
                          <Field label="Institute Name">
                            <input
                              value={settingsForm.instituteName}
                              onChange={(event) =>
                                setSettingsForm((current) => ({
                                  ...current,
                                  instituteName: event.target.value,
                                }))
                              }
                            />
                          </Field>
                          <Field label="Short Name">
                            <input
                              value={settingsForm.shortName}
                              onChange={(event) =>
                                setSettingsForm((current) => ({
                                  ...current,
                                  shortName: event.target.value,
                                }))
                              }
                            />
                          </Field>
                          <Field label="Location">
                            <input
                              value={settingsForm.location}
                              onChange={(event) =>
                                setSettingsForm((current) => ({
                                  ...current,
                                  location: event.target.value,
                                }))
                              }
                            />
                          </Field>
                          <Field label="Contact Phone">
                            <input
                              value={settingsForm.contactPhone}
                              onChange={(event) =>
                                setSettingsForm((current) => ({
                                  ...current,
                                  contactPhone: event.target.value,
                                }))
                              }
                            />
                          </Field>
                          <Field label="WhatsApp Number">
                            <input
                              value={settingsForm.whatsappNumber}
                              onChange={(event) =>
                                setSettingsForm((current) => ({
                                  ...current,
                                  whatsappNumber: event.target.value,
                                }))
                              }
                            />
                          </Field>
                        </div>
                      </section>

                      <section className="settings-section-card">
                        <div className="settings-section-head">
                          <h4>Payment Settings</h4>
                          <p>These fields control the fee calculator payment panel, UPI payment link, and QR block.</p>
                        </div>
                        <div className="settings-grid">
                          <Field label="UPI ID">
                            <input
                              value={settingsForm.upiId}
                              onChange={(event) =>
                                setSettingsForm((current) => ({
                                  ...current,
                                  upiId: event.target.value,
                                }))
                              }
                            />
                          </Field>
                          <Field label="UPI Payee Name">
                            <input
                              value={settingsForm.upiPayeeName}
                              onChange={(event) =>
                                setSettingsForm((current) => ({
                                  ...current,
                                  upiPayeeName: event.target.value,
                                }))
                              }
                            />
                          </Field>
                          <Field label="QR Image URL">
                            <input
                              value={settingsForm.upiQrImageUrl}
                              onChange={(event) =>
                                setSettingsForm((current) => ({
                                  ...current,
                                  upiQrImageUrl: event.target.value,
                                }))
                              }
                            />
                          </Field>
                          <Field label="Payment Note">
                            <input
                              value={settingsForm.upiPaymentNote}
                              onChange={(event) =>
                                setSettingsForm((current) => ({
                                  ...current,
                                  upiPaymentNote: event.target.value,
                                }))
                              }
                            />
                          </Field>
                        </div>
                      </section>

                      <section className="settings-section-card">
                        <div className="settings-section-head">
                          <h4>Admin Access</h4>
                          <p>Change the admin username or set a new password after your first login.</p>
                        </div>
                        <div className="settings-grid">
                          <Field label="Admin Username">
                            <input
                              value={adminAccessForm.username}
                              onChange={(event) =>
                                setAdminAccessForm((current) => ({
                                  ...current,
                                  username: event.target.value,
                                }))
                              }
                            />
                          </Field>
                          <Field label="New Password">
                            <input
                              type="password"
                              value={adminAccessForm.newPassword}
                              onChange={(event) =>
                                setAdminAccessForm((current) => ({
                                  ...current,
                                  newPassword: event.target.value,
                                }))
                              }
                            />
                          </Field>
                          <Field label="Confirm Password">
                            <input
                              type="password"
                              value={adminAccessForm.confirmPassword}
                              onChange={(event) =>
                                setAdminAccessForm((current) => ({
                                  ...current,
                                  confirmPassword: event.target.value,
                                }))
                              }
                            />
                          </Field>
                        </div>
                      </section>
                    </div>
                    <button className="submit-btn admin-save-btn" onClick={saveAdminSettings} type="button">
                      Save Settings
                    </button>
                  </div>
                  ) : null}

                  {adminView === "enquiries" ? (
                  <div className="admin-table-wrap">
                    <div className="admin-table-head">
                      <h3>Student Admissions</h3>
                      <input
                        className="admin-search"
                        placeholder="Search student"
                        value={adminState.query}
                        onChange={(event) =>
                          setAdminState((current) => ({
                            ...current,
                            query: event.target.value,
                            page: 1,
                          }))
                        }
                      />
                    </div>

                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Course</th>
                            <th>Contact</th>
                            <th>Admission Date</th>
                            <th>Payment</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminState.rows.map((row) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.student_code}</td>
                              <td>{row.student_name}</td>
                              <td>{row.selected_courses}</td>
                              <td>{row.contact_number}</td>
                              <td>{row.admission_date}</td>
                              <td>
                                <span className={`badge ${row.payment_status}`}>{row.payment_status}</span>
                              </td>
                              <td>
                                <button
                                  className="action-btn"
                                  onClick={() => setSelectedRegistration(row)}
                                  type="button"
                                >
                                  View
                                </button>
                                <button
                                  className="action-btn"
                                  onClick={() =>
                                    updatePaymentStatus(row.id, nextPaymentStatus(row.payment_status))
                                  }
                                  type="button"
                                >
                                  Toggle
                                </button>
                                <button
                                  className="action-btn del"
                                  onClick={() => deleteRegistration(row.id)}
                                  type="button"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="admin-table-foot">
                      <div className="table-meta">
                        {adminState.loading ? "Loading enquiries..." : `${adminState.total} total enquiries`}
                      </div>
                      <div className="table-pagination">
                        <button
                          className="action-btn secondary"
                          disabled={adminState.page <= 1 || adminState.loading}
                          onClick={() =>
                            setAdminState((current) => ({
                              ...current,
                              page: Math.max(1, current.page - 1),
                            }))
                          }
                          type="button"
                        >
                          Previous
                        </button>
                        <span>
                          Page {adminState.page} of {totalAdminPages}
                        </span>
                        <button
                          className="action-btn secondary"
                          disabled={adminState.page >= totalAdminPages || adminState.loading}
                          onClick={() =>
                            setAdminState((current) => ({
                              ...current,
                              page: Math.min(totalAdminPages, current.page + 1),
                            }))
                          }
                          type="button"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                  ) : null}

                  {adminView === "messages" ? (
                  <div className="admin-table-wrap">
                    <div className="admin-table-head">
                      <h3>Contact Messages</h3>
                      <input
                        className="admin-search"
                        placeholder="Search messages"
                        value={messageState.query}
                        onChange={(event) =>
                          setMessageState((current) => ({
                            ...current,
                            query: event.target.value,
                            page: 1,
                          }))
                        }
                      />
                    </div>
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Received</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {messageState.rows.map((row) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.sender_name}</td>
                              <td>{row.phone_number}</td>
                              <td><span className={`badge ${row.status === "done" ? "paid" : "pending"}`}>{row.status}</span></td>
                              <td>{new Date(row.created_at).toLocaleDateString("en-IN")}</td>
                              <td>
                                <button className="action-btn" onClick={() => setSelectedMessage(row)} type="button">
                                  View
                                </button>
                                <button
                                  className="action-btn"
                                  onClick={() => updateMessageStatus(row.id, row.status === "done" ? "new" : "done")}
                                  type="button"
                                >
                                  Toggle
                                </button>
                                <button className="action-btn del" onClick={() => deleteMessage(row.id)} type="button">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="admin-table-foot">
                      <div className="table-meta">
                        {messageState.loading ? "Loading messages..." : `${messageState.total} total messages`}
                      </div>
                      <div className="table-pagination">
                        <button
                          className="action-btn secondary"
                          disabled={messageState.page <= 1 || messageState.loading}
                          onClick={() =>
                            setMessageState((current) => ({
                              ...current,
                              page: Math.max(1, current.page - 1),
                            }))
                          }
                          type="button"
                        >
                          Previous
                        </button>
                        <span>
                          Page {messageState.page} of {totalMessagePages}
                        </span>
                        <button
                          className="action-btn secondary"
                          disabled={messageState.page >= totalMessagePages || messageState.loading}
                          onClick={() =>
                            setMessageState((current) => ({
                              ...current,
                              page: Math.min(totalMessagePages, current.page + 1),
                            }))
                          }
                          type="button"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {selectedRegistration ? (
        <div className="detail-overlay" onClick={() => setSelectedRegistration(null)}>
          <div className="detail-card" onClick={(event) => event.stopPropagation()}>
            <h3>{selectedRegistration.student_name}</h3>
            <p><strong>Student ID:</strong> {selectedRegistration.student_code}</p>
            <p><strong>Courses:</strong> {selectedRegistration.selected_courses}</p>
            <p><strong>Contact:</strong> {selectedRegistration.contact_number}</p>
            <p><strong>Email:</strong> {selectedRegistration.email || "Not provided"}</p>
            <p><strong>Gender:</strong> {selectedRegistration.gender}</p>
            <p><strong>Parent Contact:</strong> {selectedRegistration.parent_contact || "Not provided"}</p>
            <p><strong>Education:</strong> {selectedRegistration.highest_education || "Not provided"}</p>
            <p><strong>Typing Options:</strong> {selectedRegistration.typing_options || "Not selected"}</p>
            <p><strong>Address:</strong> {selectedRegistration.address}</p>
            <p><strong>Payment Status:</strong> {selectedRegistration.payment_status}</p>
            <button className="admin-logout" onClick={() => setSelectedRegistration(null)} type="button">
              Close
            </button>
          </div>
        </div>
      ) : null}

      {selectedMessage ? (
        <div className="detail-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="detail-card" onClick={(event) => event.stopPropagation()}>
            <h3>{selectedMessage.sender_name}</h3>
            <p><strong>Phone:</strong> {selectedMessage.phone_number}</p>
            <p><strong>Status:</strong> {selectedMessage.status}</p>
            <p><strong>Received:</strong> {new Date(selectedMessage.created_at).toLocaleString("en-IN")}</p>
            <p><strong>Message:</strong> {selectedMessage.message}</p>
            <button className="admin-logout" onClick={() => setSelectedMessage(null)} type="button">
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SectionHead({ tag, title, accent, description }) {
  return (
    <div className="section-head" data-reveal="">
      <div className="section-tag">{tag}</div>
      <h2 className="section-title">
        {title} <span>{accent}</span>
      </h2>
      {description ? <p className="section-sub">{description}</p> : null}
    </div>
  );
}

function Field({ children, label }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
    </div>
  );
}

function ContactItem({ title, body }) {
  return (
    <div className="contact-item" data-reveal="">
      <div className="contact-icon">{title.charAt(0)}</div>
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
    </div>
  );
}

function StatCard({ label, tone, value }) {
  return (
    <div className={tone ? `stat-card ${tone}` : "stat-card"}>
      <div className="stat-val">{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

export default App;
