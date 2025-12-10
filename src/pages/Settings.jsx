import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Link,
  X,
  Image,
  Plus,
  Edit2,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  Home,
} from "lucide-react";
import ReportForm from "../components/ReportForm";
import { useCompany } from "../context/CompanyContext";
import Snackbar from "../components/Snackbar";
import { saveTeam, fetchTeams, deleteTeam } from "../firebase/teamService";
import {
  saveMember,
  fetchMembers,
  deleteMember,
} from "../firebase/memberService";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("company");
  const { companyInfo, loading, error, updateCompanyInfo } = useCompany();
  const [formData, setFormData] = useState({
    companyName: "",
    teamName: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    officeStartTime: "",
    officeEndTime: "",
    logoUrl: "",
    logoType: "url",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  // Team Members State
  const [teamMembers, setTeamMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    role: "team_member",
    phone: "",
    imageUrl: "",
    imageType: "url",
    teamId: "",
  });
  const [teamForm, setTeamForm] = useState({
    name: "",
  });
  const [memberImageFile, setMemberImageFile] = useState(null);
  const [memberImagePreview, setMemberImagePreview] = useState("");
  const memberFileInputRef = useRef(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Search and Sort State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [formErrors, setFormErrors] = useState({});

  // Update form data when company info is loaded
  useEffect(() => {
    if (companyInfo) {
      setFormData({
        companyName: companyInfo.companyName || "",
        teamName: companyInfo.teamName || "",
        address: companyInfo.address || "",
        email: companyInfo.email || "",
        phone: companyInfo.phone || "",
        website: companyInfo.website || "",
        officeStartTime: companyInfo.officeStartTime || "",
        officeEndTime: companyInfo.officeEndTime || "",
        logoUrl: companyInfo.logoUrl || "",
        logoType: companyInfo.logoType || "url",
      });
      setLogoPreview(companyInfo.logoUrl || "");
    }
  }, [companyInfo]);

  // Load team members and teams from Firestore on component mount
  useEffect(() => {
    const loadTeamsFromFirestore = async () => {
      // Fetch members from Firestore
      const membersResult = await fetchMembers();

      if (membersResult.success && membersResult.data.length > 0) {
        setTeamMembers(membersResult.data);
        localStorage.setItem("teamMembers", JSON.stringify(membersResult.data));
      } else {
        // Fallback to localStorage if Firestore fails
        const savedMembers = localStorage.getItem("teamMembers");
        if (savedMembers) {
          setTeamMembers(JSON.parse(savedMembers));
        }
      }

      // Fetch teams from Firestore
      const result = await fetchTeams();

      if (result.success && result.data.length > 0) {
        const nonDefaultTeams = result.data.filter((t) => !t.isDefault);
        setTeams(result.data);

        // Also save to localStorage as backup
        localStorage.setItem("teams", JSON.stringify(result.data));

        if (nonDefaultTeams.length > 0 && !activeTeam) {
          setActiveTeam(nonDefaultTeams[0].id);
        }
      } else {
        // Fallback to localStorage if Firestore fails
        const savedTeams = localStorage.getItem("teams");
        if (savedTeams) {
          const parsedTeams = JSON.parse(savedTeams);
          setTeams(parsedTeams);
          if (parsedTeams.length > 0 && !activeTeam) {
            setActiveTeam(parsedTeams[0].id);
          }
        }
      }
    };

    loadTeamsFromFirestore();
  }, []);

  // Save teams to localStorage whenever teams change (as backup)
  useEffect(() => {
    if (teams.length > 0) {
      localStorage.setItem("teams", JSON.stringify(teams));
    }
  }, [teams]);

  // Filter and sort members by active team
  const filteredAndSortedMembers = () => {
    let filtered = teamMembers.filter(
      (member) =>
        member.teamId === activeTeam &&
        (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.phone && member.phone.includes(searchTerm)))
    );

    // Sort by role first (Team Leaders on top), then by specified field
    filtered.sort((a, b) => {
      // First priority: Team Leaders on top
      if (a.role === "team_leader" && b.role !== "team_leader") return -1;
      if (b.role === "team_leader" && a.role !== "team_leader") return 1;

      // Second priority: Sort by specified field
      if (sortField) {
        const aValue = a[sortField]?.toLowerCase() || "";
        const bValue = b[sortField]?.toLowerCase() || "";

        if (sortOrder === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }

      return 0;
    });

    return filtered;
  };

  const sortedMembers = filteredAndSortedMembers();

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedMembers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(sortedMembers.length / recordsPerPage);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showSnackbar = (message, type = "info") => {
    setSnackbar({
      isVisible: true,
      message,
      type,
    });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isVisible: false }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        showSnackbar(
          "Invalid file type. Please upload an image file.",
          "error"
        );
        return;
      }

      // Validate file size (max 1MB for Firestore)
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        showSnackbar(
          "File size too large. Please upload an image smaller than 1MB for Firestore storage.",
          "error"
        );
        return;
      }

      setLogoFile(file);
      setFormData((prev) => ({ ...prev, logoType: "upload" }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, logoType: type }));
    if (type === "url") {
      setLogoFile(null);
      setLogoPreview(formData.logoUrl || "");
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setFormData((prev) => ({ ...prev, logoUrl: "" }));
      setLogoPreview("");
    }
  };

  const handleLogoUrlChange = (url) => {
    setFormData((prev) => ({ ...prev, logoUrl: url || "" }));
    setLogoPreview(url || "");
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);

    try {
      const result = await updateCompanyInfo(formData, logoFile);
      if (result.success) {
        showSnackbar(result.message, "success");
        setLogoFile(null); // Clear file after successful upload
      } else {
        showSnackbar(result.message, "error");
      }
    } catch (err) {
      showSnackbar(
        err.message || "Error saving settings. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Show error snackbar when there's a context error
  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error]);

  const resetMemberForm = () => {
    setMemberForm({
      name: "",
      email: "",
      role: "team_member",
      phone: "",
      imageUrl: "",
      imageType: "url",
    });
    setEditingMember(null);
    setMemberImageFile(null);
    setMemberImagePreview("");
    if (memberFileInputRef.current) {
      memberFileInputRef.current.value = "";
    }
  };

  const handleAddMember = () => {
    setShowAddMemberModal(true);
    resetMemberForm();
    setMemberForm((prev) => ({ ...prev, teamId: activeTeam }));
  };

  const handleDeleteTeam = async (teamId, teamName) => {
    // Prevent deletion if team has members
    const teamHasMembers = teamMembers.some(
      (member) => member.teamId === teamId
    );

    if (teamHasMembers) {
      showSnackbar(
        `Cannot delete "${teamName}". Please remove all members first.`,
        "error"
      );
      return;
    }

    // Confirm deletion
    if (
      !window.confirm(`Are you sure you want to delete the team "${teamName}"?`)
    ) {
      return;
    }

    try {
      // Delete from Firestore
      const result = await deleteTeam(teamId);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Remove from local state
      setTeams((prev) => prev.filter((team) => team.id !== teamId));

      // Update localStorage
      const updatedTeams = teams.filter((team) => team.id !== teamId);
      if (updatedTeams.length > 0) {
        localStorage.setItem("teams", JSON.stringify(updatedTeams));
      } else {
        localStorage.removeItem("teams");
      }

      // If deleted team was active, select first available team or null
      if (activeTeam === teamId) {
        const remainingTeams = teams.filter(
          (team) => team.id !== teamId && !team.isDefault
        );
        setActiveTeam(remainingTeams.length > 0 ? remainingTeams[0].id : null);
      }

      showSnackbar("Team deleted successfully", "success");
    } catch (error) {
      showSnackbar("Error deleting team: " + error.message, "error");
    }
  };

  const handleEditMember = (member) => {
    setEditingMember(member.id);
    setMemberForm({
      name: member.name,
      email: member.email,
      role: member.role,
      phone: member.phone || "",
      imageUrl: member.imageUrl || "",
      imageType: member.imageType || "url",
      teamId: member.teamId,
    });
    setMemberImagePreview(member.imageUrl || "");
    setShowAddMemberModal(true);
  };

  const handleAddTeam = () => {
    // Generate Team ID based on existing teams count
    const teamCount = teams.filter((t) => !t.isDefault).length + 1;
    const teamId = `Team_${String(teamCount).padStart(2, "0")}`;

    setTeamForm({
      teamId: teamId,
      name: "",
    });
    setShowAddTeamModal(true);
  };

  const handleSaveTeam = async () => {
    if (!teamForm.name.trim()) {
      showSnackbar("Team name is required", "error");
      return;
    }

    try {
      const newTeam = {
        id: Date.now().toString(),
        teamId: teamForm.teamId,
        name: teamForm.name.trim(),
        isDefault: false,
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore
      const result = await saveTeam(newTeam);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Update local state
      setTeams((prev) => [...prev, newTeam]);
      setActiveTeam(newTeam.id);
      setShowAddTeamModal(false);
      setTeamForm({ teamId: "", name: "" });
      showSnackbar("Team created successfully", "success");
    } catch (error) {
      showSnackbar("Error creating team: " + error.message, "error");
    }
  };

  // Member Image Handlers
  const handleMemberImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        showSnackbar(
          "Invalid file type. Please upload an image file.",
          "error"
        );
        return;
      }

      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        showSnackbar(
          "File size too large. Please upload an image smaller than 1MB.",
          "error"
        );
        return;
      }

      setMemberImageFile(file);
      setMemberForm((prev) => ({ ...prev, imageType: "upload" }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setMemberImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMemberImageTypeChange = (type) => {
    setMemberForm((prev) => ({ ...prev, imageType: type }));
    if (type === "url") {
      setMemberImageFile(null);
      setMemberImagePreview(memberForm.imageUrl || "");
      if (memberFileInputRef.current) {
        memberFileInputRef.current.value = "";
      }
    } else {
      setMemberForm((prev) => ({ ...prev, imageUrl: "" }));
      setMemberImagePreview("");
    }
  };

  const handleMemberImageUrlChange = (url) => {
    setMemberForm((prev) => ({ ...prev, imageUrl: url || "" }));
    setMemberImagePreview(url || "");
  };

  const removeMemberImage = () => {
    setMemberImageFile(null);
    setMemberImagePreview("");
    setMemberForm((prev) => ({ ...prev, imageUrl: "" }));
    if (memberFileInputRef.current) {
      memberFileInputRef.current.value = "";
    }
  };

  // Member Form Validation
  const validateForm = () => {
    const errors = {};

    if (!memberForm.name.trim()) {
      errors.name = "Name is required";
    } else if (memberForm.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!memberForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(memberForm.email)) {
      errors.email = "Please enter a valid email address";
    } else {
      const existingMember = teamMembers.find(
        (member) =>
          member.email === memberForm.email &&
          member.id !== editingMember &&
          member.teamId === memberForm.teamId
      );
      if (existingMember) {
        errors.email = "Email already exists in this team";
      }
    }

    if (memberForm.phone && !/^[\d\+\-\(\)\s]+$/.test(memberForm.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (memberForm.role === "team_leader") {
      const existingLeader = teamMembers.find(
        (member) =>
          member.role === "team_leader" &&
          member.id !== editingMember &&
          member.teamId === memberForm.teamId
      );
      if (existingLeader) {
        errors.role = "Only one team leader is allowed per team";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if team has a leader
  const hasTeamLeader = () => {
    return teamMembers.some(
      (member) =>
        member.role === "team_leader" &&
        member.teamId === activeTeam &&
        member.id !== editingMember
    );
  };

  // Save Member
  const handleSaveMember = async () => {
    if (!validateForm()) {
      showSnackbar("Please fix the form errors", "error");
      return;
    }

    const memberData = { ...memberForm };

    if (memberImageFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        memberData.imageUrl = e.target.result;
        await saveMemberData(memberData);
      };
      reader.readAsDataURL(memberImageFile);
    } else {
      await saveMemberData(memberData);
    }
  };

  const saveMemberData = async (memberData) => {
    try {
      if (editingMember) {
        const updatedMember = { ...memberData, id: editingMember };

        const result = await saveMember(updatedMember);

        if (!result.success) {
          throw new Error(result.message);
        }

        setTeamMembers((prev) =>
          prev.map((member) =>
            member.id === editingMember ? updatedMember : member
          )
        );
        showSnackbar("Team member updated successfully", "success");
      } else {
        const newMember = {
          ...memberData,
          id: Date.now(),
        };

        const result = await saveMember(newMember);

        if (!result.success) {
          throw new Error(result.message);
        }

        setTeamMembers((prev) => [...prev, newMember]);
        showSnackbar("Team member added successfully", "success");
      }

      setShowAddMemberModal(false);
      resetMemberForm();
    } catch (error) {
      showSnackbar("Error saving member: " + error.message, "error");
    }
  };

  // Delete Member
  const handleDeleteMember = async (id) => {
    const member = teamMembers.find((m) => m.id === id);
    if (member?.role === "team_leader") {
      const leaderCount = teamMembers.filter(
        (m) => m.role === "team_leader" && m.teamId === activeTeam
      ).length;
      if (leaderCount === 1) {
        showSnackbar("Cannot delete the only team leader", "error");
        return;
      }
    }

    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    try {
      const result = await deleteMember(id);

      if (!result.success) {
        throw new Error(result.message);
      }

      setTeamMembers((prev) => prev.filter((member) => member.id !== id));
      showSnackbar("Team member deleted successfully", "success");
    } catch (error) {
      showSnackbar("Error deleting member: " + error.message, "error");
    }
  };

  // Pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Search and Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Reset to first page when team members change
  useEffect(() => {
    setCurrentPage(1);
  }, [teamMembers.length, searchTerm, sortField, sortOrder]);

  // Save team members to localStorage whenever they change
  useEffect(() => {
    if (teamMembers.length > 0) {
      localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
    }
  }, [teamMembers]);

  const tabs = [
    { id: "company", label: "Company Information" },
    { id: "teamMembers", label: "Team Members" },
    { id: "reportForm", label: "Report Form" },
  ];

  // Filter teams to show only non-default teams
  const visibleTeams = teams.filter((team) => !team.isDefault);

  return (
    <div className="flex-1 min-h-screen overflow-y-auto bg-black text-white">
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
        duration={4000}
      />

      {/* Add/Edit Member Modal (dark) */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
                {activeTeam && (
                  <span className="text-sm text-indigo-300 ml-2">
                    to {teams.find((t) => t.id === activeTeam)?.name}
                  </span>
                )}
              </h3>
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setFormErrors({});
                }}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Member Image Section */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Image Controls */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-100 mb-4">
                      Profile Image
                    </h4>

                    {/* Image Type Selection */}
                    <div className="mb-4">
                      <div className="flex space-x-4 text-gray-300">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="memberImageType"
                            value="url"
                            checked={memberForm.imageType === "url"}
                            onChange={(e) =>
                              handleMemberImageTypeChange(e.target.value)
                            }
                            className="mr-2 text-indigo-500 focus:ring-indigo-500"
                          />
                          <Link size={16} className="mr-1" />
                          Use URL
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="memberImageType"
                            value="upload"
                            checked={memberForm.imageType === "upload"}
                            onChange={(e) =>
                              handleMemberImageTypeChange(e.target.value)
                            }
                            className="mr-2 text-indigo-500 focus:ring-indigo-500"
                          />
                          <Upload size={16} className="mr-1" />
                          Upload File
                        </label>
                      </div>
                    </div>

                    {/* Image Input */}
                    {memberForm.imageType === "url" ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={memberForm.imageUrl || ""}
                          onChange={(e) =>
                            handleMemberImageUrlChange(e.target.value)
                          }
                          className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter image URL"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Upload Image
                        </label>
                        <input
                          ref={memberFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMemberImageUpload}
                          className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          key={memberForm.imageType}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Max size: 1MB. Supported: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Image Preview */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-100 mb-4">
                      Preview
                    </h4>
                    <div className="border border-gray-800 rounded-lg p-4 h-32 flex items-center justify-center bg-gray-800">
                      {memberImagePreview ? (
                        <div className="relative">
                          <img
                            src={memberImagePreview}
                            alt="Profile preview"
                            className="max-h-20 max-w-full object-contain rounded-full"
                            onError={() => setMemberImagePreview("")}
                          />
                          <button
                            onClick={removeMemberImage}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">
                          <Image size={24} className="mx-auto mb-1" />
                          <p className="text-xs">No image selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Member Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={memberForm.name}
                    onChange={(e) => {
                      setMemberForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                      if (formErrors.name)
                        setFormErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.name ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => {
                      setMemberForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                      if (formErrors.email)
                        setFormErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.email ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role *
                  </label>
                  <select
                    value={memberForm.role}
                    onChange={(e) => {
                      setMemberForm((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }));
                      if (formErrors.role)
                        setFormErrors((prev) => ({ ...prev, role: "" }));
                    }}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.role ? "border-red-500" : "border-gray-700"
                    }`}
                  >
                    <option value="team_member">Team Member</option>
                    <option value="team_leader" disabled={hasTeamLeader()}>
                      Team Leader {hasTeamLeader() ? "(Already assigned)" : ""}
                    </option>
                  </select>
                  {formErrors.role && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.role}
                    </p>
                  )}
                  {hasTeamLeader() && (
                    <p className="text-amber-600 text-xs mt-1">
                      ⚠️ This team already has a team leader
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={memberForm.phone}
                    onChange={(e) => {
                      setMemberForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                      if (formErrors.phone)
                        setFormErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.phone ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="Enter phone number"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-800">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMember}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                {editingMember ? "Update" : "Add"} Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Modal (dark) */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl max-w-md w-full border border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">
                Create New Team
              </h3>
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Team ID
                </label>
                <input
                  type="text"
                  value={teamForm.teamId}
                  readOnly
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none"
                  placeholder="Auto-generated"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) =>
                    setTeamForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter team name"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-800">
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="px-4 py-2 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTeam}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-8 py-6">
        <div className="max-w-full mx-auto">
          {/* Header: title + subtitle (left) and Add Team (right) */}
          <div className="flex items-start justify-between mb-4 gap-4">
            <div>
              {/* breadcrumb removed */}
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-sm text-gray-400 mt-1">
                Manage company settings, teams and members.
              </p>
            </div>
          </div>

          <hr className="border-gray-800 mb-6" />

          {/* Sub-menu Tabs (dark) */}
          <div className="bg-gray-900 rounded-lg shadow-sm mb-6 border border-gray-800 w-full">
            <div className="border-b border-gray-800">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-300"
                        : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="space-y-6">
            {/* Company Information Tab */}
            {activeTab === "company" && (
              <>
                {/* Company Logo Section (dark) */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left Column - Logo Controls */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-100 mb-4">
                        Company Logo
                      </h2>

                      {/* Logo Type Selection */}
                      <div className="mb-4">
                        <div className="flex space-x-4 text-gray-300">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="logoType"
                              value="url"
                              checked={formData.logoType === "url"}
                              onChange={(e) =>
                                handleLogoTypeChange(e.target.value)
                              }
                              className="mr-2 text-indigo-500 focus:ring-indigo-500"
                            />
                            <Link size={16} className="mr-1" />
                            Use URL
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="logoType"
                              value="upload"
                              checked={formData.logoType === "upload"}
                              onChange={(e) =>
                                handleLogoTypeChange(e.target.value)
                              }
                              className="mr-2 text-indigo-500 focus:ring-indigo-500"
                            />
                            <Upload size={16} className="mr-1" />
                            Upload File
                          </label>
                        </div>
                      </div>

                      {/* Logo Input */}
                      {formData.logoType === "url" ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Logo URL
                          </label>
                          <input
                            type="url"
                            value={formData.logoUrl || ""}
                            onChange={(e) =>
                              handleLogoUrlChange(e.target.value)
                            }
                            className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter logo URL"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Upload Logo
                          </label>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            key={formData.logoType}
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Max size: 1MB. Supported: JPG, PNG, GIF, WebP
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Logo Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Preview
                      </label>
                      <div className="border border-gray-800 rounded-lg p-4 h-48 flex items-center justify-center bg-gray-800">
                        {logoPreview ? (
                          <div className="relative">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="max-h-24 max-w-full object-contain"
                              onError={() => setLogoPreview("")}
                            />
                            <button
                              onClick={removeLogo}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              title="Remove logo"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">
                            <Image size={32} className="mx-auto mb-2" />
                            <p className="text-sm">No logo selected</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Settings (dark) */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-100 mb-4">
                    Company Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={formData.teamName}
                        onChange={(e) =>
                          handleInputChange("teamName", e.target.value)
                        }
                        className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter team name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter company address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter website URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Office Settings (dark) */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-100 mb-4">
                    Office Settings
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Office Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.officeStartTime}
                        onChange={(e) =>
                          handleInputChange("officeStartTime", e.target.value)
                        }
                        className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Office End Time
                      </label>
                      <input
                        type="time"
                        value={formData.officeEndTime}
                        onChange={(e) =>
                          handleInputChange("officeEndTime", e.target.value)
                        }
                        className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Team Members Tab (dark) */}
            {activeTab === "teamMembers" && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                {/* Team Selection Buttons */}
                <div className="p-6 border-b border-gray-800 bg-gray-900">
                  <h2 className="text-xl font-semibold text-gray-100 mb-4">
                    Teams
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {visibleTeams.map((team) => (
                      <div key={team.id} className="relative group">
                        <button
                          onClick={() => setActiveTeam(team.id)}
                          className={`px-4 py-2 pr-8 rounded-lg font-medium transition-colors ${
                            activeTeam === team.id
                              ? "bg-indigo-600 text-white shadow-md"
                              : "bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-800"
                          }`}
                        >
                          {team.name}
                          <span className="ml-2 text-xs opacity-75">
                            (
                            {
                              teamMembers.filter((m) => m.teamId === team.id)
                                .length
                            }
                            )
                          </span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeam(team.id, team.name);
                          }}
                          className={`absolute top-0 right-0 p-1 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
                            activeTeam === team.id
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-red-700 hover:bg-red-600 text-white"
                          }`}
                          title="Delete team"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {/* Add Team Button */}
                    <button
                      onClick={handleAddTeam}
                      className="px-4 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 shadow-md flex items-center"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Team
                    </button>
                  </div>
                </div>

                {/* Team Members Section */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      {visibleTeams.length === 0
                        ? "Team Members"
                        : activeTeam
                        ? `${
                            teams.find((t) => t.id === activeTeam)?.name ||
                            "Team"
                          } Members`
                        : "Team Members"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {sortedMembers.length} member
                      {sortedMembers.length !== 1 ? "s" : ""}
                      {visibleTeams.length > 0 && activeTeam
                        ? " in this team"
                        : ""}
                      {searchTerm &&
                        activeTeam &&
                        ` (filtered from ${
                          teamMembers.filter((m) => m.teamId === activeTeam)
                            .length
                        })`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    {activeTeam && (
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Search members..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-gray-200"
                        />
                      </div>
                    )}
                    <button
                      onClick={handleAddMember}
                      disabled={!activeTeam}
                      className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                      <span>Add Member</span>
                    </button>
                  </div>
                </div>

                {visibleTeams.length === 0 ? (
                  <div className="text-center py-16">
                    <Users size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">
                      No teams created yet
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Create your first team to start managing members
                    </p>
                    <button
                      onClick={handleAddTeam}
                      className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus size={20} />
                      <span>Create First Team</span>
                    </button>
                  </div>
                ) : !activeTeam ? (
                  <div className="text-center py-16">
                    <Users size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">
                      No team selected
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Select a team to manage members
                    </p>
                  </div>
                ) : sortedMembers.length === 0 ? (
                  <div className="text-center py-16">
                    <Users size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">
                      {searchTerm
                        ? "No members found"
                        : "No members in this team yet"}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Start building your team by adding the first member"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-full">
                      <div className="w-full overflow-x-auto">
                        <table className="w-full table-fixed min-w-[720px]">
                          <thead>
                            <tr className="bg-gray-950 border-b border-gray-800">
                              <th className="w-16 px-4 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                                Profile
                              </th>
                              <th className="w-1/5 px-4 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                                <button
                                  onClick={() => handleSort("name")}
                                  className="flex items-center space-x-1 text-gray-300 hover:text-indigo-300"
                                >
                                  <span>Name</span>
                                  <ArrowUpDown size={12} />
                                </button>
                              </th>
                              <th className="w-1/5 px-4 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                                <button
                                  onClick={() => handleSort("email")}
                                  className="flex items-center space-x-1 text-gray-300 hover:text-indigo-300"
                                >
                                  <span>Email</span>
                                  <ArrowUpDown size={12} />
                                </button>
                              </th>
                              <th className="w-1/6 px-4 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                                Role
                              </th>
                              <th className="w-1/6 px-4 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                                <button
                                  onClick={() => handleSort("phone")}
                                  className="flex items-center space-x-1 text-gray-300 hover:text-indigo-300"
                                >
                                  <span>Phone</span>
                                  <ArrowUpDown size={12} />
                                </button>
                              </th>
                              <th className="w-20 px-4 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800 bg-gray-900">
                            {currentRecords.map((member) => (
                              <tr
                                key={member.id}
                                className={`hover:bg-gray-850 transition-all duration-200 ${
                                  member.role === "team_leader"
                                    ? "bg-gray-850"
                                    : ""
                                }`}
                              >
                                <td className="w-16 px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center justify-center">
                                    {member.imageUrl ? (
                                      <img
                                        src={member.imageUrl}
                                        alt={member.name}
                                        className="h-10 w-10 rounded-full object-cover border-2 border-gray-700"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                        }}
                                      />
                                    ) : null}
                                    <div
                                      className={`h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ${
                                        member.imageUrl ? "hidden" : "flex"
                                      }`}
                                    >
                                      {member.name.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                </td>
                                <td className="w-1/5 px-4 py-4">
                                  <div
                                    className="text-sm font-semibold text-white truncate"
                                    title={member.name}
                                  >
                                    {member.name}
                                  </div>
                                </td>
                                <td className="w-1/5 px-4 py-4">
                                  <div
                                    className="text-sm text-gray-300 truncate"
                                    title={member.email}
                                  >
                                    {member.email}
                                  </div>
                                </td>
                                <td className="w-1/6 px-4 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                                      member.role === "team_leader"
                                        ? "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                                        : "bg-gradient-to-r from-indigo-400 to-purple-500 text-white"
                                    }`}
                                  >
                                    {member.role === "team_leader"
                                      ? "👑 Leader"
                                      : "👨‍💻 Member"}
                                  </span>
                                </td>
                                <td className="w-1/6 px-4 py-4">
                                  <div
                                    className="text-sm text-gray-300 font-mono truncate"
                                    title={member.phone || "-"}
                                  >
                                    {member.phone || "-"}
                                  </div>
                                </td>
                                <td className="w-20 px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center justify-center space-x-1">
                                    <button
                                      onClick={() => handleEditMember(member)}
                                      className="bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors p-2 rounded-lg"
                                      title="Edit member"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteMember(member.id)
                                      }
                                      className="bg-red-700 text-white hover:bg-red-600 transition-colors p-2 rounded-lg"
                                      title="Delete member"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-900">
                        <div className="text-sm text-gray-400">
                          Showing {indexOfFirstRecord + 1} to{" "}
                          {Math.min(indexOfLastRecord, sortedMembers.length)} of{" "}
                          {sortedMembers.length} members
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`inline-flex items-center px-3 py-2 border border-gray-700 rounded-md text-sm font-medium ${
                              currentPage === 1
                                ? "text-gray-500 bg-gray-800 cursor-not-allowed"
                                : "text-gray-200 bg-gray-800 hover:bg-gray-700"
                            }`}
                          >
                            <ChevronLeft size={16} className="mr-1" /> Previous
                          </button>
                          <span className="text-sm text-gray-400">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`inline-flex items-center px-3 py-2 border border-gray-700 rounded-md text-sm font-medium ${
                              currentPage === totalPages
                                ? "text-gray-500 bg-gray-800 cursor-not-allowed"
                                : "text-gray-200 bg-gray-800 hover:bg-gray-700"
                            }`}
                          >
                            Next <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Report Form Tab (dark) */}
            {activeTab === "reportForm" && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">
                  Report Form Template
                </h2>
                <ReportForm />
              </div>
            )}

            {/* Save Button - Only show for Company Information tab (dark) */}
            {activeTab === "company" && (
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving || loading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Settings</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
